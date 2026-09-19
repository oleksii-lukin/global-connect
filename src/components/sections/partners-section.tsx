import type { HomepageSectionData, PartnerData } from "@/types/models";

export function PartnersSection({
  partners,
  config,
}: {
  partners: PartnerData[];
  config?: HomepageSectionData;
}) {
  return (
    <section id="about" className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {config?.title && (
          <p className="text-center font-display text-2xl text-foreground sm:text-3xl">
            {config.title}
          </p>
        )}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex h-16 items-center justify-center rounded-xl border border-border/70 px-4 text-center text-xs uppercase tracking-[0.14em] text-muted-foreground"
            >
              {partner.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.logoUrl}
                  alt={partner.logoAlt ?? partner.name}
                  className="h-6 w-auto object-contain grayscale"
                />
              ) : (
                <span>{partner.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}