import { SectionBand, SectionHeading } from "@/components/sections/section";
import type { PathStepData } from "@/types/models";

const stepRuleColors = [
  "bg-lavender",
  "bg-pastel-blue",
  "bg-sage",
  "bg-peach",
  "bg-blush",
];

export function PathSection({ steps }: { steps: PathStepData[] }) {
  return (
    <SectionBand>
      <SectionHeading
        eyebrow="The path"
        eyebrowDot="pastel-blue"
        title="How Global Connect works"
        align="left"
      />
      <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
        {steps.map((step, index) => (
          <li key={step.id}>
            <div
              className={cnHair(
                stepRuleColors[index] ?? "bg-lavender",
              )}
            />
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")} — {step.title}
            </p>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </SectionBand>
  );
}

function cnHair(colorClass: string) {
  return `h-px w-full ${colorClass}`;
}