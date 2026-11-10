package app.tab.aid.data

import org.json.JSONObject
import java.util.Base64

/**
 * Reads claims out of an ID token for display. The app never uses these claims
 * to make an authorization decision: the server is authoritative for that.
 */
object Jwt {
    fun claims(token: String?): Map<String, Any?> {
        val parts = token?.split('.') ?: return emptyMap()
        if (parts.size != 3) return emptyMap()
        return try {
            val payload = String(Base64.getUrlDecoder().decode(pad(parts[1])), Charsets.UTF_8)
            val json = JSONObject(payload)
            json.keys().asSequence().associateWith { key -> json.opt(key) }
        } catch (error: Exception) {
            emptyMap()
        }
    }

    fun profileFrom(token: String?, expiresAtEpochMillis: Long): IdentityProfile? {
        val claims = claims(token)
        val subject = claims.string("sub") ?: return null
        return IdentityProfile(
            subject = subject,
            name = claims.string("name")
                ?: claims.string("preferred_username")
                ?: "Ace ID member",
            email = claims.string("email").orEmpty(),
            expiresAtEpochMillis = expiresAtEpochMillis,
        )
    }

    private fun pad(value: String): String = value + "=".repeat((4 - value.length % 4) % 4)

    private fun Map<String, Any?>.string(key: String): String? =
        (this[key] as? String)?.takeIf { it.isNotBlank() }
}
