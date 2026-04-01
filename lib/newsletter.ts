import { anonymizeNullable, appendRuntimeNdjson } from "./runtime-log";

const BUTTONDOWN_API_BASE = "https://api.buttondown.com/v1";

type NewsletterProvider = "buttondown" | "local";

type NewsletterProviderConfig =
  | { provider: "buttondown"; apiKey: string }
  | { provider: "local" }
  | { provider: "unconfigured" };

type NewsletterEvent = {
  at: string;
  event: "subscribe" | "send";
  provider: NewsletterProvider;
  status: "ok" | "failed";
  actor?: string;
  email?: string;
  subject?: string;
  issue_id?: string;
  locale?: "en" | "es";
  detail?: string;
};

export type SubscribeResult = {
  ok: boolean;
  provider: NewsletterProvider;
  status: "subscribed" | "already" | "logged";
};

export type SendResult = {
  ok: boolean;
  provider: NewsletterProvider;
  issueId: string;
};

function getButtondownKey(): string | null {
  const key = process.env.BUTTONDOWN_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

function resolveProvider(): NewsletterProviderConfig {
  const key = getButtondownKey();
  if (key) {
    return { provider: "buttondown", apiKey: key };
  }

  if (process.env.NODE_ENV === "production") {
    return { provider: "unconfigured" };
  }

  return { provider: "local" };
}

function appendNewsletterEvent(entry: NewsletterEvent) {
  const payload: NewsletterEvent = {
    ...entry,
    email: entry.email ? anonymizeNullable(entry.email) : undefined,
  };
  appendRuntimeNdjson("newsletter-events.ndjson", payload as Record<string, unknown>);
}

async function buttondownFetch(endpoint: string, apiKey: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("authorization", `Token ${apiKey}`);
  headers.set("content-type", "application/json");

  return fetch(`${BUTTONDOWN_API_BASE}${endpoint}`, {
    ...init,
    headers,
  });
}

async function readErrorDetail(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return "unknown_error";

  try {
    const parsed = JSON.parse(text) as { detail?: string; message?: string; error?: string };
    return parsed.detail || parsed.message || parsed.error || text;
  } catch {
    return text;
  }
}

export async function subscribeNewsletter(email: string, locale: "en" | "es"): Promise<SubscribeResult> {
  const provider = resolveProvider();
  const at = new Date().toISOString();

  if (provider.provider === "unconfigured") {
    appendNewsletterEvent({
      at,
      event: "subscribe",
      provider: "local",
      status: "failed",
      email,
      locale,
      detail: "missing_buttondown_api_key_in_production",
    });
    throw new Error("newsletter_provider_unconfigured");
  }

  if (provider.provider === "local") {
    appendNewsletterEvent({
      at,
      event: "subscribe",
      provider: "local",
      status: "ok",
      email,
      locale,
      detail: "local_provider_no_api_key",
    });

    return { ok: true, provider: "local", status: "logged" };
  }

  const response = await buttondownFetch("/subscribers", provider.apiKey, {
    method: "POST",
    body: JSON.stringify({
      email_address: email,
      metadata: { locale },
    }),
  });

  if (response.ok) {
    appendNewsletterEvent({
      at,
      event: "subscribe",
      provider: "buttondown",
      status: "ok",
      email,
      locale,
    });

    return { ok: true, provider: "buttondown", status: "subscribed" };
  }

  const detail = await readErrorDetail(response);
  const lowered = detail.toLowerCase();
  if (response.status === 400 || response.status === 409) {
    if (lowered.includes("already") || lowered.includes("exists")) {
      appendNewsletterEvent({
        at,
        event: "subscribe",
        provider: "buttondown",
        status: "ok",
        email,
        locale,
        detail: "already_subscribed",
      });

      return { ok: true, provider: "buttondown", status: "already" };
    }
  }

  appendNewsletterEvent({
    at,
    event: "subscribe",
    provider: provider.provider,
    status: "failed",
    email,
    locale,
    detail,
  });

  throw new Error(detail || "newsletter_subscription_failed");
}

export async function sendNewsletterIssue(input: {
  actor: string;
  locale: "en" | "es";
  subject: string;
  body: string;
}): Promise<SendResult> {
  const provider = resolveProvider();
  const at = new Date().toISOString();

  if (provider.provider === "unconfigured") {
    appendNewsletterEvent({
      at,
      event: "send",
      provider: "local",
      status: "failed",
      actor: input.actor,
      locale: input.locale,
      subject: input.subject,
      detail: "missing_buttondown_api_key_in_production",
    });
    throw new Error("newsletter_provider_unconfigured");
  }

  if (provider.provider === "local") {
    const issueId = `local_${Date.now().toString(36)}`;
    appendNewsletterEvent({
      at,
      event: "send",
      provider: "local",
      status: "ok",
      actor: input.actor,
      locale: input.locale,
      subject: input.subject,
      issue_id: issueId,
      detail: "local_provider_no_api_key",
    });

    return {
      ok: true,
      provider: "local",
      issueId,
    };
  }

  const createResponse = await buttondownFetch("/emails", provider.apiKey, {
    method: "POST",
    body: JSON.stringify({
      subject: input.subject,
      body: input.body,
    }),
  });

  if (!createResponse.ok) {
    const detail = await readErrorDetail(createResponse);
    appendNewsletterEvent({
      at,
      event: "send",
      provider: "buttondown",
      status: "failed",
      actor: input.actor,
      locale: input.locale,
      subject: input.subject,
      detail,
    });
    throw new Error(detail || "newsletter_create_failed");
  }

  const created = (await createResponse.json().catch(() => ({}))) as {
    id?: string | number;
    uuid?: string;
  };

  const emailIdRaw = created.id ?? created.uuid;
  const emailId = typeof emailIdRaw === "number" ? String(emailIdRaw) : emailIdRaw;
  if (!emailId) {
    appendNewsletterEvent({
      at,
      event: "send",
      provider: "buttondown",
      status: "failed",
      actor: input.actor,
      locale: input.locale,
      subject: input.subject,
      detail: "missing_email_id",
    });
    throw new Error("buttondown_response_missing_email_id");
  }

  const sendResponse = await buttondownFetch(`/emails/${emailId}/send-draft`, provider.apiKey, {
    method: "POST",
    body: JSON.stringify({}),
  });

  if (!sendResponse.ok) {
    const detail = await readErrorDetail(sendResponse);
    appendNewsletterEvent({
      at,
      event: "send",
      provider: "buttondown",
      status: "failed",
      actor: input.actor,
      locale: input.locale,
      subject: input.subject,
      issue_id: emailId,
      detail,
    });
    throw new Error(detail || "newsletter_send_failed");
  }

  appendNewsletterEvent({
    at,
    event: "send",
    provider: "buttondown",
    status: "ok",
    actor: input.actor,
    locale: input.locale,
    subject: input.subject,
    issue_id: emailId,
  });

  return {
    ok: true,
    provider: "buttondown",
    issueId: emailId,
  };
}
