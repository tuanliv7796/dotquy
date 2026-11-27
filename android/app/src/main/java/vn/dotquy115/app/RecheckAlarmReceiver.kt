package vn.dotquy115.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

/**
 * Fires privacy-safe local recheck reminder after TIA ("Có rồi tự hết") or watchful waiting (Rule H7).
 * Never displays medical symptom text on a locked screen.
 */
class RecheckAlarmReceiver : BroadcastReceiver() {
    companion object {
        const val CHANNEL_ID = "dotquy115_recheck_channel"
        const val EXTRA_PERSON_LABEL = "person_label"
        private const val NOTIFICATION_ID = 11501
    }

    override fun onReceive(context: Context, intent: Intent?) {
        val personLabel = intent?.getStringExtra(EXTRA_PERSON_LABEL)?.takeIf { it.isNotBlank() } ?: "người thân"
        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager ?: return

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Nhắc kiểm tra lại (Đột Quỵ 115)",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Nhắc kiểm tra lại dấu hiệu BE-FAST sau cơn nghi ngờ thoáng qua"
                lockscreenVisibility = NotificationCompat.VISIBILITY_PRIVATE
            }
            nm.createNotificationChannel(channel)
        }

        val openIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra(MainActivity.EXTRA_TARGET_ROUTE, "/kiem-tra/")
        }
        val piFlags = PendingIntent.FLAG_UPDATE_CURRENT or
            (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
        val contentPi = PendingIntent.getActivity(context, NOTIFICATION_ID, openIntent, piFlags)

        val publicLockScreenNote = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_115)
            .setContentTitle("Đột Quỵ 115")
            .setContentText("Đến giờ kiểm tra lại theo lịch hẹn.")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        val privateNote = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_115)
            .setContentTitle("Đến giờ kiểm tra lại cho $personLabel")
            .setContentText("Chạm để mở bài kiểm tra nhanh 60 giây. Nếu dấu hiệu quay lại, hãy gọi 115 ngay.")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
            .setPublicVersion(publicLockScreenNote)
            .setAutoCancel(true)
            .setContentIntent(contentPi)
            .build()

        try {
            nm.notify(NOTIFICATION_ID, privateNote)
        } catch (_: SecurityException) {
            // Notification permission denied by user on Android 13+
        }
    }
}
