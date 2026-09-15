import { formatINR } from '../Home/utils';
import type {
  CompareCell,
  CompareColumn,
  CompareViewModel,
  LineByLineViewModel,
  QuoteCard,
  QuoteLineItemDTO,
  QuoteRequestDTO,
  QuotationDTO,
} from './types';

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

  /* LOWEST is a comparison. With one quote there is nothing to be lowest of,
     and the badge would read as a finding the screen has not made. */
  const comparable = priced.length > 1;

  const quotes = live
    .map((q) => toCard(q, lowestTotal, !!accepted || !comparable))
    .sort((a, b) => {
      if (a.isAccepted !== b.isAccepted) return a.isAccepted ? -1 : 1;
      return a.total - b.total;
    });

  const highestTotal = priced.length > 0 ? Math.max(...priced.map((q) => q.grandTotal)) : 0;

  return {
    title: dto.occasion ? titleize(dto.occasion) : fallbackTitle,
    /*
     * What this screen is, for the one who opened it. A single quote is read,
     * not compared, and heading it "Compare quotes" tells a customer with one
     * reply that the others must be hidden somewhere.
     */
    heading: quotes.length === 1 ? 'Your quote' : 'Compare quotes',
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
    organizerId: q.organizer?.id ?? '',
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

/**
 * Two quotations, matched line against line.
 *
 * Lines are paired on their category key rather than their position, because
 * two organizers write their quotes in whatever order they like and pairing by
 * row number would compare decor against catering.
 *
 * The union is taken, left's order first: a line only one of them quoted still
 * earns a row, because "the cheaper one did not include transport" is the most
 * useful thing this screen can tell anybody.
 */
export function mapLineByLine(
  dto: QuoteRequestDTO,
  leftId: string,
  rightId: string,
): LineByLineViewModel | null {
  const live = (dto.quotations ?? []).filter((q) => LIVE_STATUSES.has(q.status));
  const left = live.find((q) => q.id === leftId);
  const right = live.find((q) => q.id === rightId);
  if (!left || !right) return null;

  const leftLines = new Map((left.lineItems ?? []).map((l) => [l.key, l]));
  const rightLines = new Map((right.lineItems ?? []).map((l) => [l.key, l]));
  const keys = [
    ...leftLines.keys(),
    ...[...rightLines.keys()].filter((key) => !leftLines.has(key)),
  ];

  return {
    left: toColumn(left),
    right: toColumn(right),
    rows: keys.map((key) => {
      const a = leftLines.get(key);
      const b = rightLines.get(key);
      /* Only a comparison when both sides actually priced it. One of them not
         covering a line is a difference in scope, not a better price. */
      const comparable = !!a && !!b && a.price > 0 && b.price > 0;
      return {
        key,
        title: a?.title ?? b?.title ?? key,
        subtitle: a?.subtitle ?? b?.subtitle ?? '',
        left: toCell(a, comparable && (a as QuoteLineItemDTO).price < (b as QuoteLineItemDTO).price),
        right: toCell(b, comparable && (b as QuoteLineItemDTO).price < (a as QuoteLineItemDTO).price),
      };
    }),
  };
}

function toColumn(q: QuotationDTO): CompareColumn {
  const fullName = q.organizer?.name ?? 'An organizer';
  return {
    id: q.id,
    organizerId: q.organizer?.id ?? '',
    shortName: fullName.split(/\s+/)[0] || fullName,
    fullName,
    initials: q.organizer?.initials || '·',
    avatarColor: q.organizer?.avatarColor || '#1a2e5a',
    totalLabel: formatINR(q.grandTotal ?? 0),
    total: q.grandTotal ?? 0,
  };
}

function toCell(line: QuoteLineItemDTO | undefined, isLower: boolean): CompareCell {
  if (!line || line.price <= 0) {
    return { included: false, priceLabel: 'Not included', isLower: false };
  }
  return { included: true, priceLabel: formatINR(line.price), isLower };
}
