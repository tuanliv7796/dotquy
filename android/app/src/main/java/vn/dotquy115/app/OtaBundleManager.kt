package vn.dotquy115.app

import android.content.Context
import android.content.pm.ApplicationInfo
import androidx.core.content.pm.PackageInfoCompat
import org.json.JSONObject
import java.io.BufferedInputStream
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import java.util.zip.ZipInputStream

/**
 * Offline-First Website-Synced OTA Manager with Atomic Staging, SHA-256 Verification,
 * Zip-Slip Protection, and 2-Boot Crash Rollback Watchdog.
 *
 * Guarantee:
 * 1. App ALWAYS renders instantaneously (<0.2s) from local storage (either active OTA snapshot
 *    in filesDir/ota_bundles/<buildId> or factory seed in apk://assets/public) — NEVER waits on network.
 * 2. When online, downloads dist/ota/manifest.json + dist/ota/bundle.zip from the Website in background,
 *    verifies SHA-256 and mandatory medical routes (/index.html and /so-cuu/index.html), and stages it
 *    atomically for next boot or user-initiated refresh.
 * 3. If a newly promoted OTA bundle fails to call confirmBootHealthy() twice in a row, Watchdog
 *    rolls back automatically to previous known-good snapshot or factory APK seed.
 */
object OtaBundleManager {
    private const val PREFS_NAME = "dotquy115_ota_prefs"
    private const val NATIVE_SCHEMA_VERSION = 1
    private const val MAX_BUNDLE_BYTES = 25L * 1024L * 1024L // 25 MB safety cap

    private const val KEY_LAST_APK_VERSION_CODE = "last_apk_version_code"
    private const val KEY_BOOT_FAIL_COUNT = "boot_fail_count"

    private const val KEY_ACTIVE_DIR = "active_ota_dir"
    private const val KEY_ACTIVE_BUILD_ID = "active_build_id"
    private const val KEY_ACTIVE_VERSION = "active_version"
    private const val KEY_ACTIVE_SHA256 = "active_sha256"

    private const val KEY_PREV_DIR = "prev_ota_dir"
    private const val KEY_PREV_BUILD_ID = "prev_build_id"
    private const val KEY_PREV_VERSION = "prev_version"
    private const val KEY_PREV_SHA256 = "prev_sha256"

    private const val KEY_PENDING_DIR = "pending_ota_dir"
    private const val KEY_PENDING_BUILD_ID = "pending_build_id"
    private const val KEY_PENDING_VERSION = "pending_version"
    private const val KEY_PENDING_SHA256 = "pending_sha256"

    private const val KEY_LAST_CHECKED_AT = "last_checked_at"
    private const val KEY_LAST_MANIFEST_URL = "last_manifest_url"

    data class SeedMeta(
        val buildId: String,
        val version: String,
        val sha256: String
    )

    data class UpdateCheckResult(
        val hasUpdate: Boolean,
        val version: String? = null,
        val error: String? = null
    )

    data class OtaStatus(
        val currentVersion: String,
        val source: String,
        val lastCheckedAt: String?,
        val pendingVersion: String?,
        val manifestUrl: String?
    )

    private fun prefs(context: Context) =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private fun otaRootDir(context: Context): File {
        val dir = File(context.filesDir, "ota_bundles")
        if (!dir.exists()) dir.mkdirs()
        return dir
    }

    fun readApkSeedMeta(context: Context): SeedMeta {
        return try {
            val jsonText = context.assets.open("public/ota/manifest.json")
                .bufferedReader(Charsets.UTF_8)
                .use { it.readText() }
            val obj = JSONObject(jsonText)
            SeedMeta(
                buildId = obj.optString("buildId", "1.0.0-seed"),
                version = obj.optString("version", "1.0.0"),
                sha256 = obj.optString("bundleSha256", "")
            )
        } catch (_: Exception) {
            SeedMeta("1.0.0-seed", "1.0.0", "")
        }
    }

    private fun isValidSnapshotDir(path: String?): Boolean {
        if (path.isNullOrBlank()) return false
        val root = File(path)
        return root.isDirectory &&
            File(root, "index.html").isFile &&
            File(root, "so-cuu/index.html").isFile
    }

