import { Show } from "@clerk/nextjs";
import { Suspense } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCommunityTopics } from "@/lib/contentful/queries";

export const metadata = {
  title: "Community",
  description:
    "Connect with young people around the world. Discussions, speaking clubs, mentorship and learning together.",
};

async function CommunityTopics() {
  const topics = await getCommunityTopics();
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {topics.map((topic) => (
        <Card key={topic.id}>
          <CardContent className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-lavender/20 text-2xl">
              {topic.emoji}
            </span>
            <div className="flex flex-1 flex-col">
              <span className="font-medium">{topic.label}</span>
              <span className="text-sm text-muted-foreground">
                {topic.members}
              </span>
            </div>
            <Show
              when="signed-in"
              fallback={
                <Button variant="outline" size="sm">
                  Join to participate
                </Button>
              }
            >
              <Button size="sm">Open discussion</Button>
            </Show>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border/70 bg-card/40">
          <PageHeader
            eyebrow="Community"
            title="You're not doing this alone."
            description="A place where young people prepare together, share what worked, and keep going after the first rejection."
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="flex items-center gap-4">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-2xl" />
                      <div className="flex flex-1 flex-col gap-2">
                        <span className="h-4 w-32 rounded bg-muted" />
                        <span className="h-3 w-24 rounded bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <CommunityTopics />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
