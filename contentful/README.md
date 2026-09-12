# Contentful setup

This app uses **Contentful** as its CMS. Contentful is a "headless CMS": a hosted
database + dashboard where you model content (content types), enter content
(entries), and fetch it over an API. It holds *no code* — your Next.js app is the
display layer. Everything the homepage shows (opportunities, sessions, guides,
stories, partners, path steps, interests) is stored here.

> Prefer the dashboard + video walkthrough?
> <https://www.contentful.com/developers/docs/tutorials/general/get-started/>

---

## 1. Create an account and a space

1. Go to <https://contentful.com> and sign up (free tier is fine).
2. Create a **space** (think of it as a database / project). Note the **Space ID**
   — a short hex string like `abc123def456`. You'll need it below.
   - Spaces are listed at <https://app.contentful.com>, choose *Add space*.

## 2. API keys (tokens)

Contentful issues **per-space API keys** (the tab `Settings → API keys →
*Content delivery/preview API tokens*`) and a separate, **personal management
token**. The API keys page only ever shows the per-space keys; the management
token never appears there — you have to *generate* it.

| Key | Purpose | Where to find / create it |
| --- | --- | --- |
| **Content Delivery API** token | Read **published** content from the app | Settings → API keys → *Content delivery/preview API tokens* |
| **Content Preview API** token | Read **draft** content (for preview mode) | Same page, the preview token column |
| **Management API** token (Personal Access Token, `CFPAT-…`) | Import the content model + run codegen | **Not an API key.** Generate it: Settings → **CMA tokens** (or avatar → Account settings → CMA tokens; direct URL `app.contentful.com/account/profile/cma_tokens`) → *Create personal access token* → name it → *Generate* → **copy immediately** (shown only once) |

**Important:**

- Delivery and Preview tokens are created per space. The Management token /
  PAT is personal to your account and works on any space you can open.
- The PAT starts with `CFPAT-`. Don't paste a delivery/preview key here — the
  CLI will reply with a confusing `401` (or, when the value is empty,
  "You need to provide a space id").
- **Prefer no token at all?** Run `contentful login` once (opens a browser).
  The CLI then stores your CMA token in `~/.contentfulrc.json`, and you can
  call `contentful space import` without `--management-token`.

## 3. Put the keys in your local env file

Copy `.env.example` → `.env.local` and fill in the values:

```bash
CONTENTFUL_SPACE_ID=your_space_id                      # Settings -> General settings
CONTENTFUL_ACCESS_TOKEN=your_content_delivery_api_token # Settings -> API keys
CONTENTFUL_PREVIEW_TOKEN=your_content_preview_api_token # optional, draft content
CONTENTFUL_PREVIEW_SECRET=anything_you_make_up          # optional; NOT from Contentful
CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-your_generated_pat    # generated in step 2
```

> `CONTENTFUL_PREVIEW_SECRET` is *not* a Contentful value — it's an arbitrary
> phrase you invent (it would only matter if you later wire the revalidate
> webhook). Leaving it empty is fine for now.
>
> `CONTENTFUL_ENVIRONMENT` defaults to `master` when unset.

## 4. Create the content model (the "tables")

A **content type** is like a database table (e.g. `Opportunity`), a **field** is a
column (e.g. `funding`), and an **entry** is a row (a specific opportunity).

The model for this site lives in [`content-model.json`](./content-model.json). It
defines 7 content types:

| Content type | Purpose |
| --- | --- |
| `Opportunity` | exchange / scholarship / conference / volunteering listings |
| `Online Session` | speaking clubs, workshops, sessions |
| `Guide` | how-to articles with rich-text body |
| `Student Story` | testimonials on the homepage |
| `Partner` | organisations in the "Built with people who believe…" row |
| `Path Step` | the 5-step "How Global Connect works" section |
| `Interest` | the "Personalised discovery" topic chips |

### Option A — Import with the CLI (recommended, ~1 minute)

From the repo root, run:

```bash
pnpm contentful:import
```

This loads `.env.local`, then runs the Contentful CLI (via
`scripts/contentful-import.mjs`):

- `$CONTENTFUL_*` variables live inside `.env.local`, not in your terminal, so
  the wrapper reads them from the environment `dotenv` just loaded — no shell
  quoting surprises.
- **No management token needed?** If you ran `contentful login` once, leave
  `CONTENTFUL_MANAGEMENT_TOKEN` empty in `.env.local` — the wrapper then omits
  `--management-token` and the CLI uses your stored session
  (`~/.contentfulrc.json`).