    /**
     * Called synchronously during MainActivity.onCreate() BEFORE WebView boots.
     * Pure local filesystem metadata check (<2ms). Zero network I/O.
     */
    @Synchronized
    fun prepareActiveBundlePath(context: Context): String? {
        val sp = prefs(context)
        val pkgInfo = context.packageManager.getPackageInfo(context.packageName, 0)
        val currentApkVersionCode = PackageInfoCompat.getLongVersionCode(pkgInfo)
        val recordedApkVersionCode = sp.getLong(KEY_LAST_APK_VERSION_CODE, -1L)

        // If user installed a newer .apk binary upgrade, reset to the fresh APK seed
        if (recordedApkVersionCode != -1L && recordedApkVersionCode != currentApkVersionCode) {
            sp.edit()
                .putLong(KEY_LAST_APK_VERSION_CODE, currentApkVersionCode)
                .remove(KEY_ACTIVE_DIR).remove(KEY_ACTIVE_BUILD_ID).remove(KEY_ACTIVE_VERSION).remove(KEY_ACTIVE_SHA256)
                .remove(KEY_PREV_DIR).remove(KEY_PREV_BUILD_ID).remove(KEY_PREV_VERSION).remove(KEY_PREV_SHA256)
                .remove(KEY_PENDING_DIR).remove(KEY_PENDING_BUILD_ID).remove(KEY_PENDING_VERSION).remove(KEY_PENDING_SHA256)
                .putInt(KEY_BOOT_FAIL_COUNT, 0)
                .apply()
            pruneUnusedSnapshots(context)
            return null
        } else if (recordedApkVersionCode == -1L) {
            sp.edit().putLong(KEY_LAST_APK_VERSION_CODE, currentApkVersionCode).apply()
        }

        val failCount = sp.getInt(KEY_BOOT_FAIL_COUNT, 0)
        var activeDir = sp.getString(KEY_ACTIVE_DIR, null)
        val pendingDir = sp.getString(KEY_PENDING_DIR, null)

        // 1. Watchdog rollback if active OTA snapshot failed to boot healthy >= 2 times
        if (activeDir != null && failCount >= 2) {
            val faultyDir = activeDir
            val prevDir = sp.getString(KEY_PREV_DIR, null)
            val editor = sp.edit()
            if (isValidSnapshotDir(prevDir) && prevDir != faultyDir) {
                editor.putString(KEY_ACTIVE_DIR, prevDir)
                editor.putString(KEY_ACTIVE_BUILD_ID, sp.getString(KEY_PREV_BUILD_ID, null))
                editor.putString(KEY_ACTIVE_VERSION, sp.getString(KEY_PREV_VERSION, null))
                editor.putString(KEY_ACTIVE_SHA256, sp.getString(KEY_PREV_SHA256, null))
                activeDir = prevDir
            } else {
                editor.remove(KEY_ACTIVE_DIR)
                editor.remove(KEY_ACTIVE_BUILD_ID)
                editor.remove(KEY_ACTIVE_VERSION)
                editor.remove(KEY_ACTIVE_SHA256)
                activeDir = null
            }
            editor.remove(KEY_PREV_DIR).remove(KEY_PREV_BUILD_ID).remove(KEY_PREV_VERSION).remove(KEY_PREV_SHA256)
            editor.putInt(KEY_BOOT_FAIL_COUNT, 0)
            editor.apply()
            try {
                File(faultyDir).deleteRecursively()
            } catch (_: Exception) {
            }
            return activeDir
        }

        // 2. Promote staged pending update on cold boot
        if (!pendingDir.isNullOrBlank() && isValidSnapshotDir(pendingDir)) {
            val editor = sp.edit()
            if (isValidSnapshotDir(activeDir) && activeDir != pendingDir) {
                editor.putString(KEY_PREV_DIR, activeDir)
                editor.putString(KEY_PREV_BUILD_ID, sp.getString(KEY_ACTIVE_BUILD_ID, null))
                editor.putString(KEY_PREV_VERSION, sp.getString(KEY_ACTIVE_VERSION, null))
                editor.putString(KEY_PREV_SHA256, sp.getString(KEY_ACTIVE_SHA256, null))
            }
            editor.putString(KEY_ACTIVE_DIR, pendingDir)
            editor.putString(KEY_ACTIVE_BUILD_ID, sp.getString(KEY_PENDING_BUILD_ID, null))
            editor.putString(KEY_ACTIVE_VERSION, sp.getString(KEY_PENDING_VERSION, null))
            editor.putString(KEY_ACTIVE_SHA256, sp.getString(KEY_PENDING_SHA256, null))
            editor.remove(KEY_PENDING_DIR).remove(KEY_PENDING_BUILD_ID).remove(KEY_PENDING_VERSION).remove(KEY_PENDING_SHA256)
            editor.putInt(KEY_BOOT_FAIL_COUNT, 1)
            editor.apply()
            pruneUnusedSnapshots(context)
            return pendingDir
        }

        // 3. Validate existing active snapshot
        if (!activeDir.isNullOrBlank()) {
            if (!isValidSnapshotDir(activeDir)) {
                sp.edit()
                    .remove(KEY_ACTIVE_DIR).remove(KEY_ACTIVE_BUILD_ID).remove(KEY_ACTIVE_VERSION).remove(KEY_ACTIVE_SHA256)
                    .putInt(KEY_BOOT_FAIL_COUNT, 0)
                    .apply()
                return null
            }
            sp.edit().putInt(KEY_BOOT_FAIL_COUNT, failCount + 1).apply()
            return activeDir
        }

        return null
    }

