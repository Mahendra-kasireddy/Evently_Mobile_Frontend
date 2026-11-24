import type { AdvanceChoice, CategoryTemplate } from './types';

export const INCOMING_ENDPOINT = '/quote/incoming';
export const respondEndpoint = (requestId: string) =>
  `/quote/respond/${requestId}`;
export const updateEndpoint = (quotationId: string) =>
  `/quote/updateQuotation/${quotationId}`;
export const withdrawEndpoint = (quotationId: string) =>
  `/quote/withdrawQuotation/${quotationId}`;

/** The backend's defaults when a field is left out (`quote.service.respond`). */
export const DEFAULT_TAX_RATE = 18;
export const DEFAULT_ADVANCE = 30;
export const ADVANCE_PRESETS: AdvanceChoice[] = [20, 30, 50, 'custom'];

/** `RespondQuotationDto` limits. */
export const LIMITS = {
  key: 60,
  title: 120,
  subtitle: 160,
  note: 500,
  subItem: 120,
  notes: 2000,
  /** Up to ₹99,99,99,999 a line — beyond any real quote, inside a safe integer. */
  amountDigits: 9,
  countDigits: 6,
  rateDigits: 7,
  percentMax: 100,
} as const;

/** The site-visit hint shows from this total (the web uses the same mark). */
export const SITE_VISIT_THRESHOLD = 200_000;

/** How long the "Quote sent" confirmation stays before going back. */
export const SUCCESS_PAUSE_MS = 900;

/**
 * One template per kind of service, mirroring the web's quote builder. The
 * detail fields persist as the line's `subItems`, so no new API shape is
 * needed — catering is priced as plates × rate, everything else as one amount.
 */
export const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  {
    key: 'food',
    label: 'Catering',
    icon: 'silverware-fork-knife',
    match: ['food', 'catering', 'cater'],
    fields: [
      { label: 'Plates', placeholder: '300', numeric: true },
      { label: 'Rate per plate', placeholder: '350', numeric: true },
    ],
    derivePrice: ['Plates', 'Rate per plate'],
    noteLabel: 'Menu items',
    notePlaceholder: 'Welcome drink, 2 starters, main course, dessert…',
  },
  {
    key: 'decor',
    label: 'Decor',
    icon: 'flower-tulip-outline',
    match: ['decor', 'decoration', 'flower', 'floral'],
    fields: [{ label: 'Theme', placeholder: 'Marigold & rose' }],
    noteLabel: 'What’s included',
    notePlaceholder: 'Stage, entrance arch, table centrepieces…',
  },
  {
    key: 'photography',
    label: 'Photography',
    icon: 'camera-outline',
    match: ['photo', 'photography', 'video', 'videography', 'film'],
    fields: [
      { label: 'Photographers', placeholder: '2', numeric: true },
      { label: 'Coverage hours', placeholder: '10', numeric: true },
    ],
    options: {
      label: 'Deliverables',
      values: ['Photos', 'Video', 'Album', 'Reel'],
    },
    noteLabel: 'What’s included',
    notePlaceholder: 'Candid + traditional, edited photos in 3 weeks…',
  },
  {
    key: 'priest',
    label: 'Priest & rituals',
    icon: 'fire',
    match: ['priest', 'pandit', 'pooja', 'puja', 'ritual'],
    fields: [{ label: 'Rituals', placeholder: 'Muhurtham + homam' }],
    noteLabel: 'What’s included',
    notePlaceholder: 'Samagri, dakshina…',
  },
  {
    key: 'music',
    label: 'Music & entertainment',
    icon: 'music-note-outline',
    match: ['music', 'dj', 'band', 'entertainment'],
    fields: [{ label: 'Setup', placeholder: 'DJ + live band' }],
    noteLabel: 'What’s included',
    notePlaceholder: 'Sound, lights, 4 hours…',
  },
  {
    key: 'transport',
    label: 'Transport',
    icon: 'car-outline',
    match: ['transport', 'travel', 'cab', 'car'],
    fields: [{ label: 'Vehicles', placeholder: '2 sedans + 1 tempo' }],
    noteLabel: 'What’s included',
    notePlaceholder: 'Fuel, driver, tolls…',
  },
  {
    key: 'gifting',
    label: 'Return gifts',
    icon: 'gift-outline',
    match: ['gift', 'return gift', 'favour', 'favor'],
    fields: [{ label: 'Item', placeholder: 'Silver coin boxes' }],
    noteLabel: 'What’s included',
    notePlaceholder: 'Packing, name tags…',
  },
];

/** Any other service: one amount and a line of detail. */
export const GENERIC_TEMPLATE: CategoryTemplate = {
  key: 'other',
  label: 'Other service',
  icon: 'star-four-points-outline',
  match: [],
  fields: [{ label: 'Details', placeholder: 'What this covers' }],
  noteLabel: 'What’s included',
  notePlaceholder: 'Anything the customer should know',
};

/** The "Add a service" picker: every template, then a blank one. */
export const ADD_CHOICES: CategoryTemplate[] = [
  ...CATEGORY_TEMPLATES,
  GENERIC_TEMPLATE,
];

