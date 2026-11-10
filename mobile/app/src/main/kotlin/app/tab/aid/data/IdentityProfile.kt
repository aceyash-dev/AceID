package app.tab.aid.data

import org.json.JSONObject

/** The identity the app holds locally after a successful OIDC sign-in. */
data class IdentityProfile(
    val subject: String,
    val name: String,
    val email: String,
    val expiresAtEpochMillis: Long,
) {
    val initial: String
        get() = name.trim().firstOrNull()?.uppercaseChar()?.toString() ?: "A"

    fun toJson(): String = JSONObject()
        .put("sub", subject)
        .put("name", name)
        .put("email", email)
        .put("expires_at", expiresAtEpochMillis)
        .toString()

    companion object {
        fun fromJson(raw: String?): IdentityProfile? {
            if (raw.isNullOrBlank()) return null
            return try {
                val json = JSONObject(raw)
                val subject = json.optString("sub")
                if (subject.isBlank()) null
                else IdentityProfile(
                    subject = subject,
                    name = json.optString("name").ifBlank { "Ace ID member" },
                    email = json.optString("email"),
                    expiresAtEpochMillis = json.optLong("expires_at", 0L),
                )
            } catch (error: Exception) {
                null
            }
        }
    }
}
