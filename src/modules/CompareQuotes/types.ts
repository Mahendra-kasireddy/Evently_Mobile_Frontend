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
  factsLine: string;
  quotes: QuoteCard[];
  /** '' when fewer than two quotes are priced — there is no spread to state. */
  spreadLabel: string;
  /** True once one quote has been accepted, which closes the others. */
  isDecided: boolean;
}
