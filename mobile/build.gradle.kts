// Root build file for the native Ace ID Android client.
// There is no Flutter runtime, Dart source, or Flutter plugin in this project.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