    @Synchronized
    fun confirmBootHealthy(context: Context) {
        prefs(context).edit().putInt(KEY_BOOT_FAIL_COUNT, 0).apply()
    }

    @Synchronized
    fun promotePendingImmediately(context: Context): String? {
        val sp = prefs(context)
        val pendingDir = sp.getString(KEY_PENDING_DIR, null)
        if (pendingDir.isNullOrBlank() || !isValidSnapshotDir(pendingDir)) {
            return sp.getString(KEY_ACTIVE_DIR, null)
        }
        val activeDir = sp.getString(KEY_ACTIVE_DIR, null)
        val editor = sp.edit()
        if (isValidSnapshotDir(activeDir) && activeDir != pendingDir) {
            editor.putString(KEY_PREV_DIR, activeDir)
            editor.putString(KEY_PREV_BUILD_ID, sp.getString(KEY_ACTIVE_BUILD_ID, null))
            editor.putString(KEY_PREV_VERSION, sp.getString(KEY_ACTIVE_VERSION, null))
            editor.putString(KEY_PREV_SHA256, sp.getString(KEY_ACTIVE_SHA256, null))
        }
        editor.putString(KEY_ACTIVE_DIR, pendingDir)
        editor.putString(KEY_ACTIVE_BUILD_ID, sp.getString(KEY_PENDING_BUILD_ID, null))
        editor.putString(KEY_ACTIVE_VERSION, sp.getString(KEY_PENDING_VERSION, null))
        editor.putString(KEY_ACTIVE_SHA256, sp.getString(KEY_PENDING_SHA256, null))
        editor.remove(KEY_PENDING_DIR).remove(KEY_PENDING_BUILD_ID).remove(KEY_PENDING_VERSION).remove(KEY_PENDING_SHA256)
        editor.putInt(KEY_BOOT_FAIL_COUNT, 1)
        editor.apply()
        pruneUnusedSnapshots(context)
        return pendingDir
    }

    fun getStatus(context: Context): OtaStatus {
        val sp = prefs(context)
        val seed = readApkSeedMeta(context)
        val activeDir = sp.getString(KEY_ACTIVE_DIR, null)
        val isOta = !activeDir.isNullOrBlank() && isValidSnapshotDir(activeDir)
        val currentVersion = if (isOta) {
            val ver = sp.getString(KEY_ACTIVE_VERSION, seed.version) ?: seed.version
            val bid = sp.getString(KEY_ACTIVE_BUILD_ID, "") ?: ""
            if (bid.isNotEmpty()) "$ver ($bid)" else ver
        } else {
            "${seed.version} (${seed.buildId})"
        }
        val pendingVer = sp.getString(KEY_PENDING_VERSION, null)?.let { ver ->
            val bid = sp.getString(KEY_PENDING_BUILD_ID, "") ?: ""
            if (bid.isNotEmpty()) "$ver ($bid)" else ver
        }
        return OtaStatus(
            currentVersion = currentVersion,
            source = if (isOta) "ota_snapshot" else "apk_seed",
            lastCheckedAt = sp.getString(KEY_LAST_CHECKED_AT, null),
            pendingVersion = pendingVer,
            manifestUrl = sp.getString(KEY_LAST_MANIFEST_URL, null)
        )
    }

