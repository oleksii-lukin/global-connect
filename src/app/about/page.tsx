import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/page-header";
import { PartnersSection } from "@/components/sections/partners-section";
import { getPartners, getStories } from "@/lib/contentful/queries";
import { StoriesSection } from "@/components/sections/stories-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Global Connect helps young people discover international opportunities, build confidence and connect worldwide.",
};

export default async function AboutPage() {
  const [partners, stories] = await Promise.all([getPartners(), getStories()]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border/70 bg-card/40">
          <PageHeader
            eyebrow="About"
            title="Helping young people discover what's possible."
            description="Global Connect is a global youth community sharing international opportunities, online sessions and practical guides."
          />
        </div>

        <div id="impact" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="grid gap-6 text-center sm:grid-cols-5">
            <Stat value="1,000+" label="Members" />
            <Stat value="500+" label="Opportunities shared" />
            <Stat value="35" label="Online sessions" />
            <Stat value="600" label="Young people mentored" />
            <Stat value="3" label="Partnerships" />
          </div>
        </div>

        <StoriesSection stories={stories} />

        <div id="partners">
          <PartnersSection partners={partners} />
        </div>

        <div id="contact" className="mx-auto max-w-xl px-4 py-12 text-center sm:px-6">
          <h2 className="font-display text-2xl tracking-tight text-foreground">
            Want to work with us?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Share opportunities with our community, run a session, or become a
            partner. Reach out at{" "}
            <a
              href="mailto:hello@globalconnect.example"
              className="text-brand hover:underline"
            >
              hello@globalconnect.example
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-3xl text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}