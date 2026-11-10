package app.tab.aid.data

import org.junit.Assert.assertEquals
import org.junit.Test

class ApiErrorsTest {

    @Test
    fun `maps authentication failures to a re-sign-in message`() {
        assertEquals(ApiErrors.SESSION_EXPIRED, ApiErrors.messageFor("invalid_token", null, 401))
        assertEquals(ApiErrors.SESSION_EXPIRED, ApiErrors.messageFor("not_authenticated", null, 401))
    }

    @Test
    fun `prefers the server description over a derived code`() {
        assertEquals("Email already in use", ApiErrors.messageFor("conflict", "Email already in use", 409))
    }

    @Test
    fun `falls back to a readable status message`() {
        assertEquals("Request failed (502).", ApiErrors.messageFor(null, null, 502))
        assertEquals("username change cooldown", ApiErrors.messageFor("username change cooldown", null, 400))
    }
}
