import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

/**
 * Resolve a build-time value from, in order: a -P property, an environment
 * variable, then the default. The Android client is a PUBLIC OIDC client, so
 * only an issuer, an API origin, a client ID, and a redirect URI belong here.
 * Never add a client secret, database credential, or backend secret.
 */
fun configured(propertyName: String, envName: String, fallback: String): String {
    val fromProperty = (project.findProperty(propertyName) as String?)?.trim()
    if (!fromProperty.isNullOrEmpty()) return fromProperty
    val fromEnv = System.getenv(envName)?.trim()
    if (!fromEnv.isNullOrEmpty()) return fromEnv
    return fallback
}

val aceIdIssuer = configured("aceidIssuer", "ACEID_ISSUER", "https://identity.ace-base.cc")
val aceIdApiBaseUrl = configured("aceidApiBaseUrl", "ACEID_API_BASE_URL", aceIdIssuer)
val aceIdClientId = configured("aceidMobileClientId", "ACEID_MOBILE_CLIENT_ID", "")
val aceIdRedirectUri = configured("aceidMobileRedirectUri", "ACEID_MOBILE_REDIRECT_URI", "app.tab.aid:/oauth2redirect")

android {
    namespace = "app.tab.aid"
    compileSdk = 35

    defaultConfig {
        applicationId = "app.tab.aid"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        // AppAuth needs the redirect scheme as a manifest placeholder so its
        // RedirectUriReceiverActivity can be filtered on it.
        manifestPlaceholders["appAuthRedirectScheme"] = "app.tab.aid"

        buildConfigField("String", "ACEID_ISSUER", "\"$aceIdIssuer\"")
        buildConfigField("String", "ACEID_API_BASE_URL", "\"$aceIdApiBaseUrl\"")
        buildConfigField("String", "ACEID_MOBILE_CLIENT_ID", "\"$aceIdClientId\"")
        buildConfigField("String", "ACEID_MOBILE_REDIRECT_URI", "\"$aceIdRedirectUri\"")
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildTypes {
        debug {
            isMinifyEnabled = false
        }
        release {
            // Release signing is configured by the release pipeline, not in the
            // repository. Keep the artifact unsigned rather than shipping a debug key.
            isMinifyEnabled = false
            isShrinkResources = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }

    packaging {
        resources.excludes += setOf("/META-INF/{AL2.0,LGPL2.1}", "/META-INF/LICENSE*")
    }

    testOptions {
        unitTests.isReturnDefaultValues = true
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(libs.kotlinx.coroutines.android)

    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    debugImplementation(libs.androidx.compose.ui.tooling)

    // OIDC authorization-code flow with PKCE and Custom Tabs.
    implementation(libs.appauth)

    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
    // Real org.json for JVM unit tests; the Android stub returns defaults.
    testImplementation(libs.json)
}
