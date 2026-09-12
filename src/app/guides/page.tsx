import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/page-header";
import { getGuides } from "@/lib/contentful/queries";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "How-to guides on motivation letters, scholarships, Erasmus+, interviews, CVs and more.",
};

const guideTileColors = [
  "bg-lavender/25",
  "bg-pastel-blue/25",
  "bg-sage/25",
  "bg-peach/30",
  "bg-blush/30",
  "bg-lavender/20",
];

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border/70 bg-card/40">
          <PageHeader
            eyebrow="Guides"
            title="Don't just find opportunities. Learn how to get them."
            description="Practical, no-fluff guides written for young people applying to international programmes."
          />
        </div>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
            {guides.map((guide, index) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="group flex flex-col bg-background p-8 transition-colors hover:bg-card"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl font-display text-base text-foreground ${guideTileColors[index % guideTileColors.length]}`}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-5 font-display text-xl leading-snug text-foreground">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {guide.readTime} min read
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  Read guide
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}