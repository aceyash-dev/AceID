package app.tab.aid.auth

import android.net.Uri
import app.tab.aid.BuildConfig

/**
 * Build-time configuration. This app is a PUBLIC OIDC client: it holds an issuer,
 * an API origin, a client ID, and a redirect URI, and nothing secret. Never add a
 * client secret, database credential, or backend secret here.
 */
data class AceIdConfig(
    val issuer: String,
    val apiBaseUrl: String,
    val clientId: String,
    val redirectUri: Uri,
    val scopes: List<String> = DEFAULT_SCOPES,
) {
    val isClientConfigured: Boolean get() = clientId.isNotBlank()

    /** Opens a hosted page (legal, or a security control the app does not implement natively). */
    fun webUrl(path: String): String = issuer.trimEnd('/') + path

    companion object {
        val DEFAULT_SCOPES: List<String> = listOf("openid", "profile", "email", "offline_access")

        val fromBuild: AceIdConfig = AceIdConfig(
            issuer = BuildConfig.ACEID_ISSUER.trim().trimEnd('/'),
            apiBaseUrl = BuildConfig.ACEID_API_BASE_URL.trim().trimEnd('/'),
            clientId = BuildConfig.ACEID_MOBILE_CLIENT_ID.trim(),
            redirectUri = Uri.parse(BuildConfig.ACEID_MOBILE_REDIRECT_URI.trim()),
        )
    }
}

/** A sign-in problem with copy that is already safe to show to the person. */
class AuthConfigurationException(message: String) : Exception(message)

object AuthErrors {
    const val NOT_CONFIGURED =
        "Native sign-in needs a registered Ace ID public mobile client ID. " +
            "Contact the app administrator to configure native sign-in."

    fun messageFor(code: String, details: String?): String {
        val normalized = code.lowercase()
        if (normalized.contains("cancel")) {
            return "Sign-in was cancelled. Tap Continue with Ace ID to try again."
        }
        if (normalized.contains("network") || normalized.contains("connection")) {
            return "Could not reach the identity provider. Check your connection and try again."
        }
        if (normalized.contains("redirect") || normalized.contains("callback")) {
            return "The sign-in callback was rejected. Check the registered mobile redirect URI."
        }
        if (normalized.contains("client") ||
            normalized.contains("authorize") ||
            normalized.contains("token")
        ) {
            return "The identity provider rejected the mobile sign-in ($code). " +
                "Verify the registered mobile client ID and redirect URI."
        }
        val safe = details?.replace(Regex("[\\r\\n]+"), " ")?.trim().orEmpty()
        if (safe.isEmpty()) {
            return "Sign-in failed ($code). Verify the mobile OAuth client configuration."
        }
        return "Sign-in failed ($code): " + safe.take(180)
    }
}
