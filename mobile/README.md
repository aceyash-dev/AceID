# Ace ID for Android

The Flutter Android account client for **Ace ID by The Ace Base**. It supports native OIDC sign-in, profile management, account security, sessions/devices, connected applications, and subscription views.

## Design system

- Strict monochrome palette with sharp, square-edged surfaces and borders. No orange accent colors.
- Instrument Serif display typography paired with Satoshi UI typography.
- Hugeicons stroke icons and a floating bottom navigation bar with short cross-fade transitions.

## Data and caching

The app communicates with the Ace ID identity backend over authenticated HTTPS APIs. It does **not** connect directly to PostgreSQL or ship database credentials. Profile edits and grant revocations are written through the backend, which remains authoritative for persisted state.

GET responses are checked against the server on each online refresh. A local encrypted snapshot is rewritten only when the normalized JSON differs from the previous snapshot. If the network temporarily fails, a cached response can be shown; authentication failures are never hidden by stale private data. Successful mutations invalidate the response cache, and signing out or clearing the local session removes cached account data.

## Build locally

Requirements: Flutter stable (3.29 or later), Dart 3.6+, Android SDK, and a registered public OIDC client ID.

```sh
cd mobile
bash tool/fetch_fonts.sh
flutter pub get
flutter analyze
flutter test
flutter build apk --release \
  --dart-define=ACEID_MOBILE_CLIENT_ID=YOUR_REGISTERED_PUBLIC_CLIENT_ID \
  --dart-define=ACEID_MOBILE_REDIRECT_URI=app.tab.aid:/oauth2redirect
```

Use a registered **public** OIDC client ID. Never embed a client secret, database credential, or backend secret in the APK. The registered redirect URI must exactly match `app.tab.aid:/oauth2redirect`.

The Android CI workflow validates the client ID and redirect URI, runs analysis and widget tests, then uploads one `armeabi-v7a` testing APK artifact for 14 days. It does not currently build an `arm64-v8a` APK. CI artifacts are temporary test builds, not signed Play Store release packages.

## Sign-in and account controls

The sign-in screen has no “Continue on the web” button. Native sign-in requires a configured public OIDC client ID; an empty client ID does not trigger a web-login fallback. Password, passkey, MFA, device/session, and account-deletion controls that are not implemented natively may still open the authenticated website. The Privacy and Terms links open the hosted legal pages.

The light/dark theme preference is persisted in secure storage. If preference storage fails, the current session can still use the selected in-memory theme.

## Fonts

Font binaries are fetched from their official sources before local builds and by CI. See [assets/fonts/README.md](assets/fonts/README.md) for sources and licensing notes.

Product and technical documentation: https://docs.ace-base.cc
