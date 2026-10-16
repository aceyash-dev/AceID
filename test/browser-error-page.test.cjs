"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { handler } = require("../api/oidc/[...path].js");

function fakeResponse() {
  const headers = {};
  return {
    statusCode: 200,
    body: "",
    setHeader(name, value) { headers[name.toLowerCase()] = value; },
    getHeader(name) { return headers[name.toLowerCase()]; },
    end(chunk) { this.body = chunk || ""; },
  };
}

test("browser navigation with no backend configured gets a readable HTML page", () => {
  const previous = process.env.ACEID_API_BASE_URL;
  delete process.env.ACEID_API_BASE_URL;
  try {
    const res = fakeResponse();
    handler({ url: "/login", method: "GET", headers: { accept: "text/html,application/xhtml+xml" } }, res);
    assert.equal(res.statusCode, 503);
    assert.match(res.getHeader("content-type"), /^text\/html/);
    assert.match(res.body, /temporarily unavailable/);
    assert.doesNotMatch(res.body, /^\{/);
  } finally {
    if (previous === undefined) delete process.env.ACEID_API_BASE_URL;
    else process.env.ACEID_API_BASE_URL = previous;
  }
});

test("API clients still receive the JSON error body", () => {
  const previous = process.env.ACEID_API_BASE_URL;
  delete process.env.ACEID_API_BASE_URL;
  try {
    const res = fakeResponse();
    handler({ url: "/login", method: "GET", headers: { accept: "application/json" } }, res);
    assert.equal(res.statusCode, 503);
    assert.match(res.getHeader("content-type"), /^application\/json/);
    assert.equal(JSON.parse(res.body).error, "api_upstream_not_configured");
  } finally {
    if (previous === undefined) delete process.env.ACEID_API_BASE_URL;
    else process.env.ACEID_API_BASE_URL = previous;
  }
});
