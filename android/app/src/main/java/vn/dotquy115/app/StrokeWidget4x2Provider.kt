package vn.dotquy115.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.widget.RemoteViews

/**
 * 4x2 Home-Screen Widget: Direct actions for 0s First Aid, Dial 115, Doctor Handoff Card, and 60s Check.
 */
class StrokeWidget4x2Provider : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        val piFlags = PendingIntent.FLAG_UPDATE_CURRENT or
            (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)

        for (widgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_stroke_4x2)

            val sosPi = routePendingIntent(context, 4001, "/so-cuu/", piFlags)
            val doctorPi = routePendingIntent(context, 4002, "/so-cuu/#doctor-handoff-section", piFlags)
            val checkPi = routePendingIntent(context, 4003, "/kiem-tra/", piFlags)

            val dialIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:115")).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            val dialPi = PendingIntent.getActivity(context, 4004, dialIntent, piFlags)

            views.setOnClickPendingIntent(R.id.btn_widget_sos, sosPi)
            views.setOnClickPendingIntent(R.id.btn_widget_call115, dialPi)
            views.setOnClickPendingIntent(R.id.btn_widget_doctor, doctorPi)
            views.setOnClickPendingIntent(R.id.btn_widget_check, checkPi)

            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }

    private fun routePendingIntent(context: Context, reqCode: Int, route: String, flags: Int): PendingIntent {
        val intent = Intent(context, MainActivity::class.java).apply {
            this.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra(MainActivity.EXTRA_TARGET_ROUTE, route)
        }
        return PendingIntent.getActivity(context, reqCode, intent, flags)
    }
}
