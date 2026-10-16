"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
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
