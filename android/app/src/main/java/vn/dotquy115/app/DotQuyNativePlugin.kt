package vn.dotquy115.app

import android.Manifest
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.SystemClock
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.speech.tts.TextToSpeech
import android.view.WindowManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.util.Locale
import java.util.concurrent.Executors

/**
 * Capacitor Native Plugin ("DotQuyNative") bridging Emergency Dialer, Keep-Screen-On WakeLock,
 * Vietnamese Offline TTS with language-pack diagnostics, Haptic CPR/SOS feedback,
 * AndroidKeyStore EncryptedVault, Privacy-Safe Recheck Alarms, and Website-Synced OTA Updates.
 */
@CapacitorPlugin(name = "DotQuyNative")
class DotQuyNativePlugin : Plugin() {
    private val ioExecutor = Executors.newSingleThreadExecutor()

    @Volatile
    private var tts: TextToSpeech? = null

    @Volatile
    private var ttsInitialized = false

    @Volatile
    private var ttsInitFailed = false

    private val viLocale = Locale("vi", "VN")

    @PluginMethod
    fun dial115(call: PluginCall) {
        try {
            val dialIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:115")).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(dialIntent)
            call.resolve()
        } catch (e: Exception) {
            call.reject("Không thể mở trình gọi điện 115: ${e.message}")
        }
    }

    @PluginMethod
    fun setKeepScreenOn(call: PluginCall) {
        val enabled = call.getBoolean("enabled", false) ?: false
        val act = activity
        if (act == null) {
            call.resolve()
            return
        }
        act.runOnUiThread {
            if (enabled) {
                act.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            } else {
                act.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            }
            call.resolve()
        }
    }

    @PluginMethod
    fun speakVi(call: PluginCall) {
        val text = call.getString("text", "")?.trim().orEmpty()
        val rate = call.getFloat("rate", 0.9f) ?: 0.9f
        if (text.isEmpty()) {
            call.resolve(JSObject().put("available", true))
            return
        }

        val existingTts = tts
        if (existingTts != null && ttsInitialized) {
            speakWithEngine(existingTts, text, rate, call)
            return
        }
        if (ttsInitFailed) {
            call.resolve(
                JSObject()
                    .put("available", false)
                    .put("message", "Thiết bị chưa kích hoạt công cụ đọc văn bản (Text-to-Speech).")
            )
            return
        }

        activity?.runOnUiThread {
            var engineRef: TextToSpeech? = null
            engineRef = TextToSpeech(context.applicationContext) { status ->
                if (status == TextToSpeech.SUCCESS && engineRef != null) {
                    tts = engineRef
                    ttsInitialized = true
                    speakWithEngine(engineRef!!, text, rate, call)
                } else {
                    ttsInitFailed = true
                    call.resolve(
                        JSObject()
                            .put("available", false)
                            .put("message", "Không thể khởi tạo giọng đọc trên thiết bị này.")
                    )
                }
            }
        } ?: call.resolve(JSObject().put("available", false))
    }

