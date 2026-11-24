import {
  CATEGORY_TEMPLATES,
  GENERIC_TEMPLATE,
} from '../src/organizerModules/QuoteRespond/constants';
import type {
  LineForm,
  QuotationDTO,
  QuoteForm,
  QuoteRequestDTO,
} from '../src/organizerModules/QuoteRespond/types';
import {
  buildBody,
  computeTotals,
  digitsOnly,
  droppedCount,
  errorText,
  formForRequest,
  formFromQuotation,
  formTotals,
  hasErrors,
  insertLine,
  isDirty,
  lineAmount,
  modeOf,
  newLine,
  percentInput,
  previewLines,
  setSubItem,
  templateForCategory,
  templateForLine,
  validate,
} from '../src/organizerModules/QuoteRespond/utils';

const food = CATEGORY_TEMPLATES.find(t => t.key === 'food')!;
const decor = CATEGORY_TEMPLATES.find(t => t.key === 'decor')!;
const photo = CATEGORY_TEMPLATES.find(t => t.key === 'photography')!;

const line = (over: Partial<LineForm> = {}, t = decor): LineForm => ({
  ...newLine(t),
  ...over,
});

const form = (over: Partial<QuoteForm> = {}): QuoteForm => ({
  lines: [],
  taxRate: '18',
  advanceChoice: 30,
  advanceCustom: '',
  notes: '',
  siteVisit: false,
  ...over,
});

const plates = (p: string, r: string) =>
  setSubItem(setSubItem(newLine(food), 'Plates', p), 'Rate per plate', r);

/** The backend's `computeTotals` + `quotationView` advance, verbatim. */
function backend(prices: number[], taxRate: number, advance: number) {
  const subtotal = prices.reduce((sum, p) => sum + (p || 0), 0);
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const grandTotal = subtotal + taxAmount;
  return {
    subtotal,
    taxAmount,
    grandTotal,
    advanceAmount: Math.round((grandTotal * advance) / 100),
  };
}

const quotation = (over: Partial<QuotationDTO> = {}): QuotationDTO => ({
  id: 'q1',
  requestId: 'r1',
  status: 'sent',
  lineItems: [
    {
      key: 'food',
      title: 'Catering',
      subtitle: '',
      price: 105000,
      note: 'Veg buffet',
      subItems: [
        { label: 'Plates', value: '300' },
        { label: 'Rate per plate', value: '350' },
        { label: 'Counters', value: '2' },
      ],
    },
  ],
  subtotal: 105000,
  taxRate: 5,
  taxAmount: 5250,
  grandTotal: 110250,
  advancePercentage: 40,
  advanceAmount: 44100,
  siteVisitSuggested: true,
  notes: 'Valid for 14 days',
  ...over,
});

const request = (over: Partial<QuoteRequestDTO> = {}): QuoteRequestDTO => ({
  id: 'r1',
  customerName: 'Priya R.',
  occasion: 'Wedding',
  when: '14 Nov 2026',
  where: 'Hyderabad',
  guests: '300',
  budget: '₹5–8L',
  categories: ['Food & Catering', 'Decor'],
  ideas: '',
  status: 'open',
  myQuotation: null,
  ...over,
});

describe('money', () => {
  it('matches the backend for tax, total and advance', () => {
    const cases: Array<[number[], number, number]> = [
      [[105000, 50000], 18, 30],
      [[999], 18, 30],
      [[50], 5, 50],
      [[1001], 12.5, 20],
      [[333, 333, 334], 18, 33],
      [[0], 18, 30],
      [[123457], 0, 0],
      [[7], 100, 100],
    ];
    for (const [prices, tax, adv] of cases) {
      expect(computeTotals(prices, tax, adv)).toEqual({
        ...backend(prices, tax, adv),
        taxRate: tax,
        advancePercentage: adv,
      });
    }
  });

  it('rounds tax and advance to whole rupees, half up', () => {
    // 999 × 18% = 179.82 → 180; 1179 × 30% = 353.7 → 354
    expect(computeTotals([999], 18, 30)).toMatchObject({
      taxAmount: 180,
      grandTotal: 1179,
      advanceAmount: 354,
    });
    // 50 × 5% = 2.5 → 3
    expect(computeTotals([50], 5, 30).taxAmount).toBe(3);
  });

  it('prices catering as plates × rate, else the typed amount', () => {
    expect(lineAmount(plates('300', '350'))).toBe(105000);
    // Half-filled: falls back to a lump sum.
    expect(lineAmount({ ...plates('300', ''), price: '90000' })).toBe(90000);
    expect(lineAmount(line({ price: '25000' }))).toBe(25000);
    expect(lineAmount(line({ price: '' }))).toBe(0);
  });

  it('totals the form with its tax and advance choice', () => {
    const f = form({
      lines: [plates('300', '350'), line({ price: '50000' })],
      advanceChoice: 'custom',
      advanceCustom: '25',
    });
    expect(formTotals(f)).toEqual({
      subtotal: 155000,
      taxRate: 18,
      taxAmount: 27900,
      grandTotal: 182900,
      advancePercentage: 25,
      advanceAmount: 45725,
    });
    expect(formTotals(form({ lines: f.lines, taxRate: '' })).taxAmount).toBe(0);
  });
});

