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
defines 8 content types:

| Content type | Purpose |
| --- | --- |
| `Opportunity` | exchange / scholarship / conference / volunteering listings |
| `Online Session` | speaking clubs, workshops, sessions |
| `Guide` | how-to articles with rich-text body |
| `Student Story` | testimonials on the homepage |
| `Partner` | organisations in the "Built with people who believe…" row |
| `Path Step` | the 5-step "How Global Connect works" section |
| `Interest` | the "Personalised discovery" topic chips |
| `Community Topic` | discussion topics shown on the Community page |

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

## 5. Seed content (entries + assets)

The fastest way to populate your space is to run the seed script, which
upserts every entry and uploads opportunity images automatically:

```bash
pnpm contentful:seed
```

This reads the seed arrays in `src/lib/contentful/seed.ts`, uploads images
to Contentful as assets, and creates or updates every entry. It is
**idempotent** — safe to re-run after adding new content to the seed file.

What gets seeded:

- 18 **Opportunity** entries (with full rich-text long descriptions + images)
- 14 **Online Session** entries (mix of upcoming and past, some with register URLs)
- 6 **Guide** entries (rich-text bodies with embedded images)
- 10 **Student Story** entries
- 6 **Partner** entries
- 5 **Path Step** entries (Discover, Understand, Prepare, Apply, Grow)
- 8 **Interest** entries
- 10 **Community Topic** entries (discussion topics for the Community page)

### Adding or modifying seed data

All seed data lives in `src/lib/contentful/seed.ts`. Each content type has its
own exported array (`seedOpportunities`, `seedSessions`, etc.) matching the
TypeScript interfaces in `src/types/models.ts`.

**Adding an entry** — append an object to the relevant array. The `id` field
must be unique (convention: `seed-{type}-{slug}`). Then re-run:

```bash
pnpm contentful:seed
```

**Adding embedded images** (guides, opportunity long descriptions) — use the
`guideImage(slug, alt)` helper inside a `doc()` body. This builds an inline
asset with ID `asset-{slug}`. Two things must exist for it to render:

| Mode | What's needed |
| --- | --- |
| **Contentful** (CMS) | The seed script auto-uploads the image as a Contentful asset via `scripts/contentful-seed.ts` using `https://picsum.photos/seed/asset-{slug}/1600/1000`. No manual upload needed — just re-run `pnpm contentful:seed`. |
| **Fallback** (no CMS) | A local file at `public/guides/asset-{slug}.jpg`. Download one: `curl -fsSL "https://picsum.photos/seed/asset-{slug}/1600/1000" -o public/guides/asset-{slug}.jpg` |

**Content model changes** — if you add a new content type or field, update
`content/content-model.json`, then re-run `pnpm contentful:import` before
`pnpm contentful:seed`.

**Field validations** — Contentful enforces `in` lists and regex patterns
defined in the content model. If your new data uses values not in the current
lists (e.g. a new country or funding type), update the validation in
`content-model.json` first and re-import.

### Option B — Enter content manually in the dashboard

Content → Content model → pick a type → *Add entry* (or use the
*Content* tab). Publish each entry when done (**Publish** button, top right) —
the app reads *published* content via the Delivery API.

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

## Migration / Export

### Migrating to a new Contentful space (recommended: re-seed)

The seed script is your portable "export". Moving to a new instance is two
commands:

```bash
# set new space env vars in .env.local, then
pnpm contentful:import   # creates content types
pnpm contentful:seed     # creates entries + uploads images
```

This recreates everything — content types, entries, assets — from
`src/lib/contentful/seed.ts` and `content/content-model.json`. Images are
re-uploaded from picsum, so no manual download is needed.

### Exporting from Contentful directly

The Contentful CLI can export a space to JSON:

```bash
contentful space export --space-id <id> --environment master --content-file ./export.json
```

This exports content types, entries, asset metadata, locales and roles — but
**not the actual image files**. Asset binaries are referenced by CDN URL only.

For a full migration including images you would need to:

1. Export the space → JSON.
2. Download images from the asset URLs in the export.
3. Import into the target space → `contentful space import --space-id <new-id> --content-file export.json`

> If the source space is still accessible during import, Contentful re-uploads
> assets from the original URLs automatically. If you are deleting the source
> space, download the images first.

### Other migration options

| Method | Includes images? | Notes |
| --- | --- | --- |
| `pnpm contentful:seed` | Yes (via picsum) | Recommended for this project — fully self-contained |
| `contentful space export` | No (metadata only) | Good for schema + content between live spaces |
| Dashboard "Copy space" | Yes | Space duplication (paid plans only, if available) |