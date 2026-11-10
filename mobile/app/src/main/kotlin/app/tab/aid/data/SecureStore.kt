package app.tab.aid.data

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/**
 * Key/value storage encrypted with an AES-256-GCM key that never leaves the
 * Android Keystore. Tokens and private API snapshots must not sit in plain
 * SharedPreferences, and allowBackup is off so they never leave the device.
 */
class SecureStore(context: Context) {
    private val preferences =
        context.applicationContext.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE)

    fun read(key: String): String? {
        val stored = preferences.getString(key, null) ?: return null
        val separator = stored.indexOf(SEPARATOR)
        if (separator <= 0) {
            preferences.edit().remove(key).apply()
            return null
        }
        return try {
            val iv = Base64.decode(stored.substring(0, separator), Base64.NO_WRAP)
            val body = Base64.decode(stored.substring(separator + 1), Base64.NO_WRAP)
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.DECRYPT_MODE, secretKey(), GCMParameterSpec(TAG_BITS, iv))
            String(cipher.doFinal(body), Charsets.UTF_8)
        } catch (error: Exception) {
            // A key that was invalidated (or a corrupt value) must not wedge the app.
            preferences.edit().remove(key).apply()
            null
        }
    }

    fun write(key: String, value: String) {
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, secretKey())
        val body = cipher.doFinal(value.toByteArray(Charsets.UTF_8))
        val encoded = Base64.encodeToString(cipher.iv, Base64.NO_WRAP) +
            SEPARATOR +
            Base64.encodeToString(body, Base64.NO_WRAP)
        preferences.edit().putString(key, encoded).apply()
    }

    fun delete(key: String) {
        preferences.edit().remove(key).apply()
    }

    fun keysWithPrefix(prefix: String): List<String> =
        preferences.all.keys.filter { it.startsWith(prefix) }

    private fun secretKey(): SecretKey {
        val keyStore = KeyStore.getInstance(PROVIDER).apply { load(null) }
        val existing = keyStore.getEntry(KEY_ALIAS, null) as? KeyStore.SecretKeyEntry
        if (existing != null) return existing.secretKey

        val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, PROVIDER)
        generator.init(
            KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT,
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build(),
        )
        return generator.generateKey()
    }

    private companion object {
        const val PREFERENCES = "aceid.secure"
        const val PROVIDER = "AndroidKeyStore"
        const val KEY_ALIAS = "aceid.session.v1"
        const val TRANSFORMATION = "AES/GCM/NoPadding"
        const val TAG_BITS = 128
        const val SEPARATOR = ":"
    }
}
