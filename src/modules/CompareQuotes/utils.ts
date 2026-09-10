import { formatINR } from '../Home/utils';
import type { CompareViewModel, QuoteCard, QuoteRequestDTO, QuotationDTO } from './types';

/** Quotes the customer can still act on. Drafts never leave the organizer. */
const LIVE_STATUSES = new Set(['sent', 'accepted']);

/**
 * The request and its quotes, as the comparison screen reads them.
 *
 * Withdrawn and declined quotes are dropped rather than greyed: a quote the
 * organizer pulled is not an option, and leaving it on screen invites the
 * customer to compare against a price nobody is offering. Cheapest first,
 * because that is the question the screen exists to answer — except once one
 * is accepted, when that one leads.
 */
export function mapCompare(dto: QuoteRequestDTO, fallbackTitle: string): CompareViewModel {
  const live = (dto.quotations ?? []).filter((q) => LIVE_STATUSES.has(q.status));
  const accepted = live.find((q) => q.status === 'accepted') ?? null;
  const priced = live.filter((q) => (q.grandTotal ?? 0) > 0);
  const lowestTotal = priced.length > 0 ? Math.min(...priced.map((q) => q.grandTotal)) : 0;

  const quotes = live
    .map((q) => toCard(q, lowestTotal, !!accepted))
    .sort((a, b) => {
      if (a.isAccepted !== b.isAccepted) return a.isAccepted ? -1 : 1;
      return a.total - b.total;
    });

  const highestTotal = priced.length > 0 ? Math.max(...priced.map((q) => q.grandTotal)) : 0;

  return {
    title: dto.occasion ? titleize(dto.occasion) : fallbackTitle,
    factsLine: [dto.when, dto.where, dto.guests]
      .map((v) => (v ?? '').trim())
      .filter(Boolean)
      .join(' · '),
    quotes,
    // Only when there are two different prices to sit between.
    spreadLabel:
      priced.length > 1 && highestTotal > lowestTotal
        ? `${formatINR(lowestTotal)} – ${formatINR(highestTotal)} across ${priced.length} quotes`
        : '',
    isDecided: !!accepted,
  };
}

function toCard(q: QuotationDTO, lowestTotal: number, decided: boolean): QuoteCard {
  const total = q.grandTotal ?? 0;
  return {
    id: q.id,
    organizerName: q.organizer?.name ?? 'Organizer',
    initials: q.organizer?.initials ?? '?',
    avatarColor: q.organizer?.avatarColor || '#1a2e5a',
    tier: q.organizer?.tier ?? '',
    rating: q.organizer?.rating ?? 0,
    reviews: q.organizer?.reviews ?? 0,
    totalLabel: formatINR(total),
    advanceLabel: formatINR(q.advanceAmount),
    // The badge is only meaningful while there is still a choice to make, and
    // only when this quote is genuinely the cheapest priced one.
    isLowest: !decided && total > 0 && total === lowestTotal,
    isAccepted: q.status === 'accepted',
    lines: (q.lineItems ?? [])
      .filter((li) => !!li.title)
      .map((li) => ({
        key: li.key || li.title,
        title: li.title,
        subtitle: li.subtitle ?? '',
        priceLabel: formatINR(li.price),
      })),
    total,
  };
}

function titleize(value: string): string {
  const t = (value ?? '').trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
}
