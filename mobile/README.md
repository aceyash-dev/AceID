# Ace ID for Android

The native Kotlin Android client for **Ace ID by The Ace Base**. It supports native OIDC sign-in, profile management, ID security, sessions/devices, and connected applications.

This module is a standard Gradle Android project: Kotlin, Jetpack Compose, and AppAuth. There is no Flutter runtime, Dart source, or Flutter plugin.

## Design system

- Strict monochrome palette with sharp, square-edged surfaces and hairline borders. No accent colour.
- Serif display typography paired with a humanist sans for UI copy.
- A floating bottom navigation bar with short cross-fade transitions between tabs.

The licensed display and UI font binaries are not vendored in this repository. The theme currently maps display copy to the platform serif and UI copy to the platform sans; drop the licensed files into `app/src/main/res/font` and point `DisplayFamily` / `UiFamily` in `ui/theme/AceTheme.kt` at them to match the web client exactly.

## Data and caching

The app talks to the Ace ID identity backend over authenticated HTTPS APIs. It does **not** connect to PostgreSQL and never ships a database credential or client secret: it is a public OIDC client.

GET responses are checked against the server on each online refresh. A local snapshot is rewritten only when the normalized JSON differs from the previous one, and it expires seven days after its last verification. If the network temporarily fails, a cached response can be shown; authentication failures are never hidden behind stale private data. Successful mutations clear the cache, and signing out or clearing the session removes it.

Tokens, the ID profile, and cached snapshots live in `SharedPreferences` encrypted with an AES-256-GCM key held in the Android Keystore (`data/SecureStore.kt`). Backups are disabled so that data does not leave the device.

## Build locally

Requirements: JDK 17, Android SDK 35, Gradle 8.9, and a registered **public** OIDC client ID.

```sh
cd mobile
gradle wrapper            # once, if you want a ./gradlew for this checkout
./gradlew :app:testDebugUnitTest
./gradlew :app:assembleDebug \
  -PaceidMobileClientId=YOUR_REGISTERED_PUBLIC_CLIENT_ID \
  -PaceidMobileRedirectUri=app.tab.aid:/oauth2redirect
```

Configuration is read at build time, in this order: a `-P` Gradle property, an environment variable, then the default in `gradle.properties`.

| Property | Environment variable | Default |
| --- | --- | --- |
| `aceidIssuer` | `ACEID_ISSUER` | `https://identity.ace-base.cc` |
| `aceidApiBaseUrl` | `ACEID_API_BASE_URL` | the issuer |
| `aceidMobileClientId` | `ACEID_MOBILE_CLIENT_ID` | empty |
| `aceidMobileRedirectUri` | `ACEID_MOBILE_REDIRECT_URI` | `app.tab.aid:/oauth2redirect` |

The registered redirect URI must exactly match `app.tab.aid:/oauth2redirect`. An empty client ID does not fall back to a web login; sign-in reports a configuration error instead.

CI (`.github/workflows/android.yml`) validates the client ID and redirect URI, asserts that no Flutter or Dart sources are present, runs the unit tests, and uploads a debug APK artifact. Artifacts are temporary test builds, not signed Play Store packages.

## Sign-in and ID controls

Sign-in runs the OIDC authorization-code flow with PKCE in a Custom Tab. The redirect returns through AppAuth's receiver activity, and the code exchange happens in `auth/AuthRepository.kt`. Refresh tokens are used before expiry; a failed refresh clears the session rather than leaving a half-valid one.

Password, passkey, MFA, device-management, and ID-deletion controls that are not implemented natively open the authenticated website. The Privacy and Terms links open the hosted legal pages.

The light/dark preference is persisted in the encrypted store. If that write fails, the in-memory toggle still works for the session.

## Layout

| Path | Responsibility |
| --- | --- |
| `app/src/main/kotlin/app/tab/aid/MainActivity.kt` | Launch, authorization request, redirect handling |
| `.../auth/` | OIDC configuration, PKCE flow, token refresh, sign-out |
| `.../data/` | API client, response cache, secure storage, session state |
| `.../ui/` | Compose screens, theme, components, view models |
| `app/src/test/kotlin/` | JVM unit tests for token parsing, origin validation, caching, and copy |

Product and technical documentation: https://docs.ace-base.cc
