import { cn } from "@/lib/utils";
import { SectionEyebrow, type EyebrowDot } from "@/components/sections/section";

export function PageHeader({
  eyebrow,
  eyebrowDot = "sage",
  title,
  description,
  className,
}: {
  eyebrow?: string;
  eyebrowDot?: EyebrowDot;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-2xl flex-col items-center gap-3 py-16 text-center sm:py-24",
        className,
      )}
    >
      {eyebrow && <SectionEyebrow dot={eyebrowDot}>{eyebrow}</SectionEyebrow>}
      <h1 className="mt-3 font-display text-[2.6rem] leading-[1.08] tracking-tight text-foreground text-balance sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-base text-muted-foreground text-pretty sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}