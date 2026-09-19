import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Asset, UnresolvedLink } from "contentful";
import type { ContentfulClientApi } from "contentful";
import { getContentfulClient } from "./client";
import {
  seedCommunity,
  seedGuides,
  seedHomepageSections,
  seedInterests,
  seedOpportunities,
  seedPartners,
  seedPathSteps,
  seedSessions,
  seedStories,
} from "./seed";
import type {
  Community,
  CommunitySkeleton,
  Guide,
  GuideSkeleton,
  HomepageSection,
  HomepageSectionSkeleton,
  Interest,
  InterestSkeleton,
  Opportunity,
  OpportunitySkeleton,
  Partner,
  PartnerSkeleton,
  PathStep,
  PathStepSkeleton,
  Session,
  SessionSkeleton,
  Story,
  StorySkeleton,
} from "@/types/contentful";
import type {
  CommunityData,
  GuideData,
  HomepageSectionData,
  HomepageSectionKey,
  InterestData,
  OpportunityData,
  PartnerData,
  PathStepData,
  SessionData,
  StoryData,
} from "@/types/models";

type ResolvedAssetLink =
  | UnresolvedLink<"Asset">
  | Asset<undefined, "en-US">
  | undefined;

function assetUrl(asset: ResolvedAssetLink): string | undefined {
  if (!asset || !("fields" in asset)) return undefined;
  const url = asset.fields.file?.url;
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return items
    .filter((item) => Number.isFinite(item.order))
    .sort((a, b) => a.order - b.order);
}

function mapOpportunity(entry: Opportunity): OpportunityData {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    country: fields.country ?? "",
    countryFlag: fields.countryFlag ?? "🌍",
    type: fields.type ?? "Opportunity",
    description: fields.description,
    ageRange: fields.ageRange ?? "Ages 15–21",
    funding: fields.funding ?? "Free",
    deadline: fields.deadline ?? "Rolling",
    tags: fields.tags ?? [],
    imageUrl: assetUrl(fields.image),
    imageAlt: fields.title,
    featured: fields.featured ?? false,
    order: fields.order ?? Number.MAX_SAFE_INTEGER,
    longDescription: fields.longDescription,
  };
}

function mapSession(entry: Session): SessionData {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    icon: fields.icon ?? "🌍",
    description: fields.description,
    duration: fields.duration ?? "60 min",
    difficulty: fields.difficulty ?? "All levels",
    online: fields.online ?? true,
    registerUrl: fields.registerUrl,
    upcoming: fields.upcoming ?? true,
    order: fields.order ?? Number.MAX_SAFE_INTEGER,
  };
}

function mapGuide(entry: Guide): GuideData {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    readTime: fields.readTime ?? 5,
    excerpt: fields.excerpt ?? "",
    body: fields.body,
    publishedAt: fields.publishedAt,
  };
}

function mapStory(entry: Story): StoryData {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    quote: fields.quote,
    name: fields.name,
    location: fields.location ?? "",
    role: fields.role ?? "Global Connect Member",
  };
}

function mapPartner(entry: Partner): PartnerData {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    name: fields.name,
    logoUrl: assetUrl(fields.logo),
    logoAlt: fields.name,
    website: fields.website,
  };
}

function mapPathStep(entry: PathStep): PathStepData {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    stepNumber: fields.stepNumber,
    title: fields.title,
    description: fields.description ?? "",
  };
}

function mapInterest(entry: Interest): InterestData {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    label: fields.label,
    emoji: fields.emoji ?? "✨",
  };
}

function mapCommunity(entry: Community): CommunityData {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    emoji: fields.emoji ?? "✨",
    label: fields.label,
    members: fields.members ?? "",
  };
}

function mapHomepageSection(entry: HomepageSection): HomepageSectionData {
  const fields = entry.fields;
  return {
    id: entry.sys.id,
    section: fields.section as HomepageSectionKey,
    eyebrow: fields.eyebrow ?? undefined,
    title: fields.title ?? undefined,
    description: fields.description ?? undefined,
    imageUrl: assetUrl(fields.image),
    imageAlt: fields.imageAlt ?? undefined,
    enabled: fields.enabled ?? true,
  };
}

