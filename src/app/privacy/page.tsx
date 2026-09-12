import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader title="Privacy Policy" eyebrow="Legal" />
        <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
          <ProseSection title="What we collect">
            <p>
              Global Connect uses Contentful to store content and Clerk to manage
              accounts. We only collect the information you provide when you sign
              in, and basic usage data needed to keep the site running.
            </p>
          </ProseSection>
          <ProseSection title="How we use it">
            <p>
              Your details are used to personalise community features — like
              registering for sessions — and to keep the service secure. We never
              sell your data.
            </p>
          </ProseSection>
          <ProseSection title="Your choices">
            <p>
              You can ask to see or delete your data at any time by contacting us
              at the address on the About page.
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