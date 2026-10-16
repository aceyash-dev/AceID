"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const proxy = require("../api/[...path].js");

function fakeRes() {
  const headers = {};
  return {
    statusCode: 0,
    headers,
    setHeader(name, value) { headers[name.toLowerCase()] = value; },
    end(body) { this.body = body; },
  };
}

test("account API proxy refuses backend paths outside the frontend allowlist", () => {
  const previous = process.env.ACEID_API_BASE_URL;
  process.env.ACEID_API_BASE_URL = "https://api.example.com";
  try {
    for (const url of ["/api/admin/users", "/api/accountant", "/api/oidc/token"]) {
      const res = fakeRes();
      proxy({ method: "GET", url, headers: { host: "identity.ace-base.cc" } }, res);
      assert.equal(res.statusCode, 404, url);
      assert.equal(JSON.parse(res.body).error, "not_found", url);
    }
  } finally {
    if (previous === undefined) delete process.env.ACEID_API_BASE_URL;
    else process.env.ACEID_API_BASE_URL = previous;
  }
});

function frontendApiPaths() {
  const dir = path.join(__dirname, "..", "public", "js");
  const files = [];
  (function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".js")) files.push(full);
    }
  })(dir);

  const called = new Set();
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/(?:fetch|getJson)\(\s*"(\/api\/[^"]*)"/g)) {
      called.add(match[1].split("?")[0]);
    }
  }
  return called;
}

// Guards against the frontend and the proxy allowlist drifting apart: a call
// the allowlist refuses would reach the browser as a 404 instead of an answer.
test("every API path the frontend calls is allowed by the proxy", () => {
  const called = frontendApiPaths();
  assert.ok(called.size >= 15, "expected the frontend API surface to be inventoried");
  const refused = [...called].filter((pathname) => !proxy.isAllowedApiPath(pathname));
  assert.deepEqual(refused, [], "frontend API calls must pass the proxy allowlist");
});