describe('templates', () => {
  it('matches requested categories to a template', () => {
    expect(templateForCategory('Food & Catering').key).toBe('food');
    expect(templateForCategory('Photography / Video').key).toBe('photography');
    const other = templateForCategory('Mehendi Artist');
    expect(other.key).toBe('mehendi-artist');
    expect(other.fields).toEqual(GENERIC_TEMPLATE.fields);
  });

  it('keeps a line priced by its key, whatever it is renamed to', () => {
    expect(
      templateForLine({ key: 'other', title: 'Catering' }).derivePrice,
    ).toBeUndefined();
    expect(templateForLine({ key: 'food', title: 'Lunch' }).key).toBe('food');
    expect(templateForLine({ key: '', title: 'Catering' }).key).toBe('food');
  });

  it('starts one card per requested service', () => {
    const f = formForRequest(['Food & Catering', 'Decor']);
    expect(f.lines.map(l => [l.key, l.title])).toEqual([
      ['food', 'Food & Catering'],
      ['decor', 'Decor'],
    ]);
    expect(f.lines[0].subItems.map(s => s.label)).toEqual([
      'Plates',
      'Rate per plate',
    ]);
    expect(f).toMatchObject({ taxRate: '18', advanceChoice: 30 });
    expect(formForRequest([]).lines).toHaveLength(1);
  });

  it('adds a line after the others of its kind', () => {
    const a = line({ key: 'decor' });
    const b = line({ key: 'food' }, food);
    const c = line({ key: 'decor' });
    const lines = insertLine([a, b], c);
    expect(lines.map(l => l.uid)).toEqual([a.uid, c.uid, b.uid]);
    const d = line({ key: 'music' });
    expect(insertLine(lines, d).at(-1)?.uid).toBe(d.uid);
  });
});

describe('saved quotation', () => {
  it('fills the form from it, keeping unknown detail', () => {
    const f = formFromQuotation(quotation());
    expect(f).toMatchObject({
      taxRate: '5',
      advanceChoice: 'custom',
      advanceCustom: '40',
      notes: 'Valid for 14 days',
      siteVisit: true,
    });
    expect(f.lines[0].subItems).toEqual([
      { label: 'Plates', value: '300' },
      { label: 'Rate per plate', value: '350' },
      { label: 'Counters', value: '2' },
    ]);
    expect(formTotals(f)).toMatchObject({
      grandTotal: 110250,
      advanceAmount: 44100,
    });
    expect(
      formFromQuotation(quotation({ advancePercentage: 50 })).advanceChoice,
    ).toBe(50);
  });

  it('decides what the screen can do', () => {
    expect(modeOf(request())).toBe('new');
    const withQuote = (status: QuotationDTO['status']) =>
      modeOf(request({ myQuotation: quotation({ status }) }));
    expect(withQuote('draft')).toBe('draft');
    expect(withQuote('sent')).toBe('sent');
    expect(withQuote('updated')).toBe('sent');
    expect(withQuote('superseded')).toBe('sent');
    expect(withQuote('accepted')).toBe('readonly');
    expect(withQuote('rejected')).toBe('readonly');
    expect(withQuote('withdrawn')).toBe('readonly');
    expect(modeOf(request({ status: 'closed' }))).toBe('readonly');
  });
});

