import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { OpportunityData } from "@/types/models";

const tileColors = [
  "bg-lavender/20",
  "bg-pastel-blue/20",
  "bg-sage/20",
  "bg-peach/25",
  "bg-blush/25",
];

export function OpportunityCard({
  opportunity,
  index = 0,
}: {
  opportunity: OpportunityData;
  index?: number;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/80 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(36,36,64,0.4)]">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${tileColors[index % tileColors.length]}`}
          aria-hidden="true"
        >
          {opportunity.countryFlag}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {opportunity.country}
          </p>
          <h3 className="mt-0.5 truncate font-display text-xl text-foreground">
            {opportunity.title}
          </h3>
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {opportunity.description}
      </p>

      <dl className="mt-6 space-y-1.5 border-t border-border/70 pt-5">
        <Detail label="Age" value={opportunity.ageRange} />
        <Detail label="Funding" value={opportunity.funding} />
        <Detail label="Deadline" value={opportunity.deadline} />
      </dl>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {opportunity.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/opportunities/${opportunity.slug}`}
          className="group/arrow inline-flex shrink-0 items-center gap-1 text-sm font-medium text-foreground"
        >
          View opportunity
          <ArrowRight className="size-4 transition-transform group-hover/arrow:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}