    private fun speakWithEngine(engine: TextToSpeech, text: String, rate: Float, call: PluginCall) {
        val availability = engine.isLanguageAvailable(viLocale)
        if (availability == TextToSpeech.LANG_MISSING_DATA || availability == TextToSpeech.LANG_NOT_SUPPORTED) {
            call.resolve(
                JSObject()
                    .put("available", false)
                    .put(
                        "message",
                        "Máy chưa tải gói giọng đọc tiếng Việt. Vui lòng vào Cài đặt Android → Ngôn ngữ & Bàn phím → Đầu ra chuyển văn bản thành giọng nói để tải Tiếng Việt."
                    )
            )
            return
        }
        engine.language = viLocale
        engine.setSpeechRate(rate.coerceIn(0.6f, 1.4f))
        engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, "dotquy115_tts_${System.currentTimeMillis()}")
        call.resolve(JSObject().put("available", true))
    }

    @PluginMethod
    fun stopSpeak(call: PluginCall) {
        try {
            tts?.stop()
        } catch (_: Exception) {
        }
        call.resolve()
    }

    @PluginMethod
    fun vibrate(call: PluginCall) {
        try {
            val arr = call.getArray("pattern")
            val durations = mutableListOf<Long>()
            if (arr != null) {
                for (i in 0 until arr.length()) {
                    durations.add(arr.optLong(i, 40L).coerceAtLeast(10L))
                }
            }
            if (durations.isEmpty()) durations.add(40L)

            val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vm = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vm?.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            }

            if (vibrator != null && vibrator.hasVibrator()) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    if (durations.size == 1) {
                        vibrator.vibrate(VibrationEffect.createOneShot(durations[0], VibrationEffect.DEFAULT_AMPLITUDE))
                    } else {
                        val pattern = LongArray(durations.size + 1)
                        pattern[0] = 0L
                        for (i in durations.indices) {
                            pattern[i + 1] = durations[i]
                        }
                        vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1))
                    }
                } else {
                    @Suppress("DEPRECATION")
                    vibrator.vibrate(durations[0])
                }
            }
        } catch (_: Exception) {
        }
        call.resolve()
    }

    @PluginMethod
    fun readEncryptedVault(call: PluginCall) {
        ioExecutor.execute {
            val data = EncryptedVault.read(context)
            val res = JSObject()
            if (data != null) {
                res.put("data", data)
            } else {
                res.put("data", JSObject.NULL)
            }
            call.resolve(res)
        }
    }

    @PluginMethod
    fun writeEncryptedVault(call: PluginCall) {
        val data = call.getString("data", "") ?: ""
        ioExecutor.execute {
            try {
                EncryptedVault.write(context, data)
                call.resolve()
            } catch (e: Exception) {
                call.reject("Lỗi ghi kho mã hóa: ${e.message}")
            }
        }
    }

    @PluginMethod
    fun scheduleRecheckReminder(call: PluginCall) {
        val minutes = (call.getInt("minutes", 15) ?: 15).coerceIn(1, 720)
        val personLabel = call.getString("personLabel", "Bản thân") ?: "Bản thân"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val act = activity
            if (act != null &&
                ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
            ) {
                ActivityCompat.requestPermissions(act, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 11502)
            }
        }

        try {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
            val intent = Intent(context, RecheckAlarmReceiver::class.java).apply {
                putExtra(RecheckAlarmReceiver.EXTRA_PERSON_LABEL, personLabel)
            }
            val flags = PendingIntent.FLAG_UPDATE_CURRENT or
                (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
            val pendingIntent = PendingIntent.getBroadcast(context, 11501, intent, flags)
            val triggerAt = SystemClock.elapsedRealtime() + minutes * 60_000L

            if (alarmManager != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    alarmManager.setAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAt, pendingIntent)
                } else {
                    alarmManager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAt, pendingIntent)
                }
                call.resolve(JSObject().put("scheduled", true))
            } else {
                call.resolve(JSObject().put("scheduled", false))
            }
        } catch (_: Exception) {
            call.resolve(JSObject().put("scheduled", false))
        }
    }

    @PluginMethod
    fun confirmBootHealthy(call: PluginCall) {
        OtaBundleManager.confirmBootHealthy(context)
        call.resolve()
    }

    @PluginMethod
    fun checkForWebUpdate(call: PluginCall) {
        val manifestUrl = call.getString("manifestUrl", "")?.trim().orEmpty()
        ioExecutor.execute {
            val result = OtaBundleManager.checkAndDownloadUpdate(context, manifestUrl)
            val json = JSObject().put("hasUpdate", result.hasUpdate)
            if (result.version != null) json.put("version", result.version)
            if (result.error != null) json.put("error", result.error)
            call.resolve(json)
        }
    }

    @PluginMethod
    fun applyPendingUpdate(call: PluginCall) {
        val newActivePath = OtaBundleManager.promotePendingImmediately(context)
        if (!newActivePath.isNullOrBlank()) {
            bridge.executeOnMainThread {
                bridge.setServerBasePath(newActivePath)
                call.resolve()
            }
        } else {
            call.resolve()
        }
    }

    @PluginMethod
    fun getOtaStatus(call: PluginCall) {
        val status = OtaBundleManager.getStatus(context)
        val json = JSObject()
            .put("currentVersion", status.currentVersion)
            .put("source", status.source)
        if (status.lastCheckedAt != null) json.put("lastCheckedAt", status.lastCheckedAt)
        if (status.pendingVersion != null) json.put("pendingVersion", status.pendingVersion)
        if (status.manifestUrl != null) json.put("manifestUrl", status.manifestUrl)
        call.resolve(json)
    }

    override fun handleOnDestroy() {
        try {
            tts?.stop()
            tts?.shutdown()
            tts = null
            ttsInitialized = false
        } catch (_: Exception) {
        }
        super.handleOnDestroy()
    }
}
