import type {
  CityData,
  CommunityData,
  HomepageSectionData,
  HomepageSectionKey,
  InterestData,
  OpportunityData,
  PartnerData,
  PathStepData,
  SessionData,
  StoryData,
  GuideData,
  VideoData,
} from "@/types/models";
import { BLOCKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";

/** Seed data for populating Contentful via `pnpm contentful:seed`.
 *  Only consumed by scripts/contentful-seed.ts — the app queries Contentful
 *  directly and does not fall back to this data. */

// ---------------------------------------------------------------------------
// Rich-text builders (used to author blog-style guide / opportunity bodies)
// ---------------------------------------------------------------------------

type Node = {
  nodeType: string;
  data: Record<string, unknown>;
  content?: Node[];
  value?: string;
  marks?: unknown[];
};

const text = (value: string): Node => ({
  nodeType: "text",
  value,
  marks: [],
  data: {},
});

const paragraph = (value: string): Node => ({
  nodeType: BLOCKS.PARAGRAPH,
  data: {},
  content: [text(value)],
});

const heading2 = (value: string): Node => ({
  nodeType: BLOCKS.HEADING_2,
  data: {},
  content: [text(value)],
});

const list = (items: string[]): Node => ({
  nodeType: BLOCKS.UL_LIST,
  data: {},
  content: items.map((i) => ({
    nodeType: BLOCKS.LIST_ITEM,
    data: {},
    content: [paragraph(i)],
  })),
});

const quote = (value: string): Node => ({
  nodeType: BLOCKS.QUOTE,
  data: {},
  content: [paragraph(value)],
});

/** Embedded image. In the bundled fallback the asset is inlined with a local
 *  URL so it renders without Contentful; the seeder rewrites `data.target` to
 *  an Asset Link when uploading into the CMS. */
const image = (
  assetId: string,
  url: string,
  alt: string,
  width = 1600,
  height = 1000,
): Node => ({
  nodeType: BLOCKS.EMBEDDED_ASSET,
  data: {
    target: {
      sys: { id: assetId, type: "Asset", linkType: "Asset" },
      fields: {
        title: { "en-US": alt },
        description: { "en-US": alt },
        file: {
          "en-US": {
            url,
            contentType: "image/jpeg",
            details: { image: { width, height } },
          },
        },
      },
    },
  },
  content: [],
});

const doc = (...blocks: Node[]): Document =>
  ({ nodeType: BLOCKS.DOCUMENT, data: {}, content: blocks }) as Document;

const guideImage = (slug: string, alt: string): Node =>
  image(`asset-${slug}`, `/guides/asset-${slug}.jpg`, alt);

/** Embedded video entry. The seeder rewrites `data.target` to an Entry Link
 *  when creating into the CMS. */
const video = (entryId: string, url: string, title: string, caption?: string): Node => ({
  nodeType: BLOCKS.EMBEDDED_ENTRY,
  data: {
    target: {
      sys: { id: entryId, type: "Entry", linkType: "Entry" },
      fields: {
        title: { "en-US": title },
        videoUrl: { "en-US": url },
        ...(caption ? { caption: { "en-US": caption } } : {}),
      },
    },
  },
  content: [],
});

// ---------------------------------------------------------------------------
// Opportunities
// ---------------------------------------------------------------------------

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
    longDescription: doc(
      paragraph(
        "Erasmus+ Youth Exchanges bring together groups of young people from different countries for a short, structured programme of activities built around a shared theme — from climate action to human rights to digital skills.",
      ),
      guideImage(
        "opp-erasmus-youth-exchange",
        "Young people collaborating during an Erasmus+ youth exchange in Portugal",
      ),
      heading2("What you actually do"),
      paragraph(
        "You are not a passive participant. Together with your group you plan, run and reflect on activities: workshops, field visits, creative sessions and a small local action. The exchange is hosted by a local organisation that handles logistics, accommodation and most costs.",
      ),
      list([
        "Travel and accommodation are usually fully covered by the Erasmus+ grant.",
        "You work in mixed-nationality teams, so English is the shared language.",
        "A youth worker facilitates, but the agenda is co-created with participants.",
      ]),
      heading2("Is it for you?"),
      paragraph(
        "If you are between 16 and 20, curious about other cultures, and happy to step outside your comfort zone for ten days, this is one of the highest-impact, lowest-cost experiences available to young Europeans.",
      ),
    ),
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
    longDescription: doc(
      paragraph(
        "The European Youth Programme connects young people across the EU through ongoing workshops, policy labs and small funded projects they lead themselves.",
      ),
      guideImage(
        "opp-european-youth-programme",
        "Participants in a European youth programme workshop",
      ),
      heading2("How it works"),
      paragraph(
        "Unlike a one-off exchange, this is a rolling track. You join local sessions, team up with peers from other countries, and can apply for micro-grants to run your own youth initiative.",
      ),
      list([
        "Free to join — funded by the EU youth strand.",
        "Builds directly into the EU Youth Dialogue, where recommendations reach decision-makers.",
        "Great first step before applying to bigger mobility schemes.",
      ]),
    ),
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
    longDescription: doc(
      paragraph(
        "A three-day conference where student leaders from more than forty countries share what they are building — and meet the mentors who can help them go further.",
      ),
      guideImage(
        "opp-youth-leadership-conference",
        "Speakers on stage at a youth leadership conference",
      ),
      heading2("What you get"),
      paragraph(
        "Keynotes, hands-on labs and structured networking. Scholarship tracks cover part or all of the participation fee for selected applicants.",
      ),
      quote(
        "The conversations in the hallway were worth more than any single talk.",
      ),
    ),
  },
  {
    id: "seed-opportunity-un-youth-volunteer",
    title: "UN Youth Volunteer Programme",
    slug: "un-youth-volunteer-programme",
    country: "Switzerland",
    countryFlag: "🇨🇭",
    type: "Volunteer",
    description:
      "Serve with UN agencies for up to 12 months on peace, development and humanitarian projects.",
    ageRange: "Ages 18–26",
    funding: "Fully funded",
    deadline: "Rolling",
    tags: ["Volunteer", "UN", "Development"],
    featured: false,
    order: 4,
    longDescription: doc(
      paragraph(
        "The UN Youth Volunteer programme places young people in UN agencies and partner organisations for assignments of six to twelve months, working on peacebuilding, climate, health and education.",
      ),
      guideImage(
        "opp-un-youth-volunteer-programme",
        "Young UN volunteers collaborating at a field office",
      ),
      heading2("What the role involves"),
      paragraph(
        "You support a concrete project — research, communications, event coordination or field logistics — alongside experienced staff. It is real work with real responsibility, not shadowing.",
      ),
      list([
        "Living allowance and insurance are covered.",
        "Assignments span field offices and headquarters worldwide.",
        "You join a global cohort of youth volunteers.",
      ]),
      heading2("Who should apply"),
      paragraph(
        "If you are 18–26, speak English well, and have some track record in volunteering or study relevant to development, this is a rare chance to contribute at the UN level early in your career.",
      ),
      quote(
        "I arrived unsure and left with a profession I believed in.",
      ),
    ),
  },
  {
    id: "seed-opportunity-british-council-future-leaders",
    title: "British Council Future Leaders",
    slug: "british-council-future-leaders",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    type: "Programme",
    description:
      "A year-long leadership track for students across the UK and Commonwealth.",
    ageRange: "Ages 16–21",
    funding: "Free",
    deadline: "January 31",
    tags: ["Leadership", "Programme"],
    featured: false,
    order: 5,
    longDescription: doc(
      paragraph(
        "Future Leaders is a year of workshops, mentoring and a social-action project run by the British Council for ambitious students from across the UK and Commonwealth.",
      ),
      guideImage(
        "opp-british-council-future-leaders",
        "Students in a British Council leadership workshop",
      ),
      heading2("The year at a glance"),
      paragraph(
        "Cohorts meet monthly online and twice in person. You build a project with a small team and present it to a panel of partners.",
      ),
      list([
        "No fees — fully supported.",
        "Mentors from business, policy and the arts.",
        "A certificate recognised by UK universities.",
      ]),
      heading2("Is it for you?"),
      paragraph(
        "You do not need to be top of the class. You need curiosity, consistency and a willingness to work with people unlike you.",
      ),
      quote(
        "I learned more about myself than any exam taught me.",
      ),
    ),
  },
  {
    id: "seed-opportunity-afs-intercultural-exchange",
    title: "AFS Intercultural Exchange",
    slug: "afs-intercultural-exchange",
    country: "Germany",
    countryFlag: "🇩🇪",
    type: "Exchange",
    description:
      "Spend a term at a German school and live with a host family.",
    ageRange: "Ages 15–18",
    funding: "Partial scholarship",
    deadline: "March 15",
    tags: ["Exchange", "School", "Germany"],
    featured: false,
    order: 6,
    longDescription: doc(
      paragraph(
        "AFS sends you to live with a host family and attend a local school for a term or a full year, fully immersed in daily life.",
      ),
      guideImage(
        "opp-afs-intercultural-exchange",
        "Exchange student with a host family in Germany",
      ),
      heading2("Life on exchange"),
      paragraph(
        "You take local classes, join clubs and become part of a family. Language improves fastest when you are forced to use it at dinner.",
      ),
      list([
        "Host family and school placement included.",
        "Partial scholarships available by need.",
        "Pre-departure and return support.",
      ]),
      heading2("What you gain"),
      paragraph(
        "Independence, a second language and a family on another continent. Alumni describe it as the year that changed their direction.",
      ),
      quote(
        "My host brother is still my brother.",
      ),
    ),
  },
  {
    id: "seed-opportunity-youth-exchange-green-deal",
    title: "Youth Exchange “Green Deal”",
    slug: "youth-exchange-green-deal",
    country: "Spain",
    countryFlag: "🇪🇸",
    type: "Exchange",
    description:
      "Ten days on climate action and biodiversity with peers from eight countries.",
    ageRange: "Ages 16–20",
    funding: "Fully funded",
    deadline: "April 20",
    tags: ["Exchange", "Climate", "Erasmus+"],
    featured: false,
    order: 7,
    longDescription: doc(
      paragraph(
        "A Green Deal youth exchange brings together young people from eight countries to design and run local climate actions.",
      ),
      guideImage(
        "opp-youth-exchange-green-deal",
        "Young people planting trees during a green youth exchange",
      ),
      heading2("The programme"),
      paragraph(
        "Workshops on biodiversity and just transition, then a small project you deliver in the host town with your group.",
      ),
      list([
        "Travel and stay covered by Erasmus+.",
        "Focus on hands-on local impact.",
        "Multinational teams.",
      ]),
      heading2("Why it matters"),
      paragraph(
        "Climate work feels huge; this exchange makes it local and social. You leave with friends and a project you can continue at home.",
      ),
      quote(
        "We planted forty trees and a habit I kept.",
      ),
    ),
  },
  {
    id: "seed-opportunity-harvard-secondary-school",
    title: "Harvard Secondary School Program",
    slug: "harvard-secondary-school-program",
    country: "USA",
    countryFlag: "🇺🇸",
    type: "Programme",
    description:
      "Take a real Harvard course for credit before university.",
    ageRange: "Ages 15–18",
    funding: "Paid",
    deadline: "May 10",
    tags: ["Programme", "Academic", "USA"],
    featured: false,
    order: 8,
    longDescription: doc(
      paragraph(
        "The Secondary School Program lets high-school students take Harvard courses for college credit, online or on campus.",
      ),
      guideImage(
        "opp-harvard-secondary-school-program",
        "Students studying on the Harvard campus",
      ),
      heading2("What you study"),
      paragraph(
        "Choose from writing, science, economics and more. You attend lectures, submit work and earn transferable credit.",
      ),
      list([
        "On-campus and online tracks.",
        "College credit awarded.",
        "Taught by Harvard faculty and affiliates.",
      ]),
      heading2("Worth knowing"),
      paragraph(
        "It is selective and not cheap, but financial aid exists. Treat it as a trial run of university life, not a summer camp.",
      ),
      quote(
        "I found out I liked economics by doing it.",
      ),
    ),
  },
  {
    id: "seed-opportunity-ka107-mobility",
    title: "KA107 International Mobility",
    slug: "ka107-international-mobility",
    country: "Poland",
    countryFlag: "🇵🇱",
    type: "Exchange",
    description:
      "Short study or training mobility to a partner university abroad.",
    ageRange: "Ages 18–24",
    funding: "Funded",
    deadline: "Rolling",
    tags: ["Exchange", "University", "Erasmus+"],
    featured: false,
    order: 9,
    longDescription: doc(
      paragraph(
        "KA107 funds short mobilities — from a week to a semester — between partner universities, often to and from non-EU countries.",
      ),
      guideImage(
        "opp-ka107-international-mobility",
        "International students on a partner-university campus",
      ),
      heading2("How it works"),
      paragraph(
        "Your university signs the agreement; you apply for a placement that fits your studies. A grant covers travel and living costs.",
      ),
      list([
        "Open to students and staff.",
        "Graded or recognised by your home school.",
        "Builds partner networks.",
      ]),
      heading2("Apply early"),
      paragraph(
        "Places are limited and announced per call. Talk to your international office before the deadline, not after.",
      ),
      quote(
        "Two weeks in Warsaw changed my whole plan.",
      ),
    ),
  },
  {
    id: "seed-opportunity-one-young-world",
    title: "One Young World Summit",
    slug: "one-young-world-summit",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    type: "Conference",
    description:
      "Annual summit where young leaders meet world figures and pitch solutions.",
    ageRange: "Ages 18–30",
    funding: "Scholarship available",
    deadline: "June 30",
    tags: ["Conference", "Leadership"],
    featured: false,
    order: 10,
    longDescription: doc(
      paragraph(
        "One Young World gathers young leaders from 190+ countries with presidents, activists and CEOs for a few intense days.",
      ),
      guideImage(
        "opp-one-young-world-summit",
        "Speakers on stage at the One Young World summit",
      ),
      heading2("On the floor"),
      paragraph(
        "Plenary debates, workshops and the chance to pitch your initiative to people who can fund or scale it.",
      ),
      list([
        "Scholarships cover many delegates.",
        "Mentorship from sector leaders.",
        "A global alumni network.",
      ]),
      heading2("After the summit"),
      paragraph(
        "Delegates return with contacts and a mandate. Many launch projects with peers they met in the corridor.",
      ),
      quote(
        "I pitched an idea and found three co-founders.",
      ),
    ),
  },
  {
    id: "seed-opportunity-iucn-youth-advisory",
    title: "IUCN Youth Advisory Forum",
    slug: "iucn-youth-advisory",
    country: "Remote",
    countryFlag: "🌍",
    type: "Programme",
    description:
      "Advise the IUCN on youth and nature policy, fully remote.",
    ageRange: "Ages 18–28",
    funding: "Unpaid",
    deadline: "Rolling",
    tags: ["Programme", "Nature", "Remote"],
    featured: false,
    order: 11,
    longDescription: doc(
      paragraph(
        "The IUCN Youth Advisory Forum brings young people into nature and conservation policy discussions at a global scale.",
      ),
      guideImage(
        "opp-iucn-youth-advisory",
        "Young conservationists on a video call",
      ),
      heading2("Your role"),
      paragraph(
        "You review consultations, propose youth perspectives and join working groups — all remotely, on a flexible schedule.",
      ),
      list([
        "Fully remote.",
        "Real input into policy.",
        "Network of conservation peers.",
      ]),
      heading2("Good for you if"),
      paragraph(
        "You care about biodiversity and can write clearly. It is unpaid but opens doors in environmental careers.",
      ),
      quote(
        "My comment made it into a position paper.",
      ),
    ),
  },
  {
    id: "seed-opportunity-spacex-stem-camp",
    title: "SpaceX STEM Camp",
    slug: "spacex-stem-camp",
    country: "USA",
    countryFlag: "🇺🇸",
    type: "Programme",
    description:
      "Two weeks of hands-on rocketry and coding for teens.",
    ageRange: "Ages 14–17",
    funding: "Scholarship available",
    deadline: "July 15",
    tags: ["Programme", "STEM", "USA"],
    featured: false,
    order: 12,
    longDescription: doc(
      paragraph(
        "A summer camp where teens build, code and launch real projects alongside engineers and mentors.",
      ),
      guideImage(
        "opp-spacex-stem-camp",
        "Teenagers building a small rocket at a STEM camp",
      ),
      heading2("What you build"),
      paragraph(
        "Teams design a payload, write the code and fly it. Failure is expected; debugging is the lesson.",
      ),
      list([
        "Hands-on, not lectures.",
        "Scholarships by application.",
        "Mentors from industry.",
      ]),
      heading2("Who thrives"),
      paragraph(
        "Curious teens who like making things. No prior experience required, just persistence.",
      ),
      quote(
        "Our rocket flew on the third try. Best day.",
      ),
    ),
  },
  {
    id: "seed-opportunity-adb-youth-internship",
    title: "ADB Youth Internship",
    slug: "adb-youth-internship",
    country: "Philippines",
    countryFlag: "🇵🇭",
    type: "Internship",
    description:
      "Internship at the Asian Development Bank on development projects.",
    ageRange: "Ages 19–25",
    funding: "Paid",
    deadline: "August 1",
    tags: ["Internship", "Development", "Asia"],
    featured: false,
    order: 13,
    longDescription: doc(
      paragraph(
        "The ADB youth internship places students in Manila or field offices to support poverty-reduction and infrastructure work.",
      ),
      guideImage(
        "opp-adb-youth-internship",
        "Interns at the Asian Development Bank office",
      ),
      heading2("The work"),
      paragraph(
        "You help with research, data and events tied to real loans and grants across Asia.",
      ),
      list([
        "Paid, full-time.",
        "Based in Manila or remote.",
        "Open to various majors.",
      ]),
      heading2("Before you apply"),
      paragraph(
        "Show relevant coursework or volunteering and a clear interest in development. A short cover note beats a long generic one.",
      ),
      quote(
        "I saw how a loan becomes a clinic.",
      ),
    ),
  },
  {
    id: "seed-opportunity-soros-equality-fellowship",
    title: "Soros Equality Fellowship",
    slug: "soros-equality-fellowship",
    country: "Hungary",
    countryFlag: "🇭🇺",
    type: "Fellowship",
    description:
      "A funded fellowship for young advocates working on open society.",
    ageRange: "Ages 20–30",
    funding: "Funded",
    deadline: "September 1",
    tags: ["Fellowship", "Advocacy"],
    featured: false,
    order: 14,
    longDescription: doc(
      paragraph(
        "The Equality Fellowship supports young people leading local projects on rights, inclusion and accountable institutions.",
      ),
      guideImage(
        "opp-soros-equality-fellowship",
        "Young advocates in a strategy workshop",
      ),
      heading2("The fellowship"),
      paragraph(
        "You get a stipend, training and a peer group to grow a project you already care about.",
      ),
      list([
        "Stipend provided.",
        "Training and mentorship.",
        "Flexible, project-based.",
      ]),
      heading2("Best fit"),
      paragraph(
        "Applicants with a running initiative and a clear ask. The fellowship amplifies, it does not invent.",
      ),
      quote(
        "They funded the work I was already doing.",
      ),
    ),
  },
  {
    id: "seed-opportunity-roots-and-shoots-grant",
    title: "Roots & Shoots Grant",
    slug: "roots-and-shoots-grant",
    country: "Global",
    countryFlag: "🌱",
    type: "Grant",
    description:
      "Small grants for youth-led environmental action projects.",
    ageRange: "Ages 16–25",
    funding: "Grant",
    deadline: "October 15",
    tags: ["Grant", "Environment"],
    featured: false,
    order: 15,
    longDescription: doc(
      paragraph(
        "Roots & Shoots gives small grants to groups of young people running local environmental or community projects.",
      ),
      guideImage(
        "opp-roots-and-shoots-grant",
        "Young people cleaning a local river",
      ),
      heading2("Apply with a plan"),
      paragraph(
        "You submit a simple plan, a budget and a team. Funds go straight to the activity, not overhead.",
      ),
      list([
        "Small, fast grants.",
        "For groups, not individuals.",
        "Any environment theme.",
      ]),
      heading2("Tips"),
      paragraph(
        "Specific, local and measurable wins. A river clean-up with a count beats a vague 'raise awareness'.",
      ),
      quote(
        "Two hundred euros cleared a whole beach.",
      ),
    ),
  },
  {
    id: "seed-opportunity-ted-ed-club",
    title: "TED-Ed Club",
    slug: "ted-ed-club",
    country: "Worldwide",
    countryFlag: "🌐",
    type: "Programme",
    description:
      "Run a club that helps you write and deliver your own TED-style talk.",
    ageRange: "Ages 13–18",
    funding: "Free",
    deadline: "Rolling",
    tags: ["Programme", "Speaking", "Online"],
    featured: false,
    order: 16,
    longDescription: doc(
      paragraph(
        "A TED-Ed Club is a term-long path to researching, writing and delivering a talk worth sharing.",
      ),
      guideImage(
        "opp-ted-ed-club",
        "A student delivering a TED-style talk",
      ),
      heading2("The arc"),
      paragraph(
        "You pick a question, build the idea and rehearse it. The final talk can be filmed and shared.",
      ),
      list([
        "Free curriculum.",
        "Run at school or online.",
        "Builds confidence fast.",
      ]),
      heading2("Why join"),
      paragraph(
        "Speaking anxiety drops when you own the idea. You leave with one talk you are proud of.",
      ),
      quote(
        "I finally said the thing I meant.",
      ),
    ),
  },
  {
    id: "seed-opportunity-world-heritage-volunteers",
    title: "World Heritage Volunteers",
    slug: "world-heritage-volunteers",
    country: "Italy",
    countryFlag: "🇮🇹",
    type: "Volunteer",
    description:
      "Conservation camps at UNESCO sites across Europe.",
    ageRange: "Ages 18–30",
    funding: "Funded",
    deadline: "Rolling",
    tags: ["Volunteer", "Heritage", "Europe"],
    featured: false,
    order: 17,
    longDescription: doc(
      paragraph(
        "WHV camps bring volunteers to heritage sites for hands-on conservation and interpretation work.",
      ),
      guideImage(
        "opp-world-heritage-volunteers",
        "Volunteers restoring a heritage wall in Italy",
      ),
      heading2("Camp life"),
      paragraph(
        "A week of practical work, evening talks and a team from many countries.",
      ),
      list([
        "Board and lodging covered.",
        "Sites across Europe.",
        "No experience needed.",
      ]),
      heading2("Takeaway"),
      paragraph(
        "You protect something old and meet people who care about it as much as you do.",
      ),
      quote(
        "I repaired a wall older than my country.",
      ),
    ),
  },
  {
    id: "seed-opportunity-eyf-project-grant",
    title: "EYF Project Grant",
    slug: "eyf-project-grant",
    country: "France",
    countryFlag: "🇫🇷",
    type: "Grant",
    description:
      "Grants from the European Youth Foundation for international youth activities.",
    ageRange: "Ages 15–30",
    funding: "Grant",
    deadline: "November 30",
    tags: ["Grant", "Europe", "Youth"],
    featured: false,
    order: 18,
    longDescription: doc(
      paragraph(
        "The EYF funds international activities led by youth NGOs — exchanges, trainings and campaigns.",
      ),
      guideImage(
        "opp-eyf-project-grant",
        "Young organisers at a youth project meeting",
      ),
      heading2("What it funds"),
      paragraph(
        "You apply as a group with a clear activity and budget. Grants cover the activity, not salaries.",
      ),
      list([
        "For youth organisations.",
        "International focus.",
        "Transparent criteria.",
      ]),
      heading2("How to win"),
      paragraph(
        "A realistic budget and a European dimension. Show who benefits, not just what you will do.",
      ),
      quote(
        "Our first grant paid for thirty train tickets.",
      ),
    ),
  },
];

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

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
  {
    id: "seed-session-global-debate-club",
    title: "Global Debate Club",
    slug: "global-debate-club",
    icon: "🗣️",
    description:
      "Weekly structured debates on world issues. Learn to argue and listen.",
    duration: "60 min",
    difficulty: "All levels",
    online: true,
    registerUrl: "https://global-connect.example/register/global-debate-club",
    upcoming: true,
    order: 5,
  },
  {
    id: "seed-session-university-prep",
    title: "University Prep Workshop",
    slug: "university-prep-workshop",
    icon: "🎓",
    description:
      "Step-by-step help with applications, essays and deadlines.",
    duration: "90 min",
    difficulty: "Beginner",
    online: true,
    registerUrl: "https://global-connect.example/register/university-prep-workshop",
    upcoming: true,
    order: 6,
  },
  {
    id: "seed-session-creative-writing",
    title: "Creative Writing Circle",
    slug: "creative-writing-circle",
    icon: "✍️",
    description: "Share drafts, get kind feedback, find your voice.",
    duration: "60 min",
    difficulty: "All levels",
    online: true,
    upcoming: true,
    order: 7,
  },
  {
    id: "seed-session-mental-health",
    title: "Mental Health & Wellbeing",
    slug: "mental-health-wellbeing",
    icon: "🧠",
    description:
      "Honest conversation about stress, study and staying well.",
    duration: "75 min",
    difficulty: "All levels",
    online: true,
    registerUrl: "https://global-connect.example/register/mental-health-wellbeing",
    upcoming: true,
    order: 8,
  },
  {
    id: "seed-session-coding-beginners",
    title: "Coding for Beginners",
    slug: "coding-for-beginners",
    icon: "👩‍💻",
    description: "Your first lines of Python, no experience needed.",
    duration: "90 min",
    difficulty: "Beginner",
    online: true,
    registerUrl: "https://global-connect.example/register/coding-for-beginners",
    upcoming: true,
    order: 9,
  },
  {
    id: "seed-session-model-un",
    title: "Model UN Session",
    slug: "model-un-session",
    icon: "🏛️",
    description: "Simulate the UN and negotiate a real resolution.",
    duration: "120 min",
    difficulty: "Intermediate",
    online: true,
    upcoming: false,
    order: 10,
  },
  {
    id: "seed-session-career-fair",
    title: "Career Fair Meetup",
    slug: "career-fair-meetup",
    icon: "💼",
    description:
      "Meet organisations hiring young talent across borders.",
    duration: "90 min",
    difficulty: "All levels",
    online: true,
    registerUrl: "https://global-connect.example/register/career-fair-meetup",
    upcoming: true,
    order: 11,
  },
  {
    id: "seed-session-art-culture",
    title: "Art & Culture Exchange",
    slug: "art-and-culture-exchange",
    icon: "🎨",
    description: "Show your culture, learn another's through making.",
    duration: "60 min",
    difficulty: "All levels",
    online: true,
    upcoming: true,
    order: 12,
  },
  {
    id: "seed-session-science-talks",
    title: "Science Talk Series",
    slug: "science-talk-series",
    icon: "🔬",
    description: "Young researchers explain their work simply.",
    duration: "45 min",
    difficulty: "All levels",
    online: true,
    upcoming: false,
    order: 13,
  },
  {
    id: "seed-session-volunteer-stories",
    title: "Volunteer Stories Night",
    slug: "volunteer-stories-night",
    icon: "📖",
    description: "Returned volunteers share what changed them.",
    duration: "60 min",
    difficulty: "All levels",
    online: true,
    upcoming: false,
    order: 14,
  },
];

