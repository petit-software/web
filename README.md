# petit-web

Marketing site for Petit. Next.js 15 App Router, React 19, TypeScript, CSS Modules, Framer Motion.

## Run locally

```sh
git clone https://github.com/petit-software/web.git
cd web
npm install
cp .env.example .env.local   # fill in Mailchimp keys (optional for UI work)
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Lint with `next lint` |

## Mailchimp signup

The email form posts to `/api/email-signup`, which calls the Mailchimp Marketing API. Without env vars it returns a friendly 503, so the UI works for local design work even without keys.

Required env vars (see `.env.example`):

```
MAILCHIMP_API_KEY=          # e.g. xxxx-us17
MAILCHIMP_SERVER_PREFIX=    # e.g. us17 (the suffix after the dash)
MAILCHIMP_AUDIENCE_ID=      # list ID from Mailchimp audience settings
```

## Adding a landing page

1. Add an entry to `lib/landing-pages.ts` (slug, title, description, optional ogImage).
2. Create `content/landing/<slug>.md` with `hero` + `cta` frontmatter and markdown body.
3. Drop images into `public/blog/<slug>/`. Reference them by bare filename in the MD.
4. Done — the page is live at `/<slug>`.

See `CLAUDE.md` for the full architecture, theming rules, and conventions.
