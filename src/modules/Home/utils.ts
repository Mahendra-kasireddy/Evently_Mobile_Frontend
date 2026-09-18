import { isNonEmptyArray } from '../../utils/guards';
import { absoluteFileUrl } from '../../services/urls';
import {
  CURRENT_EVENT_CTA,
  CURRENT_EVENT_STAGE_LABEL,
  OCCASION_TILE_ICON,
} from './constants';
import type {
  BannerViewModel,
  BookedEventStatus,
  BookedEventViewModel,
  CategoriesViewModel,
  CurrentEventDTO,
  CurrentEventViewModel,
  OccasionArtKey,
  OccasionsViewModel,
  ClaimableCouponDTO,
  CouponsViewModel,
  CurrentEventStage,
  QuoteOrganizerRefDTO,
  QuoteRow,
  QuoteRowDTO,
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

  const firstName =
    feed.user?.name?.split(' ')[0] || feed.user?.name || 'there';

  return {
    greeting: hero.greetingTemplate.replace('{name}', firstName),
    headingLead: hero.headingLead,
    headingAccent: hero.headingAccent,
    headingTail: hero.headingTail,
    subtitle: hero.subtitle,
    draftLabel: hero.draftLabel,
    defaultDraft: hero.defaultDraft,
    options: hero.options,
    trust: isNonEmptyArray(hero.trust)
      ? hero.trust.map(t => ({ icon: t.icon, label: t.label }))
      : [],
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
/** Two letters from a business name, for the avatar the server did not send. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '·';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * What the organizer is actually doing for this customer right now.
 *
 * A count is only quoted once there is one — a fresh booking has no tasks, and
 * "Managing 0 vendors for you" is the kind of line that makes a customer stop
 * believing the rest of the card. Before the organizer has confirmed, the true
 * thing to say is that they have not yet.
 */
function organizerNote(confirmed: boolean, vendorCount: number): string {
  if (!confirmed) return 'Confirming your booking';
  if (vendorCount === 0) return 'Managing your event';
  return `Managing ${vendorCount} vendor${
    vendorCount === 1 ? '' : 's'
  } for you`;
}

export function mapBookedEvent(feed: HomeFeedDTO): BookedEventViewModel | null {
  const b = feed.booking;
  /*
   * The card's whole action is opening this booking's workspace, so a record
   * with no id cannot be drawn as one, and one with no title has nothing to
   * put on it.
   *
   * `ref` used to be required too, and it is decoration — a booking reference
   * printed in the corner. An older row with an empty one made the entire
   * booked card vanish from Home, which is how a customer ends up believing a
   * confirmed booking was lost. It is rendered when present and omitted when
   * not.
   */
  if (!b || !b.id || !b.title) return null;

  const steps = isNonEmptyArray(b.steps)
    ? b.steps
        .filter(s => !!s?.label)
        .map(s => ({ label: s.label, done: s.done === true }))
    : [];
  const daysToGo = Number.isFinite(b.daysToGo)
    ? Math.max(0, Math.trunc(b.daysToGo))
    : 0;
  const confirmed = b.organizerConfirmed !== false;
  const organizerName = b.organizerName || 'Your organizer';
  const vendorCount = Number.isFinite(b.vendorCount)
    ? Math.max(0, Math.trunc(b.vendorCount))
    : 0;

  return {
    id: b.id,
    ref: b.ref ?? '',
    title: b.title,
    description: b.description ?? '',
    /*
     * Only the facts the booking actually holds. A booking with no brief has
     * no headcount, and a line reading "5 Sep 2026 · Kukatpally · guests" is
     * worse than one that stops after the venue.
     */
    factsLine: [b.dateLabel, b.location, b.guests ? `${b.guests} guests` : '']
      .map(part => (part ?? '').trim())
      .filter(Boolean)
      .join(' · '),
    daysToGoValue: daysToGo === 0 ? 'Today' : String(daysToGo),
    daysToGoLabel:
      daysToGo === 0 ? '' : daysToGo === 1 ? 'day to go' : 'days to go',
    progress: clampPercent(b.progress),
    daysToGo,
    status: BOOKED_STATUSES.includes(b.status) ? b.status : 'confirmed',
    // A record predating the field is treated as confirmed rather than as
    // "awaiting confirmation", which would be a scarier claim than the truth.
    organizerConfirmed: confirmed,
    organizerName,
    organizerId: b.organizerId ?? '',
    organizerInitials: b.organizerInitials || initialsOf(organizerName),
    organizerAvatarColor: b.organizerAvatarColor || '#1a2e5a',
    organizerNote: organizerNote(confirmed, vendorCount),
    stepsDoneLabel: `${steps.filter(s => s.done).length} of ${
      steps.length
    } steps done`,
    steps,
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
export function factsLineOf(
  when: string,
  where: string,
  guests: string,
): string {
  return [when, where, guests]
    .map(v => (v ?? '').trim())
    .filter(Boolean)
    .join(' · ');
}

/**
 * One date format, whatever the server sent.
 *
 * `when` used to be passed through untouched, and the two server paths that
 * compose an event do not agree: the request path emits "2026-09-21", the
 * booking path emits "21 September 2026". The customer saw both, on two cards
 * about the same event, and had no way to tell they were the same day.
 *
 * Only a bare ISO date is rewritten. Anything else — a range, a "TBC", a date
 * the backend already spelled out — is left exactly as it arrived, because
 * guessing at a format Home does not recognise is how a real value becomes
 * "Invalid Date".
 */
export function normalizeWhen(when: string): string {
  const raw = (when ?? '').trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!iso) return raw;

  const [, year, month, day] = iso;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return raw;

  // The spelling every other screen uses — Workspace, Chat and Invitation all
  // format their dates this way.
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * What makes two feed entries the same event.
 *
 * `refId` is the honest answer and is tried first, but it does not catch the
 * duplicate that actually reached customers: one event resolved from two
 * different records — the quote request and the plan behind it — carries two
 * different ids under two different `source` values. What it cannot vary is
 * the event itself, so the fallback is everything the customer reads on the
 * card: its name, its occasion, its day and its place. All four, because two
 * genuinely different events on one date at one venue are a real thing a
 * customer can have, and collapsing those would hide one of them.
 */
function eventIdentity(e: CurrentEventDTO): string {
  const facts = [e.title, e.occasion, normalizeWhen(e.when ?? ''), e.where]
    .map(v => (v ?? '').trim().toLowerCase())
    .join('|');
  // Nothing to compare on: fall back to the id rather than matching every
  // other blank event.
  return facts.replace(/\|/g, '') === '' ? `ref:${e.refId}` : `facts:${facts}`;
}

/** the customer's in-progress event, shown as its own section. Hidden if there is none. */
export function mapCurrentEvent(
  feed: HomeFeedDTO,
): CurrentEventViewModel | null {
  return feed.currentEvent ? mapEvent(feed.currentEvent) : null;
}

/**
 * The customer's other live events, in the order the server ranked them.
 *
 * Each is mapped exactly like the leading one, because each is rendered by the
 * same hero — a second event is not a lesser kind of event.
 *
 * What is dropped is anything the card above is already about. The DTO's
 * contract says `otherEvents` never repeats `currentEvent`, and the server
 * broke it: one Corporate request came back as both, and Home stacked the same
 * event on itself. A promise the client can check cheaply is one the client
 * should check — a customer seeing their single event twice cannot tell
 * whether they created it twice.
 */
export function mapOtherEvents(feed: HomeFeedDTO): CurrentEventViewModel[] {
  const seen = new Set<string>();
  for (const leading of [feed.currentEvent]) {
    if (leading) {
      seen.add(`ref:${leading.refId}`);
      seen.add(eventIdentity(leading));
    }
  }
  if (feed.booking?.id) seen.add(`ref:${feed.booking.id}`);

  return (feed.otherEvents ?? [])
    .filter(e => {
      const byRef = `ref:${e.refId}`;
      const byFacts = eventIdentity(e);
      if (seen.has(byRef) || seen.has(byFacts)) return false;
      seen.add(byRef);
      seen.add(byFacts);
      return true;
    })
    .map(mapEvent);
}

function mapEvent(e: CurrentEventDTO): CurrentEventViewModel {
  return {
    refId: e.refId,
    quotationId: e.quotationId ?? null,
    title: e.title,
    // Each of these is passed through untouched: a value the backend left
    // blank stays blank, so the card can say "not set" instead of guessing.
    occasion: e.occasion ?? '',
    when: normalizeWhen(e.when ?? ''),
    where: e.where ?? '',
    guests: e.guests ?? '',
    source: e.source ?? 'plan',
    progress: e.progress,
    daysToGo: e.daysToGo,
    stage: e.stage,
    factsLine: factsLineOf(
      normalizeWhen(e.when ?? ''),
      e.where ?? '',
      e.guests ?? '',
    ),
    stageLabel: CURRENT_EVENT_STAGE_LABEL[e.stage] ?? '',
    quoteCount: e.quoteCount ?? 0,
    /*
     * Both figures or neither, and only when they differ.
     *
     * A lone "lowest ₹6,25,000" reads as the price, and the whole point of the
     * line is that there is a range to compare. One quote has no range:
     * "Lowest ₹1,85,000 · highest ₹1,85,000" is the same number twice, dressed
     * up as a comparison the customer cannot make yet.
     */
    spreadLabel:
      e.lowestQuote > 0 &&
      e.highestQuote > 0 &&
      e.highestQuote !== e.lowestQuote
        ? `Lowest ${formatINR(e.lowestQuote)} · highest ${formatINR(
            e.highestQuote,
          )}`
        : '',
    quotedLabel:
      (e.quoteCount ?? 0) > 0
        ? `${e.quoteCount} organizer${
            e.quoteCount === 1 ? ' has' : 's have'
          } quoted`
        : '',
    reachLine: reachLine(e.sentToCount ?? 0, e.quoteCount ?? 0),
    closesLabel: closesLabel(e.closesInDays),
    quoteRows: quoteRows(e.quotes ?? []),
    awaitingLabel: awaitingLabel(e.awaiting ?? []),
    ctaLabel: ctaLabel(e.stage, e.quoteCount ?? 0),
  };
}

/**
 * The main button's words, counted where there is something to count.
 *
 * "Compare 3 quotes" says what the tap gets you; "Compare quotes" leaves the
 * customer to scroll back up and work out whether it is worth the tap.
 *
 * One quote is not compared, it is read. Offering "Compare 1 quote" promises a
 * comparison the screen cannot perform and the customer cannot act on.
 */
function ctaLabel(stage: CurrentEventStage, quoteCount: number): string {
  const base = CURRENT_EVENT_CTA[stage] ?? '';
  if (stage !== 'quotes_received' || quoteCount <= 0) return base;
  return quoteCount === 1 ? 'See the quote' : `Compare ${quoteCount} quotes`;
}

/**
 * "Your request went to 4 organizers · 3 have replied".
 *
 * The denominator is only stated when the brief recorded who it went to.
 * Older briefs were broadcast to everyone and kept no list, so they report the
 * replies alone — "3 organizers have replied" is true of them; "3 of 4" would
 * be a number this app made up.
 */
function reachLine(sentToCount: number, quoteCount: number): string {
  if (sentToCount > 0) {
    const sent = `Your request went to ${sentToCount} organizer${
      sentToCount === 1 ? '' : 's'
    }`;
    return quoteCount > 0
      ? `${sent} · ${quoteCount} ${quoteCount === 1 ? 'has' : 'have'} replied`
      : sent;
  }
  if (quoteCount > 0) {
    return `${quoteCount} organizer${quoteCount === 1 ? '' : 's'} ${
      quoteCount === 1 ? 'has' : 'have'
    } replied`;
  }
  return '';
}

/** "Closes in 4 days" — and on the last day, the day itself. */
function closesLabel(days: number | null | undefined): string {
  if (days === null || days === undefined) return '';
  if (days <= 0) return 'Closes today';
  return days === 1 ? 'Closes tomorrow' : `Closes in ${days} days`;
}

/**
 * The replies, cheapest first, each priced against the cheapest.
 *
 * The delta is what makes the list a comparison: three totals in a column
 * leaves the customer subtracting, and the whole reason they are here is to
 * see what the difference costs them.
 */
function quoteRows(rows: QuoteRowDTO[]): QuoteRow[] {
  if (!isNonEmptyArray(rows)) return [];
  const lowest = Math.min(...rows.map(row => row.total ?? 0));
  /* "Lowest" on the only quote that arrived says nothing — it is lowest of
     one. The tag is a comparison, so it needs something to compare against. */
  const comparable = rows.length > 1;

  return rows.map(row => {
    const total = row.total ?? 0;
    const delta = total - lowest;
    return {
      id: row.id,
      organizerName: row.organizer?.name ?? 'An organizer',
      initials: row.organizer?.initials || '·',
      avatarColor: row.organizer?.avatarColor || '#1a2e5a',
      totalLabel: formatINR(total),
      metaLabel: [
        row.lineItemCount > 0
          ? `${row.lineItemCount} line item${
              row.lineItemCount === 1 ? '' : 's'
            }`
          : '',
        agoLabel(row.repliedAt),
      ]
        .filter(Boolean)
        .join(' · '),
      deltaLabel: !comparable
        ? ''
        : delta <= 0
        ? 'Lowest'
        : `+${formatINR(delta)}`,
      isLowest: comparable && delta <= 0,
    };
  });
}

/** "2h ago", "yesterday", "3 Sep" — how long ago the quote landed. */
function agoLabel(iso: string | null | undefined, now = new Date()): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const elapsed = now.getTime() - date.getTime();
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (days <= 0) return `${Math.max(1, Math.floor(elapsed / 3_600_000))}h ago`;
  if (days === 1) return 'yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/**
 * Who has not answered, by name.
 *
 * Named rather than counted, because "one organizer hasn't replied" is not
 * something a customer can act on and "Sreeja Wedding Co. hasn't replied yet"
 * is. Past two, the names stop being a list and become a paragraph.
 */
function awaitingLabel(awaiting: QuoteOrganizerRefDTO[]): string {
  if (!isNonEmptyArray(awaiting)) return '';
  const names = awaiting.map(o => o.name).filter(Boolean);
  if (names.length === 0) return '';
  if (names.length === 1) return `${names[0]} hasn't replied yet`;
  if (names.length === 2)
    return `${names[0]} and ${names[1]} haven't replied yet`;
  return `${names.length} organizers haven't replied yet`;
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
    items: tiles.map(tile => ({
      id: tile.id,
      art: PACKAGE_ART_KEYS.includes(tile.art as OccasionArtKey)
        ? (tile.art as OccasionArtKey)
        : 'wedding',
      label: tile.label,
      icon: OCCASION_TILE_ICON[tile.art] ?? 'sparkles',
      note: tile.mostPlanned
        ? 'Most planned'
        : tile.fromPrice > 0
        ? `From ${formatINR(tile.fromPrice)}`
        : '',
      photoUrl: absoluteFileUrl(tile.imageUrl),
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
/**
 * "30 Sep" for a card, "30 September" for the sheet behind it.
 *
 * Two forms because the card has two lines and the sheet has a row: the same
 * date spelled out in full is what pushed the conditions onto a third line
 * that then got clipped.
 */
function endsOn(iso: string | null, style: 'short' | 'long' = 'long'): string {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: style === 'short' ? 'short' : 'long',
      });
}

/** "10% off", "10% off up to ₹5,000", "₹2,000 off". */
function discountLine(coupon: ClaimableCouponDTO): string {
  if (coupon.discountType === 'fixed')
    return `${formatINR(coupon.discountValue)} off`;
  const cap =
    coupon.maxDiscount > 0 ? ` up to ${formatINR(coupon.maxDiscount)}` : '';
  return `${coupon.discountValue}% off${cap}`;
}

/**
 * The conditions, in the order a customer runs into them.
 *
 * The organizer comes first when there is one, because it is the condition
 * that decides whether the rest of the card is relevant at all — a 15% code
 * that only works with one organizer is a different offer from a 15% code that
 * works anywhere, and the card has to say which it is before it says anything
 * else.
 *
 * The rest is built from the coupon's own limits rather than from a sentence
 * somebody typed, so a card cannot advertise a deadline or a minimum the
 * coupon does not actually have. A coupon with none of the three says nothing
 * rather than padding the card with reassurance.
 */
function termsLine(coupon: ClaimableCouponDTO): string {
  const parts: string[] = [];
  if (coupon.organizerName) parts.push(`With ${coupon.organizerName}`);
  if (coupon.minBookingAmount > 0) {
    /* Terser once something precedes it — "on bookings over" reads fine as an
       opener and as padding after an organizer's name. */
    const amount = formatINR(coupon.minBookingAmount);
    parts.push(
      parts.length > 0 ? `over ${amount}` : `On bookings over ${amount}`,
    );
  }
  const ends = endsOn(coupon.endsAt, 'short');
  if (ends) parts.push(parts.length > 0 ? `ends ${ends}` : `Ends ${ends}`);
  return parts.join(' · ');
}

/**
 * How many times this customer may still use it.
 *
 * Only worth a line when it is finite — "Unlimited" is not news, and a card
 * that says it on every coupon has taught the reader to skip the row.
 */
function usesLeftLine(coupon: ClaimableCouponDTO): string {
  if (coupon.perCustomerLimit === 0) return 'As often as you like';
  const left = Math.max(0, coupon.perCustomerLimit - coupon.timesUsed);
  return left === 1 ? 'Once' : `${left} more times`;
}

/**
 * Live platform coupons -> the home promo strip.
 *
 * The server sends only coupons this customer could still use — live, inside
 * their window, with slots left, and not already used up by them — so an empty
 * list here means there genuinely are none.
 *
 * Two conditions cannot be checked away from a booking: the minimum spend and,
 * for an organizer's coupon, the organizer. The first is printed on the card
 * instead of assumed; the second is why organizer coupons are not sent here at
 * all, and appear at checkout where the organizer is known.
 */
export function mapCoupons(feed: HomeFeedDTO): CouponsViewModel | null {
  if (!isNonEmptyArray(feed.coupons)) return null;

  return {
    title: 'Offers for you',
    countLabel: `${feed.coupons.length} live`,
    items: feed.coupons.map((coupon, index) => ({
      id: coupon.id,
      code: coupon.code,
      title: coupon.title,
      terms: termsLine(coupon),
      ctaLabel: 'See details',
      // Alternating, so a run of cards reads as a row rather than a block.
      tone: index % 2 === 0 ? ('accent' as const) : ('navy' as const),
      description: coupon.description ?? '',
      details: [
        { label: 'Code', value: coupon.code },
        { label: 'Discount', value: discountLine(coupon) },
        // Only for an organizer's coupon — "Any organizer" on every platform
        // coupon is a row that teaches the reader to skip the list.
        ...(coupon.organizerName
          ? [{ label: 'Works with', value: coupon.organizerName }]
          : []),
        ...(coupon.minBookingAmount > 0
          ? [
              {
                label: 'Minimum booking',
                value: formatINR(coupon.minBookingAmount),
              },
            ]
          : []),
        { label: 'Valid until', value: endsOn(coupon.endsAt) || 'No end date' },
        { label: 'You can use it', value: usesLeftLine(coupon) },
      ],
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
    items: section.occasions.map(o => ({
      id: o.id,
      icon: o.icon,
      art: o.art,
      label: o.label,
      cta: o.cta,
    })),
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
    items: feed.packages.map(p => ({
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
export function mapTopOrganizers(
  feed: HomeFeedDTO,
): TopOrganizersViewModel | null {
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
    items: feed.topOrganizers.map(o => ({
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
        (o.bookedThisMonth ?? 0) > 0
          ? `${o.bookedThisMonth} booked this month`
          : '',
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
    steps: section.steps.map(s => ({
      num: s.num,
      icon: s.icon,
      title: s.title,
      description: s.description,
    })),
  };
}

/** static "Plan smarter" tools copy. Hidden if there are no tools. */
export function mapTools(feed: HomeFeedDTO): ToolsViewModel | null {
  const section = feed.content?.tools;
  if (!section || !isNonEmptyArray(section.tools)) return null;

  return {
    title: section.title,
    subtitle: section.subtitle,
    tools: section.tools.map(t => ({
      id: t.id,
      icon: t.icon,
      title: t.title,
      description: t.description,
    })),
  };
}

/**
 * Every live event, leading one included, de-duplicated the same way Home's
 * rows are.
 *
 * Home splits the feed into a card and a list of rows; the All events screen
 * wants them back as one sequence. Composed from the same two mappers rather
 * than re-reading the DTO, so a de-dupe rule fixed for Home is fixed here too.
 */
/**
 * The day a quick-date chip means, as an ISO date.
 *
 * "This weekend" is the coming Saturday — and today when today is already the
 * weekend, because a customer tapping it on a Saturday means this one.
 */
export function quickDateIso(
  kind: 'weekend' | 'months',
  months: number,
  from: Date = new Date(),
): string {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate());

  if (kind === 'weekend') {
    const day = date.getDay();
    // 6 = Saturday, 0 = Sunday. Already there: keep today.
    const ahead = day === 6 || day === 0 ? 0 : 6 - day;
    date.setDate(date.getDate() + ahead);
  } else {
    date.setMonth(date.getMonth() + months);
  }

  const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

/**
 * A date the card can show. `2026-09-21` is a value, not an answer to "when".
 */
export function formatWhen(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function mapAllEvents(feed: HomeFeedDTO): CurrentEventViewModel[] {
  const leading = mapCurrentEvent(feed);
  return leading ? [leading, ...mapOtherEvents(feed)] : mapOtherEvents(feed);
}

export function mapHomeFeed(feed: HomeFeedDTO): HomeViewModel {
  return {
    banner: mapBanner(feed),
    bookedEvent: mapBookedEvent(feed),
    currentEvent: mapCurrentEvent(feed),
    otherEvents: mapOtherEvents(feed),
    categories: mapCategories(feed),
    occasions: mapOccasions(feed),
    offers: mapCoupons(feed),
    packages: mapPackages(feed),
    topOrganizers: mapTopOrganizers(feed),
    howItWorks: mapHowItWorks(feed),
    tools: mapTools(feed),
  };
}
