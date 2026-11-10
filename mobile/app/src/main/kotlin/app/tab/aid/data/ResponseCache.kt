package app.tab.aid.data

import org.json.JSONArray
import org.json.JSONObject

/**
 * Last-known-good snapshots of GET responses, used only as an offline fallback.
 * Every online read still asks the server (with If-None-Match), snapshots expire
 * after seven days without verification, and mutations clear them.
 */
class ResponseCache(private val store: SecureStore) {
    data class Entry(val data: JSONObject, val etag: String?)

    fun read(path: String): Entry? {
        val raw = store.read(keyFor(path)) ?: return null
        if (raw.length > MAX_BYTES) return null
        return try {
            val envelope = JSONObject(raw)
            if (envelope.optInt("cache_version") != 1) return null
            val data = envelope.optJSONObject("data") ?: return null
            val verifiedAt = envelope.optLong("verified_at", 0L)
            if (verifiedAt <= 0L) return null
            if (System.currentTimeMillis() - verifiedAt > MAX_OFFLINE_AGE_MILLIS) return null
            Entry(data = data, etag = envelope.optString("etag").ifBlank { null })
        } catch (error: Exception) {
            null
        }
    }

    fun write(path: String, data: JSONObject, etag: String?) {
        try {
            val envelope = JSONObject()
                .put("cache_version", 1)
                .put("verified_at", System.currentTimeMillis())
                .put("etag", etag ?: JSONObject.NULL)
                .put("data", data)
            val encoded = envelope.toString()
            if (encoded.length > MAX_BYTES) return
            store.write(keyFor(path), encoded)
        } catch (error: Exception) {
            // A cache write failure must never fail a successful request.
        }
    }

    fun clear() {
        store.keysWithPrefix(CACHE_PREFIX).forEach(store::delete)
    }

    private fun keyFor(path: String): String = CACHE_PREFIX + path

    companion object {
        const val CACHE_PREFIX = "aceid.cache."

        private const val MAX_BYTES = 256 * 1024
        private const val MAX_OFFLINE_AGE_MILLIS = 7L * 24 * 60 * 60 * 1000

        /** Key-order-independent serialization, so an unchanged payload is not rewritten. */
        fun canonical(value: Any?): String = StringBuilder().also { write(value, it) }.toString()

        private fun write(value: Any?, builder: StringBuilder) {
            when (value) {
                is JSONObject -> {
                    val keys = value.keys().asSequence().toList().sorted()
                    builder.append('{')
                    keys.forEachIndexed { index, key ->
                        if (index > 0) builder.append(',')
                        builder.append(JSONObject.quote(key)).append(':')
                        write(value.opt(key), builder)
                    }
                    builder.append('}')
                }

                is JSONArray -> {
                    builder.append('[')
                    for (index in 0 until value.length()) {
                        if (index > 0) builder.append(',')
                        write(value.opt(index), builder)
                    }
                    builder.append(']')
                }

                null, JSONObject.NULL -> builder.append("null")
                is String -> builder.append(JSONObject.quote(value))
                is Boolean, is Number -> builder.append(value.toString())
                else -> builder.append(JSONObject.quote(value.toString()))
            }
        }
    }
}
