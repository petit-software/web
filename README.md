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

1. Add the slug to `landingSlugs` in `lib/landing-pages.ts` — the registry is just a list of slugs.
2. Create `content/landing/<slug>.md` with `seo` + `aeo` + `hero` + `cta` frontmatter and a markdown body. The full reference is in [`content/landing/README.md`](./content/landing/README.md).
3. Drop images into `public/blog/<slug>/` (including a 1200×630 `og.png`). Reference them by bare filename in the MD.
4. Done — the page is live at `/<slug>`.

To route signups to a different Resend segment per page, create the segment at <https://resend.com/segments>, copy its UUID, and paste it into `cta.segmentId`. Omit the field to keep contacts ungrouped.

### SEO + AEO

Each page emits per-page `<meta>` (OG + Twitter + canonical), JSON-LD (`WebPage`, `Article`, and `FAQPage` if you provide `aeo.faqs`), and renders a calm "The short answer" lede directly under the hero from `aeo.summary`. All driven by frontmatter — see the authoring guide for the field list.

### Body layout (full-width, columns, callouts, buttons)

The markdown body supports layout directives — `:::full-width`, `:::wide`, `:::columns` / `:::column` (with `{variant=halves}` and `{variant=thirds}`), `:::callout`, and `::button[Label]` (scrolls to the email form). Full reference in [`content/landing/README.md`](./content/landing/README.md).

### House style

**No emojis in landing-page content.** The brand voice is calm and confident — use words, not glyphs. Enforced by convention; see the authoring guide.

See `CLAUDE.md` for the full architecture, theming rules, and conventions.
