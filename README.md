# AceID

**AceID is open source.** This repository contains the AceID client applications and frontend assets.

Official repository: [aceyash-dev/AceID](https://github.com/aceyash-dev/AceID)

- `public/`: web frontend assets.
- `mobile/`: Flutter Android account app. Application ID: `app.tab.aid`.
- The Node.js identity provider and backend APIs live in [aceyash-dev/ace-id](https://github.com/aceyash-dev/ace-id).
- Product and technical documentation live in [aceyash-dev/ace-docs](https://github.com/aceyash-dev/ace-docs).

## Android builds

The [Android workflow](https://github.com/aceyash-dev/AceID/blob/main/.github/workflows/android.yml) runs on changes under `mobile/**` or changes to the workflow itself on `main`, plus manual dispatch. CI builds split release APKs for `armeabi-v7a` and `arm64-v8a` only; it does not build x86_64 or a universal APK. Configure the public OIDC client ID as the GitHub Actions repository variable `ACEID_MOBILE_CLIENT_ID`. Never put a client secret in the app.

CI APKs are temporary test artifacts, retained for 14 days, not versioned GitHub Releases. Production store releases require protected release signing.

## License

MIT. See [`LICENSE`](https://github.com/aceyash-dev/AceID/blob/main/LICENSE).
