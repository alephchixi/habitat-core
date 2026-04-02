import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function normalizePolicy(value: string): string {
  return value.replace(/\s{2,}/g, " ").trim();
}

function toOrigin(raw: string): string | null {
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

function getAnalyticsOrigins(): string[] {
  const origins = new Set<string>();

  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC?.trim();
  if (plausibleSrc) {
    const srcOrigin = toOrigin(plausibleSrc);
    if (srcOrigin) origins.add(srcOrigin);
  }

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  if (plausibleDomain) {
    const candidate = plausibleDomain.includes("://") ? plausibleDomain : `https://${plausibleDomain}`;
    const domainOrigin = toOrigin(candidate);
    if (domainOrigin) origins.add(domainOrigin);
  }

  return [...origins];
}

function shouldEnforceTransportSecurity(): boolean {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) return false;

  try {
    const parsed = new URL(appUrl);
    return parsed.protocol === "https:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1";
  } catch {
    return false;
  }
}

function buildCspHeader(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const analyticsOrigins = getAnalyticsOrigins();
  const scriptSrc = ["'self'", `'nonce-${nonce}'`, ...analyticsOrigins];
  const connectSrc = ["'self'", ...analyticsOrigins];
  const directives = [
    `default-src 'self'`,
    `script-src ${scriptSrc.join(" ")}${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https:`,
    `font-src 'self' data:`,
    `connect-src ${connectSrc.join(" ")}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ];

  if (!isDev && shouldEnforceTransportSecurity()) {
    directives.push("upgrade-insecure-requests");
  }

  return normalizePolicy(directives.join("; "));
}

function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function applySecurityHeaders(response: NextResponse, csp: string, nonce: string): NextResponse {
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);
  return response;
}

function createSecuredRequestHeaders(req: NextRequest, csp: string, nonce: string): Headers {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("content-security-policy", csp);
  requestHeaders.set("x-nonce", nonce);
  return requestHeaders;
}

function runIntlMiddleware(req: NextRequest, requestHeaders: Headers): NextResponse {
  const requestWithNonce = new NextRequest(req.url, {
    method: req.method,
    headers: requestHeaders,
  });

  return intlMiddleware(requestWithNonce);
}

export function middleware(req: NextRequest) {
  const nonce = createNonce();
  const csp = buildCspHeader(nonce);
  const requestHeaders = createSecuredRequestHeaders(req, csp, nonce);

  return applySecurityHeaders(runIntlMiddleware(req, requestHeaders), csp, nonce);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
