import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RichText } from "@/lib/richtext";
import { getOpportunities } from "@/lib/contentful/queries";

export async function generateStaticParams() {
  const opportunities = await getOpportunities();
  return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = (await getOpportunities()).find((o) => o.slug === slug);
  if (!opportunity) return {};
  return {
    title: opportunity.title,
    description: opportunity.description,
  };
}

async function OpportunityContent({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const opportunities = await getOpportunities();
  const opportunity = opportunities.find((o) => o.slug === slug);

  if (!opportunity) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-8"
        render={<Link href="/opportunities" />}
      >
        <ArrowLeft className="size-4" />
        All opportunities
      </Button>

      <div className="flex items-center gap-3 text-sm font-medium">
        <span className="text-3xl">{opportunity.countryFlag}</span>
        <span>{opportunity.country}</span>
        <Badge variant="outline" className="rounded-full">
          {opportunity.type}
        </Badge>
      </div>

      <h1 className="mt-4 font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl">
        {opportunity.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        {opportunity.description}
      </p>

      <Card className="mt-8">
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <MetaRow label="Age" value={opportunity.ageRange} />
          <MetaRow label="Funding" value={opportunity.funding} />
          <MetaRow label="Deadline" value={opportunity.deadline} />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-1.5 border-t border-border pt-4">
          {opportunity.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full font-normal"
            >
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>

      {opportunity.longDescription ? (
        <div className="prose prose-neutral max-w-none mt-8">
          <RichText document={opportunity.longDescription} />
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          A full description will be added soon. Check the official
          programme page for details.
        </div>
      )}
    </article>
  );
}

export default async function OpportunityPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense>
          <OpportunityContent params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}