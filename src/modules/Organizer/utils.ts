import { formatCompactINR } from '../Home/utils';
import { absoluteFileUrl } from '../../services/urls';
import { ORGANIZER_COPY as COPY, WORK_PLACEHOLDER_GRADIENTS } from './constants';
import type {
  Assurance,
  AvailabilityViewModel,
  OrganizerDetailDTO,
  OrganizerStat,
  OrganizerViewModel,
  RatingBar,
  ReviewSummaryDTO,
  VerificationBadge,
  WorkTile,
} from './types';

/**
 * The organizer, as their profile reads them.
 *
 * Every line is dropped when the organizer has not published it. An organizer
 * who has run no events shows two stat tiles rather than three, and one
 * nobody has approved carries no verification pill — a row of zeros and an
 * unearned badge both read as claims this app cannot stand behind.
 */
export function mapOrganizer(
  dto: OrganizerDetailDTO,
  categoryTitles: Map<string, string>,
): OrganizerViewModel {
  const gallery = (dto.gallery ?? []).map((file) => absoluteFileUrl(file.url)).filter(Boolean);

  const stats: OrganizerStat[] = [
    dto.reviews > 0
      ? { key: 'rating', value: dto.rating.toFixed(1), label: plural(dto.reviews, 'review') }
      : null,
    dto.events > 0 ? { key: 'events', value: String(dto.events), label: 'events run' } : null,
    dto.responseHours > 0
      ? { key: 'reply', value: `${dto.responseHours}h`, label: 'avg reply' }
      : null,
  ].filter((stat): stat is OrganizerStat => stat !== null);

  return {
    id: dto.id,
    name: dto.name,
    initials: dto.initials,
    avatarColor: dto.avatarColor || '#1a2e5a',
    tier: dto.tier,
    // "Kukatpally, Hyderabad" — and just the city when there is no locality.
    placeLabel: [dto.location, dto.city]
      .map((v) => (v ?? '').trim())
      .filter((v, i, all) => !!v && all.indexOf(v) === i)
      .join(', '),
    coverUrl: dto.coverPhoto ? absoluteFileUrl(dto.coverPhoto.url) || null : null,
    verification: verificationOf(dto),
    stats,
    availability: availabilityOf(dto),
    assurances: assurancesOf(dto),
    work: workTiles(gallery),
    workIsPlaceholder: gallery.length === 0,
    // The services they actually priced, named the way the plan wizard names
    // them. A key with no matching category is dropped rather than shown raw.
    handles: (dto.categoryRates ?? [])
      .map((rate) => categoryTitles.get(rate.key) ?? '')
      .filter(Boolean),
    rating: dto.rating ?? 0,
    reviews: dto.reviews ?? 0,
    events: dto.events ?? 0,
    responseHours: dto.responseHours ?? 0,
    typicalLabel: dto.estRange || compactRange(dto.basePrice),
  };
}

/**
 * The verification pill.
 *
 * Only an organizer an admin has actually approved is called verified, and
 * the second half names only the documents that check had in hand. An
 * organizer with neither gets no pill rather than a hedged one — "not yet
 * verified" on a profile is a verdict this app has not reached.
 */
function verificationOf(dto: OrganizerDetailDTO): VerificationBadge | null {
  if (!dto.verified) return null;
  const detail =
    dto.kycOnFile && dto.gstOnFile
      ? COPY.kycAndGstOnFile
      : dto.kycOnFile
        ? COPY.kycOnFile
        : dto.gstOnFile
          ? COPY.gstOnFile
          : '';
  return { title: COPY.verified, detail };
}

/**
 * When they are next free, and how open that week is.
 *
 * The server does the calendar arithmetic; this only formats it. No free date
 * means no card — an empty availability strip reads as "fully booked", which
 * is a different claim from "they have not told us".
 */
