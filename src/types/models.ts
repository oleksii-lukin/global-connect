/** Flat view-models used by page components. Both seed data and
 *  Contentful queries return these — pages never import Contentful SDK types. */
import type { Document as RichTextDocument } from "@contentful/rich-text-types";

export interface OpportunityData {
  id: string;
  title: string;
  slug: string;
  country: string;
  countryFlag: string;
  type: string;
  description: string;
  longDescription?: RichTextDocument;
  ageRange: string;
  funding: string;
  deadline: string;
  tags: string[];
  imageUrl?: string;
  imageAlt?: string;
  featured: boolean;
  order: number;
}

export interface SessionData {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  duration: string;
  difficulty: string;
  online: boolean;
  registerUrl?: string;
  upcoming: boolean;
  order: number;
}

export interface GuideData {
  id: string;
  title: string;
  slug: string;
  readTime: number;
  excerpt: string;
  body?: RichTextDocument;
  publishedAt?: string;
}

export interface StoryData {
  id: string;
  quote: string;
  name: string;
  location: string;
  role: string;
}

export interface PartnerData {
  id: string;
  name: string;
  logoUrl?: string;
  logoAlt?: string;
  website?: string;
}

export interface PathStepData {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
}

export interface InterestData {
  id: string;
  label: string;
  emoji: string;
}

export interface CommunityData {
  id: string;
  emoji: string;
  label: string;
  members: string;
}

export type HomepageSectionKey =
  | "hero"
  | "stats"
  | "opportunityFinder"
  | "path"
  | "sessions"
  | "guides"
  | "stories"
  | "community"
  | "discovery"
  | "partners"
  | "finalCta";

export interface HomepageSectionData {
  id: string;
  section: HomepageSectionKey;
  eyebrow?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  enabled: boolean;
}

export interface SiteStats {
  members: string;
  opportunitiesShared: string;
  onlineSessions: string;
  youngPeopleMentored: string;
  partnerships: string;
}