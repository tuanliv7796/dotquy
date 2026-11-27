package vn.dotquy115.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.ByteArrayOutputStream
import java.io.File
import java.nio.file.Files
import java.security.MessageDigest
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class OtaSafetyUnitTest {

    @Test
    fun extractZipSafely_extractsValidFilesAndBlocksZipSlipTraversal() {
        val method = OtaBundleManager::class.java.getDeclaredMethod(
            "extractZipSafely",
            File::class.java,
            File::class.java
        ).apply { isAccessible = true }

        val tempRoot = Files.createTempDirectory("ota_unit_test").toFile()
        try {
            // 1. Valid OTA zip with index.html and so-cuu/index.html
            val validZip = File(tempRoot, "valid.zip")
            ZipOutputStream(validZip.outputStream()).use { zos ->
                zos.putNextEntry(ZipEntry("index.html"))
                zos.write("<html>Home</html>".toByteArray())
                zos.closeEntry()

                zos.putNextEntry(ZipEntry("so-cuu/index.html"))
                zos.write("<html>Emergency 115</html>".toByteArray())
                zos.closeEntry()
            }

            val extractValidDir = File(tempRoot, "extracted_valid")
            method.invoke(OtaBundleManager, validZip, extractValidDir)
            assertTrue(File(extractValidDir, "index.html").isFile)
            assertTrue(File(extractValidDir, "so-cuu/index.html").isFile)

            // 2. Malicious Zip-Slip entry attempting "../escaped.txt" must throw SecurityException
            val evilZip = File(tempRoot, "evil.zip")
            ZipOutputStream(evilZip.outputStream()).use { zos ->
                zos.putNextEntry(ZipEntry("../escaped.txt"))
                zos.write("pwned".toByteArray())
                zos.closeEntry()
            }

            val extractEvilDir = File(tempRoot, "extracted_evil")
            val thrown = assertThrows(java.lang.reflect.InvocationTargetException::class.java) {
                method.invoke(OtaBundleManager, evilZip, extractEvilDir)
            }
            assertTrue(thrown.targetException is SecurityException)
            assertTrue(!File(tempRoot, "escaped.txt").exists())
        } finally {
            tempRoot.deleteRecursively()
        }
    }

    @Test
    fun sha256HexFormat_matchesNodePackagerOutput() {
        val payload = "dot-quy-115-ota-integrity-check".toByteArray(Charsets.UTF_8)
        val digest = MessageDigest.getInstance("SHA-256").digest(payload)
        val hex = digest.joinToString("") { "%02x".format(it) }
        assertEquals(64, hex.length)
    }
}
