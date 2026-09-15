export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'withdrawn';

export interface QuoteLineItemDTO {
  key: string;
  title: string;
  subtitle: string;
  price: number;
  note: string;
}

export interface QuoteOrganizerDTO {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  tier: string;
  rating: number;
  reviews: number;
}

export interface QuotationDTO {
  id: string;
  requestId: string;
  status: QuotationStatus;
  lineItems: QuoteLineItemDTO[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  advancePercentage: number;
  advanceAmount: number;
  organizer: QuoteOrganizerDTO | null;
}

/** GET /quote/getQuoteRequest/:id — the request and every quote on it. */
export interface QuoteRequestDTO {
  id: string;
  occasion: string;
  when: string;
  where: string;
  guests: string;
  status: string;
  quotations: QuotationDTO[];
}

// ---------------------------------------------------------------------------
// View model
// ---------------------------------------------------------------------------

export interface QuoteLine {
  key: string;
  title: string;
  subtitle: string;
  priceLabel: string;
}

export interface QuoteCard {
  id: string;
  /** '' on a quote whose organizer record has gone. */
  organizerId: string;
  organizerName: string;
  initials: string;
  avatarColor: string;
  tier: string;
  rating: number;
  reviews: number;
  totalLabel: string;
  advanceLabel: string;
  /** True for the cheapest of the live quotes — one card only, or none. */
  isLowest: boolean;
  /** True once this quote has been accepted; the others are then read-only. */
  isAccepted: boolean;
  lines: QuoteLine[];
  total: number;
}

export interface CompareViewModel {
  title: string;
  /** The screen's own heading: "Your quote" for one, "Compare quotes" for more. */
  heading: string;
  factsLine: string;
  quotes: QuoteCard[];
  /** '' when fewer than two quotes are priced — there is no spread to state. */
  spreadLabel: string;
  /** True once one quote has been accepted, which closes the others. */
  isDecided: boolean;
}

// ---------------------------------------------------------------------------
// Line-by-line comparison
// ---------------------------------------------------------------------------

/** One quotation, as a column heading. */
export interface CompareColumn {
  id: string;
  /** '' on a quote whose organizer record has gone. */
  organizerId: string;
  /** The organizer's first word — a column header has no room for more. */
  shortName: string;
  fullName: string;
  initials: string;
  avatarColor: string;
  totalLabel: string;
  total: number;
}

/**
 * One side of one row.
 *
 * `included: false` is not a price of zero. A quotation that simply does not
 * cover transport has to say so — showing ₹0 would read as "free", which is
 * the opposite of what it means.
 */
export interface CompareCell {
  included: boolean;
  priceLabel: string;
  /** True only when both sides priced it and this one is cheaper. */
  isLower: boolean;
}

export interface CompareLineRow {
  key: string;
  title: string;
  subtitle: string;
  left: CompareCell;
  right: CompareCell;
}

export interface LineByLineViewModel {
  left: CompareColumn;
  right: CompareColumn;
  rows: CompareLineRow[];
}
