/**
 * @format
 *
 * The quotes on one brief.
 *
 * This screen is named for comparing, but it is the screen a customer lands on
 * when ONE organizer has replied — which is most briefs, most of the time. Half
 * of what follows is about that case, because every comparison the screen makes
 * (a lowest badge, a price range, "declines the rest") is a claim that needs a
 * second quote to be true.
 */

import { mapCompare } from '../src/modules/CompareQuotes/utils';
import { COMPARE_COPY } from '../src/modules/CompareQuotes/constants';
import type { QuoteRequestDTO, QuotationDTO } from '../src/modules/CompareQuotes/types';

const line = (key: string, title: string, price: number) => ({
  key,
  title,
  subtitle: '',
  price,
  note: '',
});

const quotation = (over: Partial<QuotationDTO> = {}): QuotationDTO =>
  ({
    id: 'q1',
    requestId: 'r1',
    status: 'sent',
    lineItems: [line('decor', 'Decor & flowers', 62000), line('cake', 'Cake & catering', 74000)],
    subtotal: 136000,
    taxRate: 0,
    taxAmount: 0,
    grandTotal: 185000,
    advancePercentage: 30,
    advanceAmount: 55500,
    organizer: {
      id: 'o1',
      name: 'Mahendra Events',
      initials: 'ME',
      avatarColor: '#e8633a',
      tier: 'gold',
      rating: 4.8,
      reviews: 62,
    },
    ...over,
  }) as QuotationDTO;

const request = (quotations: QuotationDTO[]): QuoteRequestDTO =>
  ({
    id: 'r1',
    occasion: 'anniversary',
    when: '',
    where: '',
    guests: '',
    status: 'quoted',
    quotations,
  }) as QuoteRequestDTO;

const dearer = quotation({
  id: 'q2',
  grandTotal: 240000,
  organizer: {
    id: 'o2',
    name: 'Sruthi Celebrations',
    initials: 'SC',
    avatarColor: '#6d5bd0',
    tier: 'gold',
    rating: 4.6,
    reviews: 41,
  },
});

const one = () => mapCompare(request([quotation()]), 'Anniversary');
const two = () => mapCompare(request([quotation(), dearer]), 'Anniversary');

describe('one organizer has replied', () => {
  it('shows the quote rather than an empty state', () => {
    // The screen is reachable from Home as soon as a single quote lands, and
    // a customer who taps through must find their quote on it.
    const m = one();
    expect(m.quotes).toHaveLength(1);
    expect(m.quotes[0].totalLabel).toBe('₹1,85,000');
    expect(m.quotes[0].advanceLabel).toBe('₹55,500');
  });

  it('carries the breakdown, so the one price can be examined', () => {
    expect(one().quotes[0].lines.map((l) => l.title)).toEqual([
      'Decor & flowers',
      'Cake & catering',
    ]);
  });

  it('calls itself "Your quote", not "Compare quotes"', () => {
    // Heading a single reply "Compare quotes" tells the customer the others
    // must be hidden somewhere on the screen.
    expect(one().heading).toBe('Your quote');
    expect(two().heading).toBe('Compare quotes');
  });

  it('does not badge the only quote as the lowest', () => {
    // Lowest of one is not a finding.
    expect(one().quotes[0].isLowest).toBe(false);
    expect(two().quotes[0].isLowest).toBe(true);
  });

  it('states no price range, because one price is not a range', () => {
    expect(one().spreadLabel).toBe('');
    expect(two().spreadLabel).toContain('across 2 quotes');
  });

  it('promises to decline the rest only when there is a rest', () => {
    // Said on the card via `isOnly`; the two sentences are asserted here so a
    // rewrite of either cannot quietly reintroduce the false one.
    expect(COMPARE_COPY.acceptNoteOnly).not.toMatch(/the rest/i);
    expect(COMPARE_COPY.acceptNote).toMatch(/the rest/i);
  });
});

describe('what counts as a quote', () => {
  it('drops a withdrawn quote, which is not an option any more', () => {
    const pulled = quotation({ id: 'q2', status: 'withdrawn' });
    const m = mapCompare(request([quotation(), pulled]), 'Anniversary');
    expect(m.quotes).toHaveLength(1);
    // And with one left standing, it stops calling itself a comparison.
    expect(m.heading).toBe('Your quote');
  });

  it('never shows an organizer their own unsent draft', () => {
    const draft = quotation({ id: 'q2', status: 'draft' });
    expect(mapCompare(request([quotation(), draft]), 'Anniversary').quotes).toHaveLength(1);
  });

  it('puts the cheapest first while the choice is open', () => {
    expect(two().quotes.map((q) => q.id)).toEqual(['q1', 'q2']);
  });

  it('leads with the accepted quote once one is decided', () => {
    const accepted = quotation({ id: 'q2', status: 'accepted', grandTotal: 240000 });
    const m = mapCompare(request([quotation(), accepted]), 'Anniversary');
    expect(m.isDecided).toBe(true);
    expect(m.quotes[0].id).toBe('q2');
    // Nothing is badged lowest once the decision is made.
    expect(m.quotes.every((q) => !q.isLowest)).toBe(true);
  });

  it('falls back to the given title when the brief named no occasion', () => {
    const m = mapCompare({ ...request([quotation()]), occasion: '' }, 'Your event');
    expect(m.title).toBe('Your event');
  });
});
