# Ace ID for Android

This is the native Flutter account app for Ace ID, not a developer console.

## Account features

- Sign in through Ace ID OpenID Connect.
- Store tokens using Android secure storage.
- View and edit account profile details.
- Review security activity and signed-in device information.
- Review connected apps and revoke app authorization.
- View current membership, billing-period information and plan limits in an in-app bottom sheet.
- Start paid checkout through the existing Ace ID backend. Subscription status is never granted from a client-side payment result.
- Open existing password, passkey, two-factor, device-session, and account-deletion controls on the authenticated Ace ID website.

## Native sign-in configuration

Register a public native OIDC client with the Ace ID issuer and redirect URI:

`app.tab.aid:/oauth2redirect`

Set the repository variable `ACEID_MOBILE_CLIENT_ID` in GitHub Actions to that public client ID. The APK workflow passes it to Flutter using a Dart define. A public native client ID is not a secret; do not embed a client secret in the installed app.

If this variable is missing, the app shows the specific configuration error and offers existing web login as a fallback.

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

Current CI APKs are installable test artifacts signed with the configured debug signing setup. Configure a private upload keystore and protected GitHub secrets before publishing on Google Play.

## APK workflow

The workflow runs only for changes under `mobile/**` or the workflow itself on `master`, plus manual dispatch. Web-only changes do not trigger Android packaging. It builds a universal APK and ABI-specific APKs and uploads them as the `ace-id-android-apks` artifact for 14 days.