// ---------------------------------------------------------------------------
// Guides
// ---------------------------------------------------------------------------

export const seedGuides: GuideData[] = [
  {
    id: "seed-guide-motivation-letter",
    title: "How to write a motivation letter",
    slug: "how-to-write-a-motivation-letter",
    readTime: 8,
    excerpt:
      "A practical guide to writing a motivation letter that gets your application noticed.",
    body: doc(
      paragraph(
        "A motivation letter is the one place in your application where you sound like a person, not a list of grades. Selection panels read dozens a day, so your job is to be specific, honest and easy to remember — not impressive in the generic sense.",
      ),
      guideImage(
        "how-to-write-a-motivation-letter",
        "A person writing a motivation letter at a laptop",
      ),
      heading2("Start with why, not with your CV"),
      paragraph(
        "Open with the concrete moment this opportunity mattered to you. A project you led, a question you could not stop thinking about, a community you want to serve. Committees can read your achievements elsewhere; they need the thread that connects them.",
      ),
      heading2("Structure that works"),
      list([
        "Paragraph 1 — the specific reason you are applying, in one story.",
        "Paragraph 2 — what you bring (skills, experience, perspective).",
        "Paragraph 3 — what you will do with it afterwards, and why it matters.",
        "Closing — a calm, confident restatement of fit.",
      ]),
      heading2("Cut the filler"),
      paragraph(
        "Delete “I am a very passionate and hard-working person.” Show the passion through the story and the work through the example. Every adjective should be backed by a fact.",
      ),
      quote(
        "The best letters I read are the ones where I could hear a real voice, not a template.",
      ),
      heading2("Before you send"),
      list([
        "Read it aloud — if a sentence trips you, rewrite it.",
        "Check the programme name and any specific question asked.",
        "One page. Always. Respect the reader’s time.",
      ]),
    ),
  },
  {
    id: "seed-guide-scholarships",
    title: "How to find scholarships",
    slug: "how-to-find-scholarships",
    readTime: 6,
    excerpt:
      "Where scholarship money hides, and how to match one to your profile.",
    body: doc(
      paragraph(
        "Most scholarships are not the famous, competitive ones everyone applies to. They are smaller, local, and aimed at a specific profile — your country, your field, your gender, your hobby. The trick is to search where others do not.",
      ),
      guideImage(
        "how-to-find-scholarships",
        "A student researching scholarship opportunities online",
      ),
      heading2("Search beyond the obvious"),
      list([
        "University departments often hold scholarships not listed on the main site — email the coordinator.",
        "Embassies and cultural institutes fund study in their language or country.",
        "Companies fund talent pipelines in engineering, agriculture, health.",
        "Local charities and diaspora associations support students from your region.",
      ]),
      heading2("Match, don’t mass-apply"),
      paragraph(
        "A targeted application to three well-matched scholarships beats fifty copy-pasted ones. Build a simple table: deadline, eligibility, what they want, what you have. Apply where the overlap is real.",
      ),
      quote(
        "The scholarship I won was advertised only on a bulletin board in the physics corridor.",
      ),
    ),
  },
  {
    id: "seed-guide-erasmus",
    title: "How Erasmus+ works",
    slug: "how-erasmus-works",
    readTime: 10,
    excerpt:
      "The EU's mobility programme explained, from applying to coming home.",
    body: doc(
      paragraph(
        "Erasmus+ is the EU’s programme for education, training, youth and sport. For young people it mostly means study exchanges, traineeships abroad, and youth exchanges — with travel and living costs partly or fully covered.",
      ),
      guideImage(
        "how-erasmus-works",
        "Students from different countries on an Erasmus+ exchange",
      ),
      heading2("The main routes"),
      list([
        "Study mobility — spend a semester at a partner university.",
        "Traineeship — an internship abroad, often between study years.",
        "Youth exchanges — short group programmes on a theme you care about.",
      ]),
      heading2("Money and paperwork"),
      paragraph(
        "Your home institution handles the grant and the learning agreement. Keep both documents; the grant is paid in instalments and the final one depends on you completing and submitting your confirmation of stay.",
      ),
      heading2("After you return"),
      paragraph(
        "Erasmus+ shows up well on CVs and often opens doors to traineeships and graduate programmes. The network you build is the part people underestimate at the start.",
      ),
      quote(
        "I went for one semester and came back with a second language and a job lead.",
      ),
    ),
  },
  {
    id: "seed-guide-interview",
    title: "How to prepare for an interview",
    slug: "how-to-prepare-for-an-interview",
    readTime: 7,
    excerpt:
      "What to expect, what to practise, and how to answer the tricky questions.",
    body: doc(
      paragraph(
        "Interviews reward preparation more than raw talent. The candidates who seem natural are usually the ones who rehearsed the boring parts until they were automatic.",
      ),
      video(
        "seed-video-interview-prep",
        "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        "Interview Preparation Guide",
        "A quick primer on what to expect and how to prepare for your next interview.",
      ),
      guideImage(
        "how-to-prepare-for-an-interview",
        "A candidate preparing for a job interview",
      ),
      heading2("Before the call"),
      list([
        "Research the organisation’s mission, not just its products.",
        "Prepare three stories using the situation–action–result shape.",
        "Have one sharp question that shows you did your homework.",
      ]),
      heading2("Answering the hard ones"),
      paragraph(
        "For “tell me about a weakness,” pick something real you are working on, and say how. For “why us,” name the specific thing only they offer. Silence is fine — think for two seconds before you speak.",
      ),
      quote(
        "I stopped trying to be impressive and started being specific. That changed everything.",
      ),
    ),
  },
  {
    id: "seed-guide-cv",
    title: "How to build your first CV",
    slug: "how-to-build-your-first-cv",
    readTime: 9,
    excerpt:
      "Build a CV that stands out when you're starting out — templates included.",
    body: doc(
      paragraph(
        "With no work history, your CV is proof of how you think and follow through. Projects, volunteering and school work count — frame them as things you owned and finished.",
      ),
      video(
        "seed-video-cv-tips",
        "https://www.youtube.com/watch?v=lv8TasO-EV4",
        "CV Writing Tips",
        "Watch this walkthrough on building a clean, effective CV from scratch.",
      ),
      guideImage(
        "how-to-build-your-first-cv",
        "A clean, well-structured first CV on a screen",
      ),
      heading2("Sections that carry weight"),
      list([
        "Education — with any standout subjects or awards.",
        "Projects — link to the repo, the video, the paper.",
        "Responsibility — a club, a team, a shift you were trusted with.",
        "Skills — be honest about level (basic / confident / fluent).",
      ]),
      heading2("Format rules"),
      paragraph(
        "One page, clean headings, no photo unless asked. Use the same verb tense. Export to PDF so it renders everywhere. Name the file your-name-cv.pdf, not final_final2.pdf.",
      ),
      quote(
        "Recruiters spend ten seconds first. Make the top third do the work.",
      ),
    ),
  },
  {
    id: "seed-guide-intl-programmes",
    title: "How to apply for international programmes",
    slug: "how-to-apply-for-international-programmes",
    readTime: 12,
    excerpt:
      "A step-by-step walkthrough of the application process for international opportunities.",
    body: doc(
      paragraph(
        "International programmes look intimidating because the steps are unfamiliar, not because they are hard. Break the process into stages and treat each as a small task with its own deadline.",
      ),
      guideImage(
        "how-to-apply-for-international-programmes",
        "A world map with pins marking international opportunities",
      ),
      heading2("The application staircase"),
      list([
        "Eligibility — confirm you qualify before spending an hour on forms.",
        "Documents — passport, transcripts, proof of language, references.",
        "Motivation — one letter, adapted per programme, never copied.",
        "Submission — upload early; portals crash on the last night.",
        "Follow-up — note interview dates and check spam folders.",
      ]),
      heading2("Common mistakes"),
      paragraph(
        "Missing the local-time deadline, ignoring the word limit, and sending the same letter to two programmes that name each other. Panels notice.",
      ),
      quote(
        "I missed my first deadline by six minutes. I have never cut it close since.",
      ),
      heading2("If you are rejected"),
      paragraph(
        "Most successful applicants were rejected first. Ask for feedback, fix the weak part, and apply to the next round or the next programme. Persistence beats perfection.",
      ),
    ),
  },
];

