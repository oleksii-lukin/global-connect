import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OpportunityFinder } from "@/components/sections/opportunity-finder";
import { getHomepageSections, getOpportunities } from "@/lib/contentful/queries";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Browse exchanges, scholarships, conferences and volunteering opportunities for young people worldwide.",
};

export default async function OpportunitiesPage() {
  const [opportunities, homepageSections] = await Promise.all([
    getOpportunities(),
    getHomepageSections(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <OpportunityFinder opportunities={opportunities} config={homepageSections.opportunityFinder} />
      </main>
      <SiteFooter />
    </>
  );
}