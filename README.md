# AceID

Open-source client applications for Ace ID.

- `public/`: existing web frontend assets, moved without UI/source edits.
- `mobile/`: Flutter Android app. Application ID: `app.tab.aid`.
- Backend and OIDC provider remain in [aceyash-dev/ace-id](https://github.com/aceyash-dev/ace-id).
- Product documentation remains in [aceyash-dev/ace-docs](https://github.com/aceyash-dev/ace-docs).

## Android builds

The Android workflow builds only split release APKs for `armeabi-v7a` and `arm64-v8a`; it does not build x86_64 or a universal APK. Configure the public OIDC client ID as the repository Actions variable `ACEID_MOBILE_CLIENT_ID`. Never place a client secret in the app.

## License

MIT. See `LICENSE`.
