import { isNonEmptyArray } from '../../utils/guards';
import type {
  BannerViewModel,
  BookedEventStatus,
  BookedEventViewModel,
  CategoriesViewModel,
  CurrentEventViewModel,
  OccasionArtKey,
  PackagesViewModel,
  HomeFeedDTO,
  HomeViewModel,
  HowItWorksViewModel,
  TopOrganizersViewModel,
  ToolsViewModel,
} from './types';

/** hero content -> the greeting banner. Hidden if hero copy is missing. */
export function mapBanner(feed: HomeFeedDTO): BannerViewModel | null {
  const hero = feed.content?.hero;
  if (!hero) return null;

  const firstName = feed.user?.name?.split(' ')[0] || feed.user?.name || 'there';

  return {
    greeting: hero.greetingTemplate.replace('{name}', firstName),
    headingLead: hero.headingLead,
    headingAccent: hero.headingAccent,
    headingTail: hero.headingTail,
    subtitle: hero.subtitle,
    draftLabel: hero.draftLabel,
    defaultDraft: hero.defaultDraft,
    options: hero.options,
    trust: isNonEmptyArray(hero.trust) ? hero.trust.map((t) => ({ icon: t.icon, label: t.label })) : [],
  };
}

const BOOKED_STATUSES: BookedEventStatus[] = [
  'pending',
  'awaiting_organizer',
  'confirmed',
  'in_progress',
];

/**
 * The ongoing booking behind Home's "BOOKED" card.
 *
 * Everything shown — title, copy, milestones, the ring's percentage — is
 * composed by the backend, so this only hardens the payload: a record with no
 * reference or title cannot be drawn as a booking, and a milestone with no
 * label would render as a blank chip, so it is dropped rather than shown.
 */
export function mapBookedEvent(feed: HomeFeedDTO): BookedEventViewModel | null {
  const b = feed.booking;
  // The card's whole action is opening this booking's workspace, so a record
  // with no id cannot be drawn as one — nor can one with no reference or
  // title be drawn as a booking at all.
  if (!b || !b.id || !b.ref || !b.title) return null;

  return {
    id: b.id,
    ref: b.ref,
    title: b.title,
    description: b.description ?? '',
    progress: clampPercent(b.progress),
    daysToGo: Number.isFinite(b.daysToGo) ? Math.max(0, Math.trunc(b.daysToGo)) : 0,
    status: BOOKED_STATUSES.includes(b.status) ? b.status : 'confirmed',
    // A record predating the field is treated as confirmed rather than as
    // "awaiting confirmation", which would be a scarier claim than the truth.
    organizerConfirmed: b.organizerConfirmed !== false,
    organizerName: b.organizerName || 'Your organizer',
    steps: isNonEmptyArray(b.steps)
      ? b.steps.filter((s) => !!s?.label).map((s) => ({ label: s.label, done: s.done === true }))
      : [],
  };
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** the customer's in-progress event, shown as its own section. Hidden if there is none. */
export function mapCurrentEvent(feed: HomeFeedDTO): CurrentEventViewModel | null {
  if (!feed.currentEvent) return null;

  const e = feed.currentEvent;
  return {
    title: e.title,
    // Each of these is passed through untouched: a value the backend left
    // blank stays blank, so the card can say "not set" instead of guessing.
    occasion: e.occasion ?? '',
    when: e.when ?? '',
    where: e.where ?? '',
    guests: e.guests ?? '',
    source: e.source ?? 'plan',
    progress: e.progress,
    daysToGo: e.daysToGo,
    stage: e.stage,
  };
}

/** planSection.occasions -> category tiles. Hidden if there are none. */
export function mapCategories(feed: HomeFeedDTO): CategoriesViewModel | null {
  const section = feed.content?.planSection;
  if (!section || !isNonEmptyArray(section.occasions)) return null;

  return {
    title: section.title,
    subtitle: section.subtitle,
    items: section.occasions.map((o) => ({ id: o.id, icon: o.icon, art: o.art, label: o.label, cta: o.cta })),
  };
}

/** active packages -> featured events. Hidden if there are none. */
const PACKAGE_ART_KEYS: OccasionArtKey[] = [
  'wedding',
  'birthday',
  'housewarming',
  'naming',
  'anniversary',
  'corporate',
];

export function mapPackages(feed: HomeFeedDTO): PackagesViewModel | null {
  if (!isNonEmptyArray(feed.packages)) return null;

  return {
    title: feed.content?.packages?.title ?? 'Curated packages by budget',
    subtitle: feed.content?.packages?.subtitle ?? '',
    buildLabel: feed.content?.packages?.buildLabel ?? null,
    items: feed.packages.map((p) => ({
      id: p.id,
      badge: p.badge,
      title: p.title,
      guests: p.guests,
      budget: p.budget,
      tags: isNonEmptyArray(p.tags) ? p.tags : [],
      // An unknown art key would index the gradient map to undefined and crash
      // the banner; 'wedding' is the neutral navy the app already uses as its
      // default card treatment.
      art: PACKAGE_ART_KEYS.includes(p.art) ? p.art : 'wedding',
    })),
  };
}

/** top organizers -> recommended events. Hidden if there are none. */
export function mapTopOrganizers(feed: HomeFeedDTO): TopOrganizersViewModel | null {
  if (!isNonEmptyArray(feed.topOrganizers)) return null;

  return {
    title: feed.content?.topOrganizers?.title ?? 'Top organizers near you',
    // 'all' means nothing local matched and these come from further afield.
    // Defaulted to 'all' so an older payload caveats itself rather than
    // claiming a locality it never asserted.
    scope: feed.topOrganizersScope === 'city' ? 'city' : 'all',
    city: feed.user?.location ?? '',
    items: feed.topOrganizers.map((o) => ({
      id: o.id,
      name: o.name,
      initials: o.initials,
      avatarColor: o.avatarColor,
      tier: o.tier,
      // Passed through as stored: an organizer with no reviews shows 0, and
      // the card draws no stars for it.
      rating: Number.isFinite(o.rating) ? o.rating : 0,
      reviews: Number.isFinite(o.reviews) ? o.reviews : 0,
      events: Number.isFinite(o.events) ? o.events : 0,
      tags: isNonEmptyArray(o.tags) ? o.tags : [],
    })),
  };
}

/** static "How Evently works" step copy. Hidden if there are no steps. */
export function mapHowItWorks(feed: HomeFeedDTO): HowItWorksViewModel | null {
  const section = feed.content?.howItWorks;
  if (!section || !isNonEmptyArray(section.steps)) return null;

  return {
    title: section.title,
    subtitle: section.subtitle,
    steps: section.steps.map((s) => ({ num: s.num, icon: s.icon, title: s.title, description: s.description })),
  };
}

/** static "Plan smarter" tools copy. Hidden if there are no tools. */
export function mapTools(feed: HomeFeedDTO): ToolsViewModel | null {
  const section = feed.content?.tools;
  if (!section || !isNonEmptyArray(section.tools)) return null;

  return {
    title: section.title,
    subtitle: section.subtitle,
    tools: section.tools.map((t) => ({ id: t.id, icon: t.icon, title: t.title, description: t.description })),
  };
}

export function mapHomeFeed(feed: HomeFeedDTO): HomeViewModel {
  return {
    banner: mapBanner(feed),
    bookedEvent: mapBookedEvent(feed),
    currentEvent: mapCurrentEvent(feed),
    categories: mapCategories(feed),
    packages: mapPackages(feed),
    topOrganizers: mapTopOrganizers(feed),
    howItWorks: mapHowItWorks(feed),
    tools: mapTools(feed),
  };
}
