package app.tab.aid.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class ApiOriginsTest {

    @Test
    fun `resolves a path against an https origin`() {
        val url = ApiOrigins.resolve("https://identity.ace-base.cc", "/api/account")
        assertEquals("https://identity.ace-base.cc/api/account", url.toString())
    }

    @Test
    fun `allows loopback http for local development`() {
        val url = ApiOrigins.resolve("http://localhost:3000", "/api/account")
        assertEquals("http://localhost:3000/api/account", url.toString())
    }

    @Test
    fun `refuses cleartext for a public host`() {
        assertThrows(IllegalArgumentException::class.java) {
            ApiOrigins.resolve("http://identity.ace-base.cc", "/api/account")
        }
    }

    @Test
    fun `refuses embedded credentials, query strings and paths`() {
        assertThrows(IllegalArgumentException::class.java) {
            ApiOrigins.resolve("https://user:pass@identity.ace-base.cc", "/api/account")
        }
        assertThrows(IllegalArgumentException::class.java) {
            ApiOrigins.resolve("https://identity.ace-base.cc?x=1", "/api/account")
        }
        assertThrows(IllegalArgumentException::class.java) {
            ApiOrigins.resolve("https://identity.ace-base.cc/proxy", "/api/account")
        }
    }
}
