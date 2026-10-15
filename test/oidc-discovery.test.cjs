"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const proxy = require("../api/oidc/[...path].js");

const root = path.join(__dirname, "..");
const metadataPath = path.join(root, "public/.well-known/openid-configuration");

test("static discovery document identifies the issuer and required OIDC endpoints", () => {
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  const issuer = "https://identity.ace-base.cc";

  assert.equal(metadata.issuer, issuer);
  for (const key of [
    "authorization_endpoint",
    "token_endpoint",
    "userinfo_endpoint",
    "jwks_uri",
    "end_session_endpoint",
  ]) {
    assert.equal(new URL(metadata[key]).origin, issuer, key);
  }
  assert.ok(metadata.response_types_supported.includes("code"));
  assert.ok(metadata.code_challenge_methods_supported.includes("S256"));
  assert.ok(metadata.scopes_supported.includes("openid"));
});

test("Vercel sends OIDC endpoints through the backend proxy", () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  const routes = new Map(config.rewrites.map((item) => [item.source, item.destination]));

  for (const [source, destination] of [
    ["/auth", "/api/oidc/auth"],
    ["/token", "/api/oidc/token"],
    ["/me", "/api/oidc/me"],
    ["/jwks", "/api/oidc/jwks"],
    ["/reg", "/api/oidc/reg"],
    ["/device", "/api/oidc/device"],
    ["/session/:path*", "/api/oidc/session/:path*"],
    ["/interaction/:path*", "/api/oidc/interaction/:path*"],
    ["/token/:path*", "/api/oidc/token/:path*"],
  ]) {
    assert.equal(routes.get(source), destination, source);
  }

  const headers = config.headers.find(
    (item) => item.source === "/.well-known/openid-configuration",
  );
  assert.ok(headers, "discovery response must have an explicit JSON content type");
  assert.ok(headers.headers.some((h) => h.key.toLowerCase() === "content-type" && h.value.includes("application/json")));
});

test("OIDC proxy keeps endpoint paths and query strings intact", () => {
  assert.deepEqual(proxy.mapOIDCPath("/api/oidc/auth?client_id=aid-app"), {
    pathAndQuery: "/auth?client_id=aid-app",
  });
  assert.deepEqual(proxy.mapOIDCPath("/api/oidc/token/revocation"), {
    pathAndQuery: "/token/revocation",
  });
});

test("OIDC proxy rejects non-provider paths and unsafe backend origins", () => {
  assert.equal(proxy.mapOIDCPath("/api/oidc/owner/subscriptions/grant").error, "not_found");
  assert.equal(proxy.mapOIDCPath("/api/account").error, "not_found");
  for (const value of [
    undefined,
    "",
    "http://backend.example.com",
    "https://user:pass@backend.example.com",
    "https://backend.example.com/path",
    "https://backend.example.com?x=y",
  ]) {
    assert.ok(proxy.parseUpstreamOrigin(value).error, String(value));
  }
});

test("missing backend origin returns an explicit non-cacheable 503", () => {
  const previous = process.env.ACEID_API_BASE_URL;
  delete process.env.ACEID_API_BASE_URL;
  const headers = {};
  const res = {
    statusCode: 0,
    setHeader(name, value) {
      headers[name.toLowerCase()] = value;
    },
    end(body) {
      this.body = body;
    },
  };

  try {
    proxy.handler(
      { method: "GET", url: "/api/oidc/auth", headers: { host: "identity.ace-base.cc" } },
      res,
    );
    assert.equal(res.statusCode, 503);
    assert.equal(headers["cache-control"], "no-store");
    assert.equal(JSON.parse(res.body).error, "api_upstream_not_configured");
  } finally {
    if (previous === undefined) delete process.env.ACEID_API_BASE_URL;
    else process.env.ACEID_API_BASE_URL = previous;
  }
});
