package vn.dotquy115.app

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.webkit.ServiceWorkerClient
import android.webkit.ServiceWorkerController
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import com.getcapacitor.BridgeActivity
import com.getcapacitor.BridgeWebViewClient
import com.getcapacitor.ServerPath

/**
 * Main Capacitor Activity for Cẩm Nang Đột Quỵ — Sơ cứu & Phòng bệnh ("Đột Quỵ 115").
 *
 * Key responsibilities:
 * 1. Runs OtaBundleManager.prepareActiveBundlePath() (<2ms local check, zero network blocking)
 *    and mounts the active Website OTA snapshot (or falls back to factory APK assets/public).
 * 2. Wraps BridgeWebViewClient so Astro static directory routes (/so-cuu/, /kiem-tra/,
 *    /tra-cuu/<slug>/, /benh-vien/, /ho-so/) resolve cleanly to .../index.html in BOTH
 *    APK assets and OTA file snapshots instead of falling through to SPA root /index.html.
 * 3. Handles deep-link / widget / shortcut / tile / notification EXTRA_TARGET_ROUTE navigation.
 */
class MainActivity : BridgeActivity() {
    companion object {
        const val EXTRA_TARGET_ROUTE = "target_route"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(DotQuyNativePlugin::class.java)

        val activeOtaDir = OtaBundleManager.prepareActiveBundlePath(this)
        if (!activeOtaDir.isNullOrBlank()) {
            bridgeBuilder.setServerPath(ServerPath(ServerPath.PathType.BASE_PATH, activeOtaDir))
        }

        super.onCreate(savedInstanceState)
    }

    override fun load() {
        super.load()

        val currentBridge = bridge ?: return

        // Rewrite extensionless Astro static directory routes (/so-cuu/ -> /so-cuu/index.html)
        currentBridge.webViewClient = object : BridgeWebViewClient(currentBridge) {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                val rewritten = rewriteDirectoryRequestIfNeeded(currentBridge.scheme, currentBridge.host, request)
                return super.shouldInterceptRequest(view, rewritten)
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            try {
                ServiceWorkerController.getInstance().setServiceWorkerClient(
                    object : ServiceWorkerClient() {
                        override fun shouldInterceptRequest(request: WebResourceRequest): WebResourceResponse? {
                            val rewritten = rewriteDirectoryRequestIfNeeded(currentBridge.scheme, currentBridge.host, request)
                            return currentBridge.localServer.shouldInterceptRequest(rewritten)
                        }
                    }
                )
            } catch (_: Exception) {
            }
        }

        navigateFromIntentIfNeeded(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        navigateFromIntentIfNeeded(intent)
    }

    private fun navigateFromIntentIfNeeded(incoming: Intent?) {
        if (incoming == null) return
        val currentBridge = bridge ?: return

        val routeExtra = incoming.getStringExtra(EXTRA_TARGET_ROUTE)?.trim()
        val dataRoute = incoming.data?.let { uri ->
            if (uri.scheme == "dotquy115") {
                val hostPart = uri.host?.takeIf { it.isNotEmpty() }?.let { "/$it" } ?: ""
                val pathPart = uri.path ?: ""
                val fragPart = uri.fragment?.let { "#$it" } ?: ""
                "$hostPart$pathPart$fragPart".ifEmpty { "/" }
            } else {
                null
            }
        }

        val targetRoute = routeExtra ?: dataRoute ?: return
        incoming.removeExtra(EXTRA_TARGET_ROUTE)

        val normalized = if (targetRoute.startsWith("/")) targetRoute else "/$targetRoute"
        val targetUrl = "${currentBridge.localUrl}$normalized"
        currentBridge.webView?.post {
            currentBridge.webView.loadUrl(targetUrl)
        }
    }

    private fun rewriteDirectoryRequestIfNeeded(
        appScheme: String,
        appHost: String,
        request: WebResourceRequest
    ): WebResourceRequest {
        val url = request.url ?: return request
        if (!url.scheme.equals(appScheme, ignoreCase = true) || !url.host.equals(appHost, ignoreCase = true)) {
            return request
        }

        val rawPath = url.path ?: return request
        if (rawPath.isEmpty() ||
            rawPath == "/" ||
            rawPath == "/cordova.js" ||
            rawPath == "/favicon.ico" ||
            rawPath.startsWith("/_capacitor_")
        ) {
            return request
        }

        val lastSegment = url.lastPathSegment ?: ""
        if (lastSegment.contains(".")) {
            return request
        }

        val normalizedHtmlPath = rawPath.trimEnd('/') + "/index.html"
        val rewrittenUri: Uri = url.buildUpon().path(normalizedHtmlPath).build()

        return object : WebResourceRequest {
            override fun getUrl(): Uri = rewrittenUri
            override fun isForMainFrame(): Boolean = request.isForMainFrame
            override fun isRedirect(): Boolean =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) request.isRedirect else false
            override fun hasGesture(): Boolean = request.hasGesture()
            override fun getMethod(): String = request.method
            override fun getRequestHeaders(): MutableMap<String, String> = request.requestHeaders
        }
    }
}