// ---------------------------------------------------------------------------
// Videos (embedded in guide bodies)
// ---------------------------------------------------------------------------

export const seedVideos: VideoData[] = [
  {
    id: "seed-video-cv-tips",
    title: "CV Writing Tips",
    videoUrl: "https://www.youtube.com/watch?v=lv8TasO-EV4",
    caption:
      "Watch this walkthrough on building a clean, effective CV from scratch.",
  },
  {
    id: "seed-video-interview-prep",
    title: "Interview Preparation Guide",
    videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    caption:
      "A quick primer on what to expect and how to prepare for your next interview.",
  },
];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

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
  {
    id: "seed-story-daria",
    quote:
      "Global Connect showed me that opportunities abroad are not just for 'other' people. I applied, and I went.",
    name: "Daria",
    location: "Germany",
    role: "Global Connect Member",
  },
  {
    id: "seed-story-tom",
    quote:
      "The sessions gave me the confidence to speak in English without fear. Now I host one.",
    name: "Tom",
    location: "Ireland",
    role: "Speaking Club Host",
  },
  {
    id: "seed-story-amina",
    quote:
      "I found a scholarship I never knew existed, three streets from my house, advertised at my school.",
    name: "Amina",
    location: "Kenya",
    role: "Global Connect Member",
  },
  {
    id: "seed-story-lucas",
    quote:
      "My first conference felt impossible until a mentor from Global Connect walked me through it.",
    name: "Lucas",
    location: "Brazil",
    role: "Global Connect Member",
  },
  {
    id: "seed-story-yuki",
    quote:
      "An exchange in Spain taught me more Spanish in a month than school did in years.",
    name: "Yuki",
    location: "Japan",
    role: "Exchange Alumna",
  },
  {
    id: "seed-story-noor",
    quote:
      "I launched a small climate project with friends I met in a session. It is still running.",
    name: "Noor",
    location: "Netherlands",
    role: "Project Lead",
  },
  {
    id: "seed-story-elias",
    quote:
      "The community kept me going after two rejections. The third application worked.",
    name: "Elias",
    location: "Greece",
    role: "Global Connect Member",
  },
];

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------

