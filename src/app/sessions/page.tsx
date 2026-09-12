import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/page-header";
import { getSessions } from "@/lib/contentful/queries";

export const metadata: Metadata = {
  title: "Online Sessions",
  description:
    "Speaking clubs, workshops and sessions that build your skills and confidence.",
};

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-border/70 bg-card/40">
          <PageHeader
            eyebrow="Online sessions"
            title="Learn. Speak. Connect."
            description="Build the skills and confidence you need to take your next global step."
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(36,36,64,0.4)]"
              >
                <CardHeader className="flex-row items-center justify-between">
                  <span className="text-3xl">{session.icon}</span>
                  {session.online && (
                    <Badge
                      variant="secondary"
                      className="rounded-full font-normal"
                    >
                      Online
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <h2 className="font-display text-xl text-foreground">
                    {session.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {session.description}
                  </p>
                  <p className="mt-auto text-xs font-medium text-muted-foreground">
                    {session.duration} · {session.difficulty}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    render={<Link href={`/sessions/${session.slug}`} />}
                  >
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}