import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsBand } from "@/components/sections/stats-band";
import { OpportunityFinder } from "@/components/sections/opportunity-finder";
import { PathSection } from "@/components/sections/path-section";
import { SessionsSection } from "@/components/sections/sessions-section";
import { GuidesSection } from "@/components/sections/guides-section";
import { StoriesSection } from "@/components/sections/stories-section";
import { CommunitySection } from "@/components/sections/community-section";
import { DiscoverySection } from "@/components/sections/discovery-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import {
  getGuides,
  getInterests,
  getOpportunities,
  getPartners,
  getPathSteps,
  getSessions,
  getStories,
} from "@/lib/contentful/queries";

export const metadata = {
  title: "Global Connect — Your next global opportunity",
};

export default async function HomePage() {
  const [opportunities, sessions, guides, stories, partners, pathSteps, interests] =
    await Promise.all([
      getOpportunities(),
      getSessions(),
      getGuides(),
      getStories(),
      getPartners(),
      getPathSteps(),
      getInterests(),
    ]);

  const featured = opportunities.filter((o) => o.featured);
  const heroFeatured = (featured.length >= 3 ? featured : opportunities).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection featured={heroFeatured} />
        <Reveal>
          <StatsBand />
        </Reveal>
        <Reveal delay={80}>
          <OpportunityFinder opportunities={opportunities} />
        </Reveal>
        <Reveal>
          <PathSection steps={pathSteps} />
        </Reveal>
        <Reveal delay={80}>
          <SessionsSection sessions={sessions} />
        </Reveal>
        <Reveal>
          <GuidesSection guides={guides} />
        </Reveal>
        <Reveal delay={80}>
          <StoriesSection stories={stories} />
        </Reveal>
        <Reveal>
          <CommunitySection />
        </Reveal>
        <Reveal delay={80}>
          <DiscoverySection interests={interests} />
        </Reveal>
        <Reveal>
          <PartnersSection partners={partners} />
        </Reveal>
        <Reveal delay={80}>
          <FinalCtaSection />
        </Reveal>
      </main>
      <SiteFooter />
    </>
  );
}