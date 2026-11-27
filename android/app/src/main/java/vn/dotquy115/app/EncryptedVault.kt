package vn.dotquy115.app

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.io.File
import java.io.FileOutputStream
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/**
 * Hardware-backed AndroidKeyStore AES-256-GCM Encrypted Vault (Rule H6).
 * Stores family profile & stroke test history strictly inside noBackupFilesDir
 * (never synced to Google Drive Auto Backup or cloud servers).
 */
object EncryptedVault {
    private const val KEYSTORE_PROVIDER = "AndroidKeyStore"
    private const val KEY_ALIAS = "dotquy115_vault_aes256_key"
    private const val TRANSFORMATION = "AES/GCM/NoPadding"
    private const val GCM_TAG_BITS = 128
    private const val VAULT_FILENAME = "secure_vault.enc"

    private fun vaultFile(context: Context): File =
        File(context.noBackupFilesDir, VAULT_FILENAME)

    @Synchronized
    private fun getOrCreateSecretKey(): SecretKey {
        val keyStore = KeyStore.getInstance(KEYSTORE_PROVIDER).apply { load(null) }
        val existing = keyStore.getEntry(KEY_ALIAS, null) as? KeyStore.SecretKeyEntry
        if (existing != null) {
            return existing.secretKey
        }
        val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, KEYSTORE_PROVIDER)
        val spec = KeyGenParameterSpec.Builder(
            KEY_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
        )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setKeySize(256)
            .build()
        keyGenerator.init(spec)
        return keyGenerator.generateKey()
    }

    @Synchronized
    fun write(context: Context, plaintextJson: String) {
        val file = vaultFile(context)
        if (plaintextJson.isEmpty()) {
            if (file.exists()) file.delete()
            return
        }
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, getOrCreateSecretKey())
        val iv = cipher.iv
        val encrypted = cipher.doFinal(plaintextJson.toByteArray(Charsets.UTF_8))

        val tmpFile = File(context.noBackupFilesDir, "$VAULT_FILENAME.tmp")
        FileOutputStream(tmpFile).use { fos ->
            fos.write(iv.size)
            fos.write(iv)
            fos.write(encrypted)
            fos.fd.sync()
        }
        tmpFile.renameTo(file)
    }

    @Synchronized
    fun read(context: Context): String? {
        val file = vaultFile(context)
        if (!file.isFile) return null
        return try {
            val bytes = file.readBytes()
            if (bytes.size < 14) return null
            val ivLen = bytes[0].toInt() and 0xFF
            if (ivLen !in 12..16 || bytes.size <= 1 + ivLen) return null
            val iv = bytes.copyOfRange(1, 1 + ivLen)
            val cipherBytes = bytes.copyOfRange(1 + ivLen, bytes.size)

            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.DECRYPT_MODE, getOrCreateSecretKey(), GCMParameterSpec(GCM_TAG_BITS, iv))
            String(cipher.doFinal(cipherBytes), Charsets.UTF_8)
        } catch (_: Exception) {
            null
        }
    }
}
