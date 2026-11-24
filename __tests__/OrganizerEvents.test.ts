import {
  groupEvents,
  mapEvent,
  respondByLabel,
  whenLabel,
} from '../src/organizerModules/Events/utils';
import type { OrganizerBookingDTO } from '../src/organizerModules/Events/types';

const NOW = new Date(2026, 9, 29, 12, 0);
const inDays = (d: number) => new Date(2026, 9, 29 + d, 0, 0).toISOString();
const inHours = (h: number) => new Date(NOW.getTime() + h * 3_600_000).toISOString();

const booking = (over: Partial<OrganizerBookingDTO> = {}): OrganizerBookingDTO => ({
  id: 'b1',
  title: 'Priya & Arjun Wedding',
  occasion: 'Wedding',
  location: 'Hyderabad',
  eventDate: inDays(14),
  daysToGo: 14,
  amount: 450000,
  advanceAmount: 135000,
  paymentStatus: 'advance_paid',
  organizerRespondBy: null,
  status: 'confirmed',
  tasks: [
    { id: 't1', status: 'done' },
    { id: 't2', status: 'todo' },
  ],
  customer: { id: 'c1', name: 'Priya Reddy' },
  ...over,
});

describe('labels', () => {
  it('says when an event is in plain words', () => {
    expect(whenLabel(inDays(0), NOW)).toBe('Today');
    expect(whenLabel(inDays(1), NOW)).toBe('Tomorrow');
    expect(whenLabel(inDays(12), NOW)).toBe('In 12 days');
    expect(whenLabel(inDays(-1), NOW)).toBe('Yesterday');
    expect(whenLabel(inDays(-3), NOW)).toBe('3 days ago');
    expect(whenLabel(undefined, NOW)).toBe('Date to be set');
  });

  it('counts down the time to respond, urgent in the last 12 hours', () => {
    expect(respondByLabel(inHours(30), NOW.getTime())).toEqual({ text: 'Respond within 30h', urgent: false });
    expect(respondByLabel(inHours(5), NOW.getTime())).toEqual({ text: 'Respond within 5h', urgent: true });
    expect(respondByLabel(inHours(72), NOW.getTime())).toEqual({ text: 'Respond within 3 days', urgent: false });
    expect(respondByLabel(inHours(-1), NOW.getTime())).toEqual({ text: 'Response overdue', urgent: true });
    expect(respondByLabel(null, NOW.getTime())).toBeNull();
  });
});

describe('card', () => {
  it('shows date, money, payment and task progress', () => {
    expect(mapEvent(booking(), NOW)).toMatchObject({
      title: 'Priya & Arjun Wedding',
      customerName: 'Priya Reddy',
      when: 'In 14 days',
      status: { label: 'Confirmed', tone: 'green' },
      amount: '₹4,50,000',
      paid: 'Advance paid',
      tasksDone: 1,
      tasksTotal: 2,
      awaiting: false,
      past: false,
    });
  });

  it('flags a booking waiting for the organizer, with its deadline', () => {
    expect(
      mapEvent(booking({ status: 'awaiting_organizer', organizerRespondBy: inHours(5) }), NOW),
    ).toMatchObject({ awaiting: true, respondBy: 'Respond within 5h', respondUrgent: true });
  });
});

describe('grouping', () => {
  const sections = groupEvents(
    [
      booking({ id: 'later', eventDate: inDays(30) }),
      booking({ id: 'soon', eventDate: inDays(2) }),
      booking({ id: 'undated', eventDate: undefined }),
      booking({ id: 'ask', status: 'awaiting_organizer', organizerRespondBy: inHours(10) }),
      booking({ id: 'done-old', status: 'completed', eventDate: inDays(-40) }),
      booking({ id: 'done-new', status: 'completed', eventDate: inDays(-2) }),
      booking({ id: 'cancelled', status: 'cancelled', eventDate: inDays(5) }),
    ],
    NOW,
  );

  it('puts bookings waiting on the organizer in their own list', () => {
    expect(sections.awaiting.map(i => i.id)).toEqual(['ask']);
  });

  it('orders upcoming soonest first, undated last', () => {
    expect(sections.upcoming.map(i => i.id)).toEqual(['soon', 'later', 'undated']);
  });

  it('keeps finished and cancelled events in Past, most recent first', () => {
    expect(sections.past.map(i => i.id)).toEqual(['cancelled', 'done-new', 'done-old']);
  });
});
