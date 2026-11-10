package app.tab.aid.data

enum class ThemeMode { LIGHT, DARK }

/** Everything the app persists about the current session and its preferences. */
class SessionStore(private val store: SecureStore) {
    fun accessToken(): String? = store.read(KEY_ACCESS_TOKEN)

    fun refreshToken(): String? = store.read(KEY_REFRESH_TOKEN)

    fun idToken(): String? = store.read(KEY_ID_TOKEN)

    fun expiresAtEpochMillis(): Long? = store.read(KEY_EXPIRES_AT)?.toLongOrNull()

    fun profile(): IdentityProfile? = IdentityProfile.fromJson(store.read(KEY_PROFILE))

    fun saveSession(
        accessToken: String,
        refreshToken: String?,
        idToken: String?,
        profile: IdentityProfile?,
        expiresAtEpochMillis: Long,
    ) {
        store.write(KEY_ACCESS_TOKEN, accessToken)
        if (!refreshToken.isNullOrBlank()) store.write(KEY_REFRESH_TOKEN, refreshToken)
        if (!idToken.isNullOrBlank()) store.write(KEY_ID_TOKEN, idToken)
        if (profile != null) store.write(KEY_PROFILE, profile.toJson()) else store.delete(KEY_PROFILE)
        store.write(KEY_EXPIRES_AT, expiresAtEpochMillis.toString())
    }

    /**
     * Drops the session and every cached API snapshot. Private data must never
     * survive a sign-out or an invalid session.
     */
    fun clearSession() {
        listOf(KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN, KEY_ID_TOKEN, KEY_PROFILE, KEY_EXPIRES_AT)
            .forEach(store::delete)
        store.keysWithPrefix(ResponseCache.CACHE_PREFIX).forEach(store::delete)
    }

    fun themeMode(): ThemeMode =
        if (store.read(KEY_THEME_MODE) == ThemeMode.DARK.name) ThemeMode.DARK else ThemeMode.LIGHT

    fun saveThemeMode(mode: ThemeMode) {
        try {
            store.write(KEY_THEME_MODE, mode.name)
        } catch (error: Exception) {
            // A preference write failure must not make the toggle unusable.
        }
    }

    private companion object {
        const val KEY_ACCESS_TOKEN = "aceid.access_token"
        const val KEY_REFRESH_TOKEN = "aceid.refresh_token"
        const val KEY_ID_TOKEN = "aceid.id_token"
        const val KEY_EXPIRES_AT = "aceid.expires_at"
        const val KEY_PROFILE = "aceid.profile"
        const val KEY_THEME_MODE = "aceid.theme_mode"
    }
}
