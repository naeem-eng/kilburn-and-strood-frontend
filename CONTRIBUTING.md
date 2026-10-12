# Contributing Guide

## Getting started

Copy `.env.local` from a teammate.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi instance base URL |
| `STRAPI_API_TOKEN` | Strapi read-only API token |
| `NEXT_PUBLIC_SITE_NAME` | Used in page `<title>` tags |
| `REVALIDATION_SECRET` | Validates Strapi webhook → `/api/revalidate` |
| `PREVIEW_SECRET` | Validates preview mode activation |

```bash
npm install
npm run dev
```

---

## Adding a new section type

Four files must be updated — missing any one causes a silent failure (section won't appear, no error).

- [ ] **`src/utils/utils.ts`** — add the component key to `getComponentsPopulateObj()` with its populate config
- [ ] **`src/parsers/section-parser/[name]/`** — parser + types (no `any`, verify field names in Strapi Content-Type Builder)
- [ ] **`src/components/sections/sections.tsx`** — add an `if` block for the new `section.component` string
- [ ] **`src/components/general/[name]/`** — the React component itself

Test locally with `npm run dev` against the real Strapi instance before opening a PR.

---

## Strapi schema changes

If a field is added, renamed, or removed in Strapi — update the populate query, parser types, and component props to match. Field names in Strapi are `snake_case`; the parser layer converts them to `camelCase`.

**Gotcha:** a wrong populate key returns `null` silently. Always verify names in Strapi Admin → Content-Type Builder.

---

## Dependency updates

Check changelogs before updating GSAP or Three.js — both have had breaking changes in minor versions. TypeScript major version bumps should be done in isolation and verified against a full build.
