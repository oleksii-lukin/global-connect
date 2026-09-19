import { SectionBand, SectionHeading } from "@/components/sections/section";
import type { HomepageSectionData, InterestData } from "@/types/models";

export function DiscoverySection({
  interests,
  config,
}: {
  interests: InterestData[];
  config?: HomepageSectionData;
}) {
  return (
    <SectionBand id="discovery">
      <SectionHeading
        eyebrow={config?.eyebrow}
        eyebrowDot="peach"
        title={config?.title ?? "Discover"}
        description={config?.description}
      />
      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
        {interests.map((interest) => (
          <span
            key={interest.id}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:border-foreground/30 hover:bg-muted"
          >
            <span>{interest.emoji}</span>
            {interest.label}
          </span>
        ))}
      </div>
      <div className="mt-10 text-center">
        <a
          href="#opportunities"
          className="group inline-flex items-center gap-2 text-base font-semibold text-foreground underline decoration-border underline-offset-8 transition-colors hover:text-accent-foreground"
        >
          Find opportunities for me
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →</span>
        </a>
      </div>
    </SectionBand>
  );
}