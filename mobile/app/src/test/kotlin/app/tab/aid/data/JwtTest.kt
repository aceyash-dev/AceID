package app.tab.aid.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.util.Base64

class JwtTest {

    private fun token(payload: String): String {
        val encoder = Base64.getUrlEncoder().withoutPadding()
        val header = encoder.encodeToString("""{"alg":"RS256"}""".toByteArray())
        val body = encoder.encodeToString(payload.toByteArray())
        return "$header.$body.signature"
    }

    @Test
    fun `reads claims from a well formed id token`() {
        val claims = Jwt.claims(token("""{"sub":"abc","name":"Yash","email":"y@example.com"}"""))
        assertEquals("abc", claims["sub"])
        assertEquals("Yash", claims["name"])
    }

    @Test
    fun `returns no claims for a malformed token`() {
        assertTrue(Jwt.claims("not-a-token").isEmpty())
        assertTrue(Jwt.claims(null).isEmpty())
        assertTrue(Jwt.claims("a.b").isEmpty())
    }

    @Test
    fun `builds a profile and falls back to preferred_username`() {
        val profile = Jwt.profileFrom(token("""{"sub":"abc","preferred_username":"yash"}"""), 42L)
        assertEquals("abc", profile?.subject)
        assertEquals("yash", profile?.name)
        assertEquals(42L, profile?.expiresAtEpochMillis)
    }

    @Test
    fun `rejects a token without a subject`() {
        assertNull(Jwt.profileFrom(token("""{"name":"Yash"}"""), 1L))
    }
}
