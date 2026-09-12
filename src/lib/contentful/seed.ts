import type {
  InterestData,
  OpportunityData,
  PartnerData,
  PathStepData,
  SessionData,
  StoryData,
  GuideData,
} from "@/types/models";

/** Bundled sample content, shown when Contentful isn't configured yet.
 *  Mirrors the reference site. Delete when real CMS content exists. */

export const seedOpportunities: OpportunityData[] = [
  {
    id: "seed-opportunity-erasmus",
    title: "Erasmus+ Youth Exchange",
    slug: "erasmus-youth-exchange",
    country: "Portugal",
    countryFlag: "🇵🇹",
    type: "Exchange",
    description:
      "Ten days with young people from six countries, working on climate action and intercultural dialogue.",
    ageRange: "Ages 16–20",
    funding: "Fully funded",
    deadline: "September 12",
    tags: ["Exchange", "Travel", "Erasmus+"],
    featured: true,
    order: 1,
  },
  {
    id: "seed-opportunity-european-youth-programme",
    title: "European Youth Programme",
    slug: "european-youth-programme",
    country: "Europe",
    countryFlag: "🇪🇺",
    type: "Programme",
    description:
      "A rolling programme of workshops, policy labs and youth-led projects across the EU.",
    ageRange: "Ages 15–21",
    funding: "Free",
    deadline: "Rolling",
    tags: ["Programme", "Leadership"],
    featured: false,
    order: 2,
  },
  {
    id: "seed-opportunity-youth-leadership-conference",
    title: "Youth Leadership Conference",
    slug: "youth-leadership-conference",
    country: "USA",
    countryFlag: "🇺🇸",
    type: "Conference",
    description:
      "Three days of talks, mentoring and networking with student leaders from 40+ countries.",
    ageRange: "Ages 16–20",
    funding: "Scholarship available",
    deadline: "October 30",
    tags: ["Conference", "Leadership"],
    featured: false,
    order: 3,
  },
];

export const seedSessions: SessionData[] = [
  {
    id: "seed-session-speaking-club",
    title: "Global English Speaking Club",
    slug: "global-english-speaking-club",
    icon: "🎤",
    description:
      "Weekly conversation practice with members from a dozen countries. No grades, no pressure.",
    duration: "60 min",
    difficulty: "All levels",
    online: true,
    upcoming: true,
    order: 1,
  },
  {
    id: "seed-session-tech-ai",
    title: "Technology & AI Workshop",
    slug: "technology-ai-workshop",
    icon: "💻",
    description:
      "Hands-on introduction to the tools shaping study, work and creativity in 2026.",
    duration: "90 min",
    difficulty: "Beginner",
    online: true,
    upcoming: true,
    order: 2,
  },
  {
    id: "seed-session-entrepreneurship",
    title: "Entrepreneurship Session",
    slug: "entrepreneurship-session",
    icon: "🚀",
    description:
      "From first idea to first users, told by founders who started before they turned twenty.",
    duration: "75 min",
    difficulty: "Intermediate",
    online: true,
    upcoming: true,
    order: 3,
  },
  {
    id: "seed-session-intl-opportunities",
    title: "International Opportunities Workshop",
    slug: "international-opportunities-workshop",
    icon: "🌍",
    description:
      "How exchanges, scholarships and conferences actually work — and how to get selected.",
    duration: "60 min",
    difficulty: "All levels",
    online: true,
    upcoming: true,
    order: 4,
  },
];

