package app.tab.aid.data

import java.net.URI
import java.net.URL

/**
 * Resolves an API path against the configured origin, refusing anything that
 * could redirect a bearer token somewhere it does not belong. Plain HTTP is
 * accepted only for a loopback development issuer.
 */
object ApiOrigins {
    fun resolve(baseUrl: String, path: String): URL {
        val origin = try {
            URI(baseUrl.trim())
        } catch (error: Exception) {
            throw IllegalArgumentException(ApiErrors.INVALID_ORIGIN, error)
        }

        val scheme = origin.scheme?.lowercase()
        val host = origin.host?.lowercase()
        val loopback = host == "localhost" || host == "127.0.0.1" || host == "::1"

        val valid = (scheme == "https" || (scheme == "http" && loopback)) &&
            !host.isNullOrBlank() &&
            origin.userInfo == null &&
            (origin.path.isNullOrEmpty() || origin.path == "/") &&
            origin.query == null &&
            origin.fragment == null

        if (!valid) throw IllegalArgumentException(ApiErrors.INVALID_ORIGIN)

        return URL(baseUrl.trim().trimEnd('/') + path)
    }
}
