"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const proxy = require("../api/oidc/[...path].js");

test("browser auth pages and form posts are routed through the backend", () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  const routes = new Map(config.rewrites.map((item) => [item.source, item.destination]));

  for (const [source, destination] of [
    ["/login", "/api/oidc/login"],
    ["/login/:path*", "/api/oidc/login/:path*"],
    ["/register", "/api/oidc/register"],
    ["/forgot-password", "/api/oidc/forgot-password"],
    ["/reset-password", "/api/oidc/reset-password"],
    ["/mfa", "/api/oidc/login/mfa"],
    ["/privacy", "/api/oidc/privacy"],
  ]) {
    assert.equal(routes.get(source), destination, source);
  }
});

test("no server-rendered template is served as a raw static file", () => {
  for (const file of ["login.html", "mfa.html", "forgot-password.html", "reset-password.html", "consent.html", "register.html"]) {
    assert.equal(fs.existsSync(path.join(root, "public", file)), false, file);
  }
});

test("OIDC proxy forwards browser auth endpoints and rejects everything else", () => {
  for (const endpoint of [
    "/api/oidc/login",
    "/api/oidc/login/mfa",
    "/api/oidc/login/passkey/options",
    "/api/oidc/login/passkey/verify",
    "/api/oidc/register",
    "/api/oidc/forgot-password",
    "/api/oidc/reset-password",
  ]) {
    assert.ok(proxy.mapOIDCPath(endpoint).pathAndQuery, endpoint);
  }

  for (const blocked of ["/api/oidc/admin", "/api/oidc/account", "/api/oidc/../secret"]) {
    assert.equal(proxy.mapOIDCPath(blocked).error, "not_found", blocked);
  }
});
