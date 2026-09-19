import "server-only";
import { createClient, type ContentfulClientApi } from "contentful";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;
const previewActive = process.env.CONTENTFUL_PREVIEW_ACTIVE === "true";

let client: ContentfulClientApi<undefined> | null = null;

/**
 * Returns a Contentful Delivery (or Preview) API client.
 * Throws immediately if Contentful env vars are missing so the error
 * propagates and the Next.js cache can serve stale data during outages.
 */
export function getContentfulClient(): ContentfulClientApi<undefined> {
  if (!spaceId || !accessToken) {
    throw new Error(
      "Contentful is not configured. Set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN in your .env.local file.",
    );
  }

  if (client) {
    return client;
  }

  const usePreview = previewActive && previewToken;

  client = createClient({
    space: spaceId,
    accessToken: usePreview ? previewToken! : accessToken,
    host: usePreview ? "preview.contentful.com" : undefined,
  });

  return client;
}