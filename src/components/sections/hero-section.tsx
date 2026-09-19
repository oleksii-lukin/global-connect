import Image from "next/image";
import { Suspense } from "react";
import { Show, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/sections/section";
import type { HomepageSectionData, OpportunityData } from "@/types/models";

const chipTileColors = ["bg-lavender/20", "bg-pastel-blue/20", "bg-sage/20"];
const chipTranslations = ["", "sm:translate-x-10", "sm:-translate-x-4"];

export function HeroSection({
  featured,
  config,
}: {
  featured: OpportunityData[];
  config?: HomepageSectionData;
}) {
  const chips = featured.slice(0, 3);
  const titleWords = config?.title?.trim().split(/\s+/);
  const titleHighlight = titleWords?.slice(-2).join(" ");
  const titleRest = titleWords?.slice(0, -2).join(" ");

  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="blob absolute -left-32 top-0 h-96 w-96 bg-lavender/20 blur-3xl" />
        <div className="blob absolute -right-24 top-24 h-[26rem] w-[26rem] bg-pastel-blue/20 blur-3xl" />
        <div className="blob absolute bottom-[-6rem] left-1/3 h-80 w-80 bg-sage/15 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          {config?.eyebrow && <SectionEyebrow dot="sage">{config.eyebrow}</SectionEyebrow>}

          {titleRest && titleHighlight && (
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.05] tracking-tight text-foreground sm:text-6xl text-balance">
              {titleRest}{" "}
              <span className="relative inline-block break-words">
                {titleHighlight}
                <span
                  className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-peach/40"
                  aria-hidden="true"
                />
              </span>
            </h1>
          )}

          {config?.description && (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {config.description}
            </p>
          )}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" render={<a href="#opportunities" />}>
              Explore opportunities <span aria-hidden="true">→</span>
            </Button>
            <Suspense
              fallback={
                <Button className="w-full sm:w-auto" variant="outline" disabled>
                  Join Global Connect
                </Button>
              }
            >
              <Show
                when="signed-out"
                fallback={
                  <Button
                    className="w-full sm:w-auto"
                    variant="outline"
                    render={<a href="/community" />}
                  >
                    Join the community
                  </Button>
                }
              >
                <SignInButton mode="modal">
                  <Button className="w-full sm:w-auto" variant="outline">Join Global Connect</Button>
                </SignInButton>
              </Show>
            </Suspense>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            1,000+ members · 500+ opportunities shared · 35 online sessions
          </p>
        </div>

        <div className="relative">
          <div
            className="blob drift pointer-events-none absolute inset-8 bg-lavender/15"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_70px_-40px_rgba(36,36,64,0.55)]">
            {config?.imageUrl && (
              <Image
                src={config.imageUrl}
                alt={config.imageAlt ?? "Young people from different countries laughing together on a campus"}
                width={1024}
                height={1280}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-[26rem] w-full object-cover sm:h-[34rem]"
              />
            )}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 -mt-16 space-y-3 px-2 sm:-mt-20 sm:px-6">
            {chips.map((o, index) => (
              <div
                key={o.id}
                className={`float-soft flex items-center gap-4 rounded-2xl border border-border bg-card/90 p-4 shadow-[0_14px_36px_-20px_rgba(36,36,64,0.45)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 ${chipTranslations[index] ?? ""}`}
                style={{ animationDelay: `${index * 900}ms` }}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${chipTileColors[index] ?? "bg-lavender/20"}`}
                  aria-hidden="true"
                >
                  {o.countryFlag}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {o.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {o.country} · {o.funding}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}