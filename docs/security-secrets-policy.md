# Security and Secrets Policy

This document defines how HABITAT.md handles secrets across environments.

## 1) Environment tiers

- `development`: local machine, test keys allowed.
- `preview`: staging/preview deploys, production-like behavior with isolated keys.
- `production`: live site, strict keys and no fallback credentials.

## 2) Required secrets by environment

### Newsletter

- `BUTTONDOWN_API_KEY` (for live provider dispatch)

Rules:

- Newsletter API is currently disabled while migrating distribution to Substack.
- Keep `BUTTONDOWN_API_KEY` unset unless newsletter routes are explicitly reintroduced.

### Community intake

- `COMMUNITY_INTAKE_WEBHOOK_URL` (optional)

Rules:

- If set, point only to controlled endpoints.
- Rotate webhook destination credentials if a downstream service is changed.

### Analytics

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optional)
- `NEXT_PUBLIC_PLAUSIBLE_SRC` (optional override)

Rules:

- Only privacy-first analytics providers are allowed.
- Do not add trackers that collect personal data without explicit governance review.

## 3) Rotation policy

- Rotate provider API keys (newsletter, webhooks) every 90-180 days.
- Rotate `RUNTIME_LOG_HASH_SALT` with incident response playbooks when privacy exposure is suspected.
- On rotation:
  1. create new key,
  2. update environment,
  3. validate routes,
  4. revoke old key.

## 4) Exposure prevention

- Never commit secrets to git.
- Never place secrets in `NEXT_PUBLIC_*` unless intentionally public.
- Use environment managers from deployment platform for preview/prod.
- Runtime logs must be written outside tracked content paths (default: `${TMPDIR}/habitat-runtime-logs/`) and contain hashed/anonymized PII only.
- Runtime logs should enforce retention via `RUNTIME_LOG_RETENTION_DAYS` (default: 14 days).

### Optional hardening env vars

- `TRUST_PROXY_HEADERS=1` only behind trusted reverse proxies.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for distributed rate limiting.
- `RATE_LIMIT_PREFIX` for environment key partitioning.
- `RUNTIME_LOG_HASH_SALT` for deterministic anonymization.

## 5) Operational verification checklist

Run these before releasing:

1. `npm run check`
2. Verify `/api/community/intake` request validation and logs.
3. Verify newsletter endpoints remain disabled until migration is ready.
4. Confirm CSP + security headers are active on page and API routes.
