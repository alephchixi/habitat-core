# habitat-core mirror policy

`habitat-core` is the public open-source mirror derived from the private operational repository.

## Source and destination

- Source: `/Users/navi/Documents/habitat`
- Destination: `/Users/navi/Documents/habitat-core`

## Sanitization rules

1. Do not copy git history (`.git` must not be copied).
2. Do not copy credentials (`.env*`, runtime logs, local secrets).
3. Remove real editorial MDX from:
   - `content/en/**/*.mdx`
   - `content/es/**/*.mdx`
4. Keep architecture and non-sensitive shared datasets (`content/shared/**`).
5. Initialize a fresh git repository in `habitat-core`.

## Verification

Run in `habitat-core`:

```bash
npm run lint
npm run typecheck
npm run build
```

Optional full gate:

```bash
npm run check
```
