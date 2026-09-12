import { Section } from "@/components/sections/section";
import type { PartnerData } from "@/types/models";

export function PartnersSection({ partners }: { partners: PartnerData[] }) {
  return (
    <Section id="about" className="scroll-mt-20">
      <p className="mb-8 text-center text-sm font-medium tracking-wide text-muted-foreground">
        Built with people who believe in young people.
      </p>
      <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-3">
        {partners.map((partner) => (
          <li
            key={partner.id}
            className="flex h-16 w-32 items-center justify-center rounded-xl border border-border/70 bg-muted/20 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            {partner.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={partner.logoUrl}
                alt={partner.logoAlt ?? partner.name}
                className="h-6 w-auto object-contain grayscale"
              />
            ) : (
              <span className="font-display font-medium tracking-tight">
                {partner.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}