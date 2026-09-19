# Contentful MCP — usage guide

The project includes a **Contentful MCP server** (remote, configured in
`opencode.json`) that lets AI agents read and write Contentful content directly
— create/update entries, upload assets, publish, and resolve references — without
the CLI or the dashboard.

This guide documents the rules and patterns that work. We learned most of them
the hard way.

---

## Configuration

The MCP is configured in the project root:

```jsonc
// opencode.json
{
  "mcp": {
    "contentful": {
      "type": "remote",
      "url": "https://mcp.contentful.com/mcp",
      "enabled": true
    }
  }
}
```

The MCP server authenticates via the Contentful Management API token (configured
on the server side, not in the repo). Space and environment are passed as
parameters to each tool call:

| Parameter | Value | Notes |
| --- | --- | --- |
| `spaceId` | `k91pamz6ke36` | Settings → General settings |
| `environmentId` | `master` | Default environment |
| `locale` | `en-US` | All fields are locale-keyed |

---

## Golden rules

These are the non-obvious requirements that will trip you up if you ignore them.

### 1. Every field value must be locale-wrapped

Contentful fields are locale-keyed. When you create or update an entry, every
field value must be wrapped in a locale object — `{ "en-US": value }`.

**Wrong:**

```json
{ "fields": { "title": "My Title", "slug": "my-title" } }
```

**Right:**

```json
{ "fields": { "title": { "en-US": "My Title" }, "slug": { "en-US": "my-title" } } }
```

This applies to `contentful_create_entry` and `contentful_update_entry`. Scalar
values, arrays, rich-text documents, booleans, numbers — everything must be
wrapped.

### 2. Entries and assets are created as drafts — you must publish explicitly

`contentful_create_entry` and `contentful_upload_asset` create items in **draft**
state (`publishedCounter: 0`). The Delivery API — and the live site — only sees
**published** content.

After creating, always call:

- `contentful_publish_entry` (pass `spaceId`, `environmentId`, `entryId`)
- `contentful_publish_asset` (pass `spaceId`, `environmentId`, `assetId`)

### 3. Updates require the current `sys.version`

`contentful_update_entry` requires the `version` parameter, which must match the
entry's current `sys.version`. Fetch it first with `contentful_get_entry`. If the
entry changed since you read it, the update is rejected (optimistic concurrency
control).

Workflow:

1. `contentful_get_entry` → note `sys.version`
2. `contentful_update_entry` with `version: <that version>`
3. If rejected, re-fetch and retry

### 4. Large payloads — use the SDK, not MCP tool calls

Contentful allows up to 200K characters / 1 MB for a single Rich Text field.
However, when an AI agent emits a large JSON payload as a tool-call argument, the
**LLM's output token limit** truncates the JSON mid-stream, causing:

- **`JSON Parse error: Unexpected EOF`** (most common)
- **`socket closed`** (during create)

This is **not** a Contentful or MCP server limit — it is the LLM running out of
output tokens before it finishes writing the tool-call JSON.

**Fix for one-off edits:** create the entry with a minimal/placeholder body
(body is required on the `guide` content type), then update with the full body:

```
Step 1: contentful_create_entry  → { "body": { "en-US": <minimal doc> } }
Step 2: contentful_update_entry  → { "body": { "en-US": <full doc> } }
```

