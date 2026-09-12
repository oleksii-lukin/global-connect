import Link from "next/link";

import { Section, SectionHeading } from "@/components/sections/section";
import { OpportunityCard } from "@/components/opportunity-card";
import type { OpportunityData } from "@/types/models";

export function OpportunitiesPreview({
  opportunities,
}: {
  opportunities: OpportunityData[];
}) {
  const items = opportunities.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <Section id="opportunities" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Opportunities"
        eyebrowDot="blush"
        title="Find your next global step."
        description="Exchanges, scholarships, conferences and volunteering — picked for young people worldwide."
        align="left"
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((opportunity, index) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} index={index} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/opportunities"
          className="group inline-flex items-center gap-2 text-base font-medium text-foreground transition-colors hover:text-accent-foreground"
        >
          View all opportunities
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </Section>
  );
}
