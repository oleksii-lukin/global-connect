import "server-only";
import { createClient, type ContentfulClientApi } from "contentful";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;
const previewActive = process.env.CONTENTFUL_PREVIEW_ACTIVE === "true";

export const contentfulEnabled = Boolean(spaceId && accessToken);

let client: ContentfulClientApi<undefined> | null = null;

/**
 * Returns a Contentful Delivery (or Preview) API client.
 * Returns `null` when Contentful isn't configured so the app can
 * gracefully fall back to bundled seed data.
 */
export function getContentfulClient(): ContentfulClientApi<undefined> | null {
  if (!contentfulEnabled) {
    return null;
  }

  if (client) {
    return client;
  }

  const usePreview = previewActive && previewToken;

  client = createClient({
    space: spaceId as string,
    accessToken: usePreview ? previewToken! : accessToken!,
    host: usePreview ? "preview.contentful.com" : undefined,
  });

  return client;
}