- On spaces without the *Timeline* feature, the CLI prints
  `Skipping releases import: Timeline (Releases) is not enabled` and wrongly
  exits 1 despite importing the whole model. The wrapper ignores that specific
  notice (but still fails on real errors such as `ValidationFailed`).

`--content-model-only` imports just the schema (no content), which is what you
want on a first setup. If the CLI prompts about the environment, answer `master`.

### Option B — Create manually in the dashboard (no CLI)

1. <https://app.contentful.com> → open your space → Content model.
2. *Add content type* and rebuild each table listed above, field-by-field, using
   `contentful/content-model.json` as the reference (field `id`, `type`, and
   `required` flags live in each field object).
3. The mapping from Contentful field types to the JSON `"type"` values:
   - `Symbol` → **Short text**
   - `Text` → **Long text**
   - `RichText` → **Rich text**
   - `Integer`/`Boolean`/`Date` → the obvious equivalents
   - `Array` → a single field with **List** appearance
   - `Link` with `"linkType": "Entry"` → **Reference → one entry**
   - `Link` with `"linkType": "Asset"` → **Media → one file**

## 5. Enter content (entries)

Now add rows. Content → Content model → pick a type → *Add entry* (or use the
*Content* tab). Publish each entry when done (**Publish** button, top right) —
the app reads *published* content via the Delivery API.

A sensible first batch (mirrors the reference site):

- 3–6 **Opportunity** entries (e.g. Erasmus+ Youth Exchange, Portugal 🇵🇹,
  Fully funded, Ages 16–20, deadline "September 12", tags `Exchange`, `Travel`,
  `Erasmus+`).
- 4 **Online Session** entries (English Speaking Club, Technology & AI Workshop,
  Entrepreneurship Session, International Opportunities Workshop).
- 6 **Guide** entries (motivation letter, scholarships, Erasmus+, interview, CV,
  international programmes) with the `readTime` minutes and a rich-text `body`.
- 3 **Student Story** entries (Lera, Maxim, Alice).
- 6 **Partner** entries (Lyceum №14, Youth Bridge NGO, …).
- 5 **Path Step** entries (Discover, Understand, Prepare, Apply, Grow) numbered
  1–5.
- 8 **Interest** entries (Studying abroad, Travel & exchanges, Technology, …).

Upload a few **assets** (Media tab) for Opportunity images and Partner logos,
then reference them from the corresponding entries.

## 6. Generate TypeScript types (optional but recommended)

The app ships with hand-written types in `src/types/contentful.ts` so it builds
out of the box. If you want types generated straight from your content model
(they stay in sync automatically), run:

```bash
pnpm contentful:codegen
```

This uses `contentful-typescript-codegen` (which reads
`getContentfulEnvironment.ts` in the repo root and your
`CONTENTFUL_MANAGEMENT_TOKEN`) and writes
`src/types/generated/contentful.d.ts`. You can then import those generated
interfaces instead of the hand-written ones (search the code for
`from "@/types/contentful"`).

## 7. Run the app

```bash
pnpm dev
```

## How caching / revalidation works here

The app is **static with ISR** (Next.js 16 *Cache Components*):

- `src/lib/contentful/queries.ts` marks each fetcher with `"use cache"`, so
  results are cached and reused.
- `cacheLife("hours")` sets how long cached content lives before it is
  regenerated (see the profile in `next.config.ts` — `cacheLife` profiles).
- `cacheTag("contentful")` tags every cached result. When you later set up the
  **Contentful Webhook → /api/revalidate** route (`revalidateTag("contentful")`),
  edits in the dashboard will refresh pages in seconds instead of hours.

Status quo: Contentful edits appear on the site within the `cacheLife` window, or
immediately in **Preview mode** (set `CONTENTFUL_PREVIEW_ACTIVE=true` locally).

## Troubleshooting

- **"Missing CONTENTFUL_MANAGEMENT_TOKEN or CONTENTFUL_SPACE_ID"** (from
  `pnpm contentful:import`): your `.env.local` is missing keys — see step 3.
- **Import fails / 401**: Management token is wrong, or the CLI logged into a
  different Contentful account than the space owner. Double check the value is
  a `CFPAT-…` Personal Access Token from *Settings → CMA tokens*, **not** a
  delivery/preview API key from the API keys page.
- **Content not appearing**: check the entries are **published** (Delivery API
  only sees published content).
- **Stale content**: wait out the cache window, or hit the revalidate route.