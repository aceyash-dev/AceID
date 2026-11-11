package app.tab.aid.auth

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class RefreshRejectionTest {
    @Test
    fun providerRejectionsEndTheSession() {
        assertTrue(isRefreshRejected("invalid_grant"))
        assertTrue(isRefreshRejected("INVALID_GRANT"))
        assertTrue(isRefreshRejected("invalid_client"))
    }

    @Test
    fun transientFailuresKeepTheSession() {
        assertFalse(isRefreshRejected(null))
        assertFalse(isRefreshRejected("server_error"))
        assertFalse(isRefreshRejected("temporarily_unavailable"))
    }
}
