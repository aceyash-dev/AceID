package app.tab.aid.auth

import org.junit.Assert.assertEquals
import org.junit.Test

class RevocationBodyTest {
    @Test
    fun encodesFieldsForAPublicClient() {
        assertEquals(
            "client_id=abc&token=a%2Bb%3D%3D&token_type_hint=refresh_token",
            revocationBody("abc", "a+b==", "refresh_token"),
        )
    }
}
