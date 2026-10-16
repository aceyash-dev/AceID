"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const read = (...parts) => fs.readFileSync(path.join(__dirname, "..", ...parts), "utf8");

test("account subscription link resolves to the subscription page", () => {
  const config = JSON.parse(read("vercel.json"));
  const rewrite = config.rewrites.find((r) => r.source === "/account/subscription");
  assert.ok(rewrite, "missing /account/subscription rewrite");
  assert.equal(rewrite.destination, "/subscription.html");
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