**Fix for large bodies that still truncate on update:** use the
`contentful-management` SDK directly in a script (see "Using the SDK for large
payloads" below). The SDK runs outside the LLM's token budget.

### 5. Publish assets one at a time

`contentful_publish_asset` accepts either a single `assetId` string or an array.
The array form currently returns `400 Bad Request: Invalid resource id`.

**Fix:** publish each asset individually.

```jsonc
// Works:
contentful_publish_asset({ assetId: "abc123", spaceId: "...", environmentId: "..." })

// Fails with 400:
contentful_publish_asset({ assetId: ["abc123", "def456"], ... })
```

### 6. Rich-text block nodes need a `content` array

Every block-level node in a Contentful Rich Text document must include a
`content` array — even if it is empty. Omitting it causes a 422 validation
error.

The most common gotcha: **`embedded-asset-block`**.

**Wrong:**

```json
{
  "nodeType": "embedded-asset-block",
  "data": { "target": { "sys": { "type": "Link", "linkType": "Asset", "id": "..." } } }
}
```

**Right:**

```json
{
  "nodeType": "embedded-asset-block",
  "data": { "target": { "sys": { "type": "Link", "linkType": "Asset", "id": "..." } } },
  "content": []
}
```

This is confirmed by the seed helper in `src/lib/contentful/seed.ts:91`
(`content: []`). The same applies to `table`, `table-row`, `table-cell`,
`table-header-cell`, `list-item`, `blockquote`, etc. — all block nodes need
`content`.

### 7. Asset references use Contentful's `sys.id`

When you upload an asset via MCP (`contentful_upload_asset`), it receives a
Contentful system ID — something like `5V4EZEcTd5ydNEPIB3jG6y`. This is what
you reference in `embedded-asset-block` targets inside a rich-text body.

The seed script uses custom IDs (`asset-{slug}`) via `createWithId`, but MCP
uploads get auto-generated IDs. Always use the `sys.id` returned by
`contentful_upload_asset`.

### 8. `fields` must be a JSON object, not a string

`contentful_create_entry` and `contentful_update_entry` expect `fields` as a
JSON object. Passing a JSON string fails with a parse error.

**Wrong:** `"fields": "{\"title\": {\"en-US\": \"X\"}}"`
**Right:** `"fields": { "title": { "en-US": "X" } }`

### 9. Rich Text `enabledNodeTypes` — tables are not allowed by default

When a content type has a Rich Text field with **no** `enabledNodeTypes`
validation, Contentful applies a default set of allowed node types. This default
does **not** include `table`, `table-row`, `table-cell`, or
`table-header-cell`.

If you try to publish an entry with a table in a Rich Text field that lacks the
validation, you get:

```
422 Validation error: ... "table" is not one of the allowed node types
```

**Fix:** add an `enabledNodeTypes` validation to the content type's Rich Text
field. You can do this via the REST API, the CLI, or the dashboard.

Via the Contentful Management API (example — add `table` nodes to the `guide`
content type's `body` field):

```jsonc
// PATCH /spaces/{spaceId}/environments/{environmentId}/contentTypes/guide
{
  "fields": [
    {
      "id": "body",
      "name": "Body",
      "type": "RichText",
      "required": true,
      "localized": true,
      "validations": [
        {
          "enabledNodeTypes": [
            "heading-1", "heading-2", "heading-3", "heading-4",
            "heading-5", "heading-6", "paragraph", "blockquote",
            "unordered-list", "ordered-list", "hr",
            "embedded-asset-block", "embedded-entry-block",
            "hyperlink", "table", "table-row",
            "table-header-cell", "table-cell"
          ]
        },
        {
          "enabledMarks": ["bold", "italic", "underline", "code"]
        }
      ]
    }
  ]
}
```

**Critical:** `enabledNodeTypes` and `enabledMarks` must be **separate**
validation objects. Combining them in a single object causes a `422 ambiguous`
error.

---

## Worked example — add a guide with rich text + images

This is the exact flow that worked for adding the "How to prepare for studying
abroad" guide.

### Step 1: Upload images

Upload each image via `contentful_upload_asset`. Use `file.upload` with a
publicly accessible URL (the MCP fetches the bytes server-side).

```jsonc
contentful_upload_asset({
  spaceId: "k91pamz6ke36",
  environmentId: "master",
  title: "Planning your study abroad trip",
  description: "A student planning their study abroad experience",
  file: {
    fileName: "my-image-1.jpg",
    contentType: "image/jpeg",
    upload: "https://picsum.photos/seed/my-image-1/1600/1000"
  }
})
```

If the picsum URL fails (some environments block external fetches), use the
upload session fallback:

1. `contentful_create_upload_session` → get `uploadHandle` + `uploadUrl`
2. PUT raw bytes to `https://mcp.contentful.com{uploadUrl}` with
   `Content-Length` header
3. `contentful_upload_asset` with `file: { uploadHandle: "..." }`

Note the returned `sys.id` — you need it for step 3.

### Step 2: Publish each asset

Do this one at a time (bulk array currently fails):

```jsonc
contentful_publish_asset({
  spaceId: "k91pamz6ke36",
  environmentId: "master",
  assetId: "5V4EZEcTd5ydNEPIB3jG6y"  // from step 1
})
```

### Step 3: Create the entry with a placeholder body

The `guide` content type requires `body`. Create the entry with a minimal
document to satisfy the requirement:

```jsonc
contentful_create_entry({
  spaceId: "k91pamz6ke36",
  environmentId: "master",
  contentTypeId: "guide",
  fields: {
    title: { "en-US": "How to prepare for studying abroad" },
    slug: { "en-US": "how-to-prepare-for-studying-abroad" },
    readTime: { "en-US": 10 },
    excerpt: { "en-US": "A practical checklist for the months before you leave." },
    publishedAt: { "en-US": "2026-09-19" },
    body: {
      "en-US": {
        "nodeType": "document",
        "data": {},
        "content": [
          {
            "nodeType": "paragraph",
            "data": {},
            "content": [
              { "nodeType": "text", "value": "placeholder", "marks": [], "data": {} }
            ]
          }
        ]
      }
    }
  }
})
```

Note the entry ID returned (e.g. `7yPmn2ANqrdLrTqPL1l0Xl`) and the version.

### Step 4: Update with the full rich-text body

Fetch the current version with `contentful_get_entry`, then update:

```jsonc
contentful_update_entry({
  spaceId: "k91pamz6ke36",
  environmentId: "master",
  entryId: "7yPmn2ANqrdLrTqPL1l0Xl",
  version: 1,  // from get_entry
  fields: {
    body: {
      "en-US": {
        "nodeType": "document",
        "data": {},
        "content": [
          // ... full rich text document (see section below)
        ]
      }
    }
  }
})
```

### Step 5: Publish the entry

```jsonc
contentful_publish_entry({
  spaceId: "k91pamz6ke36",
  environmentId: "master",
  entryId: "7yPmn2ANqrdLrTqPL1l0Xl"
})
```

### Step 6: Verify

```jsonc
contentful_get_entry({ ..., entryId: "7yPmn2ANqrdLrTqPL1l0Xl" })
contentful_resolve_entry_references({ ..., entryId: "7yPmn2ANqrdLrTqPL1l0Xl" })
```

---

## Rich-text reference

Contentful Rich Text is a JSON document with a tree of typed nodes. The
structure follows the
[Contentful Rich Text specification](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/rich-text).

### Document structure

```
document (root)
  ├── paragraph
  │     └── text (with optional marks)
  ├── heading-1 … heading-6
  │     └── text
  ├── unordered-list
  │     └── list-item
  │           └── paragraph → text
  ├── ordered-list
  │     └── list-item
  │           └── paragraph → text
  ├── blockquote
  │     └── paragraph → text
  ├── table
  │     └── table-row
  │           └── table-header-cell | table-cell
  │                 └── paragraph → text
  ├── hr
  ├── embedded-asset-block
  │     data.target = { sys: { type: "Link", linkType: "Asset", id: "..." } }
  ├── embedded-entry-block
  │     data.target = { sys: { type: "Link", linkType: "Entry", id: "..." } }
  └── hyperlink
        data.uri = "https://..."
        content = [text]
```

### Marks (inline formatting)

Marks are applied to `text` nodes via the `marks` array:

| Mark | Effect |
| --- | --- |
| `{ "type": "bold" }` | **Bold** |
| `{ "type": "italic" }` | *Italic* |
| `{ "type": "underline" }` | Underline |
| `{ "type": "code" }` | `Inline code` |
| `{ "type": "superscript" }` | Superscript |
| `{ "type": "subscript" }` | Subscript |

Example — bold + italic text:

```json
{ "nodeType": "text", "value": "important", "marks": [{ "type": "bold" }, { "type": "italic" }], "data": {} }
```

### Hyperlinks

Inline links inside a paragraph:

```json
{
  "nodeType": "hyperlink",
  "data": { "uri": "https://www.numbeo.com/cost-of-living/" },
  "content": [
    { "nodeType": "text", "value": "Numbeo Cost of Living", "marks": [], "data": {} }
  ]
}
```

### Embedded images

Reference an uploaded asset by its Contentful `sys.id`:

```json
{
  "nodeType": "embedded-asset-block",
  "data": {
    "target": {
      "sys": {
        "type": "Link",
        "linkType": "Asset",
        "id": "5V4EZEcTd5ydNEPIB3jG6y"
      }
    }
  },
  "content": []
}
```

**Critical:** always include `"content": []` — see golden rule #6.

### Minimal complete skeleton

```json
{
  "nodeType": "document",
  "data": {},
  "content": [
    {
      "nodeType": "paragraph",
      "data": {},
      "content": [
        { "nodeType": "text", "value": "Hello world.", "marks": [], "data": {} }
      ]
    }
  ]
}
```

---

## Tool reference (MCP calls at a glance)

| Operation | Tool | Key params | Notes |
| --- | --- | --- | --- |
| Upload image | `contentful_upload_asset` | `spaceId`, `environmentId`, `title`, `file.fileName`, `file.contentType`, `file.upload` (public URL) | Returns draft asset with `sys.id` |
| Publish asset | `contentful_publish_asset` | `spaceId`, `environmentId`, `assetId` (string) | One at a time; array fails |
| Create entry | `contentful_create_entry` | `spaceId`, `environmentId`, `contentTypeId`, `fields` | Locale-wrapped; returns draft |
| Get entry | `contentful_get_entry` | `spaceId`, `environmentId`, `entryId` | Use version for updates |
| Update entry | `contentful_update_entry` | `spaceId`, `environmentId`, `entryId`, `version`, `fields` | Locale-wrapped; requires version |
| Publish entry | `contentful_publish_entry` | `spaceId`, `environmentId`, `entryId` (string) | Must follow create/update |
| Resolve refs | `contentful_resolve_entry_references` | `spaceId`, `environmentId`, `entryId`, `include` (1-10) | Walks linked entries/assets |
| Delete entry | `contentful_delete_entry` | `spaceId`, `environmentId`, `entryId` | Two-phase: preview then confirm |
| List entries | `contentful_search_entries` | `spaceId`, `environmentId`, `query` | Supports filtering, pagination |
| Semantic search | `contentful_semantic_search` | `spaceId`, `environmentId`, `query` | Natural-language entry lookup |

---

## Using the SDK for large payloads

When an MCP tool call truncates because the LLM output is too large, use the
`contentful-management` SDK directly in a Node.js script. The SDK runs outside
the LLM's token budget, so there is no truncation.

`contentful-management` v12 is already in `devDependencies`.

```js
// scripts/update-guide-body.mjs
import { createClient } from "contentful-management";
import { readFileSync } from "fs";

const SPACE_ID = "k91pamz6ke36";
const ENV_ID = "master";
const ENTRY_ID = "your-entry-id";

// Read token from .env.local
const envText = readFileSync(".env.local", "utf-8");
const cmaToken = envText
  .split("\n")
  .find((l) => l.startsWith("CONTENTFUL_MANAGEMENT_TOKEN="))
  ?.split("=")[1]
  .trim();

const client = createClient({ accessToken: cmaToken });
const base = { spaceId: SPACE_ID, environmentId: ENV_ID };

// Read the large body from a JSON file
const body = JSON.parse(readFileSync("./my-large-body.json", "utf-8"));

// Get current entry (required for version)
const entry = await client.entry.get({ ...base, entryId: ENTRY_ID });

// Update
entry.fields.body = { "en-US": body };
const updated = await client.entry.update(
  { ...base, entryId: ENTRY_ID },
  entry,
);

// Publish
const published = await client.entry.publish(
  { ...base, entryId: ENTRY_ID },
  updated,
);

console.log(`Published! Version: ${published.sys.version}`);
```

Note: the SDK uses a flat params pattern — `client.entry.get({ spaceId,
environmentId, entryId })` — not the chained `space.getEnvironment()` pattern
from older versions.

---

## Troubleshooting

| Error | Cause | Fix |
| --- | --- | --- |
| `422 Validation error: required at fields.body.en-US.content[N].content` | `embedded-asset-block` (or other block node) missing `content` array | Add `"content": []` to the node |
| `400 Bad Request: Invalid resource id` (publish) | Passed an array of asset IDs to `contentful_publish_asset` | Publish each asset individually |
| `JSON Parse error: Unexpected EOF` | Payload too large; truncated by the tool layer | Create with placeholder, then update with full content |
| `socket closed` (during create) | Same as above — payload exceeded tool size limit | Split into create (small) + update (large) |
| Update rejected / version conflict | Stale `version` in `contentful_update_entry` | Re-fetch with `contentful_get_entry` and use the new version |
| Content not appearing on the site | Entry/asset is still a draft | Call `contentful_publish_entry` or `contentful_publish_asset` |
| `InvalidEntry` / fields validation error | Field value not locale-wrapped | Wrap every value: `{ "en-US": value }` |
| Rich-text image not rendering | Asset reference uses wrong ID or asset not published | Use the `sys.id` returned by `contentful_upload_asset`; ensure the asset is published |
| `422 Validation error: "table" is not one of the allowed node types` | Content type Rich Text field missing `table` in `enabledNodeTypes` | Add `enabledNodeTypes` validation to the content type (see golden rule #9) |
| `422 Validation error: ambiguous node types` | `enabledNodeTypes` and `enabledMarks` combined in one validation object | Split into two separate validation objects (see golden rule #9) |

---

## Comparison: MCP vs seed script

| Aspect | MCP (`opencode.json`) | Seed script (`pnpm contentful:seed`) |
| --- | --- | --- |
| Auth | Remote MCP server (pre-configured) | `CONTENTFUL_MANAGEMENT_TOKEN` in `.env.local` |
| Entry creation | `contentful_create_entry` (locale-wrapped) | `client.entry.createWithId()` (locale-wrapped) |
| Asset upload | `contentful_upload_asset` (`file.upload` URL) | `client.asset.createWithId()` + `processForAllLocales()` |
| Asset IDs | Contentful auto-generates (`5V4...`) | Custom IDs (`asset-{slug}`) via `createWithId` |
| Publish | Separate step per item | `client.entry.publish()` / `client.asset.publish()` inline |
| Idempotency | Manual (check with `get_entry` before create) | Built-in get-or-create pattern |
| Rich text | Same JSON format; must include `content: []` on all blocks | Same format; `image()` helper includes `content: []` |
| Best for | One-off edits, adding content from chat, exploring | Bulk seeding, reproducible setups, CI/CD |
