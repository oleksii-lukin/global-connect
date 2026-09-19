import Link from "next/link";

import { SectionBand, SectionHeading } from "@/components/sections/section";
import type { GuideData, HomepageSectionData } from "@/types/models";

const tileColors = [
  "bg-lavender/25",
  "bg-pastel-blue/25",
  "bg-sage/25",
  "bg-peach/30",
  "bg-blush/30",
  "bg-lavender/20",
];

export function GuidesSection({
  guides,
  config,
}: {
  guides: GuideData[];
  config?: HomepageSectionData;
}) {
  return (
    <SectionBand id="guides" className="scroll-mt-20">
      <SectionHeading
        eyebrow={config?.eyebrow ?? "Guides"}
        eyebrowDot="peach"
        title={config?.title ?? "Don't just find opportunities. Learn how to get them."}
        align="left"
      />
      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide, index) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.slug}`}
            className="group flex flex-col bg-background p-8 transition-colors hover:bg-card"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-lg text-foreground ${tileColors[index % tileColors.length]}`}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 font-display text-xl leading-snug text-foreground">
              {guide.title}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              {guide.readTime} min read
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
              Read guide
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </SectionBand>
  );
}