# HABITAT.md

`habitat-core` is the open-source codebase for HABITAT.md, a bilingual editorial platform built with Next.js 16.

This repository is a sanitized mirror intended for:

- local deployment
- forking and experimentation
- architecture reuse

It includes:

- Journal publishing (essay, note, observatory)
- Nest repositories and recent launches
- Curated Library + Links governance
- Community intake pathways (local/LAN only)

It excludes:

- real editorial MDX under `content/en/**/*.mdx` and `content/es/**/*.mdx`
- local credentials and private runtime artifacts

## Editorial workflow (GitHub-first)

In this open-source mirror, content can be edited directly in `content/**` and published through Pull Requests.

Typical flow:

1. Create a branch (`article/<slug>`).
2. Edit MDX under `content/**`.
3. Open Pull Request.
4. Review and merge to `main`.
5. Deploy on your own platform (Vercel, self-hosting, etc.).

Draft/publish is controlled by frontmatter:

- `status: draft | review | approved | published`
- Public routes only render `published` content.

## Local development

```bash
npm install
npm run dev
```

Main app runs at `http://localhost:3333`.

## Validation commands

- `npm run lint`
- `npm run typecheck`
- `npm run content-check`
- `npm run build`
- `npm run perf-budget` (template asset budgets from `.next` manifests)
- `npm run headers-check` (security headers + CSP route audit)
- `npm run qa:ui` (Playwright responsive + accessibility smoke)
- `npm run qa:wcag` (keyboard navigation + contrast AA audit; expects app on `:3333`)
- `npm run qa:cwv` (Core Web Vitals audit from live web-vitals logs + current run sample; expects app on `:3333`)
- `npm run check` (runs all checks above in sequence)

## Environment variables

### Core

- `NEXT_PUBLIC_APP_URL` - canonical site URL for metadata and sitemap

### Community + growth

- `BUTTONDOWN_API_KEY` - enables live Buttondown subscription and send operations
- `COMMUNITY_INTAKE_WEBHOOK_URL` - optional webhook target for `/api/community/intake`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - enable privacy-first analytics script when set
- `NEXT_PUBLIC_PLAUSIBLE_SRC` - optional analytics script URL override
- `NEXT_PUBLIC_ENABLE_WEB_VITALS` - set to `0` to disable in-app web vitals reporting

### Security, rate limiting and runtime logs

- `TRUST_PROXY_HEADERS=1` - trust forwarded IP headers (`x-forwarded-for`, `cf-connecting-ip`, etc.) for rate limiting
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` - optional distributed rate limit backend
- `RATE_LIMIT_PREFIX` - optional key namespace for distributed rate limiting
- `HABITAT_RUNTIME_LOG_DIR` - optional runtime log directory (default: `${TMPDIR}/habitat-runtime-logs`)
- `RUNTIME_LOG_HASH_SALT` - hash salt for anonymized runtime logs
- `RUNTIME_LOG_RETENTION_DAYS` - optional retention window for `*.ndjson` runtime logs (default: `14`)

Operational logs with sensitive payloads are written outside the repo by default (`${TMPDIR}/habitat-runtime-logs/*.ndjson`) and should never be committed.

Newsletter endpoints are currently disabled pending Substack migration.

Security policy reference: `docs/security-secrets-policy.md`.

## License

MIT (see `LICENSE`).

## CI

GitHub Actions workflow at `.github/workflows/check.yml` runs `npm ci` and `npm run check` on push and pull requests.
