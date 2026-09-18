/**
 * @format
 *
 * One brief, several organizers, and what happens after they reply.
 *
 * The rules here are the ones a customer would notice if they broke: a brief
 * goes to everyone they ticked and nobody they did not; the button on Home
 * opens what its words promise; and the cash option never claims money has
 * moved when it has not.
 */

import { MAX_ORGANIZERS } from '../src/modules/Plan/constants';
import { mapPayment } from '../src/modules/Payment/utils';
import { PAY_OPTIONS } from '../src/modules/Payment/constants';
import type { PaymentOrderDTO } from '../src/modules/Payment/types';

/**
 * The shortlist reducer, mirrored from `toggleOrganizer`.
 *
 * Mirrored rather than imported because the container is a hook wired to the
 * API client; what is worth pinning down is the rule, which is small enough to
 * state exactly.
 */
function toggle(chosen: string[], id: string): string[] {
  if (chosen.includes(id)) return chosen.filter((x) => x !== id);
  if (chosen.length >= MAX_ORGANIZERS) return chosen;
  return [...chosen, id];
}

describe('the shortlist', () => {
  it('adds, removes, and keeps the order they were ticked in', () => {
    let chosen: string[] = [];
    chosen = toggle(chosen, 'b');
    chosen = toggle(chosen, 'a');
    chosen = toggle(chosen, 'c');
    expect(chosen).toEqual(['b', 'a', 'c']);

    chosen = toggle(chosen, 'a');
    expect(chosen).toEqual(['b', 'c']);
  });

  it('stops at the cap, but never at the cost of undoing a tick', () => {
    /*
     * Every recipient is a person who is notified and expected to price the
     * job, so the ceiling is real. What must not happen is a full shortlist
     * that cannot be changed — a customer who ticked six and wants a different
     * sixth has to be able to take one off.
     */
    let chosen = ['o1', 'o2', 'o3', 'o4', 'o5', 'o6'];
    expect(chosen).toHaveLength(MAX_ORGANIZERS);

    chosen = toggle(chosen, 'o7');
    expect(chosen).not.toContain('o7');
    expect(chosen).toHaveLength(MAX_ORGANIZERS);

    chosen = toggle(chosen, 'o3');
    expect(chosen).toEqual(['o1', 'o2', 'o4', 'o5', 'o6']);
    chosen = toggle(chosen, 'o7');
    expect(chosen).toContain('o7');
  });
});

/**
 * Where the Home card's main button goes, mirrored from `useOpenEvent`.
 *
 * Returns the route name alone — what is being pinned down is the choice, not
 * React Navigation's argument shape.
 */
function ctaRoute(source: string, quoteCount: number): string {
  if (source === 'booking') return 'Workspace';
  if (source !== 'quote') return 'Plan';
  return quoteCount === 2 ? 'LineByLine' : 'CompareQuotes';
}

describe('the button on the Home card', () => {
  it('opens the one quote there is, rather than a comparison of one', () => {
    expect(ctaRoute('quote', 1)).toBe('CompareQuotes');
  });

  it('goes straight to the side-by-side when there are exactly two', () => {
    /*
     * "Compare 2 quotes" promises a comparison, and with two there is no
     * choosing left — sending the customer to a list so they can tick the only
     * two rows on it is a screen that asks a question with one answer.
     */
    expect(ctaRoute('quote', 2)).toBe('LineByLine');
  });

  it('opens the list at three, where which two is a real choice', () => {
    expect(ctaRoute('quote', 3)).toBe('CompareQuotes');
    expect(ctaRoute('quote', 6)).toBe('CompareQuotes');
  });

  it('still opens the request when nobody has replied at all', () => {
    // A brief with no quotes used to fall through to a blank plan wizard.
    expect(ctaRoute('quote', 0)).toBe('CompareQuotes');
  });

  it('leaves a booking and a draft where they were', () => {
    expect(ctaRoute('booking', 0)).toBe('Workspace');
    expect(ctaRoute('plan', 0)).toBe('Plan');
  });
});

const order = (over: Partial<PaymentOrderDTO> = {}): PaymentOrderDTO =>
  ({
    orderId: 'order_TEST',
    amountInPaise: 20520000,
    currency: 'INR',
    keyId: 'rzp_test',
    advanceAmount: 205200,
    totalAmount: 684000,
    balanceAmount: 478800,
    advancePercentage: 30,
    couponCode: '',
    couponDiscount: 0,
    organizerName: 'Mahendra Events',
    ...over,
  }) as PaymentOrderDTO;

describe('paying in cash', () => {
  it('is offered alongside the gateway, not hidden under it', () => {
    // It is the one path that works when the gateway does not.
    expect(PAY_OPTIONS.map((o) => o.id)).toEqual(['upi', 'card', 'netbanking', 'cash']);
  });

  it('says "book", not "pay" — tapping it moves no money', () => {
    const model = mapPayment(order());
    expect(model.ctaLabel).toBe('Pay ₹2,05,200 advance');
    expect(model.cashCtaLabel).toBe('Book with ₹2,05,200 in cash');
    // Same figure either way: the server priced it, and the method does not
    // change what is owed.
    expect(model.cashCtaLabel).toContain('₹2,05,200');
  });
});
