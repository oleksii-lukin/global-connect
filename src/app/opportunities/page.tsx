import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/page-header";
import { OpportunityFinder } from "@/components/sections/opportunity-finder";
import { getOpportunities } from "@/lib/contentful/queries";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Browse exchanges, scholarships, conferences and volunteering opportunities for young people worldwide.",
};

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border/70 bg-card/40">
          <PageHeader
            eyebrow="Opportunity finder"
            title="Find an opportunity that's actually for you."
            description="Exchanges, scholarships, conferences and volunteering for young people around the world."
          />
        </div>
        <OpportunityFinder opportunities={opportunities} />
      </main>
      <SiteFooter />
    </>
  );
}