    /**
     * Runs on a background thread. Downloads manifest.json, compares SHA-256,
     * streams bundle.zip, verifies SHA-256 + Zip-Slip + mandatory emergency files,
     * and stages atomically into ota_bundles/<safeBuildId>.
     */
    fun checkAndDownloadUpdate(context: Context, manifestUrl: String): UpdateCheckResult {
        val trimmedUrl = manifestUrl.trim()
        if (trimmedUrl.isEmpty()) {
            return UpdateCheckResult(false, error = "URL trống")
        }

        val isDebuggable = (context.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0
        val parsedManifestUrl = try {
            URL(trimmedUrl)
        } catch (_: Exception) {
            return UpdateCheckResult(false, error = "Địa chỉ URL không hợp lệ")
        }

        val host = parsedManifestUrl.host.lowercase(Locale.ROOT)
        val isLocalDevHost = host == "localhost" || host == "127.0.0.1" || host == "10.0.2.2"
        if (parsedManifestUrl.protocol != "https" && !(isDebuggable || isLocalDevHost)) {
            return UpdateCheckResult(false, error = "Yêu cầu kết nối HTTPS an toàn")
        }

        val sp = prefs(context)
        sp.edit().putString(KEY_LAST_MANIFEST_URL, trimmedUrl).apply()

        return try {
            val manifestText = httpGetString(parsedManifestUrl)
            val manifest = JSONObject(manifestText)

            val buildId = manifest.optString("buildId", "").trim()
            val version = manifest.optString("version", "1.0.0").trim()
            val minNative = manifest.optInt("minNativeVersion", 1)
            val bundleRelUrl = manifest.optString("bundleUrl", "./bundle.zip").trim()
            val expectedSha256 = manifest.optString("bundleSha256", "").trim().lowercase(Locale.ROOT)

            val nowIso = isoNow()
            sp.edit().putString(KEY_LAST_CHECKED_AT, nowIso).apply()

            if (buildId.isEmpty() || expectedSha256.length != 64) {
                return UpdateCheckResult(false, error = "Manifest thiếu mã SHA-256 hợp lệ")
            }
            if (minNative > NATIVE_SCHEMA_VERSION) {
                return UpdateCheckResult(
                    hasUpdate = false,
                    version = version,
                    error = "Phiên bản nội dung mới yêu cầu cài đặt bản .apk mới hơn"
                )
            }

            val seed = readApkSeedMeta(context)
            val currentSha = (
                sp.getString(KEY_PENDING_SHA256, null)
                    ?: sp.getString(KEY_ACTIVE_SHA256, null)
                    ?: seed.sha256
                ).lowercase(Locale.ROOT)

            if (expectedSha256 == currentSha) {
                return UpdateCheckResult(hasUpdate = false, version = "$version ($buildId)")
            }

            val bundleUrl = URL(parsedManifestUrl, bundleRelUrl)
            val rootDir = otaRootDir(context)
            val safeId = buildId.replace(Regex("[^a-zA-Z0-9._-]"), "_").take(80)
            val tempZip = File(rootDir, ".download_$safeId.zip")
            val stagingDir = File(rootDir, ".staging_$safeId")
            val finalDir = File(rootDir, safeId)

            if (tempZip.exists()) tempZip.delete()
            if (stagingDir.exists()) stagingDir.deleteRecursively()

            val actualSha256 = downloadAndHash(bundleUrl, tempZip)
            if (actualSha256 != expectedSha256) {
                tempZip.delete()
                return UpdateCheckResult(false, error = "Sai lệch mã kiểm tra SHA-256")
            }

            extractZipSafely(tempZip, stagingDir)
            tempZip.delete()

            // Verify critical medical screens exist before accepting snapshot
            if (!File(stagingDir, "index.html").isFile || !File(stagingDir, "so-cuu/index.html").isFile) {
                stagingDir.deleteRecursively()
                return UpdateCheckResult(false, error = "Gói cập nhật thiếu trang Sơ cứu thiết yếu")
            }

            if (finalDir.exists()) {
                finalDir.deleteRecursively()
            }
            if (!stagingDir.renameTo(finalDir)) {
                stagingDir.deleteRecursively()
                return UpdateCheckResult(false, error = "Không thể lưu gói cập nhật nguyên tử")
            }

            synchronized(this) {
                sp.edit()
                    .putString(KEY_PENDING_DIR, finalDir.absolutePath)
                    .putString(KEY_PENDING_BUILD_ID, buildId)
                    .putString(KEY_PENDING_VERSION, version)
                    .putString(KEY_PENDING_SHA256, expectedSha256)
                    .putString(KEY_LAST_CHECKED_AT, nowIso)
                    .apply()
                pruneUnusedSnapshots(context)
            }

            UpdateCheckResult(hasUpdate = true, version = "$version ($buildId)")
        } catch (e: Exception) {
            UpdateCheckResult(hasUpdate = false, error = e.message ?: "Lỗi kết nối máy chủ")
        }
    }

    private fun httpGetString(url: URL): String {
        val conn = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = 5000
            readTimeout = 8000
            useCaches = false
            setRequestProperty("Cache-Control", "no-cache")
            setRequestProperty("Accept", "application/json")
        }
        try {
            val code = conn.responseCode
            if (code !in 200..299) {
                throw IllegalStateException("HTTP $code")
            }
            return conn.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
        } finally {
            conn.disconnect()
        }
    }

