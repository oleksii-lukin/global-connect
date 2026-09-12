import { Show } from "@clerk/nextjs";
import { Suspense } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TOPICS = [
  { emoji: "🌍", label: "Travel & exchanges", members: "1,240 members" },
  { emoji: "🎓", label: "Studying abroad", members: "980 members" },
  { emoji: "🎤", label: "Speaking clubs", members: "760 members" },
  { emoji: "💻", label: "Technology & AI", members: "540 members" },
];

export const metadata = {
  title: "Community",
  description:
    "Connect with young people around the world. Discussions, speaking clubs, mentorship and learning together.",
};

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
                {TOPICS.map((topic) => (
                  <Card key={topic.label}>
                    <CardContent className="flex items-center gap-4">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-2xl">
                        {topic.emoji}
                      </span>
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium">{topic.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {topic.members}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Join to participate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <div className="grid gap-6 md:grid-cols-2">
              {TOPICS.map((topic) => (
                <Card key={topic.label}>
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
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}