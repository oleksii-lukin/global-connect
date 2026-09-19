import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/sections/section";
import type { CityData, HomepageSectionData } from "@/types/models";

const FEATURES = [
  { icon: "🌍", text: "Meet young people worldwide" },
  { icon: "💬", text: "Join discussions" },
  { icon: "🎤", text: "Speaking clubs" },
  { icon: "🤝", text: "Mentorship" },
  { icon: "📚", text: "Learn together" },
];

const CITY_STYLES: { bg: string; lift?: boolean }[] = [
  { bg: "bg-lavender/30" },
  { bg: "bg-pastel-blue/30", lift: true },
  { bg: "bg-sage/30" },
  { bg: "bg-peach/35" },
  { bg: "bg-blush/35", lift: true },
  { bg: "bg-lavender/20" },
  { bg: "bg-pastel-blue/20", lift: true },
  { bg: "bg-sage/20" },
];

const DEFAULT_CITY_BG = "bg-muted/30";

export function CommunitySection({
  config,
  cities,
}: {
  config?: HomepageSectionData;
  cities?: CityData[];
}) {
  return (
    <section id="community" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={config?.eyebrow}
              eyebrowDot="blush"
              title={config?.title ?? "Community"}
              description={config?.description}
              align="left"
            />
            <ul className="mt-10 space-y-3">
              {FEATURES.map((f) => (
                <li
                  key={f.text}
                  className="flex items-center gap-3 text-base text-foreground"
                >
                  <span aria-hidden="true">{f.icon}</span>
                  {f.text}
                </li>
              ))}
            </ul>
            <Link
              href="/community"
              className="group mt-10 inline-flex items-center gap-2 text-base font-medium text-foreground"
            >
              Join the community
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <div>
            <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_70px_-45px_rgba(36,36,64,0.5)]">
              {config?.imageUrl && (
                <Image
                  src={config.imageUrl}
                  alt={config.imageAlt ?? "Young people from different countries talking in a circle"}
                  width={1200}
                  height={912}
                  loading="lazy"
                  className="h-72 w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04] sm:h-96"
                />
              )}
            </div>
            <div className="mt-5 grid grid-cols-4 gap-3 sm:gap-4">
              {(cities ?? []).map((c, i) => {
                const pres = CITY_STYLES[i % CITY_STYLES.length] ?? {
                  bg: DEFAULT_CITY_BG,
                };
                return (
                  <div
                    key={c.initials}
                    className={`flex flex-col items-center justify-center rounded-2xl border border-border bg-card/70 p-2.5 text-center transition-transform duration-300 hover:-translate-y-1 ${pres.lift ? "translate-y-3" : ""}`}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-sm text-foreground ${pres.bg}`}
                    >
                      {c.initials}
                    </span>
                    <span className="mt-2 text-[0.7rem] text-muted-foreground">
                      {c.city}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}