export const seedGuides: GuideData[] = [
  {
    id: "seed-guide-motivation-letter",
    title: "How to write a motivation letter",
    slug: "how-to-write-a-motivation-letter",
    readTime: 8,
    excerpt:
      "A practical guide to writing a motivation letter that gets your application noticed.",
  },
  {
    id: "seed-guide-scholarships",
    title: "How to find scholarships",
    slug: "how-to-find-scholarships",
    readTime: 6,
    excerpt:
      "Where scholarship money hides, and how to match one to your profile.",
  },
  {
    id: "seed-guide-erasmus",
    title: "How Erasmus+ works",
    slug: "how-erasmus-works",
    readTime: 10,
    excerpt:
      "The EU's mobility programme explained, from applying to coming home.",
  },
  {
    id: "seed-guide-interview",
    title: "How to prepare for an interview",
    slug: "how-to-prepare-for-an-interview",
    readTime: 7,
    excerpt:
      "What to expect, what to practise, and how to answer the tricky questions.",
  },
  {
    id: "seed-guide-cv",
    title: "How to build your first CV",
    slug: "how-to-build-your-first-cv",
    readTime: 9,
    excerpt:
      "Build a CV that stands out when you're starting out — templates included.",
  },
  {
    id: "seed-guide-intl-programmes",
    title: "How to apply for international programmes",
    slug: "how-to-apply-for-international-programmes",
    readTime: 12,
    excerpt:
      "A step-by-step walkthrough of the application process for international opportunities.",
  },
];

export const seedStories: StoryData[] = [
  {
    id: "seed-story-lera",
    quote:
      "Thank you so much to Global Connect, and especially to Zlata Shevtsova, its founder! Thanks to your channel, I discovered the Erasmus+ exchange opportunity and was able to go to Portugal. It was an incredible experience!",
    name: "Lera",
    location: "Portugal",
    role: "Global Connect Member",
  },
  {
    id: "seed-story-maxim",
    quote:
      "I never knew that speaking English could be this much fun! The Global Connect speaking clubs made practicing English so enjoyable.",
    name: "Maxim",
    location: "Speaking Clubs",
    role: "Global Connect Member",
  },
  {
    id: "seed-story-alice",
    quote:
      "I simply admire the amazing opportunities that Global Connect shares with us. It's such a great platform for discovering new possibilities and getting inspired to take action.",
    name: "Alice",
    location: "Global Member",
    role: "Global Connect Member",
  },
];

export const seedPartners: PartnerData[] = [
  { id: "seed-partner-lyceum", name: "Lyceum №14" },
  { id: "seed-partner-youthbridge", name: "Youth Bridge NGO" },
  { id: "seed-partner-esn", name: "Erasmus Student Network" },
  { id: "seed-partner-coimbra", name: "Univ. of Coimbra" },
  { id: "seed-partner-openfuture", name: "OpenFuture Labs" },
  { id: "seed-partner-coy", name: "Council of Youth" },
];

export const seedPathSteps: PathStepData[] = [
  {
    id: "seed-step-discover",
    stepNumber: 1,
    title: "Discover",
    description: "Find an opportunity",
  },
  {
    id: "seed-step-understand",
    stepNumber: 2,
    title: "Understand",
    description: "Check eligibility and requirements",
  },
  {
    id: "seed-step-prepare",
    stepNumber: 3,
    title: "Prepare",
    description: "Use guides, sessions and mentoring",
  },
  {
    id: "seed-step-apply",
    stepNumber: 4,
    title: "Apply",
    description: "Follow the official application process",
  },
  {
    id: "seed-step-grow",
    stepNumber: 5,
    title: "Grow",
    description: "Connect with the community and discover what's next",
  },
];

export const seedInterests: InterestData[] = [
  { id: "seed-interest-study", label: "Studying abroad", emoji: "🎓" },
  { id: "seed-interest-travel", label: "Travel & exchanges", emoji: "🌍" },
  { id: "seed-interest-tech", label: "Technology", emoji: "💻" },
  { id: "seed-interest-research", label: "Research", emoji: "🧠" },
  { id: "seed-interest-startup", label: "Entrepreneurship", emoji: "🚀" },
  { id: "seed-interest-speaking", label: "Public speaking", emoji: "🎤" },
  { id: "seed-interest-competitions", label: "Competitions", emoji: "🏆" },
  { id: "seed-interest-volunteering", label: "Volunteering", emoji: "🤝" },
];