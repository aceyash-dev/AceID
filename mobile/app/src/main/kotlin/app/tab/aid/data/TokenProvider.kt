package app.tab.aid.data

/** Supplies a currently valid access token, refreshing it when needed. */
interface TokenProvider {
    suspend fun accessToken(): String?
}
