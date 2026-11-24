/*
 * The quote form: `GET /quote/incoming` (the enquiry and any quotation this
 * organizer already wrote for it), the body `POST /quote/respond/:requestId`
 * and `PATCH /quote/updateQuotation/:id` accept, and the form's own model.
 */
import type { QuoteRequestStatus } from '../Enquiries/types';

export type { QuoteRequestStatus };

/**
 * Includes `superseded` — the customer edited the brief after this quote was
 * sent. The Enquiries list does not model it yet; here it decides whether the
 * quote can still be revised (it can).
 */
export type QuotationStatus =
  | 'draft'
  | 'sent'
  | 'updated'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'
  | 'superseded';

export interface QuoteLineSubItemDTO {
  label: string;
  value: string;
}

export interface QuoteLineDTO {
  key: string;
  title: string;
  subtitle: string;
  /** Whole rupees. */
  price: number;
  note?: string;
  subItems: QuoteLineSubItemDTO[];
}

/** The quotation as the API returns it (`quotationView` on the backend). */
export interface QuotationDTO {
  id: string;
  requestId: string;
  status: QuotationStatus;
  lineItems: QuoteLineDTO[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  advancePercentage: number;
  advanceAmount: number;
  siteVisitSuggested: boolean;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

/** One row of `GET /quote/incoming`, with the full quotation this screen edits. */
export interface QuoteRequestDTO {
  id: string;
  /** Shortened by the API for privacy ("Priya R."); '' when unknown. */
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
  myQuotation: QuotationDTO | null;
}

/** `RespondQuotationDto` / `UpdateQuotationDto`, exactly. */
export interface QuoteLineBody {
  key?: string;
  title: string;
  subtitle?: string;
  price: number;
  note?: string;
  subItems?: QuoteLineSubItemDTO[];
}

export interface QuoteBody {
  lineItems: QuoteLineBody[];
  taxRate?: number;
  notes?: string;
  advancePercentage?: number;
  siteVisitSuggested?: boolean;
  /** `true` keeps it a private draft; `false` sends it. */
  asDraft?: boolean;
}

// ---- Category templates ------------------------------------------------------

export interface TemplateField {
  /** The `subItems[].label` this field reads and writes. */
  label: string;
  placeholder: string;
  /** Digits only, typed on the number pad. */
  numeric?: boolean;
}

/** How one kind of service is priced and described on the form. */
export interface CategoryTemplate {
  /** Written to the line's `key`. */
  key: string;
  /** Name for the "Add a service" picker and a new line's title. */
  label: string;
  /** MaterialCommunityIcons glyph. */
  icon: string;
  /** Matched against the customer's requested category text. */
  match: string[];
  fields: TemplateField[];
  /** Price = the product of these two numeric fields (catering: plates × rate). */
  derivePrice?: [string, string];
  /** Tick-any add-ons, stored as one comma-joined sub-item. */
  options?: { label: string; values: string[] };
  noteLabel: string;
  notePlaceholder: string;
}

// ---- Form ----------------------------------------------------------------------

/** One priced service while it is being edited. Numbers stay strings until sent. */
export interface LineForm {
  /** Local id for React keys and errors — never sent. */
  uid: string;
  key: string;
  title: string;
  /** Kept from a saved quote; the form does not edit it. */
  subtitle: string;
  /** The typed amount, digits only. Ignored while a derived price applies. */
  price: string;
  note: string;
  subItems: QuoteLineSubItemDTO[];
}

export type AdvanceChoice = 20 | 30 | 50 | 'custom';

export interface QuoteForm {
  lines: LineForm[];
  /** Percent, may carry a decimal ("12.5"). */
  taxRate: string;
  advanceChoice: AdvanceChoice;
  /** Used when `advanceChoice` is 'custom'. Digits only. */
  advanceCustom: string;
  notes: string;
  siteVisit: boolean;
}

export interface QuoteTotals {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  advancePercentage: number;
  advanceAmount: number;
}

export interface QuoteErrors {
  /** By line `uid`. */
  lines: Record<string, string>;
  taxRate?: string;
  advance?: string;
  notes?: string;
  /** A message for the whole form ("Add a price to at least one service"). */
  form?: string;
}

/**
 * What the screen can do with this enquiry:
 * - `new` — no quote yet: send, or save a draft
 * - `draft` — a saved draft: send, or keep it a draft
 * - `sent` — sent/updated/superseded: update (the customer is told), or withdraw
 * - `readonly` — accepted, declined, withdrawn, or the enquiry is closed
 */
export type QuoteMode = 'new' | 'draft' | 'sent' | 'readonly';

/** The enquiry at the top of the form. */
export interface EnquirySummary {
  title: string;
  occasion: string;
  facts: Array<{ icon: string; text: string }>;
  categories: string[];
  ideas: string;
}

/** A line as the customer will read it. */
export interface PreviewLine {
  uid: string;
  icon: string;
  title: string;
  amount: string;
  details: string[];
  note: string;
}