describe('request body', () => {
  const f = form({
    lines: [
      { ...plates('300', '350'), title: ' Catering ', note: ' Veg ' },
      line({ title: 'Decor', price: '' }),
      setSubItem(
        line({ key: 'photography', title: 'Photos', price: '40000' }, photo),
        'Deliverables',
        'Photos, Album',
      ),
    ],
    taxRate: '12.5',
    advanceChoice: 50,
    notes: '  Valid 14 days  ',
    siteVisit: true,
  });

  it('sends only priced services, with the backend field names', () => {
    expect(buildBody(f, false)).toEqual({
      lineItems: [
        {
          key: 'food',
          title: 'Catering',
          price: 105000,
          note: 'Veg',
          subItems: [
            { label: 'Plates', value: '300' },
            { label: 'Rate per plate', value: '350' },
          ],
        },
        {
          key: 'photography',
          title: 'Photos',
          price: 40000,
          subItems: [{ label: 'Deliverables', value: 'Photos, Album' }],
        },
      ],
      taxRate: 12.5,
      notes: 'Valid 14 days',
      advancePercentage: 50,
      siteVisitSuggested: true,
      asDraft: false,
    });
    expect(droppedCount(f)).toBe(1);
  });

  it('keeps unpriced, named services in a draft', () => {
    const body = buildBody(f, true);
    expect(body.asDraft).toBe(true);
    expect(body.lineItems.map(l => [l.title, l.price])).toEqual([
      ['Catering', 105000],
      ['Decor', 0],
      ['Photos', 40000],
    ]);
  });

  it('always sends tax, notes and site visit so an update can clear them', () => {
    const body = buildBody(form({ taxRate: '', notes: '' }), false);
    expect(body).toMatchObject({
      taxRate: 0,
      notes: '',
      siteVisitSuggested: false,
      advancePercentage: 30,
    });
  });
});

describe('validation', () => {
  it('needs one priced service to send, not to save a draft', () => {
    const f = form({ lines: [line({ price: '' })] });
    expect(validate(f, false).form).toBeTruthy();
    expect(hasErrors(validate(f, true))).toBe(false);
  });

  it('flags a priced service with no name', () => {
    const l = line({ title: '  ', price: '5000' });
    const errors = validate(form({ lines: [l] }), true);
    expect(errors.lines[l.uid]).toBeTruthy();
  });

  it('keeps percentages within 0–100', () => {
    const lines = [line({ price: '1000' })];
    expect(
      validate(form({ lines, taxRate: '120' }), false).taxRate,
    ).toBeTruthy();
    expect(
      validate(form({ lines, taxRate: '' }), false).taxRate,
    ).toBeUndefined();
    expect(
      validate(
        form({ lines, advanceChoice: 'custom', advanceCustom: '' }),
        false,
      ).advance,
    ).toBeTruthy();
    expect(
      validate(
        form({ lines, advanceChoice: 'custom', advanceCustom: '101' }),
        false,
      ).advance,
    ).toBeTruthy();
    expect(hasErrors(validate(form({ lines }), false))).toBe(false);
  });

  it('limits the note to the customer', () => {
    const lines = [line({ price: '1000' })];
    expect(
      validate(form({ lines, notes: 'x'.repeat(2001) }), false).notes,
    ).toBeTruthy();
  });
});

describe('input and display', () => {
  it('cleans typed numbers', () => {
    expect(digitsOnly('1,05,000', 9)).toBe('105000');
    expect(digitsOnly('12345678901', 9)).toBe('123456789');
    expect(percentInput('12.555')).toBe('12.55');
    expect(percentInput('1.2.3')).toBe('1.23');
    expect(percentInput('18%')).toBe('18');
  });

  it('notices edits but not new local ids', () => {
    const base = formForRequest(['Decor']);
    const relabelled = {
      ...base,
      lines: base.lines.map(l => ({ ...l, uid: 'x' })),
    };
    expect(isDirty(base, relabelled)).toBe(false);
    expect(isDirty(base, { ...base, notes: 'hi' })).toBe(true);
    expect(isDirty(null, base)).toBe(false);
  });

  it('shows the customer only priced services, with the plate maths', () => {
    const p = previewLines(
      form({ lines: [plates('300', '350'), line({ price: '' })] }),
    );
    expect(p).toHaveLength(1);
    expect(p[0].amount).toBe(`₹${(105000).toLocaleString('en-IN')}`);
    expect(p[0].details[0]).toContain('300 ×');
  });

  it('reads Nest validation messages', () => {
    expect(errorText({ message: ['a', 'b'] }, 'x')).toBe('a\nb');
    expect(errorText({ message: 'nope' }, 'x')).toBe('nope');
    expect(errorText(null, 'x')).toBe('x');
  });
});
