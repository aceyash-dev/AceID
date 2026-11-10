package app.tab.aid.ui

import java.time.Instant
import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

/** Turns a server timestamp into short display copy, falling back to the raw value. */
object Dates {
    private val display = DateTimeFormatter.ofPattern("d MMM yyyy")

    fun short(raw: String?): String? {
        val value = raw?.trim()
        if (value.isNullOrBlank() || value == "null") return null
        return try {
            Instant.parse(value).atZone(ZoneId.systemDefault()).format(display)
        } catch (error: Exception) {
            try {
                OffsetDateTime.parse(value).format(display)
            } catch (second: Exception) {
                value
            }
        }
    }
}
