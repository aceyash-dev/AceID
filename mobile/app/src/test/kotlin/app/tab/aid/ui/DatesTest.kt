package app.tab.aid.ui

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class DatesTest {

    @Test
    fun `formats an ISO instant`() {
        assertEquals("9 Nov 2026", Dates.short("2026-11-09T10:15:00Z"))
    }

    @Test
    fun `returns null for empty values`() {
        assertNull(Dates.short(null))
        assertNull(Dates.short(""))
        assertNull(Dates.short("null"))
    }

    @Test
    fun `keeps an unparseable value as-is`() {
        assertEquals("last Tuesday", Dates.short("last Tuesday"))
    }
}
