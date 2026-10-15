"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const proxy = require("../api/[...path].js");

test("backend origin must be a clean HTTPS origin", () => {
  assert.deepEqual(proxy.parseUpstreamOrigin("https://api.example.com"), {
    origin: "https://api.example.com",
  });
  assert.deepEqual(proxy.parseUpstreamOrigin("https://api.example.com/"), {
    origin: "https://api.example.com",
  });
  for (const value of [
    undefined,
    "",
    "http://api.example.com",
    "https://user:pass@api.example.com",
    "https://api.example.com/api",
    "https://api.example.com?target=evil.test",
    "not a URL",
  ]) {
    const parsed = proxy.parseUpstreamOrigin(value);
    assert.ok(parsed.error, `expected ${String(value)} to be rejected`);
  }
});

test("missing API origin returns an explicit non-cacheable 503 response", async () => {
  const previous = process.env.ACEID_API_BASE_URL;
  delete process.env.ACEID_API_BASE_URL;
  const headers = {};
  const res = {
    statusCode: 0,
    setHeader(name, value) { headers[name.toLowerCase()] = value; },
    end(body) { this.body = body; this.finished = true; },
  };

  try {
    proxy({ method: "GET", url: "/api/account", headers: { host: "identity.ace-base.cc" } }, res);
    assert.equal(res.statusCode, 503);
    assert.equal(headers["cache-control"], "no-store");
    assert.equal(JSON.parse(res.body).error, "api_upstream_not_configured");
  } finally {
    if (previous === undefined) delete process.env.ACEID_API_BASE_URL;
    else process.env.ACEID_API_BASE_URL = previous;
  }
});

test("proxy rejects non-API paths even when a backend origin is configured", () => {
  const previous = process.env.ACEID_API_BASE_URL;
  process.env.ACEID_API_BASE_URL = "https://api.example.com";
  const headers = {};
  const res = {
    statusCode: 0,
    setHeader(name, value) { headers[name.toLowerCase()] = value; },
    end(body) { this.body = body; this.finished = true; },
  };

  try {
    proxy({ method: "GET", url: "/.well-known/openid-configuration", headers: { host: "identity.ace-base.cc" } }, res);
    assert.equal(res.statusCode, 404);
    assert.equal(JSON.parse(res.body).error, "not_found");
  } finally {
    if (previous === undefined) delete process.env.ACEID_API_BASE_URL;
    else process.env.ACEID_API_BASE_URL = previous;
  }
});
