# Contributing to HABITAT.md

This repository uses a GitHub-first editorial workflow.

## Scope

- Runtime dashboard editing is disabled.
- Content is edited directly as files in `content/**`.
- Publication happens via Pull Request merge.

## Editorial workflow

1. Create a branch from `main`.
   - Suggested name: `article/<slug>` or `update/<scope>`.
2. Edit MDX files under `content/**`.
3. Keep frontmatter valid and set `status`:
   - `draft`: working copy
   - `review`: ready for collaborator review
   - `approved`: accepted, waiting publication window
   - `published`: visible publicly
4. Open a Pull Request.
5. Request review from the second collaborator.
6. Merge to `main` when approved.

## Content paths

- English journal content:
  - `content/en/essays/*.mdx`
  - `content/en/notes/*.mdx`
  - `content/en/observatory/*.mdx`
- Spanish journal content:
  - `content/es/ensayos/*.mdx`
  - `content/es/notas/*.mdx`
  - `content/es/observatorio/*.mdx`

## Validation before merge

Run locally:

```bash
npm run lint
npm run typecheck
npm run build
```

For full gate:

```bash
npm run check
```
