package app.tab.aid.data

import org.json.JSONObject

/** Returns the first non-blank string among [keys]. */
fun JSONObject.optText(vararg keys: String): String? {
    for (key in keys) {
        val value = optString(key)
        if (value.isNotBlank() && value != "null") return value
    }
    return null
}

/** Reads an array of objects, tolerating a missing or malformed value. */
fun JSONObject.optObjects(key: String): List<JSONObject> {
    val array = optJSONArray(key) ?: return emptyList()
    return (0 until array.length()).mapNotNull { array.optJSONObject(it) }
}

fun JSONObject.optStrings(key: String): List<String> {
    val array = optJSONArray(key) ?: return emptyList()
    return (0 until array.length()).mapNotNull { index ->
        array.opt(index)?.toString()?.takeIf { it.isNotBlank() }
    }
}

/** The server serializes activity under `log`; `logs` is a compatibility alias. */
fun activityLogs(response: JSONObject): List<JSONObject> =
    response.optObjects("log").ifEmpty { response.optObjects("logs") }
