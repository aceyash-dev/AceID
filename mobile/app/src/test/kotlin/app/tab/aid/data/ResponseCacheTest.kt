package app.tab.aid.data

import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Test

class ResponseCacheTest {

    @Test
    fun `canonical form ignores object key order`() {
        val first = JSONObject("""{"b":1,"a":{"d":2,"c":[1,2]}}""")
        val second = JSONObject("""{"a":{"c":[1,2],"d":2},"b":1}""")
        assertEquals(ResponseCache.canonical(first), ResponseCache.canonical(second))
    }

    @Test
    fun `canonical form notices a changed value`() {
        val first = JSONObject("""{"a":1}""")
        val second = JSONObject("""{"a":2}""")
        assertNotEquals(ResponseCache.canonical(first), ResponseCache.canonical(second))
    }

    @Test
    fun `canonical form keeps array order significant`() {
        val first = JSONArray("""[1,2]""")
        val second = JSONArray("""[2,1]""")
        assertNotEquals(ResponseCache.canonical(first), ResponseCache.canonical(second))
    }
}
