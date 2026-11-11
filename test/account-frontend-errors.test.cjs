"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = (...parts) => fs.readFileSync(path.join(__dirname, "..", ...parts), "utf8");

test("subscription and payment surfaces are absent", () => {
  const config = JSON.parse(read("vercel.json"));
  assert.equal(
    config.rewrites.find((r) => r.source === "/account/subscription"),
    undefined,
    "the subscription rewrite must stay removed",
  );
  assert.doesNotMatch(read("public", "account.html"), /\/account\/subscription/);
  assert.doesNotMatch(read("public", "js", "account", "app.js"), /\/api\/subscription/);
  assert.doesNotMatch(read("api", "[...path].js"), /\/api\/subscription/);
});

test("account page never parses responses with a bare response.json()", () => {
  const source = read("public", "js", "account", "app.js");
  assert.doesNotMatch(source, /\.json\(\)/);
  assert.match(source, /async function readJson\(response\)/);
});

test("account page never throws raw API objects into Error messages", () => {
  const source = read("public", "js", "account", "app.js");
  assert.doesNotMatch(source, /new Error\(\w+\.error \|\|/);
  assert.match(source, /function messageOf\(value, fallback\)/);
});

test("onboarding can always be dismissed, even if the save fails", () => {
  const source = read("public", "js", "account", "app.js");
  const start = source.indexOf("async function completeOnboarding");
  assert.ok(start !== -1, "completeOnboarding is missing");
  const body = source.slice(start, source.indexOf("\n    }", start));
  assert.ok(body.includes("closeOnboarding();"), "the tour must close itself");
  assert.ok(
    body.indexOf("closeOnboarding();") < body.indexOf("await fetch("),
    "the tour must close before the completion request is awaited"
  );
  assert.match(body, /AbortController/, "the completion request must be bounded so it cannot hang");
});
