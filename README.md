# HABITAT Core

`habitat-core` is the public, minimal codebase for HABITAT.md.

It is intended for:

- local deployment
- open-source forking
- adapting the architecture to new projects

It excludes private runtime secrets and real editorial MDX content.

## Local development

```bash
npm install
npm run dev
```

App: `http://localhost:3333`

## Cloudflare Workers deployment

This project is configured for Cloudflare Workers via OpenNext.

```bash
npm run deploy
```

Useful commands:

- `npm run preview`
- `npm run deploy`
- `npm run upload`
- `npm run cf-typegen`

## Basic checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment variable

- `NEXT_PUBLIC_APP_URL` (canonical public URL)

## License

MIT (see `LICENSE`).
