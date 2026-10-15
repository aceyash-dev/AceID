# Ace ID for Android

This is the native Flutter account app for Ace ID, not a developer console. The app source lives in the public [aceyash-dev/AceID repository](https://github.com/aceyash-dev/AceID/tree/main/mobile).

## Account features

- Sign in through Ace ID OpenID Connect using the system browser and Authorization Code + PKCE.
- Store credentials using platform secure storage.
- View and edit account profile details.
- Review recent security activity and signed-in device sessions.
- Review connected apps and revoke an app's authorization.
- View membership, billing-period information and plan limits.
- Start paid checkout through the existing Ace ID backend. Subscription status is never granted from a client-side payment result.
- Open password, passkey, two-factor, device-session, and account-deletion controls on the authenticated Ace ID website.

## Native sign-in configuration

Register a public native OIDC client with the Ace ID issuer and this exact redirect URI:

`app.tab.aid:/oauth2redirect`

Set the GitHub Actions repository variable `ACEID_MOBILE_CLIENT_ID` to that public client ID. The Android workflow passes it to Flutter using a Dart define. A public native client ID is not a secret; do not embed a client secret in the installed app.

If this variable is missing, native sign-in is unavailable and the app offers existing web login as a fallback. Backend account APIs must continue to enforce authorization and ownership server-side.

## Local build

Requires Flutter stable and Android SDK tooling:

```sh
cd mobile
flutter pub get
dart run flutter_launcher_icons
flutter analyze --no-fatal-infos
flutter test
flutter build apk --release --dart-define=ACEID_MOBILE_CLIENT_ID=YOUR_PUBLIC_CLIENT_ID
```

The repository does not currently track `mobile/pubspec.lock`, so dependency resolution is not fully reproducible. Commit the application lockfile and validate a clean CI build before treating artifacts as reproducible release inputs.

CI APKs are test artifacts signed with the default debug signing setup. Configure a private upload keystore and protected GitHub secrets before publishing on Google Play. Never commit signing keys or passwords.

## Android CI workflow

The canonical workflow is [`.github/workflows/android.yml`](https://github.com/aceyash-dev/AceID/blob/main/.github/workflows/android.yml). It runs for pushes and pull requests targeting `main` when `mobile/**` or the workflow file changes, and supports manual dispatch. Web-only changes do not trigger Android packaging.

CI builds **split release APKs only** for `armeabi-v7a` and `arm64-v8a`; it does not produce a universal or x86_64 APK. The workflow uploads them as the `ace-id-android-apks` artifact, retained for 14 days. These temporary workflow artifacts are not versioned GitHub Releases.

## Repository boundaries

- [`aceyash-dev/AceID`](https://github.com/aceyash-dev/AceID): public web frontend assets and Flutter client app.
- [`aceyash-dev/ace-id`](https://github.com/aceyash-dev/ace-id): Node.js identity provider, backend APIs, migrations, and backend CI.
- [`aceyash-dev/ace-docs`](https://github.com/aceyash-dev/ace-docs): product and technical documentation.

## License

The AceID repository is MIT-licensed. See the repository's [LICENSE](https://github.com/aceyash-dev/AceID/blob/main/LICENSE).
