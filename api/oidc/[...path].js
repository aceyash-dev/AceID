"use strict";

const https = require("node:https");

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const ALLOWED_EXACT_PATHS = new Set([
  "/auth",
  "/token",
  "/me",
  "/jwks",
  "/reg",
  "/device",
  "/health/live",
  "/health/ready",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/logout",
  "/privacy",
  "/terms",
  "/account/unfreeze",
]);

const ALLOWED_PATH_PREFIXES = [
  "/interaction/",
  "/session/",
  "/token/",
  "/request/",
  "/connect/",
  "/login/",
];

function parseUpstreamOrigin(value) {
  if (!value || !value.trim()) {
    return { error: "api_upstream_not_configured" };
  }

  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !url.hostname ||
      url.username ||
      url.password ||
      (url.pathname !== "/" && url.pathname !== "") ||
      url.search ||
      url.hash
    ) {
      return { error: "api_upstream_invalid" };
    }
    return { origin: url.origin };
  } catch {
    return { error: "api_upstream_invalid" };
  }
}

function mapOIDCPath(requestUrl) {
  let parsed;
  try {
    parsed = new URL(requestUrl || "/", "https://identity.invalid");
  } catch {
    return { error: "not_found" };
  }

  // Vercel can invoke a rewritten catch-all with either the destination
  // (/api/oidc/auth) or the stripped endpoint path (/auth). Normalize both
  // forms; do not reject a valid provider endpoint just because routing has
  // already removed the internal prefix.
  let path;
  if (parsed.pathname === "/api/oidc" || parsed.pathname.startsWith("/api/oidc/")) {
    path = parsed.pathname.slice("/api/oidc".length) || "/";
  } else {
    path = parsed.pathname || "/";
  }
  const allowed =
    ALLOWED_EXACT_PATHS.has(path) ||
    ALLOWED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));

  if (!allowed || path.includes("\\") || path.includes("\0")) {
    return { error: "not_found" };
  }

  return { pathAndQuery: path + parsed.search };
}

function escapeText(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function wantsHtml(req) {
  const accept = String(req?.headers?.accept || "");
  return accept.includes("text/html") && !accept.includes("application/json");
}

// Browsers opening an account page should see a readable message, not raw JSON.
// API and OIDC clients keep receiving the JSON error body.
function sendError(res, statusCode, code, description, req) {
  res.statusCode = statusCode;
  res.setHeader("cache-control", "no-store");
  if (req && wantsHtml(req)) {
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(
      "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">" +
      "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
      "<title>Ace ID is unavailable</title>" +
      "<style>body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;font-family:system-ui,sans-serif;background:#fafaf8;color:#111}" +
      "main{max-width:440px}h1{font-size:22px;margin:0 0 12px}p{line-height:1.5;color:#444;margin:0 0 10px}small{color:#777;font-family:monospace}</style>" +
      "</head><body><main><h1>Ace ID is temporarily unavailable</h1>" +
      "<p>" + escapeText(description) + "</p>" +
      "<p>Please try again in a few minutes.</p>" +
      "<small>" + escapeText(code) + "</small></main></body></html>"
    );
    return;
  }
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ error: code, error_description: description }));
}

function handler(req, res) {
  const mapped = mapOIDCPath(req.url);
  if (mapped.error) {
    return sendError(
      res,
      404,
      "not_found",
      "The requested OIDC endpoint does not exist.",
      req,
    );
  }

  const parsedOrigin = parseUpstreamOrigin(process.env.ACEID_API_BASE_URL);
  if (parsedOrigin.error === "api_upstream_not_configured") {
    return sendError(
      res,
      503,
      parsedOrigin.error,
      "The backend origin is not configured for this deployment.",
      req,
    );
  }
  if (parsedOrigin.error) {
    return sendError(
      res,
      503,
      parsedOrigin.error,
      "ACEID_API_BASE_URL must be a clean HTTPS origin without a path, query, or credentials.",
      req,
    );
  }

  const upstream = new URL(mapped.pathAndQuery, parsedOrigin.origin);
  const headers = {};
  for (const [name, value] of Object.entries(req.headers || {})) {
    if (value === undefined || HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
      continue;
    }
    headers[name.toLowerCase()] = value;
  }

  // Preserve the public issuer host for OIDC redirects and cookie scope.
  // TLS still connects to the configured backend hostname.
  // The edge in front of the backend routes by its own hostname, so Host must be
  // the upstream host. The public issuer host travels in X-Forwarded-Host, which
  // the provider uses (proxy trust) to build URLs.
  const publicHost = String(req.headers?.host || "identity.ace-base.cc");
  headers.host = upstream.host;
  headers["x-forwarded-host"] = publicHost;
  headers["x-forwarded-proto"] = "https";
  headers["cache-control"] = "no-store";

  const upstreamRequest = https.request(
    {
      protocol: "https:",
      hostname: upstream.hostname,
      port: upstream.port || 443,
      method: req.method || "GET",
      path: upstream.pathname + upstream.search,
      headers,
      timeout: 8000,
      servername: upstream.hostname,
    },
    (upstreamResponse) => {
      res.statusCode = upstreamResponse.statusCode || 502;
      for (const [name, value] of Object.entries(upstreamResponse.headers)) {
        if (value === undefined || HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
          continue;
        }
        res.setHeader(name, value);
      }
      res.setHeader("cache-control", "no-store");
      upstreamResponse.pipe(res);
    },
  );

  upstreamRequest.on("timeout", () => {
    upstreamRequest.destroy(new Error("OIDC upstream timed out"));
  });
  upstreamRequest.on("error", () => {
    if (res.headersSent) return res.destroy();
    sendError(
      res,
      502,
      "oidc_upstream_unavailable",
      "The OIDC backend could not be reached.",
      req,
    );
  });

  req.pipe(upstreamRequest);
}

module.exports = handler;
module.exports.handler = handler;
module.exports.mapOIDCPath = mapOIDCPath;
module.exports.parseUpstreamOrigin = parseUpstreamOrigin;
