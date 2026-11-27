package vn.dotquy115.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.os.Build
import android.widget.RemoteViews

/**
 * 2x2 Home-Screen Widget: One-tap 0-second launch into Emergency First Aid (/so-cuu/).
 */
class StrokeWidget2x2Provider : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        val piFlags = PendingIntent.FLAG_UPDATE_CURRENT or
            (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)

        for (widgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_stroke_2x2)
            val sosIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
                putExtra(MainActivity.EXTRA_TARGET_ROUTE, "/so-cuu/")
            }
            val sosPi = PendingIntent.getActivity(context, 2001, sosIntent, piFlags)
            views.setOnClickPendingIntent(R.id.widget_2x2_root, sosPi)
            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }
}