/**
 * Runs a Contentful query and falls back to bundled seed data on any failure
 * (missing/unpublished content type, empty space, token or network error).
 * This keeps pages rendering even when Contentful has no usable data.
 */
export async function queryOrSeed<T>(
  query: (client: ContentfulClientApi<undefined>) => Promise<T>,
  fallback: T,
): Promise<T> {
  const client = getContentfulClient();
  if (!client) return fallback;
  try {
    return await query(client);
  } catch (err) {
    console.error("[contentful] query failed, using seed data:", err);
    return fallback;
  }
}

export async function getOpportunities(): Promise<OpportunityData[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  return queryOrSeed(
      (client) =>
        client
          .getEntries<OpportunitySkeleton>({
            content_type: "opportunity",
            limit: 100,
            include: 10,
          })
          .then((r) => sortByOrder(r.items.map(mapOpportunity))),
    seedOpportunities,
  );
}

export async function getOpportunityBySlug(
  slug: string,
): Promise<OpportunityData | undefined> {
  const opportunities = await getOpportunities();
  return opportunities.find((o) => o.slug === slug);
}

export async function getSessions(): Promise<SessionData[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  return queryOrSeed(
    (client) =>
      client
        .getEntries<SessionSkeleton>({ content_type: "session", limit: 100 })
        .then((r) => sortByOrder(r.items.map(mapSession))),
    seedSessions,
  );
}

export async function getSessionBySlug(
  slug: string,
): Promise<SessionData | undefined> {
  const sessions = await getSessions();
  return sessions.find((s) => s.slug === slug);
}

export async function getGuides(): Promise<GuideData[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  return queryOrSeed(
      (client) =>
        client
          .getEntries<GuideSkeleton>({
            content_type: "guide",
            limit: 100,
            include: 10,
            order: ["-sys.createdAt"],
          })
          .then((r) => r.items.map(mapGuide)),
    seedGuides,
  );
}

export async function getGuideBySlug(
  slug: string,
): Promise<GuideData | undefined> {
  const guides = await getGuides();
  return guides.find((g) => g.slug === slug);
}

export async function getStories(): Promise<StoryData[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  return queryOrSeed(
    (client) =>
      client
        .getEntries<StorySkeleton>({ content_type: "story", limit: 100 })
        .then((r) =>
          r.items.filter((s) => s.fields.approved !== false).map(mapStory),
        ),
    seedStories,
  );
}

export async function getPartners(): Promise<PartnerData[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  return queryOrSeed(
    (client) =>
      client
        .getEntries<PartnerSkeleton>({ content_type: "partner", limit: 100 })
        .then((r) => r.items.map(mapPartner)),
    seedPartners,
  );
}

export async function getPathSteps(): Promise<PathStepData[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  return queryOrSeed(
    (client) =>
      client
        .getEntries<PathStepSkeleton>({ content_type: "pathStep", limit: 100 })
        .then((r) =>
          r.items
            .map(mapPathStep)
            .sort((a, b) => a.stepNumber - b.stepNumber),
        ),
    seedPathSteps,
  );
}

export async function getInterests(): Promise<InterestData[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  return queryOrSeed(
    (client) =>
      client
        .getEntries<InterestSkeleton>({ content_type: "interest", limit: 100 })
        .then((r) => r.items.map(mapInterest)),
    seedInterests,
  );
}

export async function getCommunityTopics(): Promise<CommunityData[]> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  return queryOrSeed(
    (client) =>
      client
        .getEntries<CommunitySkeleton>({ content_type: "community", limit: 100 })
        .then((r) => r.items.map(mapCommunity)),
    seedCommunity,
  );
}

export async function getHomepageSections(): Promise<
  Record<HomepageSectionKey, HomepageSectionData | undefined>
> {
  "use cache";
  cacheLife("cms");
  cacheTag("contentful");

  return queryOrSeed(
    (client) =>
      client
        .getEntries<HomepageSectionSkeleton>({
          content_type: "homepageSection",
          limit: 100,
          include: 10,
        })
        .then((r) => {
          const map = {} as Record<
            HomepageSectionKey,
            HomepageSectionData | undefined
          >;
          for (const item of r.items) {
            const data = mapHomepageSection(item);
            map[data.section] = data;
          }
          return map;
        }),
    seedHomepageSections,
  );
}