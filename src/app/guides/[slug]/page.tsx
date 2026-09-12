import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RichText } from "@/lib/richtext";
import { getGuides } from "@/lib/contentful/queries";

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = (await getGuides()).find((g) => g.slug === slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.excerpt,
  };
}

export default async function GuidePage({
  params,
}: {
  params: { slug: string };
}) {
  const [{ slug }, guides] = await Promise.all([params, getGuides()]);
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) notFound();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-8"
            render={<Link href="/guides" />}
          >
            <ArrowLeft className="size-4" />
            All guides
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            {guide.readTime} min read
            {guide.publishedAt && (
              <span aria-hidden>·</span>
            )}
            {guide.publishedAt && (
              <time dateTime={guide.publishedAt}>
                {new Date(guide.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>

          <h1 className="mt-4 font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{guide.excerpt}</p>

          <div className="mt-10 border-t border-border pt-10">
            {guide.body ? (
              <RichText document={guide.body} />
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                This guide&apos;s full text is coming soon. In the meantime,
                explore <Link href="/opportunities" className="text-brand">opportunities</Link>{" "}
                or <Link href="/sessions" className="text-brand">online sessions</Link>.
              </div>
            )}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}