export const QUOTE_COPY = {
  title: 'Send a quote',
  titleDraft: 'Finish your quote',
  titleSent: 'Your quote',
  loading: 'Loading the enquiry…',
  error: 'We couldn’t load this enquiry.',
  retry: 'Try again',
  notFoundTitle: 'Enquiry not available',
  notFoundBody:
    'The customer may have cancelled it, or it is no longer open to you.',
  back: 'Go back',

  // Enquiry card
  enquiryEyebrow: 'Enquiry',
  guests: (n: string) => `${n} guests`,
  budget: (b: string) => `Budget ${b}`,
  ideasTitle: 'Their ideas',
  readMore: 'Read more',
  readLess: 'Show less',

  // Sections
  servicesTitle: 'Services & prices',
  servicesHint: 'One card per service. Prices are in rupees, before tax.',
  noServices: 'Add the services you’ll provide.',
  addService: 'Add a service',
  addServiceTitle: 'Which service?',
  cancel: 'Cancel',
  serviceName: 'Service name',
  amount: 'Amount',
  lineTotal: 'Total',
  plateMaths: (plates: string, rate: string) => `${plates} × ${rate}`,
  lumpSumHint: 'Or enter a total amount instead',
  removeService: 'Remove',
  removeA11y: (name: string) => `Remove ${name}`,
  noPrice: 'Add price',

  termsTitle: 'Terms',
  notesLabel: 'Note to the customer',
  notesPlaceholder: 'What’s included, what isn’t, how long the quote is valid…',
  taxLabel: 'Tax (GST %)',
  taxHint: 'Added on top of the services.',
  advanceLabel: 'Advance to confirm',
  advanceHint: 'Share of the total the customer pays to book you.',
  custom: 'Custom',
  percent: (n: number | string) => `${n}%`,
  siteVisitTitle: 'Suggest a site visit',
  siteVisitBody: 'Tell the customer you’d like to see the venue first.',
  siteVisitRecommended: 'Recommended for quotes above ₹2L.',

  // Footer
  subtotal: 'Subtotal',
  tax: (rate: number) => `Tax ${rate}%`,
  total: 'Total',
  advance: (pct: number) => `Advance ${pct}%`,
  send: 'Send quote',
  sending: 'Sending…',
  update: 'Update quote',
  updating: 'Updating…',
  saveDraft: 'Save draft',
  savingDraft: 'Saving…',

  // Confirmations
  confirmSendTitle: 'Send this quote?',
  confirmUpdateTitle: 'Update this quote?',
  confirmBody: (who: string, total: string, advance: string) =>
    `${who} will see a total of ${total}, with ${advance} to confirm. We’ll let them know.`,
  confirmDropped: (n: number) =>
    n === 1
      ? '\n\n1 service without a price will be left out.'
      : `\n\n${n} services without a price will be left out.`,
  theCustomer: 'The customer',
  confirmSend: 'Send',
  confirmUpdate: 'Update',
  sentDone: 'Quote sent',
  updatedDone: 'Quote updated',
  draftDone: 'Draft saved',
  withdrawnDone: 'Quote withdrawn',

  withdraw: 'Withdraw quote',
  withdrawTitle: 'Withdraw this quote?',
  withdrawBody:
    'The customer will be told you’ve withdrawn it, and it can’t be accepted any more.',
  withdrawConfirm: 'Withdraw',
  withdrawFailed: 'Couldn’t withdraw the quote.',

  discardTitle: 'Discard changes?',
  discardBody: 'Your changes to this quote haven’t been saved.',
  keepEditing: 'Keep editing',
  discard: 'Discard',

  saveFailed: 'Couldn’t save the quote. Please try again.',
  fixFields: 'Check the highlighted fields.',

  // Validation
  needPrice: 'Add a price to at least one service.',
  needTitle: 'Give this service a name.',
  titleTooLong: `Keep the name under ${120} characters.`,
  noteTooLong: `Keep this under ${500} characters.`,
  notesTooLong: `Keep the note under ${2000} characters.`,
  percentRange: 'Enter a number from 0 to 100.',

  // Status banners
  banner: {
    draft: 'Draft — only you can see this until you send it.',
    sent: 'Sent. Changes you make here are sent to the customer as an update.',
    updated:
      'Updated. Changes you make here are sent to the customer as an update.',
    superseded:
      'The customer changed their brief. Review the prices and send an update.',
    accepted: 'Accepted — the customer booked you with this quote.',
    rejected: 'The customer declined this quote.',
    withdrawn: 'You withdrew this quote.',
    closed: 'This enquiry is closed.',
  },

  // Customer view
  preview: 'Customer view',
  previewA11y: 'See the quote as the customer will',
  previewTitle: 'How the customer sees it',
  previewEmpty: 'No priced services yet.',
  previewSiteVisit: 'Site visit suggested before the plan is final',
  previewNotes: 'Note from the organizer',
  previewAdvance: (pct: number) => `Pay ${pct}% to confirm`,
  close: 'Close',
} as const;
