/**
 * @format
 *
 * My Bookings.
 *
 * The rules that matter: every status the backend can emit has a label, a
 * booking that is over has no countdown, and a line the booking does not
 * carry is dropped rather than shown as a dash.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, size, color }: { name: string; size?: number; color?: string }) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});

import { page, toHtml } from '../test-utils/rn-to-html';
import { BookingRow } from '../src/modules/Booking/sections/BookingRow';
import { formatINR, initials, isPast, mapBookings } from '../src/modules/Booking/utils';
import { BOOKING_STATUS_COPY } from '../src/modules/Booking/constants';
import type { BookingDTO, BookingStatus } from '../src/modules/Booking/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const dto = (over: Partial<BookingDTO> = {}): BookingDTO =>
  ({
    id: 'bk1',
    ref: 'EVT-2026-1977',
    title: 'Your Naming · 5 Sept 2026',
    occasion: 'naming',
    location: 'Jubilee Hills, Hyderabad',
    eventDate: '2026-09-05T00:00:00.000Z',
    daysToGo: 8,
    amount: 240000,
    amountPaid: 72000,
    paymentStatus: 'advance_paid',
    progress: 25,
    status: 'confirmed',
    organizer: {
      id: 'o1',
      name: 'MAHENDRA EVENTS',
      initials: 'ME',
      avatarColor: '#7C5CE6',
      tier: 'Silver',
      rating: 0,
    },
    createdAt: '2026-08-01T00:00:00.000Z',
    ...over,
  }) as BookingDTO;

function render(node: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(node);
  });
  return tree;
}

function textOf(tree: ReactTestRenderer.ReactTestRenderer): string {
  const out: string[] = [];
  const walk = (n: any) => {
    if (n == null) return;
    if (typeof n === 'string') {
      if (!n.startsWith(' icon:')) out.push(n);
      return;
    }
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    walk(n.children);
  };
  walk(tree.toJSON());
  return out.join('');
}

function drawnButtons(tree: ReactTestRenderer.ReactTestRenderer): any[] {
  const out: any[] = [];
  const walk = (n: any) => {
    if (n == null || typeof n === 'string') return;
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (n.props?.accessibilityRole === 'button') out.push(n);
    walk(n.children);
  };
  walk(tree.toJSON());
  return out;
}

const noop = () => {};
const row = (over: Partial<BookingDTO> = {}) =>
  render(<BookingRow item={mapBookings([dto(over)])[0]} onPress={noop} />);

describe('mapBookings', () => {
  it('labels every status the backend can emit', () => {
    // `awaiting_organizer` and `expired` were missing from the mobile union,
    // so they fell through to a generic grey label.
    const statuses: BookingStatus[] = [
      'pending',
      'awaiting_organizer',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'rejected',
      'expired',
    ];

    for (const status of statuses) {
      expect(BOOKING_STATUS_COPY[status]).toBeDefined();
      expect(mapBookings([dto({ status })])[0].statusLabel).toBe(BOOKING_STATUS_COPY[status].label);
    }
  });

  it('treats an unanswered booking as a failure, not a neutral state', () => {
    expect(mapBookings([dto({ status: 'expired' })])[0].statusTone).toBe('danger');
    expect(mapBookings([dto({ status: 'awaiting_organizer' })])[0].statusTone).toBe('warning');
  });

  it('drops the countdown once a booking is over', () => {
    // "3 days to go" on a completed event is nonsense.
    expect(mapBookings([dto({ status: 'completed', daysToGo: 3 })])[0].daysToGo).toBeNull();
    expect(mapBookings([dto({ status: 'cancelled', daysToGo: 3 })])[0].daysToGo).toBeNull();
    // 0 is a real answer: the event is today.
    expect(mapBookings([dto({ daysToGo: 0 })])[0].daysToGo).toBe(0);
  });

  it('sorts a booking into the tab that matches its status', () => {
    expect(mapBookings([dto({ status: 'in_progress' })])[0].tab).toBe('active');
    expect(mapBookings([dto({ status: 'rejected' })])[0].tab).toBe('past');
    expect(isPast('expired')).toBe(true);
    expect(isPast('pending')).toBe(false);
  });

  it('shows a payment only when both halves are known', () => {
    // "₹72,000" on its own says nothing about what is still owed.
    expect(mapBookings([dto()])[0].paidLabel).toBe('₹72,000 of ₹2,40,000');
    expect(mapBookings([dto({ amount: 0 })])[0].paidLabel).toBe('');
    expect(mapBookings([dto({ amountPaid: 0 })])[0].paidLabel).toBe('');
  });

  it('never prints ₹0 for an amount nobody has set', () => {
    expect(formatINR(0)).toBe('');
    expect(formatINR(undefined)).toBe('');
  });

  it('falls back to a monogram it can actually draw', () => {
    expect(initials('MAHENDRA EVENTS')).toBe('ME');
    expect(initials('')).toBe('·');
  });
});

describe('BookingRow', () => {
  it('shows the booking, its reference and where it is', () => {
    const text = textOf(row());

    expect(text).toContain('Your Naming · 5 Sept 2026');
    expect(text).toContain('EVT-2026-1977');
    expect(text).toContain('Jubilee Hills, Hyderabad');
    expect(text).toContain('5 Sept 2026');
    expect(text).toContain('₹72,000 of ₹2,40,000');
    expect(text).toContain('8 days to go');
  });

  it('says "Today" rather than "0 days to go"', () => {
    expect(textOf(row({ daysToGo: 0 }))).toContain('Today');
  });

  it('drops a line the booking does not carry', () => {
    const text = textOf(row({ location: '', amount: 0, amountPaid: 0 }));

    expect(text).not.toContain('₹');
    expect(text).toContain('Your Naming · 5 Sept 2026');
  });

  it('names an organizer who has not been assigned yet', () => {
    expect(textOf(row({ organizer: null }))).toContain('Organizer to be confirmed');
  });

  it('is one tap target, not a card plus a nested link', () => {
    const tree = row();
    const buttons = drawnButtons(tree);

    expect(buttons).toHaveLength(1);
    expect(buttons[0].props.accessibilityLabel).toContain('Open workspace');
  });

  it('opens the workspace when tapped', () => {
    const onPress = jest.fn();
    const tree = render(<BookingRow item={mapBookings([dto()])[0]} onPress={onPress} />);

    ReactTestRenderer.act(() =>
      tree.root.findAllByProps({ accessibilityRole: 'button' })[0].props.onPress(),
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const cards = (list: BookingDTO[]) => (
      <>
        {mapBookings(list).map((item) => (
          <BookingRow key={item.id} item={item} onPress={noop} />
        ))}
      </>
    );

    const panels: Array<[string, string]> = [
      [
        'Active bookings',
        toHtml(
          render(
            cards([
              dto(),
              dto({
                id: 'bk2',
                ref: 'EVT-2026-2043',
                title: 'Your Wedding · 12 Dec 2026',
                occasion: 'wedding',
                status: 'awaiting_organizer',
                progress: 20,
                daysToGo: 106,
                amountPaid: 300000,
                amount: 1000000,
              }),
              dto({
                id: 'bk3',
                ref: 'EVT-2026-2101',
                title: 'Housewarming',
                occasion: 'housewarming',
                status: 'in_progress',
                progress: 70,
                daysToGo: 0,
                location: '',
                organizer: null,
                amount: 0,
                amountPaid: 0,
              }),
            ]),
          ).toJSON(),
        ),
      ],
      [
        'Past bookings',
        toHtml(
          render(
            cards([
              dto({ id: 'bk4', status: 'completed', progress: 100, title: 'Your Anniversary', occasion: 'anniversary' }),
              dto({ id: 'bk5', status: 'expired', progress: 20, title: 'Your Birthday', occasion: 'birthday' }),
            ]),
          ).toJSON(),
        ),
      ],
    ];

    fs.writeFileSync(out, page(panels, { title: 'My Bookings', width: 390, background: '#fff', padding: 16 }), 'utf8');
    expect(fs.existsSync(out)).toBe(true);
  });
});
