package app.tab.aid.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URLEncoder

/**
 * The account API client. Reads are cached for offline use; mutations always hit
 * the server and invalidate the cache. No database credential, client secret,
 * or provider secret is ever present in this app.
 */
class AceIdApi(
    private val tokens: TokenProvider,
    private val cache: ResponseCache,
    private val baseUrl: String,
) {
    suspend fun account(): JSONObject = request("GET", "/api/account")

    suspend fun updateAccount(values: JSONObject): JSONObject =
        request("POST", "/api/account", values)

    suspend fun devices(): JSONObject = request("GET", "/api/account/devices")

    suspend fun logs(): JSONObject = request("GET", "/api/account/logs")

    suspend fun connectedApps(): JSONObject = request("GET", "/api/account/connected-apps")

    suspend fun revokeApp(grantId: String): JSONObject =
        request("DELETE", "/api/account/connected-apps/" + encodePathSegment(grantId))

    private suspend fun request(
        method: String,
        path: String,
        body: JSONObject? = null,
    ): JSONObject = withContext(Dispatchers.IO) {
        val isRead = method == "GET"
        val cached = if (isRead) cache.read(path) else null
        val token = try {
            tokens.accessToken()
        } catch (error: ApiException) {
            // The token could not be refreshed (offline or provider down).
            return@withContext cached?.data ?: throw error
        } ?: throw ApiException(ApiErrors.SESSION_EXPIRED)

        val url = try {
            ApiOrigins.resolve(baseUrl, path)
        } catch (error: IllegalArgumentException) {
            throw ApiException(ApiErrors.INVALID_ORIGIN)
        }

        var connection: HttpURLConnection? = null
        try {
            val http = url.openConnection() as HttpURLConnection
            connection = http
            http.requestMethod = method
            http.connectTimeout = TIMEOUT_MILLIS
            http.readTimeout = TIMEOUT_MILLIS
            http.instanceFollowRedirects = false
            http.setRequestProperty("Accept", "application/json")
            http.setRequestProperty("Authorization", "Bearer $token")
            http.setRequestProperty("Cache-Control", if (isRead) "no-cache" else "no-store")
            if (isRead && cached?.etag != null) {
                http.setRequestProperty("If-None-Match", cached.etag)
            }
            if (body != null) {
                http.doOutput = true
                http.setRequestProperty("Content-Type", "application/json")
                http.outputStream.use { stream ->
                    stream.write(body.toString().toByteArray(Charsets.UTF_8))
                }
            }

            val status = http.responseCode

            // Express answers a conditional GET with 304 when nothing changed.
            if (isRead && status == HttpURLConnection.HTTP_NOT_MODIFIED && cached != null) {
                cache.write(path, cached.data, http.getHeaderField("ETag") ?: cached.etag)
                return@withContext cached.data
            }

            val stream = if (status in 200..299) http.inputStream else http.errorStream
            val payload = stream?.bufferedReader()?.use { it.readText() }.orEmpty()
            val parsed = parse(payload)

            if (status !in 200..299) {
                val code = parsed.optString("error").ifBlank { null }
                val failure = ApiException(
                    ApiErrors.messageFor(
                        code = code,
                        description = parsed.optString("error_description").ifBlank { null },
                        status = status,
                    ),
                    statusCode = status,
                    code = code,
                )
                // A server fault is exactly when a verified snapshot is still useful.
                if (cached != null && status >= 500) return@withContext cached.data
                throw failure
            }

            if (isRead) {
                cache.write(path, parsed, http.getHeaderField("ETag"))
            } else {
                cache.clear()
            }
            parsed
        } catch (error: ApiException) {
            if (cached != null && (error.statusCode ?: 0) >= 500) cached.data else throw error
        } catch (error: IOException) {
            // Offline or a transient network failure only: authentication
            // failures above are never masked by cached private data.
            cached?.data ?: throw ApiException(ApiErrors.UNREACHABLE)
        } finally {
            connection?.disconnect()
        }
    }

    private fun parse(payload: String): JSONObject = try {
        if (payload.isBlank()) JSONObject() else JSONObject(payload)
    } catch (error: Exception) {
        JSONObject()
    }

    private fun encodePathSegment(value: String): String =
        URLEncoder.encode(value, "UTF-8").replace("+", "%20")

    private companion object {
        const val TIMEOUT_MILLIS = 20_000
    }
}