export const seedPartners: PartnerData[] = [
  { id: "seed-partner-lyceum", name: "Lyceum №14" },
  { id: "seed-partner-youthbridge", name: "Youth Bridge NGO" },
  { id: "seed-partner-esn", name: "Erasmus Student Network" },
  { id: "seed-partner-coimbra", name: "Univ. of Coimbra" },
  { id: "seed-partner-openfuture", name: "OpenFuture Labs" },
  { id: "seed-partner-coy", name: "Council of Youth" },
];

// ---------------------------------------------------------------------------
// Path steps
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Interests
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Community topics (shown on the Community page)
// ---------------------------------------------------------------------------

export const seedCommunity: CommunityData[] = [
  { id: "seed-community-travel", emoji: "🌍", label: "Travel & exchanges", members: "1,240 members" },
  { id: "seed-community-studying", emoji: "🎓", label: "Studying abroad", members: "980 members" },
  { id: "seed-community-speaking", emoji: "🎤", label: "Speaking clubs", members: "760 members" },
  { id: "seed-community-tech", emoji: "💻", label: "Technology & AI", members: "540 members" },
  { id: "seed-community-volunteering", emoji: "🤝", label: "Volunteering", members: "610 members" },
  { id: "seed-community-scholarships", emoji: "🎓", label: "Scholarships", members: "830 members" },
  { id: "seed-community-entrepreneurship", emoji: "🚀", label: "Entrepreneurship", members: "420 members" },
  { id: "seed-community-research", emoji: "🧠", label: "Research", members: "290 members" },
  { id: "seed-community-competitions", emoji: "🏆", label: "Competitions", members: "510 members" },
  { id: "seed-community-climate", emoji: "🌱", label: "Climate & Sustainability", members: "370 members" },
];

