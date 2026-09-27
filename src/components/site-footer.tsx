import Image from "next/image";
import Link from "next/link";

import { getSiteSettings } from "@/lib/contentful/queries";

const aboutLinks = [
  { label: "Our story", href: "/about" },
  { label: "Impact", href: "/about#impact" },
  { label: "Partners", href: "/about#partners" },
  { label: "Contact", href: "/about#contact" },
];

export async function SiteFooter() {
  const { communityUrl } = await getSiteSettings();

  const exploreLinks = [
    { label: "Opportunities", href: "/opportunities" },
    { label: "Sessions", href: "/sessions" },
    { label: "Guides", href: "/guides" },
    { label: "Community", href: communityUrl, external: true },
  ];

  return (
    <footer className="border-t border-border/70 bg-card/40 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(2,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Global Connect logo"
                width={40}
                height={40}
                loading="lazy"
                className="h-9 w-9 object-contain"
              />
              <p className="font-display text-lg text-foreground">
                GLOBAL CONNECT
              </p>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Helping young people discover what&apos;s possible.
            </p>
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="About" links={aboutLinks} />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Global Connect</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
