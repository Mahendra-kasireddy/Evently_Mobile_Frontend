import { formatCompactINR, formatINR } from '../Home/utils';
import { absoluteFileUrl } from '../../services/urls';
import type {
  OrganizerDetailDTO,
  OrganizerStat,
  OrganizerViewModel,
  RatingBar,
  ReviewSummaryDTO,
} from './types';

/**
 * The organizer, as their profile reads them.
 *
 * Every line is dropped when the organizer has not published it. An organizer
 * who has run no events shows two stat tiles rather than three, and one who
 * set no base price shows no headline — a row of zeros reads as a failing
 * business rather than as a new one.
 */
export function mapOrganizer(
  dto: OrganizerDetailDTO,
  categoryTitles: Map<string, string>,
): OrganizerViewModel {
  const from = formatINR(dto.basePrice);
  const booked = 0; // filled by the caller when the home feed supplied it

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
    headlineLabel: [from ? `From ${from}` : '', booked > 0 ? `${booked} booked this month` : '']
      .filter(Boolean)
      .join(' · '),
    stats,
    gallery: (dto.gallery ?? []).map((file) => absoluteFileUrl(file.url)).filter(Boolean),
    // The services they actually priced, named the way the plan wizard names
    // them. A key with no matching category is dropped rather than shown raw.
    handles: (dto.categoryRates ?? [])
      .map((rate) => categoryTitles.get(rate.key) ?? '')
      .filter(Boolean),
    rating: dto.rating ?? 0,
    reviews: dto.reviews ?? 0,
    events: dto.events ?? 0,
    typicalLabel: dto.estRange || compactRange(dto.basePrice),
  };
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
