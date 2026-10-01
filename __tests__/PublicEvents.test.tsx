/**
 * @format
 *
 * Public events on the customer's side: the money discipline, and the rule
 * that no screen here decides what it is allowed to do.
 */

jest.mock('react-native-razorpay', () => ({ open: jest.fn() }));

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { apiClient } from '../src/services/apiClient';
import {
  browseEvents,
  confirmBooking,
  fetchEventDetail,
  fetchMyTickets,
  fetchTicket,
  startBooking,
} from '../src/modules/PublicEvents/services';
import {
  BROWSE_ENDPOINT,
  MY_TICKETS_ENDPOINT,
  TICKET_STATE_LABEL,
  formatPrice,
} from '../src/modules/PublicEvents/constants';

const get = jest.spyOn(apiClient, 'get');
const post = jest.spyOn(apiClient, 'post');

beforeEach(() => {
  get.mockReset().mockResolvedValue({ data: { items: [] } } as never);
  post.mockReset().mockResolvedValue({ data: {} } as never);
});

describe('what the app is allowed to ask for', () => {
  /*
   * The catalogue decides for itself what is visible. If this app could send a
   * status, somebody could read an organizer's unfinished drafts — so there is
   * deliberately no argument that could carry one.
   */
  it('never sends a status, a visibility or anybody else’s id when browsing', async () => {
    await browseEvents({ q: 'comedy', sort: 'soon' });
    const [url, config] = get.mock.calls[0] as [string, { params: Record<string, unknown> }];
    expect(url).toBe(BROWSE_ENDPOINT);
    for (const key of Object.keys(config.params)) {
      expect(key).not.toMatch(/status|draft|visib|organizer|customer/i);
    }
  });

  it('asks for one event by id alone', async () => {
    get.mockResolvedValue({ data: {} } as never);
    await fetchEventDetail('e1');
    expect(get.mock.calls[0][0]).toBe(`${BROWSE_ENDPOINT}/e1`);
  });

  /*
   * THE rule for a ticket sale. A body that could carry a price is a body a
   * modified client could carry its own price in — so the only things sent are
   * which ticket and how many, and the server reads the price itself.
   */
  it('sends only a ticket type and a quantity when buying', async () => {
    post.mockResolvedValue({ data: { bookingId: 'b1' } } as never);
    await startBooking('e1', 'tt1', 3);

    const [url, body] = post.mock.calls[0] as [string, Record<string, unknown>];
    expect(url).toBe(`${BROWSE_ENDPOINT}/e1/book`);
    expect(body).toEqual({ ticketTypeId: 'tt1', quantity: 3 });
    for (const key of Object.keys(body)) {
      expect(key).not.toMatch(/price|amount|total|discount|currency|paid|status/i);
    }
  });

  /*
   * Confirming hands back exactly what Razorpay signed and nothing else. A
   * client cannot claim a payment by asserting one — the signature is an HMAC
   * only the server can check.
   */
  it('sends nothing but Razorpay’s signed answer when confirming', async () => {
    post.mockResolvedValue({ data: {} } as never);
    await confirmBooking('b1', {
      razorpayOrderId: 'order_1',
      razorpayPaymentId: 'pay_1',
      razorpaySignature: 'sig',
    });

    const [, body] = post.mock.calls[0] as [string, Record<string, unknown>];
    expect(Object.keys(body).sort()).toEqual([
      'razorpayOrderId',
      'razorpayPaymentId',
      'razorpaySignature',
    ]);
  });

  it('reads tickets from the caller’s own route, with no customer id in it', async () => {
    await fetchMyTickets('upcoming');
    expect(get.mock.calls[0][0]).toBe(MY_TICKETS_ENDPOINT);
    expect(get.mock.calls[0][0]).not.toMatch(/customer/i);

    get.mockResolvedValue({ data: {} } as never);
    await fetchTicket('t1');
    expect(get.mock.calls[1][0]).toBe(`${MY_TICKETS_ENDPOINT}/t1`);
  });
});

describe('the ticket purchase flow', () => {
  /*
   * A free ticket is already confirmed by the server and already has its
   * tickets. Sending somebody to a payment sheet for ₹0 is a dead end with a
   * gateway at the bottom of it.
   */
  it('skips the gateway entirely when there is nothing to pay', async () => {
    const RazorpayCheckout = require('react-native-razorpay');
    post.mockResolvedValue({
      data: {
        bookingId: 'b1',
        reference: 'EVT-1',
        amount: 0,
        payment: null,
        status: 'confirmed',
        ticketIds: ['t1'],
      },
    } as never);

    const { useTicketPurchase } = require('../src/modules/PublicEvents/booking');

    /* No testing-library in this repo, so the hook is exercised the way the
       other suites here do it: a probe component and react-test-renderer. */
    let api: ReturnType<typeof useTicketPurchase> | null = null;
    const Probe = () => {
      api = useTicketPurchase();
      return null;
    };

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<Probe />);
    });

    let booked: { ticketIds: string[] } | null = null;
    await ReactTestRenderer.act(async () => {
      booked = await api!.buy('e1', 'tt1', 1, 'Free show');
    });

    expect(RazorpayCheckout.open).not.toHaveBeenCalled();
    expect(booked).not.toBeNull();
    expect((booked as unknown as { ticketIds: string[] }).ticketIds).toEqual(['t1']);
  });
});

describe('what the customer is told', () => {
  it('calls a zero price Free rather than ₹0', () => {
    expect(formatPrice(0)).toBe('Free');
    expect(formatPrice(250)).toBe('₹250');
  });

  it('has a word for every state a ticket can be in', () => {
    // The server decides the state; this is only what each one is called.
    expect(Object.keys(TICKET_STATE_LABEL).sort()).toEqual(
      ['cancelled', 'checked_in', 'completed', 'upcoming'].sort(),
    );
  });
});
