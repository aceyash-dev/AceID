# Font assets

The Android build fetches the font binaries at build time. Font binaries are not committed to this public repository.

- **Instrument Serif**: Google Fonts, SIL Open Font License. Source: https://fonts.google.com/specimen/Instrument+Serif
- **Satoshi**: Indian Type Foundry / Fontshare, ITF Free Font License. Source: https://www.fontshare.com/fonts/satoshi

Run `bash tool/fetch_fonts.sh` from `mobile/` before building locally. The Android GitHub Actions workflow performs this step automatically. Keep the Fontshare binary sourced from the official endpoint; do not mirror the font files in this repository.
