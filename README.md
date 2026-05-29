# petit-web

Marketing site for Petit. Next.js 15 App Router, React 19, TypeScript, CSS Modules, Framer Motion.

## Run locally

```sh
git clone https://github.com/petit-software/web.git
cd web
npm install
cp .env.example .env.local   # fill in Resend keys (optional for UI work)
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

## Resend signup

The email form posts to `/api/email-signup`, which creates a Resend contact via the [Contacts API](https://resend.com/docs/dashboard/contacts/introduction) using the official `resend` SDK. Without an API key it returns a friendly 503, so the UI works for local design work even without keys.

Env vars (see `.env.example`):

```
RESEND_API_KEY=             # full-access key from https://resend.com/api-keys
                            # (sending-only keys return 401 on contacts endpoints)
```

Each landing page configures its own segment via `cta.segmentId` in the markdown frontmatter, so the same `<EmailSignup />` component can drop into multiple pages and route signups to different segments.

## Adding a landing page

1. Add an entry to `lib/landing-pages.ts` (slug, title, description, optional ogImage).
2. Create `content/landing/<slug>.md` with `hero` + `cta` frontmatter and markdown body:
   ```yaml
   ---
   hero:
     title: "Required headline"
     subtitle: "optional"
     image: "hero.png"
   cta:
     title: "Required CTA headline"
     buttonLabel: "Get notified"
     placeholder: "you@company.com"
     segmentId: "uuid-from-resend"   # optional — Resend segment for this page's signups
   ---
   ```
3. Drop images into `public/blog/<slug>/`. Reference them by bare filename in the MD.
4. Done — the page is live at `/<slug>`.

To route signups to a different Resend segment per page, create the segment at <https://resend.com/segments>, copy its UUID, and paste it into `cta.segmentId`. Omit the field to keep contacts ungrouped.

See `CLAUDE.md` for the full architecture, theming rules, and conventions.
