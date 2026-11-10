package app.tab.aid.data

/** A failure the UI can show as-is. Messages are already user-facing. */
class ApiException(
    message: String,
    val statusCode: Int? = null,
    val code: String? = null,
) : Exception(message)

object ApiErrors {
    const val SESSION_EXPIRED = "Your session expired. Sign in again."
    const val UNREACHABLE = "Could not reach Ace ID. Check your connection and try again."
    const val INVALID_ORIGIN = "The configured API origin is invalid."

    /** Mirrors the server's error codes to copy a person can act on. */
    fun messageFor(code: String?, description: String?, status: Int): String = when (code) {
        "not_authenticated", "authentication_required", "invalid_token" -> SESSION_EXPIRED
        "username_change_cooldown" -> "Your username cannot be changed yet."
        "invalid_redirect_uri", "invalid_origin" -> "This request was rejected for security reasons. Try again from the app."
        else -> description?.takeIf { it.isNotBlank() }
            ?: code?.replace('_', ' ')
            ?: "Request failed ($status)."
    }
}
