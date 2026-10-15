# Ace ID for Android

The Flutter Android account client for **Ace ID by The Ace Base**. It supports OIDC sign-in, profile management, account security, sessions/devices, connected applications, and subscription views.

## Design system

- Strict monochrome palette with sharp, square-edged surfaces and borders. No orange accent colors.
- Instrument Serif display typography paired with Satoshi UI typography.
- Hugeicons stroke icons and a floating bottom navigation bar with short cross-fade transitions.

## Data and caching

The app communicates with the Ace ID identity backend over authenticated HTTPS APIs. It does **not** connect directly to PostgreSQL or ship database credentials. Profile edits and grant revocations are written through the backend, which remains authoritative for persisted state.

GET responses are checked against the server on each online refresh. A local encrypted snapshot is rewritten only when the normalized JSON differs from the previous snapshot. If the network temporarily fails, a cached response can be shown; authentication failures are never hidden by stale private data. Successful mutations invalidate the response cache, and signing out or clearing the local session removes cached account data.

## Build locally

Requirements: Flutter stable (3.29 or later), Dart 3.6+, Android SDK, and access to the registered public OIDC client configuration.

```sh
cd mobile
bash tool/fetch_fonts.sh
flutter pub get
flutter analyze
flutter test
flutter build apk --release --dart-define=ACEID_MOBILE_CLIENT_ID=YOUR_REGISTERED_PUBLIC_CLIENT_ID
```

Use a registered **public** OIDC client ID. Never embed a client secret, database credential, or backend secret in the APK. The CI workflow downloads font assets from their official sources, runs analysis and widget tests, then uploads ABI-specific APK artifacts.

Product documentation: https://docs.ace-base.cc
