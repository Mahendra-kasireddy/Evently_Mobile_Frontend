/**
 * @format
 *
 * Public events on the customer's side: the money discipline, and the rule
 * that no screen here decides what it is allowed to do.
 */

jest.mock('react-native-razorpay', () => ({ open: jest.fn() }));

import React from 'react';
import { Text } from 'react-native';

declare const process: { env: Record<string, string | undefined> };
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

/*
 * The teaser on Home.
 *
 * This section shipped with a heading that rendered whether or not anything
 * was under it — "Events near you · See all" over an empty gap, which reads as
 * a section that failed rather than one with nothing to say. These are the
 * tests for that, and they are about what is on screen rather than what the
 * service was asked.
 */
describe('events near you, on Home', () => {
  const { EventsNearYou } = require('../src/modules/PublicEvents/sections/EventsNearYou');

  const HEADER_TEXT = 'Events near you';
  const header = React.createElement(Text, null, HEADER_TEXT);

  const draw = async (items: unknown[]) => {
    get.mockResolvedValue({ data: { items } } as never);
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        React.createElement(EventsNearYou, {
          header,
          coordinates: null,
          onOpenEvent: () => {},
        }),
      );
    });
    return JSON.stringify(tree.toJSON() ?? null);
  };

  const anEvent = {
    id: 'e1',
    title: 'Audio Launch 2026',
    category: 'Concert',
    coverUrl: '',
    startDateTime: new Date(Date.now() + 86_400_000).toISOString(),
    endDateTime: null,
    timezone: 'Asia/Kolkata',
    venueName: 'JRC Convention Centre',
    city: 'Hyderabad',
    startingPrice: 499,
    soldOut: false,
    status: 'published',
    liveEnabled: false,
    liveState: 'upcoming',
  };

  /*
   * Three chips share one phone's width, so each gets about a third of it.
   * "Within 10 km" and "Any distance" did not fit and were clipped mid-word —
   * a filter whose own value you cannot read. The icon says what it filters;
   * the label only has to say what it is set to.
   */
  it('keeps every chip label short enough to read in a third of the width', () => {
    const {
      DISTANCE_OPTIONS,
      WHEN_OPTIONS,
      SORT_OPTIONS,
    } = require('../src/modules/PublicEvents/constants');

    const labels = [
      ...DISTANCE_OPTIONS.map((o: { label: string }) => o.label),
      ...WHEN_OPTIONS.map((o: { label: string }) => o.label),
      ...SORT_OPTIONS.map((o: { label: string }) => o.label),
    ];

    /* Ten, not nine: "Just added" fits, and the labels that did not were the
       twelve-character ones — "Within 10 km", "Any distance". This list also
       feeds the full filter sheet, where there is room for a longer word. */
    for (const label of labels) {
      expect(label.length).toBeLessThanOrEqual(10);
    }
  });

  /* The price row sits on the floor of the card rather than under the last
     line of text, so a title that wraps to two lines does not push its price
     below the one beside it. */
  it('pins the price row to the bottom of the card', () => {
    const { homeUi } = require('../src/modules/PublicEvents/ui.styles');
    const { StyleSheet } = require('react-native');
    expect(StyleSheet.flatten(homeUi.foot).marginTop).toBe('auto');
    expect(StyleSheet.flatten(homeUi.body).flex).toBe(1);
  });

  it('draws nothing at all — not even its heading — when there is nothing on', async () => {
    const out = await draw([]);
    // The whole section goes, so Home does not carry an orphan title.
    expect(out).toBe('null');
  });

  it('draws the heading and the event once there is something to show', async () => {
    const out = await draw([anEvent]);
    expect(out).toContain(HEADER_TEXT);
    expect(out).toContain('Audio Launch 2026');
    expect(out).toContain('JRC Convention Centre');
    // The price a ticket starts at, which is the reason to tap it.
    expect(out).toContain('499');
  });
});

/* A picture of the section, written when EVENTLY_RENDER_OUT is set. */
describe('render dump', () => {
  it('writes an HTML rendering of the Home section', async () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const { page, toHtml } = require('../test-utils/rn-to-html');
    const { EventsNearYou } = require('../src/modules/PublicEvents/sections/EventsNearYou');
    const fs = require('fs');

    const sample = (over: Record<string, unknown>) => ({
      id: String(over.id),
      title: 'Audio Launch 2026',
      category: 'Concert',
      coverUrl: '',
      startDateTime: new Date('2026-10-18T19:00:00.000Z').toISOString(),
      endDateTime: null,
      timezone: 'Asia/Kolkata',
      venueName: 'JRC Convention Centre',
      city: 'Hyderabad',
      startingPrice: 499,
      soldOut: false,
      status: 'published',
      liveEnabled: false,
      liveState: 'upcoming',
      ...over,
    });

    get.mockResolvedValue({
      data: {
        items: [
          sample({ id: '1' }),
          sample({ id: '2', title: 'Creative Art Workshop', category: 'Workshop', startingPrice: 799, venueName: 'The Gallery Space' }),
          sample({ id: '3', title: 'Hyderabad Food & Culture Fest', category: 'Festival', startingPrice: 299, venueName: "People's Plaza" }),
          sample({ id: '4', title: 'Stand-Up Comedy Night', category: 'Comedy', startingPrice: 399, venueName: 'Lamakaan' }),
        ],
      },
    } as never);

    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        React.createElement(EventsNearYou, {
          header: React.createElement(Text, null, 'Events near you'),
          coordinates: { latitude: 17.4, longitude: 78.4 },
          onOpenEvent: () => {},
        }),
      );
    });

    fs.writeFileSync(
      out,
      page([['Events near you', toHtml(tree.toJSON())]], {
        title: 'Events near you',
        width: 390,
        background: '#f6f7fb',
        padding: 0,
      }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
