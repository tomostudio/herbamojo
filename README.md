# Herbamojo

The Herbamojo site, rebuilt on Next.js App Router + Sanity + Tailwind CSS. It replaces
a Gatsby build whose content lived in markdown files edited through Decap CMS;
that project is the reference for how every page should look and behave.

- **Public site** — home, product authentication, and a bilingual journal
  (English and Indonesian), each with its own paginated list.
- **Content editing** — Sanity Studio, mounted at `/admin`.

## Requirements

Node is pinned in `.nvmrc`:

```bash
nvm use
npm install
```

## Environment

Copy `.env.example` to `.env.local` and fill it in:

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public. |
| `NEXT_PUBLIC_SANITY_DATASET` | Public, normally `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public. |
| `SANITY_API_READ_TOKEN` | **Server only.** Never give it a `NEXT_PUBLIC_` prefix — that inlines it into the client bundle and ships it to every visitor. |
| `SANITY_REVALIDATE_SECRET` | Shared with the Sanity webhook below. `openssl rand -hex 32`. |

`.env.local` is git-ignored. Set the same variables in the hosting provider.

On AWS Amplify the console's variables reach the build but not the SSR runtime.
`amplify.yml` writes them into `.env.production` during the build so the token
and the webhook secret are readable per request — without it revalidation
fails and `/api/revalidate/` answers `SANITY_REVALIDATE_SECRET is not set`,
even though the variable is set in the console.

## Commands

```bash
npm run dev          # development server
npm run build        # production build (prerenders every page)
npm run start        # serve the production build
npm run lint         # biome: format, lint and import sorting
npm run typecheck    # tsc --noEmit
```

Biome is the only tool for formatting and linting — there is no ESLint or
Prettier. A pre-commit hook runs it on staged files.

## Structure

Follows the TOMO Studio conventions.

| Path | Holds |
| --- | --- |
| `app/<page>/page.tsx` | Route entry: fetches data, exports `generateMetadata` and `revalidate`. No UI. |
| `app/<page>/index.tsx` | The page's UI, receiving data as props. |
| `app/<page>/queries.ts` | That page's GROQ queries. |
| `components/` | Reusable UI as atoms / molecules / organisms / templates. Never fetches. |
| `utils/fetchPageData/` | The only door to the CMS for a page. Always includes the site settings and footer. |
| `sanity/schemas/` | Document and field definitions; new schemas must be registered in `index.tsx`. |
| `styles/` | `tailwind.css` holds the design tokens (`@theme`), the custom variants for body state (`hover`, `loaded`, `revealed`, `snapon`, `menu-open`, `h-mid`, `h-less`) and the keyframes; `_fonts.scss` the `@font-face` rules; `_utils.scss` the body classes the scroll scripts toggle. Components are styled with utilities through `cn()`. |

## Content updates

Pages are on a 60 second ISR timer, with a webhook for immediate updates.
Without the webhook an edit can sit unseen for up to a minute.

To wire it up, in **sanity.io/manage → API → Webhooks**:

| Field | Value |
| --- | --- |
| URL | `https://<domain>/api/revalidate/` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| HTTP method | `POST` |
| Secret | the value of `SANITY_REVALIDATE_SECRET` |

The trailing slash matters. `trailingSlash` is on, so `/api/revalidate`
answers with a 308 and many webhook senders do not follow redirects.

Each delivery is signed, and the signature is checked before anything is
revalidated. Publishing a post refreshes that post, the list it belongs to and
its pagination, the journal strip on the home page, and the sitemap; the site
settings and footer refresh every page.

## Notes for anyone comparing against the old site

A few differences from the Gatsby build are deliberate:

- Images go through `next/image` against Sanity's CDN, so the markup is a
  single `<img>` with a `srcset` rather than Gatsby's `<picture>` pairs.
- Fonts are declared in `styles/_fonts.scss` with `font-display: swap`, so
  text can show in a fallback face for a moment before the webfonts land.
- `robots.txt` is new — the old site had none — and keeps crawlers out of
  `/admin` and `/api`.
- `hreflang` links for the two languages are new.
- The 404 page's logo link is labelled "Herbamojo"; the original labels it
  "Shop Slider", which looks like a copy-paste slip.
- Setting the stockist's slider option to "Disable Slider" gives the plain,
  arrow-only layout its help text describes. The original sets an internal
  layout value its own switch has no branch for, so choosing it there renders
  an empty stockist section.

The security headers, the `/journal/1` redirect, the sitemap's original paths
(`/sitemap-index.xml` and `/sitemap-0.xml`) and the year-long caching of
`/assets/*` all match the old site's Netlify configuration.
