import { isNonEmptyArray } from '../../utils/guards';
import { absoluteFileUrl } from '../../services/urls';
import { CURRENT_EVENT_STAGE_LABEL, OCCASION_TILE_ICON } from './constants';
import type {
  BannerViewModel,
  BookedEventStatus,
  BookedEventViewModel,
  CategoriesViewModel,
  CurrentEventViewModel,
  OccasionArtKey,
  OccasionsViewModel,
  OffersViewModel,
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

/**
 * Indian-format currency. '' for an amount nobody set, so every caller drops
 * the line rather than printing ₹0 as though it were a figure.
 */
/**
 * A price short enough for a card corner: ₹7L, ₹6.5L, ₹40K.
 *
 * Indian units rather than a truncated full figure, because "₹7,00,000" in a
 * 60pt column either wraps or gets an ellipsis, and an ellipsised price is
 * worse than no price. Below a thousand it is printed in full — rounding a
 * small number into a unit loses more than it saves.
 */
export function formatCompactINR(amount: number | undefined | null): string {
  if (!Number.isFinite(amount) || (amount as number) <= 0) return '';
  const value = amount as number;
  if (value >= 10000000) return `₹${trimZero(value / 10000000)}Cr`;
  if (value >= 100000) return `₹${trimZero(value / 100000)}L`;
  if (value >= 1000) return `₹${trimZero(value / 1000)}K`;
  return `₹${Math.round(value)}`;
}

/** 6.5 stays 6.5; 7.0 becomes 7 — a trailing zero is noise at this size. */
function trimZero(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatINR(amount: number | undefined | null): string {
  if (!Number.isFinite(amount) || (amount as number) <= 0) return '';
  return `₹${Math.round(amount as number).toLocaleString('en-IN')}`;
}

/**
 * The one line under the hero's title: date, place, headcount.
 *
 * Only the parts the record actually carries, joined — an event with no venue
 * yet reads "5 Sep 2026 · 150 guests" rather than showing an empty slot the
 * customer would read as missing information about their own event.
 */
export function factsLineOf(when: string, where: string, guests: string): string {
  return [when, where, guests].map((v) => (v ?? '').trim()).filter(Boolean).join(' · ');
}

/** the customer's in-progress event, shown as its own section. Hidden if there is none. */
export function mapCurrentEvent(feed: HomeFeedDTO): CurrentEventViewModel | null {
  if (!feed.currentEvent) return null;

  const e = feed.currentEvent;
  return {
    refId: e.refId,
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
    factsLine: factsLineOf(e.when ?? '', e.where ?? '', e.guests ?? ''),
    stageLabel: CURRENT_EVENT_STAGE_LABEL[e.stage] ?? '',
    quoteCount: e.quoteCount ?? 0,
    /*
     * Both figures or neither. A lone "lowest ₹6,25,000" reads as the price,
     * and the whole point of the line is that there is a range to compare.
     */
    spreadLabel:
      e.lowestQuote > 0 && e.highestQuote > 0
        ? `Lowest ${formatINR(e.lowestQuote)} · highest ${formatINR(e.highestQuote)}`
        : '',
    quotedLabel:
      (e.quoteCount ?? 0) > 0
        ? `${e.quoteCount} organizer${e.quoteCount === 1 ? '' : 's'} have quoted`
        : '',
  };
}

/**
 * "Plan something new" — every occasion, with the one honest line under it.
 *
 * The badge wins over the price when an occasion has both: "Most planned" says
 * something about this platform that a starting price does not, and two lines
 * in a tile that size is a squeeze.
 */
export function mapOccasions(feed: HomeFeedDTO): OccasionsViewModel | null {
  const tiles = feed.occasions;
  if (!isNonEmptyArray(tiles)) return null;

  return {
    title: feed.content?.planSection?.title ?? 'Plan something new',
    subtitle: feed.content?.planSection?.subtitle ?? '',
    items: tiles.map((tile) => ({
      id: tile.id,
      art: PACKAGE_ART_KEYS.includes(tile.art as OccasionArtKey)
        ? (tile.art as OccasionArtKey)
        : 'wedding',
      label: tile.label,
      icon: OCCASION_TILE_ICON[tile.art] ?? 'sparkles',
      note: tile.mostPlanned ? 'Most planned' : tile.fromPrice > 0 ? `From ${formatINR(tile.fromPrice)}` : '',
    })),
  };
}

/**
 * The live offers.
 *
 * The count is the real number of cards, not a fixed "3 live" — a section
 * header that says three when two are running is the kind of small lie that
 * makes a customer stop believing the rest of the screen.
 */
export function mapOffers(feed: HomeFeedDTO): OffersViewModel | null {
  if (!isNonEmptyArray(feed.offers)) return null;

  return {
    title: 'Offers for you',
    countLabel: `${feed.offers.length} live`,
    items: feed.offers.map((offer) => ({
      id: offer.id,
      eyebrow: offer.eyebrow,
      title: offer.title,
      // The window, when there is one, is worth more than generic terms.
      terms: offer.endsLabel || offer.terms,
      ctaLabel: offer.ctaLabel,
      tone: offer.tone === 'navy' ? ('navy' as const) : ('accent' as const),
    })),
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
      bannerNote: p.bannerNote ?? '',
      photoUrl: absoluteFileUrl(p.photoUrl),
      priceLabel: formatINR(p.price),
      // Only a genuine reduction is struck through; the backend already
      // refuses a "was" figure that is not above the current price.
      listPriceLabel: formatINR(p.listPrice),
      organizer: p.organizer
        ? {
            id: p.organizer.id,
            name: p.organizer.name,
            rating: p.organizer.rating ?? 0,
            reviews: p.organizer.reviews ?? 0,
            bookedLabel:
              (p.organizer.bookedThisMonth ?? 0) > 0
                ? `${p.organizer.bookedThisMonth} booked this month`
                : '',
          }
        : null,
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

  const scope = feed.topOrganizersScope === 'city' ? 'city' : 'all';
  const city = feed.user?.location ?? '';

  return {
    // "near you" only when they really are. When the search had to widen, the
    // heading says so rather than claiming a locality the server never asserted.
    title: scope === 'city' ? 'Organizers near you' : 'Organizers on Evently',
    scopeNote:
      scope === 'city'
        ? ''
        : city
          ? `No organizers listed in ${city} yet — these serve other cities. Change your city.`
          : ('These organizers serve other cities. Set your city to see local ones.' as string),
    // 'all' means nothing local matched and these come from further afield.
    // Defaulted to 'all' so an older payload caveats itself rather than
    // claiming a locality it never asserted.
    scope,
    city,
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
      // Each of these is '' when the organizer has not published the figure:
      // "FROM ₹0" and "Replies in 0h" are worse than saying nothing at all.
      fromLabel: formatCompactINR(o.basePrice),
      repliesLabel: o.responseHours > 0 ? `Replies in ${o.responseHours}h` : '',
      bookedLabel:
        (o.bookedThisMonth ?? 0) > 0 ? `${o.bookedThisMonth} booked this month` : '',
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
    occasions: mapOccasions(feed),
    offers: mapOffers(feed),
    packages: mapPackages(feed),
    topOrganizers: mapTopOrganizers(feed),
    howItWorks: mapHowItWorks(feed),
    tools: mapTools(feed),
  };
}
