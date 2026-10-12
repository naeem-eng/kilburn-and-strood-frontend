# CLAUDE.md — AI context for Kilburn & Strode

## Project overview

Next.js 16 (App Router, Turbopack) marketing site for Kilburn & Strode LLP, a UK law firm.
Strapi v4 (cloud-hosted) is the headless CMS — all content lives there, not in code.
GSAP handles all scroll and page transition animations. Three.js powers the fractal glass WebGL effect.

---

## Architecture

```
Strapi Cloud (content)
  → strapiFetch()              src/requests/lib/strapi.ts
  → request modules            src/requests/*-requests/
  → parser layer               src/parsers/
  → React components           src/components/
  → pages                      src/app/
```

**Routing:**
- `src/app/[...slug]/` — catch-all for all generic CMS pages (fetches from `/api/pages`)
- `src/app/people/` — people listing (separate Strapi collection)
- `src/app/people/[slug]/` — individual person profile (single segment, not catch-all)
- `src/app/insights/[...slug]/` — articles
- `src/app/events/[...slug]/` — events

**Caching:** All pages are `force-static` with `revalidate: 3600`. Strapi webhooks POST to `/api/revalidate` for on-demand cache busting. If content changes aren't appearing, check the webhook log in Strapi Admin → Settings → Webhooks.

---

## Key patterns

### strapiFetch
Single function for all Strapi calls. Located at `src/requests/lib/strapi.ts`.
- Reads `NEXT_PUBLIC_STRAPI_URL` and `STRAPI_API_TOKEN` from env
- Appends `status=published` (or `status=draft` in preview mode) automatically
- Runs `toCamelCaseDeep()` on every response — all keys arrive at the component layer as camelCase
- Uses `force-cache` + Next.js cache tags for caching; `no-store` in preview mode

### Populate
Strapi does not return relations by default. `populate: "*"` only goes one level deep.
For nested relations, every level must be named explicitly.

`getComponentsPopulateObj()` in `src/utils/utils.ts` is the central registry — a map of every known Strapi component type to its populate config. This is used when fetching page sections via the `on:` key (polymorphic populate). **This file must be updated whenever a new section type is added in Strapi.**

### Parser layer
Every request module passes the raw Strapi response through a parser before it reaches a component.
- Input: raw Strapi shape (snake_case, though strapiFetch already camelCases keys)
- Output: typed component props
- Always handle `null`/`undefined` — Strapi returns `null` for unpopulated relations, not empty objects
- Never use `any` — use the Strapi Content-Type Builder to find exact field names and type them

### Sections system
`src/components/sections/sections.tsx` maps Strapi component strings (e.g. `components.homepage-header`) to React components via a chain of `if` blocks.
`src/parsers/section-parser/index.ts` maps the raw sections array through the correct parser per component type.

**Adding a new section type requires updating all four:**
1. `getComponentsPopulateObj()` — populate config
2. `src/parsers/section-parser/` — new parser + types
3. `src/components/sections/sections.tsx` — if block
4. `src/components/general/[name]/` — React component

Missing any one causes a silent failure — the section simply won't render, no error thrown.

### FullPageSlider
`src/components/interactive/fullpage/full-pageslider.tsx` wraps every page.
- `interactive={true}` — fullpage scroll-snap mode (desktop ≥1280px), driven by GSAP Observer + ScrollTrigger
- `interactive={false}` — normal scroll with scroll-triggered animations
- Intercepts all link clicks in capture phase, plays exit animation, then calls `router.push()`
- Exposes `kill()` and `reinit()` via `useImperativeHandle` for parent components to control
- Animation config lives in HTML data attributes (`data-from`, `data-middle`, `data-to`, `data-animation-atoms`) — not in JS props

### Client-side API proxy routes
The browser can't call Strapi directly (token must stay server-side). Six routes in `src/app/api/` proxy Strapi requests:
- `/api/filters` — filter dropdown options
- `/api/people` — people listing with filtering + pagination
- `/api/article` — articles with filtering + pagination
- `/api/event` — events split into upcoming/past with filtering
- `/api/search` — site-wide search across all collections
- `/api/aside-search` — result counts only (for search sidebar totals)

### Preview mode
`/api/preview?url=/slug&token=SECRET` — enables Next.js draft mode (sets a cookie), redirects to the slug.
`/api/exit-preview?slug=/slug` — disables draft mode, redirects back.
Once draft mode is active, `strapiFetch` passes `status=draft` instead of `status=published`.
`PreviewListener` (`src/components/general/preview_listner/`) listens for `postMessage` events from Strapi's admin iframe and calls `router.refresh()` on content changes. Mounted on the homepage only, and only when preview mode is active (`{isPreview && <PreviewListener />}`).

---

## Known issues (see PROJECT-ISSUES.md for full list)

- Revalidation secret is hardcoded in `src/app/api/revalidate/route.ts` — should be `process.env.REVALIDATION_SECRET`
- Preview route has no token validation — anyone can enable draft mode
- `next.config.js` uses `module.exports` (CommonJS) — fine for `.js`, but `withBundleAnalyzer` wrapping means `ANALYZE=true` in `.env.local` runs the analyzer on every build
- `revalidateTag(tag, 'max')` has an invalid second argument — should be `revalidateTag(tag)`
- `smooth-scrollbar` and `react-device-detect` are installed but never imported
- `fractal-glass-v2` component exists but is never used (v1 is active)
- `types: []` in `tsconfig.json` suppresses ambient type declarations

---

## What not to do

- Do not use `populate: "*"` for deeply nested relations — it only goes one level deep and silently returns `null` for anything deeper
- Do not add a new section type in Strapi without updating all four files listed above
- Do not use `any` in parsers or request modules — type the Strapi response shape explicitly
- Do not update GSAP or Three.js without checking their changelogs first — both have had breaking changes in minor versions
- Do not upgrade TypeScript to v7 without verifying full toolchain compatibility first

---

## Strapi instance

Base URL is set via `NEXT_PUBLIC_STRAPI_URL` in `.env.local`. The admin panel is at `{NEXT_PUBLIC_STRAPI_URL}/admin`.
Use Content-Type Builder to verify exact field names before writing populate queries or parser types.