function availabilityOf(dto: OrganizerDetailDTO): AvailabilityViewModel | null {
  if (!dto.nextFreeDate) return null;
  const dateLabel = formatDayMonthYear(dto.nextFreeDate);
  if (!dateLabel) return null;

  const detail = [
    dto.capacityMax > 0 ? COPY.capacity(dto.capacityMax) : '',
    dto.slotsLeftThatWeek > 0 ? COPY.slotsLeft(dto.slotsLeftThatWeek) : '',
  ]
    .filter(Boolean)
    .join(' · ');

  return { dateLabel, dateIso: dto.nextFreeDate, detail };
}

/**
 * The three assurances under the availability card.
 *
 * The reply promise is made only by an organizer whose own record carries
 * both a rate and a time — quoting "0% within 0 hours" at somebody would be
 * worse than saying nothing. The other two are Evently's promises, not this
 * organizer's, so they hold for every profile.
 */
function assurancesOf(dto: OrganizerDetailDTO): Assurance[] {
  const rows: Assurance[] = [];
  if (dto.responseRate > 0 && dto.responseHours > 0) {
    rows.push({
      key: 'replies',
      icon: 'lightning-bolt-outline',
      text: COPY.repliesWithin(Math.round(dto.responseRate), dto.responseHours),
    });
  }
  rows.push({ key: 'advance', icon: 'shield-check-outline', text: COPY.advanceHeld });
  rows.push({ key: 'itemised', icon: 'chart-bar', text: COPY.itemisedQuotes });
  return rows;
}

/**
 * The portfolio strip.
 *
 * Real uploads when there are any. When there are none the strip still runs —
 * three abstract gradients and a line saying so — because an organizer's
 * profile that simply stops after the assurances reads as half-loaded. The
 * gradients carry no caption: labelling an invented tile "Wedding · Jubilee
 * Hills" would be this app inventing work nobody did.
 */
function workTiles(gallery: string[]): WorkTile[] {
  if (gallery.length > 0) {
    return gallery.map((photo, i) => ({
      key: photo,
      photo,
      gradient: WORK_PLACEHOLDER_GRADIENTS[i % WORK_PLACEHOLDER_GRADIENTS.length],
    }));
  }
  return WORK_PLACEHOLDER_GRADIENTS.map((gradient, i) => ({
    key: `placeholder-${i}`,
    photo: null,
    gradient,
  }));
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-09-05" -> "5 Sep 2026". '' when the server sent something unparseable. */
export function formatDayMonthYear(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return '';
  const [, year, month, day] = match;
  const name = MONTHS[Number(month) - 1];
  if (!name) return '';
  return `${Number(day)} ${name} ${year}`;
}

/** "12 reviews" / "1 review". */
function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

/**
 * A range built from the base price when the organizer publishes no estimate.
 *
 * Deliberately open-ended — "₹6.5L+" rather than an invented upper bound. The
 * base price is the floor they quoted; the ceiling is not ours to guess.
 */
function compactRange(basePrice: number): string {
  const from = formatCompactINR(basePrice);
  return from ? `${from}+` : '';
}

/**
 * The histogram, with each bar already sized.
 *
 * Percentages are of the largest bar rather than of the total, so a
 * distribution where 98 of 126 are five stars still shows the smaller bars as
 * visible slivers instead of nothing at all.
 */
export function ratingBars(summary: ReviewSummaryDTO): RatingBar[] {
  const rows = summary.histogram ?? [];
  const peak = rows.reduce((max, row) => Math.max(max, row.count), 0);
  return rows.map((row) => ({
    stars: row.stars,
    count: row.count,
    percent: peak > 0 ? Math.round((row.count / peak) * 100) : 0,
  }));
}

/** Whole stars for a score — 4.8 fills five, 3.2 fills three. */
export function filledStars(rating: number): number {
  if (!Number.isFinite(rating) || rating <= 0) return 0;
  return Math.min(5, Math.max(0, Math.round(rating)));
}
