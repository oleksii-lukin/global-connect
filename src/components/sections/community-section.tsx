import Image from "next/image";
import { Suspense } from "react";
import { Show, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/sections/section";

const MEMBER_CHIPS = [
  { city: "Berlin", meta: "Meets once a month" },
  { city: "New York", meta: "Erasmus alum", lift: true },
  { city: "São Paulo", meta: "Spanish + English speaker" },
  { city: "Lagos", meta: "Remote internship tips" },
  { city: "New Delhi", meta: "LSE 2025 offer" },
  { city: "Tokyo", meta: "Library meetup", lift: true },
  { city: "Nairobi", meta: "Consulting track" },
  { city: "Melbourne", meta: "Studying abroad", lift: true },
];

const OVERLAY_CHIPS = ["🎓 study buddy", "✈️ travel buddy", "🧠 girl power ✨"];

export function CommunitySection() {
  return (
    <section
      id="community"
      className="relative scroll-mt-20 overflow-hidden bg-background px-6 py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="blob absolute -left-32 top-0 h-96 w-96 bg-lavender/15 blur-3xl" />
        <div className="blob absolute -right-24 bottom-0 h-80 w-80 bg-pastel-blue/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionEyebrow dot="sage">The community</SectionEyebrow>
          <h2 className="mt-6 font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            Join a global community.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            More than an opportunity directory — a place where young people
            prepare together, share what worked, and keep going after the first
            rejection.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-2">
            {MEMBER_CHIPS.map((member) => (
              <div
                key={member.city}
                className={`flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 backdrop-blur-md ${member.lift ? "sm:translate-y-3" : ""}`}
              >
                <p className="font-medium text-foreground">{member.city}</p>
                <p className="text-sm text-muted-foreground">{member.meta}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Button render={<a href="#opportunities" />}>
              Explore opportunities <span aria-hidden="true">→</span>
            </Button>
            <Suspense
              fallback={
                <Button variant="outline" disabled>
                  Join Global Connect
                </Button>
              }
            >
              <Show
                when="signed-in"
                fallback={
                  <SignInButton mode="modal">
                    <Button variant="outline">Join Global Connect</Button>
                  </SignInButton>
                }
              >
                <Button variant="outline" render={<a href="/community" />}>
                  Open the community
                </Button>
              </Show>
            </Suspense>
          </div>
        </div>

        <div className="relative">
          <div
            className="blob drift pointer-events-none absolute inset-8 bg-pastel-blue/15"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_70px_-45px_rgba(36,36,64,0.5)]">
            <Image
              src="/community-circle.jpg"
              alt="A circle of young friends laughing together outdoors"
              width={1200}
              height={912}
              loading="lazy"
              className="h-[24rem] w-full object-cover sm:h-[28rem]"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-background/70 to-transparent p-6"
              aria-hidden="true"
            >
              {OVERLAY_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border bg-card/90 px-3 py-1 text-xs backdrop-blur-md"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}