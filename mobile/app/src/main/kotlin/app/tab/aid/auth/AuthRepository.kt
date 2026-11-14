package app.tab.aid.auth

import android.content.Context
import android.content.Intent
import android.net.Uri
import app.tab.aid.data.ApiErrors
import app.tab.aid.data.ApiException
import app.tab.aid.data.IdentityProfile
import app.tab.aid.data.Jwt
import app.tab.aid.data.SessionStore
import app.tab.aid.data.TokenProvider
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import net.openid.appauth.AuthorizationException
import net.openid.appauth.AuthorizationRequest
import net.openid.appauth.AuthorizationResponse
import net.openid.appauth.AuthorizationService
import net.openid.appauth.AuthorizationServiceConfiguration
import net.openid.appauth.CodeVerifierUtil
import net.openid.appauth.EndSessionRequest
import net.openid.appauth.GrantTypeValues
import net.openid.appauth.ResponseTypeValues
import net.openid.appauth.TokenRequest
import net.openid.appauth.TokenResponse
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

/**
 * Owns the OIDC authorization-code + PKCE flow, token refresh, and sign-out.
 * Tokens live only in the Keystore-backed session store; nothing is written to
 * a log, and the app never talks to PostgreSQL directly.
 */
class AuthRepository(
    context: Context,
    private val session: SessionStore,
    private val config: AceIdConfig = AceIdConfig.fromBuild,
) : TokenProvider {

    private val appContext: Context = context.applicationContext
    private val service = AuthorizationService(appContext)
    private var discovery: AuthorizationServiceConfiguration? = null

    /** Serialises refreshes so a rotated refresh token is never spent twice. */
    private val refreshMutex = Mutex()

    /** Restores a still-valid session, or returns null after clearing it. */
    suspend fun restore(): IdentityProfile? = withContext(Dispatchers.IO) {
        val profile = session.profile()
        if (profile == null) {
            session.clearSession()
            return@withContext null
        }
        try {
            if (accessToken() == null) {
                session.clearSession()
                return@withContext null
            }
        } catch (error: ApiException) {
            // Offline or the provider is down: keep the session and its cached data.
        }
        profile
    }

    /** Builds the authorization request; the caller launches the returned intent. */
    suspend fun createAuthorizationRequest(): AuthorizationRequest = withContext(Dispatchers.IO) {
        if (!config.isClientConfigured) throw AuthConfigurationException(AuthErrors.NOT_CONFIGURED)
        val configuration = loadDiscovery()
        val verifier = CodeVerifierUtil.generateRandomCodeVerifier()
        AuthorizationRequest.Builder(
            configuration,
            config.clientId,
            ResponseTypeValues.CODE,
            config.redirectUri,
        )
            .setScope(config.scopes.joinToString(" "))
            .setCodeVerifier(
                verifier,
                CodeVerifierUtil.deriveCodeVerifierChallenge(verifier),
                CodeVerifierUtil.getCodeVerifierChallengeMethod(),
            )
            .build()
    }

    fun authorizationIntent(request: AuthorizationRequest): Intent =
        service.getAuthorizationRequestIntent(request)

    /** Exchanges the redirect for tokens. Throws [AuthConfigurationException] with user-safe copy. */
    suspend fun completeSignIn(data: Intent?): IdentityProfile = withContext(Dispatchers.IO) {
        if (data == null) {
            throw AuthConfigurationException(
                "Sign-in did not finish. Check your connection and try again.",
            )
        }

        val failure = AuthorizationException.fromIntent(data)
        val response = AuthorizationResponse.fromIntent(data)
        if (response == null) {
            val code = failure?.error ?: "oauth_response_missing"
            throw AuthConfigurationException(AuthErrors.messageFor(code, failure?.errorDescription))
        }

        val exchangeRequest = response.createTokenExchangeRequest()
        val tokenResponse = try {
            performTokenRequest(exchangeRequest)
        } catch (error: AuthorizationException) {
            throw AuthConfigurationException(
                AuthErrors.messageFor(error.error ?: "oauth_token_error", error.errorDescription),
            )
        } catch (error: Exception) {
            throw AuthConfigurationException(
                "Sign-in could not complete (${error.javaClass.simpleName}). " +
                    "Check the mobile OAuth client registration and try again.",
            )
        }

        tokenResponse.accessToken
            ?: throw AuthConfigurationException(
                "The identity provider returned no access token. " +
                    "Check the OAuth client and authorization-code exchange.",
            )
        if (tokenResponse.idToken.isNullOrBlank()) {
            throw AuthConfigurationException(
                "The identity provider returned no ID token. " +
                    "Ensure the mobile client requests the openid scope.",
            )
        }

        persist(tokenResponse)
            ?: throw AuthConfigurationException(
                "The identity provider returned an invalid ID token. " +
                    "Check the issuer and OIDC client configuration.",
            )
    }

    /** Returns a valid access token, refreshing it first when it is close to expiry. */
    override suspend fun accessToken(): String? = withContext(Dispatchers.IO) {
        validToken()?.let { return@withContext it }

        refreshMutex.withLock {
            // A concurrent caller may have refreshed while this one waited.
            validToken()?.let { return@withLock it }

            val refreshToken = session.refreshToken()
            if (refreshToken.isNullOrBlank() || !config.isClientConfigured) return@withLock null

            try {
                val request = TokenRequest.Builder(loadDiscovery(), config.clientId)
                    .setGrantType(GrantTypeValues.REFRESH_TOKEN)
                    .setRefreshToken(refreshToken)
                    .build()
                persist(performTokenRequest(request))
                session.accessToken()
            } catch (error: CancellationException) {
                throw error
            } catch (error: AuthorizationException) {
                // Only a provider rejection ends the session. Timeouts, being
                // offline, and 5xx responses must not sign the person out.
                if (isRefreshRejected(error.error)) {
                    session.clearSession()
                    null
                } else {
                    throw ApiException(ApiErrors.UNREACHABLE)
                }
            } catch (error: Exception) {
                throw ApiException(ApiErrors.UNREACHABLE)
            }
        }
    }

    private fun validToken(): String? {
        val token = session.accessToken()
        val expiresAt = session.expiresAtEpochMillis() ?: 0L
        return token?.takeIf { it.isNotBlank() && expiresAt > System.currentTimeMillis() + EXPIRY_SKEW_MILLIS }
    }

    /**
     * Ends the provider session when possible, then always clears local state.
     * Local sign-out must succeed even if the provider is unreachable.
     */
    suspend fun signOut() = withContext(Dispatchers.IO) {
        val idToken = session.idToken()
        val refreshToken = session.refreshToken()
        val accessToken = session.accessToken()

        // Revoke first so a stolen copy of either token stops working now,
        // not when it eventually expires. Best effort: never blocks sign-out.
        if (config.isClientConfigured) {
            try {
                val endpoint = loadDiscovery().discoveryDoc?.docJson
                    ?.optString("revocation_endpoint")?.takeIf { it.isNotBlank() }
                if (endpoint != null) {
                    refreshToken?.let { revoke(endpoint, it, "refresh_token") }
                    accessToken?.let { revoke(endpoint, it, "access_token") }
                }
            } catch (error: Exception) {
                // Ignored on purpose: the local session is cleared below regardless.
            }
        }

        if (config.isClientConfigured && !idToken.isNullOrBlank()) {
            try {
                // No post_logout_redirect_uri: the mobile client has none registered,
                // and sending one makes the provider show an error page.
                val request = EndSessionRequest.Builder(loadDiscovery())
                    .setIdTokenHint(idToken)
                    .build()
                val intent = service.getEndSessionRequestIntent(request)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                appContext.startActivity(intent)
            } catch (error: Exception) {
                // Ignored on purpose: the local session is cleared below regardless.
            }
        }
        session.clearSession()
    }

    private fun revoke(endpoint: String, token: String, hint: String) {
        val url = java.net.URL(endpoint)
        if (url.protocol != "https" && url.host != "localhost" && url.host != "127.0.0.1") return
        val connection = url.openConnection() as java.net.HttpURLConnection
        try {
            connection.requestMethod = "POST"
            connection.connectTimeout = REVOKE_TIMEOUT_MILLIS
            connection.readTimeout = REVOKE_TIMEOUT_MILLIS
            connection.instanceFollowRedirects = false
            connection.doOutput = true
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
            connection.outputStream.use { it.write(revocationBody(config.clientId, token, hint).toByteArray()) }
            connection.responseCode // Drain; any status is acceptable for best-effort revocation.
        } finally {
            connection.disconnect()
        }
    }

    fun dispose() = service.dispose()

    private suspend fun performTokenRequest(request: TokenRequest): TokenResponse =
        suspendCancellableCoroutine<TokenResponse> { continuation ->
            service.performTokenRequest(request) { response, error ->
                when {
                    response != null -> if (continuation.isActive) continuation.resume(response)
                    error != null -> if (continuation.isActive) continuation.resumeWithException(error)
                    else -> if (continuation.isActive) {
                        continuation.resumeWithException(
                            IllegalStateException("The identity provider returned an empty token response."),
                        )
                    }
                }
            }
        }

    private fun persist(response: TokenResponse): IdentityProfile? {
        val accessToken = response.accessToken ?: return null
        val expiresAt = response.accessTokenExpirationTime
            ?: (System.currentTimeMillis() + DEFAULT_TOKEN_LIFETIME_MILLIS)
        val profile = Jwt.profileFrom(response.idToken, expiresAt)
        session.saveSession(
            accessToken = accessToken,
            refreshToken = response.refreshToken,
            idToken = response.idToken,
            profile = profile,
            expiresAtEpochMillis = expiresAt,
        )
        return profile
    }

    private suspend fun loadDiscovery(): AuthorizationServiceConfiguration {
        discovery?.let { return it }
        val fetched = suspendCancellableCoroutine<AuthorizationServiceConfiguration> { continuation ->
            AuthorizationServiceConfiguration.fetchFromIssuer(Uri.parse(config.issuer)) { configuration, error ->
                when {
                    configuration != null -> if (continuation.isActive) continuation.resume(configuration)
                    else -> if (continuation.isActive) {
                        continuation.resumeWithException(
                            AuthConfigurationException(
                                AuthErrors.messageFor(
                                    error?.error ?: "discovery_failed",
                                    error?.errorDescription,
                                ),
                            ),
                        )
                    }
                }
            }
        }
        discovery = fetched
        return fetched
    }

    private companion object {
        const val EXPIRY_SKEW_MILLIS = 60_000L
        const val REVOKE_TIMEOUT_MILLIS = 8_000
        const val DEFAULT_TOKEN_LIFETIME_MILLIS = 5 * 60 * 1000L
    }
}

private val REJECTED_REFRESH_ERRORS = setOf("invalid_grant", "invalid_client", "unauthorized_client")

/** True when the provider itself refused the refresh token, as opposed to a transport failure. */
internal fun isRefreshRejected(error: String?): Boolean =
    error?.lowercase() in REJECTED_REFRESH_ERRORS

/** Form body for RFC 7009 token revocation by a public client. */
internal fun revocationBody(clientId: String, token: String, hint: String): String {
    fun enc(value: String) = java.net.URLEncoder.encode(value, "UTF-8")
    return "client_id=${enc(clientId)}&token=${enc(token)}&token_type_hint=${enc(hint)}"
}
