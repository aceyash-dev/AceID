# AceID

**AceID is an open-source identity project by The Ace Base.** It provides an OpenID Connect identity experience with web and Android clients.

This repository contains the public web client assets and the Flutter Android account app.

- **Product and technical documentation:** [docs.ace-base.cc](https://docs.ace-base.cc)
- **License:** MIT

The identity provider and backend are maintained separately. For setup, architecture, API details, and operational guidance, use the documentation rather than expanding this overview into a second manual.

## Frontend API deployment

The web account UI calls `/api/*` on the same origin. The Vercel function in `api/[...path].js` forwards those requests to the private Express service without exposing backend credentials. Configure `ACEID_API_BASE_URL` as a **Vercel project environment variable** using the deployed backend's HTTPS origin only, for example `https://your-verified-backend-host` (no path, query, username, or password). Do not set it to `https://identity.ace-base.cc` while that domain still points to this static frontend; doing so creates a proxy loop. Until the variable is configured, the bridge returns an explicit `503` instead of pretending that account data is available.

For Android release/testing builds, add the same `ACEID_API_BASE_URL` value as a GitHub Actions repository **variable** in `aceyash-dev/AceID`. The optional build define defaults to the OIDC issuer, so it should be set when the API and issuer have different origins.

The issuer domain must be served by the OIDC/Express backend for `/.well-known/openid-configuration`, authorization, and token exchange to work. Vercel does not rewrite reserved `/.well-known` paths to a backend. Keep the issuer on the backend service or configure the domain so the backend itself owns that origin.
