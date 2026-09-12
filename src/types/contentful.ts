import type {
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
} from "contentful";

export type OpportunitySkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol<string>;
    slug: EntryFieldTypes.Symbol<string>;
    country: EntryFieldTypes.Symbol<string>;
    countryFlag: EntryFieldTypes.Symbol<string>;
    type: EntryFieldTypes.Symbol<string>;
    description: EntryFieldTypes.Text<string>;
    longDescription?: EntryFieldTypes.RichText;
    ageRange: EntryFieldTypes.Symbol<string>;
    funding: EntryFieldTypes.Symbol<string>;
    deadline: EntryFieldTypes.Symbol<string>;
    tags: EntryFieldTypes.Array<EntryFieldTypes.Symbol<string>>;
    image?: EntryFieldTypes.AssetLink;
    featured?: EntryFieldTypes.Boolean;
    order?: EntryFieldTypes.Integer<number>;
  },
  "opportunity"
>;

export type SessionSkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol<string>;
    slug: EntryFieldTypes.Symbol<string>;
    icon: EntryFieldTypes.Symbol<string>;
    description: EntryFieldTypes.Text<string>;
    duration: EntryFieldTypes.Symbol<string>;
    difficulty: EntryFieldTypes.Symbol<string>;
    online?: EntryFieldTypes.Boolean;
    registerUrl?: EntryFieldTypes.Symbol<string>;
    upcoming?: EntryFieldTypes.Boolean;
    order?: EntryFieldTypes.Integer<number>;
  },
  "session"
>;

export type GuideSkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol<string>;
    slug: EntryFieldTypes.Symbol<string>;
    readTime?: EntryFieldTypes.Integer<number>;
    excerpt: EntryFieldTypes.Text<string>;
    body: EntryFieldTypes.RichText;
    publishedAt?: EntryFieldTypes.Date;
  },
  "guide"
>;

export type StorySkeleton = EntrySkeletonType<
  {
    quote: EntryFieldTypes.Text<string>;
    name: EntryFieldTypes.Symbol<string>;
    location: EntryFieldTypes.Symbol<string>;
    role: EntryFieldTypes.Symbol<string>;
    approved?: EntryFieldTypes.Boolean;
  },
  "story"
>;

export type PartnerSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol<string>;
    logo?: EntryFieldTypes.AssetLink;
    website?: EntryFieldTypes.Symbol<string>;
  },
  "partner"
>;

export type PathStepSkeleton = EntrySkeletonType<
  {
    stepNumber: EntryFieldTypes.Integer<number>;
    title: EntryFieldTypes.Symbol<string>;
    description: EntryFieldTypes.Text<string>;
  },
  "pathStep"
>;

export type InterestSkeleton = EntrySkeletonType<
  {
    label: EntryFieldTypes.Symbol<string>;
    emoji: EntryFieldTypes.Symbol<string>;
  },
  "interest"
>;

export type CommunitySkeleton = EntrySkeletonType<
  {
    emoji: EntryFieldTypes.Symbol<string>;
    label: EntryFieldTypes.Symbol<string>;
    members: EntryFieldTypes.Symbol<string>;
  },
  "community"
>;

export type Opportunity = Entry<OpportunitySkeleton, undefined, "en-US">;
export type Session = Entry<SessionSkeleton, undefined, "en-US">;
export type Guide = Entry<GuideSkeleton, undefined, "en-US">;
export type Story = Entry<StorySkeleton, undefined, "en-US">;
export type Partner = Entry<PartnerSkeleton, undefined, "en-US">;
export type PathStep = Entry<PathStepSkeleton, undefined, "en-US">;
export type Interest = Entry<InterestSkeleton, undefined, "en-US">;
export type Community = Entry<CommunitySkeleton, undefined, "en-US">;