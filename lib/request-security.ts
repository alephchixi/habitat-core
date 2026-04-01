import crypto from "node:crypto";

const SAFE_FETCH_SITES = new Set(["same-origin", "same-site", "none"]);

function timingSafeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function validateSameOriginRequest(
  req: Request,
  options?: { requireOrigin?: boolean }
): { ok: true } | { ok: false; status: number; error: string } {
  const requireOrigin = options?.requireOrigin ?? true;
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");

  if (requireOrigin && !origin) {
    return {
      ok: false,
      status: 403,
      error: "Missing Origin header",
    };
  }

  if (origin) {
    if (!host) {
      return {
        ok: false,
        status: 400,
        error: "Missing host header",
      };
    }

    try {
      const originHost = new URL(origin).host;
      if (!timingSafeEqual(originHost, host)) {
        return {
          ok: false,
          status: 403,
          error: "Invalid request origin",
        };
      }
    } catch {
      return {
        ok: false,
        status: 400,
        error: "Malformed origin header",
      };
    }
  }

  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && !SAFE_FETCH_SITES.has(fetchSite)) {
    return {
      ok: false,
      status: 403,
      error: "Cross-site request blocked",
    };
  }

  return { ok: true };
}

export function getClientIp(req: Request): string {
  const trustProxyHeaders = process.env.TRUST_PROXY_HEADERS === "1";
  if (!trustProxyHeaders) {
    return "direct";
  }

  const prioritizedHeaders = [
    "cf-connecting-ip",
    "x-vercel-forwarded-for",
    "x-real-ip",
    "x-forwarded-for",
  ] as const;

  for (const headerName of prioritizedHeaders) {
    const value = req.headers.get(headerName);
    if (!value) continue;

    const candidate = value.split(",")[0]?.trim();
    if (candidate) return candidate;
  }

  return "unknown";
}

