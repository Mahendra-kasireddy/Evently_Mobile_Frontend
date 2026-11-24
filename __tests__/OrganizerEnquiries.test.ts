import {
  applyFilter,
  defaultFilter,
  filterChips,
  mapEnquiries,
  mapEnquiry,
  slaChip,
  stageOf,
} from '../src/organizerModules/Enquiries/utils';
import type { IncomingRequestDTO } from '../src/organizerModules/Enquiries/types';

const NOW = new Date(2026, 9, 29, 12, 0);
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3_600_000).toISOString();

const req = (over: Partial<IncomingRequestDTO> = {}): IncomingRequestDTO => ({
  id: 'r1',
  customerName: 'Priya R.',
  occasion: 'Wedding',
  when: '14 Nov 2026',
  where: 'Hyderabad',
  guests: '300',
  budget: '₹5–8L',
  categories: ['Decor', 'Catering'],
  ideas: '',
  status: 'open',
  createdAt: hoursAgo(2),
  myQuotation: null,
  ...over,
});

const quoted = (status: string, grandTotal = 125000) =>
  ({ id: 'q', status, grandTotal }) as IncomingRequestDTO['myQuotation'];

describe('stage', () => {
  it('sorts each enquiry by where the organizer is with it', () => {
    expect(stageOf(req())).toBe('new');
    expect(stageOf(req({ myQuotation: quoted('draft') }))).toBe('draft');
    expect(stageOf(req({ myQuotation: quoted('sent') }))).toBe('sent');
    expect(stageOf(req({ myQuotation: quoted('updated') }))).toBe('sent');
    expect(stageOf(req({ myQuotation: quoted('accepted') }))).toBe('confirmed');
    expect(stageOf(req({ myQuotation: quoted('rejected') }))).toBe('closed');
    expect(stageOf(req({ myQuotation: quoted('withdrawn') }))).toBe('closed');
    expect(stageOf(req({ status: 'cancelled' }))).toBe('closed');
  });
});

describe('reply-time chip', () => {
  it('counts down the 24 hours, turning red near the end and after', () => {
    expect(slaChip(hoursAgo(0.5), NOW.getTime())).toEqual({ label: 'New', tone: 'violet' });
    expect(slaChip(hoursAgo(10), NOW.getTime())).toEqual({ label: '14h left', tone: 'amber' });
    expect(slaChip(hoursAgo(20), NOW.getTime())).toEqual({ label: '4h left', tone: 'red' });
    expect(slaChip(hoursAgo(30), NOW.getTime())).toEqual({ label: 'Reply overdue', tone: 'red' });
  });
});

describe('card', () => {
  it('asks for a quote on a new enquiry', () => {
    expect(mapEnquiry(req(), NOW)).toMatchObject({
      title: 'Priya R.',
      occasion: 'Wedding',
      action: 'Send quote',
      quoteTotal: '',
      initials: 'PR',
    });
  });

  it('shows the quote and its status once sent', () => {
    expect(mapEnquiry(req({ myQuotation: quoted('sent', 125000) }), NOW)).toMatchObject({
      action: 'View quote',
      quoteTotal: '₹1,25,000',
      chip: { label: 'Sent', tone: 'violet' },
    });
  });

  it('leads with the occasion when the customer has no name, without repeating it', () => {
    expect(mapEnquiry(req({ customerName: '' }), NOW)).toMatchObject({
      title: 'Wedding',
      occasion: '',
    });
  });
});

describe('list', () => {
  const items = mapEnquiries(
    [
      req({ id: 'old', createdAt: hoursAgo(40), myQuotation: quoted('sent') }),
      req({ id: 'new', createdAt: hoursAgo(1), customerName: 'Arjun K.', where: 'Pune' }),
      req({ id: 'draft', createdAt: hoursAgo(5), myQuotation: quoted('draft') }),
    ],
    NOW,
  );

  it('puts the newest first', () => {
    expect(items.map(i => i.id)).toEqual(['new', 'draft', 'old']);
  });

  it('counts every chip', () => {
    expect(Object.fromEntries(filterChips(items).map(c => [c.key, c.count]))).toEqual({
      new: 1,
      draft: 1,
      sent: 1,
      confirmed: 0,
      closed: 0,
      all: 3,
    });
  });

  it('filters by chip and search together', () => {
    expect(applyFilter(items, 'all', 'pune').map(i => i.id)).toEqual(['new']);
    expect(applyFilter(items, 'draft', '').map(i => i.id)).toEqual(['draft']);
    expect(applyFilter(items, 'sent', 'pune')).toEqual([]);
  });

  it('opens on New when something waits for a reply', () => {
    expect(defaultFilter(items)).toBe('new');
    expect(defaultFilter(items.filter(i => i.stage !== 'new'))).toBe('all');
  });
});