// ---------------------------------------------------------------------------
// Cities (community avatar grid on the homepage)
// ---------------------------------------------------------------------------

export const seedCities: CityData[] = [
  { id: "seed-city-kyiv", initials: "LR", city: "Kyiv", order: 1 },
  { id: "seed-city-lisbon", initials: "MK", city: "Lisbon", order: 2 },
  { id: "seed-city-warsaw", initials: "AS", city: "Warsaw", order: 3 },
  { id: "seed-city-nairobi", initials: "TN", city: "Nairobi", order: 4 },
  { id: "seed-city-berlin", initials: "JD", city: "Berlin", order: 5 },
  { id: "seed-city-istanbul", initials: "YB", city: "Istanbul", order: 6 },
  { id: "seed-city-manila", initials: "SC", city: "Manila", order: 7 },
  { id: "seed-city-madrid", initials: "EM", city: "Madrid", order: 8 },
];

// ---------------------------------------------------------------------------
// Homepage sections
// ---------------------------------------------------------------------------

export const seedHomepageSections: Record<
  HomepageSectionKey,
  HomepageSectionData
> = {
  hero: {
    id: "seed-homepage-hero",
    section: "hero",
    eyebrow: "For young people, everywhere",
    title: "Your next global opportunity starts here.",
    description:
      "Discover international opportunities, learn from experts, build confidence and connect with young people around the world.",
    imageUrl: "/hero-youth.jpg",
    imageAlt: "Young people from different countries laughing together on a campus",
    enabled: true,
  },
  stats: {
    id: "seed-homepage-stats",
    section: "stats",
    enabled: true,
  },
  opportunityFinder: {
    id: "seed-homepage-opportunity-finder",
    section: "opportunityFinder",
    eyebrow: "Opportunity finder",
    title: "Find an opportunity that's actually for you.",
    description: "Stop scrolling through opportunities you can't apply for.",
    enabled: true,
  },
  path: {
    id: "seed-homepage-path",
    section: "path",
    eyebrow: "The path",
    title: "How Global Connect works",
    enabled: true,
  },
  sessions: {
    id: "seed-homepage-sessions",
    section: "sessions",
    eyebrow: "Online sessions",
    title: "Learn. Speak. Connect.",
    description:
      "Build the skills and confidence you need to take your next global step.",
    imageUrl: "/session-online.jpg",
    imageAlt: "A young woman taking notes during an online Global Connect session",
    enabled: true,
  },
  guides: {
    id: "seed-homepage-guides",
    section: "guides",
    eyebrow: "Guides",
    title: "Don't just find opportunities. Learn how to get them.",
    enabled: true,
  },
  stories: {
    id: "seed-homepage-stories",
    section: "stories",
    eyebrow: "Student stories",
    title: "Real people. Real opportunities. Real growth.",
    description:
      "Real experiences from young people discovering opportunities, building confidence and connecting with the world.",
    enabled: true,
  },
  community: {
    id: "seed-homepage-community",
    section: "community",
    eyebrow: "Community",
    title: "You're not doing this alone.",
    description:
      "Global Connect is more than an opportunity directory. It's a place where young people prepare together, share what worked, and keep going after the first rejection.",
    imageUrl: "/community-circle.jpg",
    imageAlt: "Young people from different countries talking in a circle",
    enabled: true,
  },
  discovery: {
    id: "seed-homepage-discovery",
    section: "discovery",
    eyebrow: "Personalised discovery",
    title: "What do you dream about?",
    description:
      "Tell us what you're interested in, and we'll help you find somewhere to begin.",
    enabled: true,
  },
  partners: {
    id: "seed-homepage-partners",
    section: "partners",
    title: "Built with people who believe in young people.",
    enabled: true,
  },
  finalCta: {
    id: "seed-homepage-final-cta",
    section: "finalCta",
    title: "The world is bigger than you think.",
    description: "Your next opportunity could be one search away.",
    enabled: true,
  },
};
