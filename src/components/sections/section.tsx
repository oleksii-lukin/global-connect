import { cn } from "@/lib/utils";

export type EyebrowDot = "sage" | "lavender" | "pastel-blue" | "peach" | "blush";

const eyebrowDotClass: Record<EyebrowDot, string> = {
  sage: "bg-sage",
  lavender: "bg-lavender",
  "pastel-blue": "bg-pastel-blue",
  peach: "bg-peach",
  blush: "bg-blush",
};

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("px-6 py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionBand({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "border-y border-border/70 bg-card/40 px-6 py-24 sm:py-32",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionEyebrow({
  dot = "sage",
  children,
  className,
}: {
  dot?: EyebrowDot;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", eyebrowDotClass[dot])} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  eyebrowDot,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  eyebrowDot?: EyebrowDot;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <SectionEyebrow dot={eyebrowDot}>{eyebrow}</SectionEyebrow>}
      <h2 className="mt-6 font-display text-3xl leading-[1.1] text-foreground sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export function CardShell({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: "default" | "story";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl border border-border bg-card/80 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(36,36,64,0.4)]",
        variant === "story" &&
          "group relative p-8 shadow-[0_8px_30px_-12px_rgba(36,36,64,0.08)] backdrop-blur-sm hover:shadow-[0_16px_40px_-12px_rgba(36,36,64,0.14)]",
        className,
      )}
    >
      {children}
    </div>
  );
}