    private fun downloadAndHash(url: URL, targetZip: File): String {
        val conn = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = "GET"
            connectTimeout = 6000
            readTimeout = 15000
            useCaches = false
            setRequestProperty("Cache-Control", "no-cache")
        }
        try {
            val code = conn.responseCode
            if (code !in 200..299) {
                throw IllegalStateException("HTTP $code khi tải bundle")
            }
            val digest = MessageDigest.getInstance("SHA-256")
            var totalBytes = 0L
            BufferedInputStream(conn.inputStream).use { input ->
                FileOutputStream(targetZip).use { output ->
                    val buffer = ByteArray(16 * 1024)
                    while (true) {
                        val read = input.read(buffer)
                        if (read <= 0) break
                        totalBytes += read
                        if (totalBytes > MAX_BUNDLE_BYTES) {
                            throw IllegalStateException("Gói cập nhật vượt giới hạn an toàn 25MB")
                        }
                        digest.update(buffer, 0, read)
                        output.write(buffer, 0, read)
                    }
                    output.fd.sync()
                }
            }
            return digest.digest().joinToString("") { "%02x".format(it) }
        } finally {
            conn.disconnect()
        }
    }

    private fun extractZipSafely(zipFile: File, destDir: File) {
        destDir.mkdirs()
        val canonicalRoot = destDir.canonicalPath + File.separator
        ZipInputStream(BufferedInputStream(zipFile.inputStream())).use { zis ->
            val buffer = ByteArray(16 * 1024)
            while (true) {
                val entry = zis.nextEntry ?: break
                val outFile = File(destDir, entry.name)
                val canonicalOut = outFile.canonicalPath
                if (!canonicalOut.startsWith(canonicalRoot)) {
                    throw SecurityException("Phát hiện đường dẫn Zip-Slip không an toàn: ${entry.name}")
                }
                if (entry.isDirectory) {
                    outFile.mkdirs()
                } else {
                    outFile.parentFile?.mkdirs()
                    FileOutputStream(outFile).use { fos ->
                        while (true) {
                            val len = zis.read(buffer)
                            if (len <= 0) break
                            fos.write(buffer, 0, len)
                        }
                    }
                }
                zis.closeEntry()
            }
        }
    }

    private fun pruneUnusedSnapshots(context: Context) {
        val sp = prefs(context)
        val keepPaths = setOfNotNull(
            sp.getString(KEY_ACTIVE_DIR, null),
            sp.getString(KEY_PREV_DIR, null),
            sp.getString(KEY_PENDING_DIR, null)
        )
        val root = otaRootDir(context)
        root.listFiles()?.forEach { child ->
            if (child.absolutePath !in keepPaths && !child.name.startsWith(".download_")) {
                try {
                    child.deleteRecursively()
                } catch (_: Exception) {
                }
            }
        }
    }

    private fun isoNow(): String {
        val fmt = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
        fmt.timeZone = TimeZone.getTimeZone("UTC")
        return fmt.format(Date())
    }
}
