# AceID

**AceID is an open-source identity project by The Ace Base.** It provides an OpenID Connect identity experience with web and Android clients.

This repository contains the public web client and the native Kotlin Android ID app. The identity provider and account APIs are maintained separately in the private [`aceyash-dev/ace-id`](https://github.com/aceyash-dev/ace-id) repository.

- **Product and technical documentation:** [docs.ace-base.cc](https://docs.ace-base.cc)
- **Android app setup:** [mobile/README.md](mobile/README.md)
- **License:** MIT

## Clients

| Client | Path | Stack |
| --- | --- | --- |
| Web | `public/` | Static HTML, CSS, and ES modules behind the API proxy in `api/` |
| Android | `mobile/` | Kotlin, Jetpack Compose, AppAuth, Gradle |

The Android client is a native Kotlin application. It has no Flutter runtime, Dart source, or Flutter plugin, and it is built with Gradle rather than the Flutter toolchain.

## Vocabulary

User-facing copy calls the signed-in entity an **ID**, not an "account". Routes (`/account/...`), API paths (`/api/account`), DOM identifiers, and CSS classes keep their existing names so the client and the backend stay compatible; only the words a person reads changed.
