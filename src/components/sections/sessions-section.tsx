import Image from "next/image";
import Link from "next/link";

import { Section, SectionHeading } from "@/components/sections/section";
import type { SessionData } from "@/types/models";

const SESSION_COUNT = "35";
const tileColors = [
  "bg-lavender/20",
  "bg-pastel-blue/20",
  "bg-sage/25",
  "bg-peach/25",
];

export function SessionsSection({
  sessions,
}: {
  sessions: SessionData[];
}) {
  return (
    <Section id="sessions" className="scroll-mt-20">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Online sessions"
          eyebrowDot="sage"
          title="Learn. Speak. Connect."
          description="Build the skills and confidence you need to take your next global step."
          align="left"
        />
        <p className="shrink-0 font-display text-5xl text-foreground">
          {SESSION_COUNT}{" "}
          <span className="block text-sm font-sans uppercase tracking-[0.18em] text-muted-foreground">
            online sessions
          </span>
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-[2rem] border border-border shadow-[0_30px_70px_-45px_rgba(36,36,64,0.5)]">
        <Image
          src="/session-online.jpg"
          alt="A young woman taking notes during an online Global Connect session"
          width={1024}
          height={768}
          loading="lazy"
          className="h-64 w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04] sm:h-80"
        />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {sessions.map((session, index) => (
          <SessionCard
            key={session.id}
            session={session}
            tileColor={tileColors[index % tileColors.length]}
          />
        ))}
      </div>
    </Section>
  );
}

function SessionCard({
  session,
  tileColor,
}: {
  session: SessionData;
  tileColor: string;
}) {
  return (
    <article className="flex flex-col rounded-3xl border border-border bg-card/80 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(36,36,64,0.4)]">
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${tileColor}`}
          aria-hidden="true"
        >
          {session.icon}
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          Online
        </span>
      </div>
      <h3 className="mt-5 font-display text-xl text-foreground">
        {session.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {session.description}
      </p>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-border/70 pt-5">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {session.duration} · {session.difficulty}
        </p>
        {session.registerUrl ? (
          <a
            href={session.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Register"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Register
          </a>
        ) : (
          <Link
            href={`/sessions/${session.slug}`}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Register
          </Link>
        )}
      </div>
    </article>
  );
}