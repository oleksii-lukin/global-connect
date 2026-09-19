import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    cms: {
      stale: 24 * 60 * 60, // serve stale while revalidating for up to 24h
      revalidate: 15 * 60, // check Contentful for new content every 15 min
      expire: 30 * 24 * 60 * 60, // drop old cached content after 30 days
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
};

export default nextConfig;