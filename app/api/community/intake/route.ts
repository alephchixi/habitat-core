import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getClientIp, validateSameOriginRequest } from "@/lib/request-security";
import { isLocalNetworkRequestFromHeaders } from "@/lib/network-access";
import { anonymizeNullable, appendRuntimeNdjson, hashSensitiveValue } from "@/lib/runtime-log";

export const runtime = "nodejs";

type IntakeKind = "guest-author" | "alliance";

type IntakePayload = {
  kind?: unknown;
  name?: unknown;
  email?: unknown;
  organization?: unknown;
  axis?: unknown;
  links?: unknown;
  message?: unknown;
  website?: unknown;
  hp?: unknown;
};

const VALID_KINDS = new Set<IntakeKind>(["guest-author", "alliance"]);
const VALID_AXES = new Set(["habitat", "ethics", "ecology", "spirit", "cosmotechnics", "lab"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_BODY_SIZE = 12_000;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 200;
const MAX_ORGANIZATION_LENGTH = 160;
const MAX_AXIS_LENGTH = 32;
const MAX_LINKS_LENGTH = 500;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_WEBSITE_LENGTH = 200;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function normalizeText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

async function dispatchWebhook(entry: Record<string, unknown>): Promise<"disabled" | "delivered" | "failed"> {
  const webhookUrl = process.env.COMMUNITY_INTAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    return "disabled";
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(entry),
    });

    return response.ok ? "delivered" : "failed";
  } catch {
    return "failed";
  }
}

export async function POST(req: Request) {
  if (!isLocalNetworkRequestFromHeaders(req.headers)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const requestValidation = validateSameOriginRequest(req, { requireOrigin: true });
  if (!requestValidation.ok) {
    return NextResponse.json({ error: requestValidation.error }, { status: requestValidation.status });
  }

  const ip = getClientIp(req);
  const rateLimit = await consumeRateLimit({
    bucket: "community-intake",
    key: ip,
    limit: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a minute." },
      {
        status: 429,
        headers: {
          "retry-after": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      }
    );
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Expected application/json" }, { status: 415 });
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

  let payload: IntakePayload;
  try {
    payload = JSON.parse(rawBody) as IntakePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const kind = normalizeText(payload.kind, 20) as IntakeKind;
  const name = normalizeText(payload.name, MAX_NAME_LENGTH);
  const email = normalizeText(payload.email, MAX_EMAIL_LENGTH).toLowerCase();
  const organization = normalizeText(payload.organization, MAX_ORGANIZATION_LENGTH);
  const axis = normalizeText(payload.axis, MAX_AXIS_LENGTH);
  const links = normalizeText(payload.links, MAX_LINKS_LENGTH);
  const message = normalizeText(payload.message, MAX_MESSAGE_LENGTH);
  const website = normalizeText(payload.website, MAX_WEBSITE_LENGTH);
  const honeypot = normalizeText(payload.hp, 120);

  if (honeypot.length > 0) {
    return NextResponse.json({ success: true });
  }

  if (!VALID_KINDS.has(kind)) {
    return NextResponse.json({ error: "Invalid collaboration type" }, { status: 400 });
  }

  if (name.length < 2) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  if (axis && !VALID_AXES.has(axis)) {
    return NextResponse.json({ error: "Invalid editorial axis" }, { status: 400 });
  }

  if (message.length < 40) {
    return NextResponse.json({ error: "Message must be at least 40 characters" }, { status: 400 });
  }

  const createdAt = new Date().toISOString();
  const ticket = `intake_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;
  const emailDomain = email.includes("@") ? email.split("@")[1] : "unknown";

  const webhookEntry = {
    ticket,
    created_at: createdAt,
    kind,
    name,
    email,
    email_domain: emailDomain,
    organization,
    axis,
    links,
    message,
    website,
    ip,
    user_agent: req.headers.get("user-agent") || "",
  };

  appendRuntimeNdjson("community-intake.ndjson", {
    ticket,
    created_at: createdAt,
    kind,
    name,
    email_hash: anonymizeNullable(email),
    email_domain: hashSensitiveValue(emailDomain),
    organization,
    axis,
    links,
    message,
    website,
    ip_hash: anonymizeNullable(ip),
    user_agent_hash: anonymizeNullable(req.headers.get("user-agent")),
  });

  const webhook = await dispatchWebhook(webhookEntry);

  return NextResponse.json({
    success: true,
    ticket,
    webhook,
  });
}
