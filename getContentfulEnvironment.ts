import { config } from "dotenv";
import { createClient } from "contentful-management";
import type { EnvironmentGetter } from "contentful-typescript-codegen";

config({ path: ".env.local" });
config({ path: ".env" });

const {
  CONTENTFUL_MANAGEMENT_TOKEN,
  CONTENTFUL_SPACE_ID,
} = process.env as Record<string, string>;

const getContentfulEnvironment: EnvironmentGetter = async () => {
  if (!CONTENTFUL_MANAGEMENT_TOKEN || !CONTENTFUL_SPACE_ID) {
    throw new Error(
      "Missing CONTENTFUL_MANAGEMENT_TOKEN or CONTENTFUL_SPACE_ID. See contentful/README.md",
    );
  }

  const client = createClient(
    { accessToken: CONTENTFUL_MANAGEMENT_TOKEN },
    { type: "legacy" },
  );

  const space = await client.getSpace(CONTENTFUL_SPACE_ID);

  return space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT ?? "master");
};

export default getContentfulEnvironment;