#!/usr/bin/env node
import { config } from "dotenv";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

config({ path: path.join(root, ".env.local") });
config({ path: path.join(root, ".env") });

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_MANAGEMENT_TOKEN,
  CONTENTFUL_ENVIRONMENT = "master",
} = process.env;

if (!CONTENTFUL_SPACE_ID) {
  console.error("Missing CONTENTFUL_SPACE_ID. See contentful/README.md (step 3).");
  process.exit(1);
}
if (!CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error(
    "Missing CONTENTFUL_MANAGEMENT_TOKEN. Set it in .env.local (see contentful/README.md).",
  );
  process.exit(1);
}

const bin = path.join(root, "node_modules", ".bin", "contentful");
if (!existsSync(bin)) {
  console.error("contentful-cli is not installed. Run `pnpm install` first.");
  process.exit(1);
}

// Create a temp rc file so the CLI uses our CFPAT instead of the stale
// ~/.contentfulrc.json session.  The CLI reads CONTENTFUL_CONFIG_FILE.
const tmpDir = path.join(os.tmpdir(), "global-connect-import");
mkdirSync(tmpDir, { recursive: true });
const rcPath = path.join(tmpDir, ".contentfulrc.json");
writeFileSync(
  rcPath,
  JSON.stringify({
    managementToken: CONTENTFUL_MANAGEMENT_TOKEN,
    activeSpaceId: CONTENTFUL_SPACE_ID,
    activeEnvironmentId: CONTENTFUL_ENVIRONMENT,
    host: "api.contentful.com",
  }),
);

const result = spawnSync(
  bin,
  [
    "space",
    "import",
    "--space-id",
    CONTENTFUL_SPACE_ID,
    "--environment-id",
    CONTENTFUL_ENVIRONMENT,
    "--content-file",
    path.join(root, "contentful", "content-model.json"),
    "--content-model-only",
  ],
  {
    cwd: root,
    stdio: ["inherit", "pipe", "pipe"],
    env: { ...process.env, CONTENTFUL_CONFIG_FILE: rcPath },
  },
);

const stdout = result.stdout?.toString() ?? "";
const stderr = result.stderr?.toString() ?? "";
const output = stdout + stderr;
const hadTimelineNotice =
  /Timeline \(Releases\) is not enabled for this organization/.test(output);
const hadRealError = /ValidationFailed|unauthorized/i.test(output);

process.stdout.write(stdout);
process.stderr.write(stderr);

if (result.status !== 0 && hadTimelineNotice && !hadRealError) {
  console.log(
    "\n✓ Content model imported. (Ignored the harmless 'Timeline (Releases) is not enabled' notice.)",
  );
  process.exit(0);
}
process.exit(result.status ?? 1);
