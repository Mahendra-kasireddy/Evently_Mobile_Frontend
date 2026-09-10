/**
 * @format
 *
 * Payments.
 *
 * There is no payments endpoint — this screen is a second reading of the
 * bookings list. So the rules that matter are about not inventing money: a
 * booking with nothing agreed is not a debt, a total is a sum across events
 * rather than a bill, and a settled event drops the column it has no figure for.
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
import { PaymentRow } from '../src/modules/Payments/sections/PaymentRow';
import { mapPayments, summarise } from '../src/modules/Payments/utils';
import { PAYMENTS_COPY } from '../src/modules/Payments/constants';
import type { BookingDTO } from '../src/modules/Booking/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const dto = (over: Partial<BookingDTO> = {}): BookingDTO =>
  ({
    id: 'bk1',
    ref: 'EVT-2026-1977',
    title: 'Naming ceremony',
    occasion: 'naming',
    location: 'Jubilee Hills, Hyderabad',
    eventDate: '2026-09-05T00:00:00.000Z',
    daysToGo: 3,
    amount: 240000,
    amountPaid: 72000,
    advanceAmount: 72000,
    balanceAmount: 168000,
    paymentStatus: 'advance_paid',
    progress: 35,
    status: 'confirmed',
    steps: [],
    organizer: {
      id: 'o1',
      name: 'Mahendra Events',
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

const noop = () => {};

describe('mapPayments', () => {
  it('reads the figures the bookings list already carries', () => {
    const [item] = mapPayments([dto()]);

    expect(item.agreedLabel).toBe('₹2,40,000');
    expect(item.paidLabel).toBe('₹72,000');
    expect(item.dueLabel).toBe('₹1,68,000');
    expect(item.paidPercent).toBe(30);
    expect(item.settled).toBe(false);
  });

  it('leaves out a booking with nothing agreed', () => {
    // A quote nobody has accepted has no money attached; listing it under
    // Payments would invent a debt.
    expect(mapPayments([dto({ amount: 0, amountPaid: 0, balanceAmount: 0 })])).toHaveLength(0);
  });

  it('marks an event with nothing left to pay as settled', () => {
    const [item] = mapPayments([
      dto({ amountPaid: 240000, balanceAmount: 0, paymentStatus: 'paid_in_full' }),
    ]);

    expect(item.settled).toBe(true);
    expect(item.paidPercent).toBe(100);
  });

  it('puts the largest balance first, and what is settled last', () => {
    const order = mapPayments([
      dto({ id: 'small', balanceAmount: 1000 }),
      dto({ id: 'done', balanceAmount: 0, amountPaid: 240000 }),
      dto({ id: 'big', balanceAmount: 500000, amount: 600000 }),
    ]).map((i) => i.bookingId);

    expect(order).toEqual(['big', 'small', 'done']);
  });
});

describe('summarise', () => {
  it('adds up what is still owed across every event', () => {
    const summary = summarise(
      mapPayments([dto({ id: 'a', balanceAmount: 168000 }), dto({ id: 'b', balanceAmount: 32000 })]),
    );

    expect(summary.outstandingLabel).toBe('₹2,00,000');
    expect(summary.eventsWithBalance).toBe(2);
  });

  it('says nothing is outstanding rather than showing ₹0', () => {
    const summary = summarise(mapPayments([dto({ balanceAmount: 0, amountPaid: 240000 })]));

    expect(summary.eventsWithBalance).toBe(0);
    expect(summary.outstandingLabel).toBe('');
  });

  it('calls the total a sum across events, not a bill', () => {
    /*
     * These balances are owed to different organizers on different dates and
     * cannot be paid from this screen. A headline figure without that caveat
     * reads like something with a Pay button missing.
     */
    expect(PAYMENTS_COPY.outstandingNote).toContain('Across your events');
  });
});

describe('PaymentRow', () => {
  it('shows agreed, paid and due together', () => {
    // A balance alone says what is owed but not whether that is most of the
    // bill or the last of it.
    const text = textOf(render(<PaymentRow item={mapPayments([dto()])[0]} onPress={noop} />));

    expect(text).toContain('₹2,40,000');
    expect(text).toContain('₹72,000');
    expect(text).toContain('₹1,68,000');
    expect(text).toContain(PAYMENTS_COPY.due);
  });

  it('drops the "still due" column on a settled event', () => {
    const item = mapPayments([dto({ balanceAmount: 0, amountPaid: 240000 })])[0];
    const text = textOf(render(<PaymentRow item={item} onPress={noop} />));

    expect(text).not.toContain(PAYMENTS_COPY.due);
    expect(text).toContain(PAYMENTS_COPY.settled.toUpperCase());
  });

  it('names an organizer who has not been assigned yet', () => {
    const item = mapPayments([dto({ organizer: null })])[0];
    expect(textOf(render(<PaymentRow item={item} onPress={noop} />))).toContain(
      PAYMENTS_COPY.organizerTbd,
    );
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const rows = mapPayments([
      dto(),
      dto({
        id: 'bk2',
        ref: 'EVT-2026-2905',
        title: 'Birthday party',
        occasion: 'birthday',
        amount: 90000,
        amountPaid: 90000,
        balanceAmount: 0,
        paymentStatus: 'paid_in_full',
        status: 'completed',
      }),
    ]);

    const panels: Array<[string, string]> = [
      [
        'Payments',
        toHtml(
          render(
            <>
              {rows.map((item) => (
                <PaymentRow key={item.bookingId} item={item} onPress={noop} />
              ))}
            </>,
          ).toJSON(),
        ),
      ],
    ];

    fs.writeFileSync(
      out,
      page(panels, { title: 'Payments', width: 390, background: '#faf8f7', padding: 16 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
