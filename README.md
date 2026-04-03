# HABITAT Core

`habitat-core` is the public, minimal codebase for HABITAT.md.

It is intended for:

- local deployment by default
- open-source forking
- adapting the architecture to new projects

It excludes private runtime secrets and real editorial MDX content.

## Local development

```bash
npm install
npm run dev
```

App: `http://localhost:3333`

## Basic checks

```bash
npm run lint
npm run typecheck
npm run build
```

## License

MIT (see `LICENSE`).
