import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader title="Terms of Service" eyebrow="Legal" />
        <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
          <ProseSection title="Using Global Connect">
            <p>
              Global Connect connects young people with international
              opportunities. We aim to keep listings accurate, but always confirm
              details on official programme pages before applying.
            </p>
          </ProseSection>
          <ProseSection title="Content">
            <p>
              Opportunity listings and guides are provided for informational
              purposes. We are not responsible for the application outcomes of
              third-party programmes we share.
            </p>
          </ProseSection>
          <ProseSection title="Account conduct">
            <p>
              Be kind. Harassment, spam or misleading content leads to account
              removal. Community members are expected to treat each other with
              respect.
            </p>
          </ProseSection>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function ProseSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <div className="text-muted-foreground">{children}</div>
    </section>
  );
}