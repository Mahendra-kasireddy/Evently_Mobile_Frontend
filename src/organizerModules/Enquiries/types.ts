/*
 * `GET /quote/incoming` as the organizer receives it, then the view models the
 * Enquiries screen draws. Only the fields this screen reads are typed.
 */

export type QuotationStatus =
  | 'draft'
  | 'sent'
  | 'updated'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'
  /** The customer changed their brief after this quote was sent. */
  | 'superseded';
export type QuoteRequestStatus =
  | 'open'
  | 'quoted'
  | 'accepted'
  | 'cancelled'
  | 'closed';

export interface IncomingRequestDTO {
  id: string;
  /** Shortened by the API for privacy ("Priya R."); '' when the customer has no name. */
  customerName: string;
  occasion: string;
  when: string;
  where: string;
  guests: string;
  budget: string;
  categories: string[];
  ideas: string;
  status: QuoteRequestStatus;
  createdAt?: string;
  myQuotation: {
    id: string;
    status: QuotationStatus;
    grandTotal: number;
  } | null;
}

/** Where an enquiry sits for this organizer — the filter chips. */
export type EnquiryStage = 'new' | 'draft' | 'sent' | 'confirmed' | 'closed';
export type EnquiryFilter = EnquiryStage | 'all';

export type ChipTone = 'violet' | 'amber' | 'red' | 'green' | 'grey' | 'blue';

export interface EnquiryItem {
  id: string;
  stage: EnquiryStage;
  /** "Priya R." — or the occasion when there is no name. */
  title: string;
  /** "Wedding" — shown as a chip when the name leads. */
  occasion: string;
  where: string;
  when: string;
  guests: string;
  budget: string;
  categories: string[];
  receivedAgo: string;
  /** The small chip at the top right: time left to reply, or the quote's status. */
  chip: { label: string; tone: ChipTone };
  /** "₹1,25,000" once quoted, else ''. */
  quoteTotal: string;
  /** The one button: Send quote / Finish draft / View quote. */
  action: string;
  initials: string;
  /** Lower-cased text the search box matches against. */
  searchText: string;
}

export interface FilterChip {
  key: EnquiryFilter;
  label: string;
  count: number;
}
