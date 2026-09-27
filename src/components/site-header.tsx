import { getSiteSettings } from "@/lib/contentful/queries";
import { SiteHeaderNav } from "@/components/site-header-nav";

export async function SiteHeader() {
  const { communityUrl } = await getSiteSettings();
  return <SiteHeaderNav communityUrl={communityUrl} />;
}
