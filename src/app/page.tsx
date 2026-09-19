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
  getHomepageSections,
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
  const [opportunities, sessions, guides, stories, partners, pathSteps, interests, homepageSections] =
    await Promise.all([
      getOpportunities(),
      getSessions(),
      getGuides(),
      getStories(),
      getPartners(),
      getPathSteps(),
      getInterests(),
      getHomepageSections(),
    ]);

  const featured = opportunities.filter((o) => o.featured);
  const heroFeatured = (featured.length >= 3 ? featured : opportunities).slice(0, 3);

  const sections = {
    hero: homepageSections.hero,
    stats: homepageSections.stats,
    opportunityFinder: homepageSections.opportunityFinder,
    path: homepageSections.path,
    sessions: homepageSections.sessions,
    guides: homepageSections.guides,
    stories: homepageSections.stories,
    community: homepageSections.community,
    discovery: homepageSections.discovery,
    partners: homepageSections.partners,
    finalCta: homepageSections.finalCta,
  };

  function isEnabled(
    section: { enabled?: boolean } | undefined,
  ): section is { enabled?: boolean } {
    return section != null && section.enabled !== false;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {isEnabled(sections.hero) && (
          <HeroSection featured={heroFeatured} config={sections.hero} />
        )}
        {isEnabled(sections.stats) && (
          <Reveal>
            <StatsBand config={sections.stats} />
          </Reveal>
        )}
        {isEnabled(sections.opportunityFinder) && (
          <Reveal delay={80}>
            <OpportunityFinder opportunities={opportunities} limit={3} config={sections.opportunityFinder} />
          </Reveal>
        )}
        {isEnabled(sections.path) && (
          <Reveal>
            <PathSection steps={pathSteps} config={sections.path} />
          </Reveal>
        )}
        {isEnabled(sections.sessions) && (
          <Reveal delay={80}>
            <SessionsSection sessions={sessions} config={sections.sessions} />
          </Reveal>
        )}
        {isEnabled(sections.guides) && (
          <Reveal>
            <GuidesSection guides={guides} config={sections.guides} />
          </Reveal>
        )}
        {isEnabled(sections.stories) && (
          <Reveal delay={80}>
            <StoriesSection stories={stories} config={sections.stories} />
          </Reveal>
        )}
        {isEnabled(sections.community) && (
          <Reveal>
            <CommunitySection config={sections.community} />
          </Reveal>
        )}
        {isEnabled(sections.discovery) && (
          <Reveal delay={80}>
            <DiscoverySection interests={interests} config={sections.discovery} />
          </Reveal>
        )}
        {isEnabled(sections.partners) && (
          <Reveal>
            <PartnersSection partners={partners} config={sections.partners} />
          </Reveal>
        )}
        {isEnabled(sections.finalCta) && (
          <Reveal delay={80}>
            <FinalCtaSection config={sections.finalCta} />
          </Reveal>
        )}
      </main>
      <SiteFooter />
    </>
  );
}