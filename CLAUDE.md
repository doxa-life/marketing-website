# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing website for doxa.life, rebuilt from WordPress to Nuxt 4. Replaces the old WordPress marketing-theme with an SSR Nuxt app that has a built-in admin CMS.

## Development

```bash
bun install
bun run dev          # Runs migrations then starts dev server on port 3200
bun run build        # Production build
bun run preview      # Preview production build
```

Requires `DATABASE_URL` in `.env` (PostgreSQL). Migrations run automatically on `dev` and `start`.

## Testing

Visual regression tests use Playwright:
```bash
npx playwright test                          # All visual tests
npx playwright test tests/visual/pages.spec.ts  # Single test file
```

Tests run against `http://localhost:3200` (dev server starts automatically via playwright config).

## Architecture

### Two-zone design
- **Public pages** (`app/pages/` except `admin/`): SSR, uses the ported SCSS design system (CUBE CSS methodology). Uses `default` layout with SiteHeader/SiteFooter.
- **Admin pages** (`app/pages/admin/`): SPA (`ssr: false` via routeRules), uses Nuxt UI components. Uses `admin` layout with sidebar nav. Protected by `admin` middleware.

### Base layer
Extends `github:corsacca/nuxt-base` which provides auth (`useAuth()`), database utilities, email, and S3 support.

### SCSS design system (public pages only)
Located in `app/assets/styles/`, follows CUBE CSS ordering:
1. Tokens → 2. Base (reset, globals) → 3. Composition (Everylayout) → 4. Blocks → 5. Utilities

Block-level styles in `app/assets/styles/blocks/` (header, footer, cards, forms, etc.). **Do not use Tailwind or Nuxt UI components on public pages.**

### i18n
- Language config in `config/languages.ts` (single source of truth for enabled languages)
- Locale files in `i18n/locales/{code}/common.json`
- Strategy: `prefix_except_default` (English has no prefix, others get `/es/`, `/fr/`, etc.)
- `/en/**` redirects to `/**` (no English prefix)

### CMS (admin)
Admin CRUD for pages stored in PostgreSQL (`server/utils/pages-db.ts`). About pages are database-driven with rich text editing (Tiptap). Public about pages fetch content via `/api/pages/[slug]` with language parameter.

### Server routes
- `server/api/adopt.post.ts`, `server/api/contact.post.ts` — Form submissions (proxy to campaigns server, keeps secrets server-side)
- `server/api/pages/` — Public page content API
- `server/api/people-groups/` — People group data API
- `server/api/admin/pages/` — Admin CRUD (protected)
- Cloudflare Turnstile verification via `server/utils/turnstile.ts`

### Key integrations
- **Mapbox** — Interactive prayer map (`PrayerMap.vue`)
- **Cloudflare Turnstile** — Bot protection on forms
- **Campaigns server** (`pray.doxa.life`) — Form submissions proxy through server routes

### Route rules
ISR (1 hour) on public content pages. WordPress legacy URLs (`/wp-content/**`, `/wp-admin/**`, `/wp-login.php`) redirect to Nuxt equivalents.

## Nuxt Routing Rules (CRITICAL)

Avoid routing conflicts in Nuxt file-based routing:
- **NEVER** create both `pages/section.vue` AND `pages/section/[id]/page.vue`
- **ALWAYS** use nested structure: `pages/section/index.vue` + `pages/section/[id]/page.vue`

```
❌ pages/admin/users.vue + pages/admin/users/[id]/activity.vue
✅ pages/admin/users/index.vue + pages/admin/users/[id]/activity.vue
```

## Base Layer Reference

Extends `github:corsacca/nuxt-base`. Key utilities:

```typescript
// Client-side auth (composable)
const { user, isLoggedIn, authReady, login, logout, register, checkAuth } = useAuth()

// Server-side auth
const user = await requireAuth(event)  // throws 401 if not authenticated
const user = await getAuthUser(event)  // returns null if not authenticated

// Server-side utilities (from base layer)
// sql - database connection (from #imports)
// sendEmail, sendTemplateEmail - email
// uploadToS3, generateSignedUrl, deleteFromS3 - S3 storage
// logCreate, logUpdate, logDelete - activity logging
```

Local utilities in `server/utils/app/` are excluded from Nitro auto-imports to avoid conflicts with the base layer.

### Database
- PostgreSQL with the `postgres` package (`sql` from `#imports`)
- Migrations in `migrations/` — files use `{number}_{description}.js` format, extend `BaseMigration`
- Migrations auto-execute on `dev` and `start`

## Admin UI Components

Admin pages use Nuxt UI v4 — always use Nuxt UI components instead of plain HTML:
- `<UButton>` not `<button>`, `<UInput>` not `<input>`, `<UTable>` not `<table>`, etc.
- Icons use Lucide: `icon="i-lucide-plus"`
- Reference: https://ui.nuxt.com/components

## i18n Usage
- Use `$t('key')` in templates, `useI18n()` in scripts
- Use `localePath()` for navigation links
- Translation glossaries: follow DeepL glossaries in `../translation/deepl-glossaries/` for consistent terminology

## Key Rules
- Public pages use the ported SCSS design system, NOT Tailwind/Nuxt UI
- Admin pages use Nuxt UI components
- Never edit `.env` directly
- Use toasts/modals, never `alert()`/`confirm()`
- Components use `pathPrefix: false` — no directory prefix needed in templates
