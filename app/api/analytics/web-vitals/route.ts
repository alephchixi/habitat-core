import { NextResponse } from "next/server";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getClientIp, validateSameOriginRequest } from "@/lib/request-security";
import { anonymizeNullable, appendRuntimeNdjson, hashSensitiveValue } from "@/lib/runtime-log";

export const runtime = "nodejs";

type WebVitalsPayload = {
  id?: unknown;
  name?: unknown;
  value?: unknown;
  delta?: unknown;
  rating?: unknown;
  navigationType?: unknown;
  pathname?: unknown;
  href?: unknown;
};

const MAX_BODY_SIZE = 4_096;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 180;

const VALID_METRIC_NAMES = new Set(["CLS", "FCP", "FID", "INP", "LCP", "TTFB"]);
const VALID_RATINGS = new Set(["good", "needs-improvement", "poor"]);
const VALID_NAV_TYPES = new Set([
  "navigate",
  "reload",
  "prerender",
  "back-forward",
  "back-forward-cache",
  "restore",
]);

function normalizeString(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

export async function POST(req: Request) {
  const requestValidation = validateSameOriginRequest(req, { requireOrigin: false });
  if (!requestValidation.ok) {
    return NextResponse.json({ error: requestValidation.error }, { status: requestValidation.status });
  }

  const ip = getClientIp(req);
  const rateLimit = await consumeRateLimit({
    bucket: "web-vitals",
    key: ip,
    limit: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "retry-after": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      }
    );
  }

  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Unable to read request body" }, { status: 400 });
  }

  if (rawBody.length === 0) {
    return NextResponse.json({ error: "Request body is required" }, { status: 400 });
  }

  if (rawBody.length > MAX_BODY_SIZE) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let payload: WebVitalsPayload;
  try {
    payload = JSON.parse(rawBody) as WebVitalsPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = normalizeString(payload.id, 100);
  const name = normalizeString(payload.name, 16).toUpperCase();
  const rating = normalizeString(payload.rating, 32);
  const navigationType = normalizeString(payload.navigationType, 32);
  const pathname = normalizeString(payload.pathname, 240);
  const href = normalizeString(payload.href, 1_000);
  const value = toNumber(payload.value);
  const delta = toNumber(payload.delta);

  if (!VALID_METRIC_NAMES.has(name)) {
    return NextResponse.json({ error: "Unsupported metric name" }, { status: 400 });
  }

  if (!Number.isFinite(value) || value < 0) {
    return NextResponse.json({ error: "Invalid metric value" }, { status: 400 });
  }

  if (!Number.isFinite(delta)) {
    return NextResponse.json({ error: "Invalid metric delta" }, { status: 400 });
  }

  if (rating && !VALID_RATINGS.has(rating)) {
    return NextResponse.json({ error: "Invalid metric rating" }, { status: 400 });
  }

  if (navigationType && !VALID_NAV_TYPES.has(navigationType)) {
    return NextResponse.json({ error: "Invalid navigation type" }, { status: 400 });
  }

  appendRuntimeNdjson("web-vitals.ndjson", {
    created_at: new Date().toISOString(),
    id,
    name,
    value,
    delta,
    rating,
    navigation_type: navigationType,
    pathname,
    href_hash: href ? hashSensitiveValue(href) : "none",
    ip_hash: anonymizeNullable(ip),
    user_agent_hash: anonymizeNullable(req.headers.get("user-agent")),
  });

  return NextResponse.json({ success: true });
}
