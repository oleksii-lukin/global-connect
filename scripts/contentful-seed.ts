import { config } from "dotenv";
import { createClient } from "contentful-management";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { BLOCKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import {
  seedCommunity,
  seedInterests,
  seedOpportunities,
  seedPartners,
  seedPathSteps,
  seedSessions,
  seedStories,
  seedGuides,
} from "../src/lib/contentful/seed";

config({ path: ".env.local" });
config({ path: ".env" });

const SPACE = process.env.CONTENTFUL_SPACE_ID!;
const ENV = process.env.CONTENTFUL_ENVIRONMENT || "master";

// Prefer the env var; fall back to the stored `contentful login` session so a
// plain `contentful login` works without copy-pasting the token.
let TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
if (!TOKEN) {
  try {
    const rcPath =
      process.env.CONTENTFUL_CONFIG_FILE ||
      path.join(os.homedir(), ".contentfulrc.json");
    const rc = JSON.parse(fs.readFileSync(rcPath, "utf8"));
    TOKEN = rc.managementToken;
  } catch {
    // ignore — validated below
  }
}

if (!SPACE || !TOKEN) {
  console.error(
    "Missing CONTENTFUL_SPACE_ID / CONTENTFUL_MANAGEMENT_TOKEN. See contentful/README.md.",
  );
  process.exit(1);
}

// Plain client (default in contentful-management v12) — the legacy nested
// client is deprecated. Calls are parameter-based: client.entry.get({ ... }).
const client = createClient({ accessToken: TOKEN });

// ---------------------------------------------------------------------------
// Rich-text helpers (shared with the bundled seed)
// ---------------------------------------------------------------------------

type RTNode = {
  nodeType: string;
  data: Record<string, unknown>;
  content: RTNode[];
};

function collectAssetIds(doc: Document | undefined): string[] {
  const ids: string[] = [];
  const walk = (nodes: RTNode[]) => {
    for (const node of nodes) {
      if (node.nodeType === BLOCKS.EMBEDDED_ASSET) {
        const target = node.data.target as { sys?: { id?: string } } | undefined;
        if (target?.sys?.id) ids.push(target.sys.id);
      }
      if (Array.isArray(node.content)) walk(node.content);
    }
  };
  if (doc) walk(doc.content as RTNode[]);
  return ids;
}

/** Rewrite inline asset objects into Asset Links for the CMS (images are
 *  uploaded separately by assetId). */
function toContentfulBody(doc: Document | undefined): Document | undefined {
  if (!doc) return undefined;
  const clone = structuredClone(doc) as Document & { content: RTNode[] };
  const walk = (nodes: RTNode[]) => {
    for (const node of nodes) {
      if (node.nodeType === BLOCKS.EMBEDDED_ASSET) {
        const target = node.data.target as { sys?: { id?: string } } | undefined;
        if (target?.sys?.id) {
          node.data.target = {
            sys: { type: "Link", linkType: "Asset", id: target.sys.id },
          };
        }
      }
      if (Array.isArray(node.content)) walk(node.content);
    }
  };
  walk(clone.content);
  return clone;
}

// ---------------------------------------------------------------------------
// Asset upload (idempotent: get-or-create + process + publish)
// ---------------------------------------------------------------------------

async function uploadAsset(assetId: string, title: string) {
  const base = { spaceId: SPACE, environmentId: ENV, assetId };
  try {
    await client.asset.get(base);
    console.log("asset exists", assetId);
    return;
  } catch {
    // not found — create below
  }
  const uploadUrl = `https://picsum.photos/seed/${assetId}/1600/1000`;
  const asset = await client.asset.createWithId(base, {
    fields: {
      title: { "en-US": title },
      file: {
        "en-US": {
          contentType: "image/jpeg",
          fileName: `${assetId}.jpg`,
          upload: uploadUrl,
        },
      },
    },
  });
  const processed = await client.asset.processForAllLocales(base, asset);
  await client.asset.publish(base, processed);
  console.log("uploaded asset", assetId);
}

// ---------------------------------------------------------------------------
// Entry upsert
// ---------------------------------------------------------------------------

async function upsert(
  type: string,
  id: string,
  fields: Record<string, Record<"en-US", unknown>>,
): Promise<void> {
  const base = { spaceId: SPACE, environmentId: ENV };
  try {
    const existing = await client.entry.get({ ...base, entryId: id });
    const updated = await client.entry.update(
      { ...base, entryId: id },
      { ...existing, fields },
    );
    await client.entry.publish({ ...base, entryId: id }, updated);
    console.log("updated", type, id);
    return;
  } catch (err) {
    const e = err as { sys?: { id?: string }; name?: string } | undefined;
    if (e?.sys?.id !== "NotFound" && e?.name !== "NotFound") throw err;
  }
  const created = await client.entry.createWithId(
    { ...base, entryId: id, contentTypeId: type },
    { fields },
  );
  await client.entry.publish({ ...base, entryId: id }, created);
  console.log("created", type, id);
}

async function main(): Promise<void> {
  const base = { spaceId: SPACE, environmentId: ENV };
  const CONTENT_TYPE_IDS = [
    "opportunity",
    "session",
    "guide",
    "story",
    "partner",
    "pathStep",
    "interest",
    "community",
  ];

  // Content types must be published before their entries appear in the Delivery API.
  for (const id of CONTENT_TYPE_IDS) {
    try {
      const ct = await client.contentType.get({ ...base, contentTypeId: id });
      await client.contentType.publish({ ...base, contentTypeId: id }, ct);
      console.log("published content type", id);
    } catch (err) {
      console.error(`Could not publish content type ${id}:`, err);
      process.exit(1);
    }
  }

  for (const o of seedOpportunities) {
    for (const assetId of collectAssetIds(o.longDescription)) {
      await uploadAsset(assetId, o.title);
    }
    await upsert("opportunity", o.id, {
      title: { "en-US": o.title },
      slug: { "en-US": o.slug },
      country: { "en-US": o.country },
      countryFlag: { "en-US": o.countryFlag },
      type: { "en-US": o.type },
      description: { "en-US": o.description },
      ageRange: { "en-US": o.ageRange },
      funding: { "en-US": o.funding },
      deadline: { "en-US": o.deadline },
      tags: { "en-US": o.tags },
      featured: { "en-US": o.featured },
      order: { "en-US": o.order },
      ...(o.longDescription
        ? { longDescription: { "en-US": toContentfulBody(o.longDescription) } }
        : {}),
    });
  }

  for (const s of seedSessions) {
    await upsert("session", s.id, {
      title: { "en-US": s.title },
      slug: { "en-US": s.slug },
      icon: { "en-US": s.icon },
      description: { "en-US": s.description },
      duration: { "en-US": s.duration },
      difficulty: { "en-US": s.difficulty },
      online: { "en-US": s.online },
      upcoming: { "en-US": s.upcoming },
      order: { "en-US": s.order },
    });
  }

  for (const g of seedGuides) {
    for (const assetId of collectAssetIds(g.body)) {
      await uploadAsset(assetId, g.title);
    }
    await upsert("guide", g.id, {
      title: { "en-US": g.title },
      slug: { "en-US": g.slug },
      readTime: { "en-US": g.readTime },
      excerpt: { "en-US": g.excerpt },
      body: { "en-US": toContentfulBody(g.body) },
      ...(g.publishedAt ? { publishedAt: { "en-US": g.publishedAt } } : {}),
    });
  }

  for (const st of seedStories) {
    await upsert("story", st.id, {
      quote: { "en-US": st.quote },
      name: { "en-US": st.name },
      location: { "en-US": st.location },
      role: { "en-US": st.role },
      approved: { "en-US": true },
    });
  }

  for (const p of seedPartners) {
    await upsert("partner", p.id, { name: { "en-US": p.name } });
  }

  for (const s of seedPathSteps) {
    await upsert("pathStep", s.id, {
      stepNumber: { "en-US": s.stepNumber },
      title: { "en-US": s.title },
      description: { "en-US": s.description },
    });
  }

  for (const i of seedInterests) {
    await upsert("interest", i.id, {
      label: { "en-US": i.label },
      emoji: { "en-US": i.emoji },
    });
  }

  for (const c of seedCommunity) {
    await upsert("community", c.id, {
      emoji: { "en-US": c.emoji },
      label: { "en-US": c.label },
      members: { "en-US": c.members },
    });
  }

  console.log("Seeding complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
