"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// The Deplexo edge routes by its own hostname and rejects a foreign Host header
// with a 403, so the upstream Host must be sent while the public host travels in
// X-Forwarded-Host.
test("proxy sends the upstream host and forwards the public host", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "api", "oidc", "[...path].js"), "utf8");
  assert.match(source, /headers\.host = upstream\.host;/);
  assert.match(source, /headers\["x-forwarded-host"\] = publicHost;/);
  assert.doesNotMatch(source, /headers\.host = publicHost;/);
});
