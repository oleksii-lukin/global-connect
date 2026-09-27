import { config } from "dotenv";
import { createClient } from "contentful-management";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { BLOCKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import {
  seedCities,
  seedHomepageSections,
  seedInterests,
  seedOpportunities,
  seedPartners,
  seedPathSteps,
  seedSessions,
  seedStories,
  seedGuides,
  seedVideos,
} from "../src/lib/contentful/seed";
import { FALLBACK_COMMUNITY_URL } from "../src/lib/community";

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
      if (node.nodeType === BLOCKS.EMBEDDED_ENTRY) {
        const target = node.data.target as { sys?: { id?: string } } | undefined;
        if (target?.sys?.id) {
          node.data.target = {
            sys: { type: "Link", linkType: "Entry", id: target.sys.id },
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

async function uploadLocalAsset(
  assetId: string,
  filePath: string,
  title: string,
) {
  const base = { spaceId: SPACE, environmentId: ENV, assetId };
  try {
    await client.asset.get(base);
    console.log("asset exists", assetId);
    return;
  } catch {
    // not found — create below
  }
  const fileBytes = fs.readFileSync(filePath);
  const contentType =
    filePath.endsWith(".png") ? "image/png" : "image/jpeg";
  const fileName = path.basename(filePath);
  const upload = await client.upload.create(
    { spaceId: SPACE, environmentId: ENV },
    { file: fileBytes.buffer.slice(fileBytes.byteOffset, fileBytes.byteOffset + fileBytes.byteLength) },
  );
  const asset = await client.asset.createWithId(base, {
    fields: {
      title: { "en-US": title },
      file: {
        "en-US": {
          contentType,
          fileName,
          uploadFrom: {
            sys: {
              type: "Link",
              linkType: "Upload",
              id: upload.sys.id,
            },
          },
        },
      },
    },
  });
  const processed = await client.asset.processForAllLocales(base, asset);
  await client.asset.publish(base, processed);
  console.log("uploaded local asset", assetId);
}

// ---------------------------------------------------------------------------
// Entry upsert
// ---------------------------------------------------------------------------

async function upsert(
  type: string,
  id: string,
  fields: Record<string, Record<"en-US", unknown>>,
): Promise<boolean> {
  const base = { spaceId: SPACE, environmentId: ENV };
  try {
    const existing = await client.entry.get({ ...base, entryId: id });
    const updated = await client.entry.update(
      { ...base, entryId: id },
      { ...existing, fields },
    );
    await client.entry.publish({ ...base, entryId: id }, updated);
    console.log("updated", type, id);
    return true;
  } catch (err) {
    const e = err as { sys?: { id?: string }; name?: string } | undefined;
    if (e?.sys?.id !== "NotFound" && e?.name !== "NotFound") {
      console.error(`✗ ${type} ${id}:`, err);
      return false;
    }
  }
  try {
    const created = await client.entry.createWithId(
      { ...base, entryId: id, contentTypeId: type },
      { fields },
    );
    await client.entry.publish({ ...base, entryId: id }, created);
    console.log("created", type, id);
    return true;
  } catch (err) {
    console.error(`✗ ${type} ${id}:`, err);
    return false;
  }
}

async function main(): Promise<void> {
  const base = { spaceId: SPACE, environmentId: ENV };
  const failures: string[] = [];
  const CONTENT_TYPE_IDS = [
    "opportunity",
    "session",
    "guide",
    "story",
    "partner",
    "pathStep",
    "interest",
    "siteSettings",
    "city",
    "homepageSection",
    "video",
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
    const ok = await upsert("opportunity", o.id, {
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
    if (!ok) failures.push(`opportunity:${o.id}`);
  }

  for (const s of seedSessions) {
    const ok = await upsert("session", s.id, {
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
    if (!ok) failures.push(`session:${s.id}`);
  }

  for (const v of seedVideos) {
    const ok = await upsert("video", v.id, {
      title: { "en-US": v.title },
      videoUrl: { "en-US": v.videoUrl },
      ...(v.caption ? { caption: { "en-US": v.caption } } : {}),
    });
    if (!ok) failures.push(`video:${v.id}`);
  }

  for (const g of seedGuides) {
    for (const assetId of collectAssetIds(g.body)) {
      await uploadAsset(assetId, g.title);
    }
    const ok = await upsert("guide", g.id, {
      title: { "en-US": g.title },
      slug: { "en-US": g.slug },
      readTime: { "en-US": g.readTime },
      excerpt: { "en-US": g.excerpt },
      body: { "en-US": toContentfulBody(g.body) },
      ...(g.publishedAt ? { publishedAt: { "en-US": g.publishedAt } } : {}),
    });
    if (!ok) failures.push(`guide:${g.id}`);
  }

  for (const st of seedStories) {
    const ok = await upsert("story", st.id, {
      quote: { "en-US": st.quote },
      name: { "en-US": st.name },
      location: { "en-US": st.location },
      role: { "en-US": st.role },
      approved: { "en-US": true },
    });
    if (!ok) failures.push(`story:${st.id}`);
  }

  for (const p of seedPartners) {
    const ok = await upsert("partner", p.id, { name: { "en-US": p.name } });
    if (!ok) failures.push(`partner:${p.id}`);
  }

  for (const s of seedPathSteps) {
    const ok = await upsert("pathStep", s.id, {
      stepNumber: { "en-US": s.stepNumber },
      title: { "en-US": s.title },
      description: { "en-US": s.description },
    });
    if (!ok) failures.push(`pathStep:${s.id}`);
  }

  for (const c of seedInterests) {
    const ok = await upsert("interest", c.id, {
      label: { "en-US": c.label },
      emoji: { "en-US": c.emoji },
    });
    if (!ok) failures.push(`interest:${c.id}`);
  }

  // Site Settings: reuse existing singleton, create "seed-site-settings" only if none exists
  {
    const base = { spaceId: SPACE, environmentId: ENV };
    // Try the known IDs first, then fall back to creating with the standard seed ID
    const candidateIds = ["seed-site-settings", "cfKUwgvtwk17fFhbVxHP6"];
    let settingsId: string | undefined;
    for (const id of candidateIds) {
      try {
        await client.entry.get({ ...base, entryId: id });
        settingsId = id;
        break;
      } catch {
        // not found
      }
    }
    if (!settingsId) settingsId = "seed-site-settings";
    try {
      const entry = await client.entry.get({ ...base, entryId: settingsId });
      const updated = await client.entry.update(
        { ...base, entryId: settingsId },
        { ...entry, fields: { communityUrl: { "en-US": FALLBACK_COMMUNITY_URL } } },
      );
      await client.entry.publish({ ...base, entryId: settingsId }, updated);
      console.log("updated siteSettings", settingsId);
    } catch {
      const created = await client.entry.createWithId(
        { ...base, entryId: settingsId, contentTypeId: "siteSettings" },
        { fields: { communityUrl: { "en-US": FALLBACK_COMMUNITY_URL } } },
      );
      await client.entry.publish({ ...base, entryId: settingsId }, created);
      console.log("created siteSettings", settingsId);
    }
  }

  for (const c of seedCities) {
    const ok = await upsert("city", c.id, {
      initials: { "en-US": c.initials },
      city: { "en-US": c.city },
      order: { "en-US": c.order },
    });
    if (!ok) failures.push(`city:${c.id}`);
  }

  // Homepage sections — upload local images then upsert entries
  const homepageImages: [string, string, string][] = [
    ["asset-homepage-hero", "public/hero-youth.jpg", "Hero section image"],
    [
      "asset-homepage-sessions",
      "public/session-online.jpg",
      "Sessions section image",
    ],
    [
      "asset-homepage-community",
      "public/community-circle.jpg",
      "Community section image",
    ],
  ];
  for (const [id, file, title] of homepageImages) {
    await uploadLocalAsset(id, file, title);
  }

  for (const key of Object.keys(seedHomepageSections) as Array<
    keyof typeof seedHomepageSections
  >) {
    const s = seedHomepageSections[key];
    const fields: Record<string, { "en-US": unknown }> = {
      section: { "en-US": s.section },
      enabled: { "en-US": s.enabled },
    };
    if (s.eyebrow) fields.eyebrow = { "en-US": s.eyebrow };
    if (s.title) fields.title = { "en-US": s.title };
    if (s.description) fields.description = { "en-US": s.description };
    if (s.imageAlt) fields.imageAlt = { "en-US": s.imageAlt };
    if (s.imageUrl && s.imageUrl.startsWith("/")) {
      // Map local fallback URLs to uploaded asset IDs
      const imageMap: Record<string, string> = {
        "/hero-youth.jpg": "asset-homepage-hero",
        "/session-online.jpg": "asset-homepage-sessions",
        "/community-circle.jpg": "asset-homepage-community",
      };
      const assetId = imageMap[s.imageUrl];
      if (assetId) {
        fields.image = {
          "en-US": {
            sys: { type: "Link", linkType: "Asset", id: assetId },
          },
        };
      }
    }
    const ok = await upsert("homepageSection", s.id, fields);
    if (!ok) failures.push(`homepageSection:${s.id}`);
  }

  console.log("Seeding complete.");
  if (failures.length > 0) {
    console.error(`\n${failures.length} entries failed to seed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
