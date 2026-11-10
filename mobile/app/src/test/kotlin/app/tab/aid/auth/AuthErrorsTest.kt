package app.tab.aid.auth

import org.junit.Assert.assertTrue
import org.junit.Test

class AuthErrorsTest {

    @Test
    fun `cancellation is described as a retry`() {
        assertTrue(AuthErrors.messageFor("access_denied_user_cancelled", null).contains("cancelled"))
    }

    @Test
    fun `network failures point at connectivity`() {
        assertTrue(AuthErrors.messageFor("network_error", null).contains("Could not reach"))
    }

    @Test
    fun `client errors name the configuration problem`() {
        val message = AuthErrors.messageFor("invalid_client", "unknown client")
        assertTrue(message.contains("mobile client ID"))
    }

    @Test
    fun `long provider detail is truncated`() {
        val message = AuthErrors.messageFor("server_error", "x".repeat(500))
        assertTrue(message.length < 260)
    }
}
