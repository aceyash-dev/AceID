"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
const rewrites = new Map(config.rewrites.map((item) => [item.source, item.destination]));

const ASSET = /\.(css|js|png|ico|woff2|svg|xml|txt|json)$/i;

function htmlFiles() {
  const dir = path.join(root, "public");
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join(dir, name));
}

function staticExists(href) {
  const rel = href.replace(/^\//, "");
  if (!rel) return fs.existsSync(path.join(root, "public", "index.html"));
  return (
    fs.existsSync(path.join(root, "public", rel)) ||
    fs.existsSync(path.join(root, "public", rel + ".html"))
  );
}

// A page link that is neither rewritten nor a static file is answered by the
// platform's 404 page, which is what produced the "Page Not Found" report for
// /account/subscription.
test("every internal page link resolves to a rewrite or a static file", () => {
  const missing = [];
  for (const file of htmlFiles()) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = match[1];
      if (href.startsWith("/.well-known/") || ASSET.test(href)) continue;
      if (rewrites.has(href) || staticExists(href)) continue;
      missing.push(path.basename(file) + " -> " + href);
    }
  }
  assert.deepEqual(missing, [], "page links must resolve to a rewrite or a static file");
});

test("the account header's subscription link is routed to the subscription page", () => {
  assert.equal(rewrites.get("/account/subscription"), "/subscription.html");
});
