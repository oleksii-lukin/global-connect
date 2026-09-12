import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessions } from "@/lib/contentful/queries";

export async function generateStaticParams() {
  const sessions = await getSessions();
  return sessions.map((session) => ({ slug: session.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const session = (await getSessions()).find((s) => s.slug === slug);
  if (!session) return {};
  return {
    title: session.title,
    description: session.description,
  };
}

async function SessionContent({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const sessions = await getSessions();
  const session = sessions.find((s) => s.slug === slug);

  if (!session) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-8"
        render={<Link href="/sessions" />}
      >
        <ArrowLeft className="size-4" />
        All sessions
      </Button>

      <div className="flex items-center gap-3">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-lavender/20 text-3xl">
          {session.icon}
        </span>
        {session.online && (
          <Badge variant="secondary" className="rounded-full">
            Online
          </Badge>
        )}
      </div>

      <h1 className="mt-6 font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl">
        {session.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {session.description}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Badge variant="outline" className="rounded-full px-3 py-1">
          {session.duration}
        </Badge>
        <Badge variant="outline" className="rounded-full px-3 py-1">
          {session.difficulty}
        </Badge>
        {session.upcoming && (
          <Badge className="rounded-full px-3 py-1">Upcoming</Badge>
        )}
      </div>

      <div className="mt-8">
        {session.registerUrl ? (
          <Button
            size="lg"
            render={
              <a
                href={session.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Register for this session"
              />
            }
          >
            Register for this session
          </Button>
        ) : (
          <Button size="lg" render={<Link href="/community" />}>
            Join to register
          </Button>
        )}
      </div>
    </article>
  );
}

export default async function SessionPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense>
          <SessionContent params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}