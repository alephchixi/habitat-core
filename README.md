# HABITAT Core

`habitat-core` is the public, open, minimal codebase for HABITAT.md, the same used in https://habitatmd.net.

It is intended for:

- media/journal lab/repository/library
- local deployment by default
- open-source forking
- adapting the architecture to new projects

It excludes private runtime secrets and editorial MDX content.

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
