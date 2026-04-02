import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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

function buildCspHeader(): string {
  const isDev = process.env.NODE_ENV === "development";
  const analyticsOrigins = getAnalyticsOrigins();
  const enforceTransportSecurity = shouldEnforceTransportSecurity();
  const scriptSrc = ["'self'", ...analyticsOrigins];
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

  if (!isDev && enforceTransportSecurity) {
    directives.push("upgrade-insecure-requests");
  }

  return normalizePolicy(directives.join("; "));
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Content-Security-Policy",
        value: buildCspHeader(),
      },
    ];

    if (shouldEnforceTransportSecurity()) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      });
    }

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

initOpenNextCloudflareForDev();
