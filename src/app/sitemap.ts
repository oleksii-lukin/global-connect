import type { MetadataRoute } from "next";
import { getGuides, getOpportunities, getSessions } from "@/lib/contentful/queries";

const BASE_URL = "https://global-connect-woad.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [guides, opportunities, sessions] = await Promise.all([
    getGuides(),
    getOpportunities(),
    getSessions(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/opportunities`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/sessions`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/community`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: guide.publishedAt ? new Date(guide.publishedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const opportunityPages: MetadataRoute.Sitemap = opportunities.map((opp) => ({
    url: `${BASE_URL}/opportunities/${opp.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const sessionPages: MetadataRoute.Sitemap = sessions.map((session) => ({
    url: `${BASE_URL}/sessions/${session.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...guidePages, ...opportunityPages, ...sessionPages];
}
