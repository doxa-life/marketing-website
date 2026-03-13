# marketing-rebuild

Marketing website for doxa.life, rebuilt from WordPress to Nuxt 4.

## Development
```bash
bun install
bun run dev
```

## Architecture
- Public pages: SSR with ported SCSS design system (not Tailwind)
- Admin area: SPA (ssr: false via routeRules), uses Nuxt UI
- Extends github:corsacca/nuxt-base for auth, database, email, S3
- Forms proxy through Nuxt server routes (secrets stay server-side)

## Key Rules
- Public pages use the ported SCSS design system, NOT Tailwind/Nuxt UI
- Admin pages use Nuxt UI components
- Never edit .env directly
- Use toasts/modals, never alert()/confirm()
