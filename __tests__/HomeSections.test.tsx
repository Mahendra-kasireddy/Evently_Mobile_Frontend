/**
 * @format
 *
 * The redesigned home screen.
 *
 * Most of these are about not showing a number the platform cannot back: the
 * hero counts the quotes that arrived rather than the organizers it hoped for,
 * an occasion tile only claims a "from" price an organizer really published,
 * and the offers header counts the cards actually on screen.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({
    name,
    size,
    color,
  }: {
    name: string;
    size?: number;
    color?: string;
  }) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});

import { page, toHtml } from '../test-utils/rn-to-html';
import { EventHero } from '../src/modules/Home/sections/EventHero';
import { EventRow } from '../src/modules/Home/sections/EventRow';
import { EventlyText as EventlyTextForDump } from '../src/Components/EventlyText';
import { View } from 'react-native';
import { HomeHeader } from '../src/modules/Home/sections/HomeHeader';
import { OccasionGrid } from '../src/modules/Home/sections/OccasionGrid';
import { Offers } from '../src/modules/Home/sections/Offers';
import { TopOrganizers } from '../src/modules/Home/sections/TopOrganizers';
import { TrustStrip } from '../src/modules/Home/sections/TrustStrip';
import {
  formatCompactINR,
  mapCurrentEvent,
  mapOtherEvents,
  normalizeWhen,
  mapOccasions,
  mapCoupons,
  mapPackages,
} from '../src/modules/Home/utils';
import type { HomeFeedDTO } from '../src/modules/Home/types';

declare const process: { env: Record<string, string | undefined> };
const fs: {
  writeFileSync(p: string, d: string, e: string): void;
  existsSync(p: string): boolean;
} = require('fs');

const feed = (over: Partial<HomeFeedDTO>): HomeFeedDTO => over as HomeFeedDTO;

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

const quoteEvent = (over: Record<string, unknown> = {}) =>
  mapCurrentEvent(
    feed({
      currentEvent: {
        stage: 'quotes_received',
        refId: 'req1',
        title: 'Naming ceremony',
        occasion: 'Naming',
        when: '5 Sep 2026',
        where: 'Kukatpally',
        guests: '150 guests',
        source: 'quote',
        progress: 55,
        daysToGo: null,
        quoteCount: 3,
        lowestQuote: 625000,
        highestQuote: 742000,
        sentToCount: 4,
        closesInDays: 4,
        quotes: [
          {
            id: 'q1',
            organizer: {
              id: 'o1',
              name: 'Venkat Decor & Events',
              initials: 'VD',
              avatarColor: '#1d9e75',
            },
            total: 625000,
            lineItemCount: 7,
            repliedAt: '2026-09-04T12:00:00.000Z',
          },
          {
            id: 'q2',
            organizer: {
              id: 'o2',
              name: 'Mahendra Events',
              initials: 'ME',
              avatarColor: '#e8633a',
            },
            total: 684000,
            lineItemCount: 7,
            repliedAt: '2026-09-04T09:00:00.000Z',
          },
        ],
        awaiting: [
          {
            id: 'o4',
            name: 'Sreeja Wedding Co.',
            initials: 'SW',
            avatarColor: '#6d5bd0',
          },
        ],
        ...over,
      } as HomeFeedDTO['currentEvent'],
    }),
  )!;

/** One live brief, as the server sends it inside `otherEvents`. */
const briefDTO = (over: Record<string, unknown> = {}) =>
  ({
    stage: 'quotes_received',
    refId: 'req9',
    title: 'Anniversary',
    occasion: 'Anniversary',
    when: '5 Sep 2026',
    where: 'Kukatpally',
    guests: '150 guests',
    source: 'quote',
    progress: 40,
    daysToGo: null,
    quoteCount: 3,
    lowestQuote: 625000,
    highestQuote: 742000,
    sentToCount: 4,
    closesInDays: 4,
    quotes: [],
    awaiting: [],
    ...over,
  } as NonNullable<HomeFeedDTO['currentEvent']>);

describe('occasion tiles with and without a photo', () => {
  const tiles = (over: Record<string, unknown> = {}) =>
    mapOccasions(
      feed({
        occasions: [
          {
            id: 'wedding',
            label: 'Wedding',
            art: 'wedding',
            fromPrice: 0,
            mostPlanned: false,
            ...over,
          },
        ],
      } as unknown as HomeFeedDTO),
    )!;

  it('carries an uploaded photo through, made absolute', () => {
    // The server sends a root-relative path; React Native cannot fetch one.
    const [tile] = tiles({
      imageUrl: '/api/upload/file/categoryImage/x.png',
    }).items;
    expect(tile.photoUrl).toBe(
      'http://localhost:3000/api/upload/file/categoryImage/x.png',
    );
  });

  it('reports no photo as no photo, so the tile draws its illustration', () => {
    // '' is the ordinary state for every tile that has never been photographed.
    expect(tiles().items[0].photoUrl).toBe('');
    expect(tiles({ imageUrl: '' }).items[0].photoUrl).toBe('');
  });

  it('still keeps the illustration key alongside the photo', () => {
    // The gradient is painted underneath either way, so a failed image never
    // leaves a blank rectangle.
    const [tile] = tiles({
      imageUrl: '/api/upload/file/categoryImage/x.png',
    }).items;
    expect(tile.art).toBe('wedding');
  });
});

describe('mapOtherEvents', () => {
  /*
   * The bug these are about: a customer with a confirmed booking for one event
   * and a brief still collecting quotes for another saw only the booking. The
   * brief was in the database the whole time — Home ranked it below the
   * booking and then showed one card.
   */
  it('maps a second live event the same way as the first', () => {
    const [brief] = mapOtherEvents(feed({ otherEvents: [briefDTO()] }));
    expect(brief.title).toBe('Anniversary');
    expect(brief.stage).toBe('quotes_received');
    // Mapped by the same function, so it gets a counted CTA, not a lesser one.
    expect(brief.ctaLabel).toBe('Compare 3 quotes');
  });

  it('keeps the order the server ranked them in', () => {
    const events = mapOtherEvents(
      feed({
        otherEvents: [
          briefDTO({ refId: 'a', title: 'Anniversary' }),
          briefDTO({ refId: 'b', title: 'Naming' }),
        ],
      }),
    );
    expect(events.map(e => e.title)).toEqual(['Anniversary', 'Naming']);
  });

  it('is empty for the ordinary account with one event', () => {
    expect(mapOtherEvents(feed({ otherEvents: [] }))).toEqual([]);
    // Older payloads predate the field; Home must not crash on them.
    expect(mapOtherEvents(feed({}))).toEqual([]);
  });

  /*
   * The duplicate that reached customers. `otherEvents` is documented as never
   * repeating `currentEvent`, the server broke that, and Home stacked one
   * Corporate request on itself — a customer who created one event saw two and
   * could not tell whether they had created it twice.
   */
  it('drops an event the leading card is already about', () => {
    const events = mapOtherEvents(
      feed({ currentEvent: briefDTO(), otherEvents: [briefDTO()] }),
    );
    expect(events).toEqual([]);
  });

  it('drops the duplicate even when it arrives under a different id', () => {
    /*
     * The real shape of it: one event resolved from two records — the quote
     * request and the plan behind it — so the ids differ, the `source` differs
     * and the date arrives in two formats. Nothing an id comparison can catch;
     * everything the customer reads is identical.
     */
    const events = mapOtherEvents(
      feed({
        currentEvent: briefDTO({
          refId: 'req9',
          source: 'quote',
          when: '2026-09-05',
        }),
        otherEvents: [
          briefDTO({
            refId: 'plan3',
            source: 'plan',
            when: '5 September 2026',
            sentToCount: 0,
            closesInDays: null,
          }),
        ],
      }),
    );
    expect(events).toEqual([]);
  });

  it('keeps two real events that share a date and a venue', () => {
    // Two different celebrations on one day at one hall is a thing a customer
    // can genuinely have, and collapsing them would hide one.
    const events = mapOtherEvents(
      feed({
        currentEvent: briefDTO({ refId: 'a', title: 'Anniversary' }),
        otherEvents: [briefDTO({ refId: 'b', title: 'Naming ceremony' })],
      }),
    );
    expect(events.map(e => e.title)).toEqual(['Naming ceremony']);
  });

  it('drops a duplicate of the booked card too', () => {
    const events = mapOtherEvents(
      feed({
        booking: { id: 'bk1' } as NonNullable<HomeFeedDTO['booking']>,
        otherEvents: [briefDTO({ refId: 'bk1' })],
      }),
    );
    expect(events).toEqual([]);
  });
});

describe('a second event on Home', () => {
  /*
   * Ten events used to mean ten full navy heroes — ten screens of card before
   * a customer reached anything else on Home. Only the leading event keeps
   * that weight now; the rest are one-line rows.
   */
  const row = (over: Record<string, unknown> = {}) => {
    const [event] = mapOtherEvents(feed({ otherEvents: [briefDTO(over)] }));
    let tree!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <EventRow event={event} onPress={() => {}} />,
      );
    });
    return tree;
  };

  const textIn = (tree: ReactTestRenderer.ReactTestRenderer): string => {
    const out: string[] = [];
    const walk = (n: unknown): void => {
      if (n == null) return;
      if (typeof n === 'string') return void out.push(n);
      if (Array.isArray(n)) return n.forEach(walk);
      walk((n as { children?: unknown }).children);
    };
    walk(tree.toJSON());
    return out.join(' ');
  };

  it('keeps what tells one event from another', () => {
    const text = textIn(row());
    expect(text).toContain('Anniversary');
    // The date rides on the picture as a chip now — "SEP" over "5" — rather
    // than inside a facts line, which is the thing people scan a list of
    // events for.
    expect(text).toContain('SEP');
    expect(text).toContain('5');
    expect(text).toContain('Kukatpally');
  });

  it('counts the replies, and says nothing at zero', () => {
    // "0 quotes" is not news anyone can act on, and it costs a row its width.
    expect(textIn(row({ quoteCount: 3 }))).toContain('3');
    expect(textIn(row({ quoteCount: 0 }))).not.toMatch(/\b0\b/);
  });

  it('is one control, not three', () => {
    // The hero carries a button, a link and a tappable quote per organizer. A
    // row that did the same would be unreadable at this height, so the row
    // itself is the button.
    const buttons = row().root.findAll(
      node => node.props?.accessibilityRole === 'button',
      { deep: true },
    );
    // The Pressable and the host view it renders — one control either way.
    expect(new Set(buttons.map(b => b.props.accessibilityLabel)).size).toBe(1);
  });
});

describe('the date on a home card', () => {
  /*
   * Two server paths compose an event and they do not agree on a format: the
   * request path sends "2026-09-21", the booking path "21 September 2026". The
   * customer saw both, on two cards about the same day.
   */
  it('spells out a bare ISO date the way the rest of the app does', () => {
    expect(normalizeWhen('2026-09-21')).toBe('21 September 2026');
  });

  it('leaves anything it does not recognise exactly as it arrived', () => {
    // A range, a note, an already-spelled-out date: guessing at a format Home
    // does not know is how a real value becomes "Invalid Date".
    expect(normalizeWhen('21 September 2026')).toBe('21 September 2026');
    expect(normalizeWhen('Sep–Oct 2026')).toBe('Sep–Oct 2026');
    expect(normalizeWhen('Date TBC')).toBe('Date TBC');
    expect(normalizeWhen('')).toBe('');
  });

  it('shows the spelled-out date on the card itself', () => {
    const event = mapCurrentEvent(
      feed({ currentEvent: briefDTO({ when: '2026-09-21' }) }),
    );
    expect(event?.when).toBe('21 September 2026');
    expect(event?.factsLine).toContain('21 September 2026');
  });
});

describe('a brief with only one quote', () => {
  /*
   * The real shape of this account's Anniversary brief: quoted, one reply, and
   * no recorded recipients. Every line below read as a comparison the customer
   * could not yet make, because the three-quote mock never exercised it.
   */
  const single = () =>
    quoteEvent({
      quoteCount: 1,
      lowestQuote: 185000,
      highestQuote: 185000,
      sentToCount: 0,
      awaiting: [],
      quotes: [
        {
          id: 'q1',
          organizer: {
            id: 'o1',
            name: 'Mahendra Events',
            initials: 'ME',
            avatarColor: '#e8633a',
          },
          total: 185000,
          lineItemCount: 5,
          repliedAt: '2026-09-11T09:00:00.000Z',
        },
      ],
    });

  it('does not offer to compare a single quote', () => {
    // "Compare 1 quote" promises a comparison the screen cannot perform.
    expect(single().ctaLabel).toBe('See the quote');
    expect(quoteEvent().ctaLabel).toBe('Compare 3 quotes');
  });

  it('shows no price range when there is only one price', () => {
    // "Lowest ₹1,85,000 · highest ₹1,85,000" is one number twice.
    expect(single().spreadLabel).toBe('');
    expect(quoteEvent().spreadLabel).toBe(
      'Lowest ₹6,25,000 · highest ₹7,42,000',
    );
  });

  it('does not tag the only quote as the lowest', () => {
    // Lowest of one is not a finding.
    expect(single().quoteRows[0].deltaLabel).toBe('');
    expect(single().quoteRows[0].isLowest).toBe(false);
    expect(quoteEvent().quoteRows[0].deltaLabel).toBe('Lowest');
  });

  it('makes the verb agree with one organizer', () => {
    expect(single().quotedLabel).toBe('1 organizer has quoted');
    expect(quoteEvent().quotedLabel).toBe('3 organizers have quoted');
  });
});

describe('formatCompactINR', () => {
  it('uses Indian units so a price fits the corner it sits in', () => {
    expect(formatCompactINR(700000)).toBe('₹7L');
    expect(formatCompactINR(650000)).toBe('₹6.5L');
    expect(formatCompactINR(40000)).toBe('₹40K');
    expect(formatCompactINR(12500000)).toBe('₹1.3Cr');
  });

  it('says nothing for a figure nobody set', () => {
    expect(formatCompactINR(0)).toBe('');
    expect(formatCompactINR(undefined)).toBe('');
  });
});

describe('mapCurrentEvent', () => {
  it('joins only the facts the record carries', () => {
    expect(quoteEvent().factsLine).toBe('5 Sep 2026 · Kukatpally · 150 guests');
    // An event with no venue reads shorter rather than showing an empty slot.
    expect(quoteEvent({ where: '' }).factsLine).toBe('5 Sep 2026 · 150 guests');
  });

  it('states the spread only when both ends are priced', () => {
    expect(quoteEvent().spreadLabel).toBe(
      'Lowest ₹6,25,000 · highest ₹7,42,000',
    );
    // A lone "lowest" reads as the price, and the point of the line is a range.
    expect(quoteEvent({ highestQuote: 0 }).spreadLabel).toBe('');
    expect(quoteEvent({ lowestQuote: 0, highestQuote: 0 }).spreadLabel).toBe(
      '',
    );
  });

  it('counts the quotes that arrived, never a total it was never told', () => {
    /*
     * A broadcast request does not record how many organizers it reached, so
     * "3 of 4 quotes in" would be a denominator this system cannot produce.
     */
    expect(quoteEvent().quotedLabel).toBe('3 organizers have quoted');
    expect(quoteEvent({ quoteCount: 1 }).quotedLabel).toBe(
      '1 organizer has quoted',
    );
    expect(quoteEvent({ quoteCount: 0 }).quotedLabel).toBe('');
  });
});

describe('mapOccasions', () => {
  const tiles = (items: Array<Record<string, unknown>>) =>
    mapOccasions(
      feed({ occasions: items as unknown as HomeFeedDTO['occasions'] }),
    );

  it('prefers the badge over a price when an occasion has both', () => {
    const vm = tiles([
      {
        id: 'wedding',
        label: 'Wedding',
        art: 'wedding',
        fromPrice: 250000,
        mostPlanned: true,
      },
    ]);
    expect(vm?.items[0].note).toBe('Most planned');
  });

  it('shows a from-price only when an organizer published one', () => {
    const vm = tiles([
      {
        id: 'birthday',
        label: 'Birthday',
        art: 'birthday',
        fromPrice: 40000,
        mostPlanned: false,
      },
      {
        id: 'corporate',
        label: 'Corporate',
        art: 'corporate',
        fromPrice: 0,
        mostPlanned: false,
      },
    ]);
    expect(vm?.items[0].note).toBe('From ₹40,000');
    // "From ₹0" would be a price nobody is offering.
    expect(vm?.items[1].note).toBe('');
  });

  it('falls back to a gradient it can actually paint', () => {
    // An unknown art key would index the gradient map to undefined and crash.
    const vm = tiles([
      { id: 'x', label: 'Mystery', art: 'unheard-of', fromPrice: 0 },
    ]);
    expect(vm?.items[0].art).toBe('wedding');
  });
});

describe('mapCoupons', () => {
  const coupon = (over: Record<string, unknown> = {}) => ({
    id: 'c1',
    code: 'FESTIVE10',
    title: '10% off decor',
    organizerName: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 0,
    minBookingAmount: 0,
    endsAt: null,
    perCustomerLimit: 1,
    timesUsed: 0,
    ...over,
  });
  const coupons = (items: Array<Record<string, unknown>>) =>
    mapCoupons(feed({ coupons: items as unknown as HomeFeedDTO['coupons'] }));

  it('never prints the discount twice on one card', () => {
    /*
     * Most coupon titles already state the figure — "10% off decor" — and the
     * card set it large again underneath, so a 340-point card said "10%"
     * twice in two sizes. The big figure is for a coupon whose title does not
     * say it; the cap still appears either way, because "up to ₹10,000" is
     * the part the title leaves out.
     */
    const data = coupons([
      coupon({ title: '10% off decor', maxDiscount: 10000 }),
      coupon({ id: 'c2', title: 'Diwali bonanza', discountValue: 15 }),
    ]);
    const text = textOf(
      render(
        <Offers
          data={data as NonNullable<typeof data>}
          onPressOffer={noop}
          onPressSeeAll={noop}
        />,
      ),
    );

    // The title says it, so the figure is not set a second time — but its cap
    // survives, among the conditions.
    expect(text.split('10%')).toHaveLength(2);
    expect(text).toContain('up to ₹10,000');
    // This title does not say it, so the card does.
    expect(text).toContain('15%');
  });

  it('counts the cards actually on screen', () => {
    // A header saying "3 live" over two cards is the kind of small lie that
    // makes a customer stop believing the rest of the screen.
    expect(coupons([coupon(), coupon({ id: 'c2' })])?.countLabel).toBe(
      '2 live',
    );
  });

  it('leads with the code, because that is what has to be carried', () => {
    expect(coupons([coupon()])?.items[0].code).toBe('FESTIVE10');
  });

  it('builds the terms from the coupon\u2019s real limits', () => {
    const vm = coupons([
      coupon({ minBookingAmount: 50000, endsAt: '2026-09-30T18:29:59.000Z' }),
    ]);
    expect(vm?.items[0].terms).toContain('On bookings over');
    // Abbreviated on the card, spelled out in the sheet — the card has two
    // lines to say this in and a third would be clipped.
    expect(vm?.items[0].terms).toContain('ends 30 Sep');
    expect(
      vm?.items[0].details.find(row => row.label === 'Valid until')?.value,
    ).toBe('30 September');
  });

  it('says nothing rather than padding a coupon with no conditions', () => {
    // "Terms apply" under a coupon with no terms is filler that teaches the
    // reader to skip the line on the coupons that do have some.
    expect(coupons([coupon()])?.items[0].terms).toBe('');
  });

  it('states the cap on a percentage, which is the part that surprises people', () => {
    const vm = coupons([coupon({ maxDiscount: 5000 })]);
    const discount = vm?.items[0].details.find(row => row.label === 'Discount');
    expect(discount?.value).toContain('up to');
  });

  it('counts down how many uses this customer has left', () => {
    const vm = coupons([coupon({ perCustomerLimit: 3, timesUsed: 2 })]);
    const uses = vm?.items[0].details.find(
      row => row.label === 'You can use it',
    );
    expect(uses?.value).toBe('Once');
  });

  it('leads the terms with the organizer, when the coupon is only theirs', () => {
    // Whether a code works anywhere or with one organizer changes what the
    // whole card means, so it is said before the minimum or the deadline.
    const vm = coupons([
      coupon({
        organizerName: 'Mahendra Events',
        minBookingAmount: 50000,
        endsAt: '2026-09-30T18:29:59.000Z',
      }),
    ]);
    // "Sep" or "Sept" depending on the platform's ICU data — the order and the
    // separators are what this test is about, not the abbreviation.
    expect(vm?.items[0].terms).toMatch(
      /^With Mahendra Events · over ₹50,000 · ends 30 Sept?$/,
    );
  });

  it('names the organizer in the details, and says nothing for a platform coupon', () => {
    const scoped = coupons([coupon({ organizerName: 'Mahendra Events' })]);
    expect(
      scoped?.items[0].details.find(row => row.label === 'Works with')?.value,
    ).toBe('Mahendra Events');

    // "Any organizer" on every platform coupon is a row nobody reads twice.
    const platform = coupons([coupon()]);
    expect(
      platform?.items[0].details.some(row => row.label === 'Works with'),
    ).toBe(false);
  });

  it('alternates the card tone so a run reads as a row', () => {
    const vm = coupons([coupon(), coupon({ id: 'c2' }), coupon({ id: 'c3' })]);
    expect(vm?.items.map(item => item.tone)).toEqual([
      'accent',
      'navy',
      'accent',
    ]);
  });

  it('hides the section entirely when nothing is running', () => {
    expect(coupons([])).toBeNull();
  });
});

describe('mapPackages', () => {
  const one = (over: Record<string, unknown>) =>
    mapPackages(
      feed({
        packages: [
          {
            id: 'p1',
            badge: 'Bestseller',
            title: 'Marigold naming ceremony',
            guests: '150 guests',
            budget: '₹1L – 2L',
            tags: [],
            art: 'naming',
            bannerNote: 'Marigold stage · 150 guests',
            photoUrl: '',
            price: 185000,
            listPrice: 210000,
            organizer: {
              id: 'o1',
              name: 'Mahendra Events',
              initials: 'ME',
              avatarColor: '#7C5CE6',
              rating: 4.9,
              reviews: 64,
              bookedThisMonth: 42,
            },
            ...over,
          },
        ] as HomeFeedDTO['packages'],
      }),
    )!.items[0];

  it('prints the price and a genuine reduction', () => {
    expect(one({}).priceLabel).toBe('₹1,85,000');
    expect(one({}).listPriceLabel).toBe('₹2,10,000');
  });

  it('shows no struck-through figure where there is no reduction', () => {
    expect(one({ listPrice: 0 }).listPriceLabel).toBe('');
  });

  it('attributes recent bookings to the organizer, since that is whose they are', () => {
    expect(one({}).organizer?.bookedLabel).toBe('42 booked this month');
    expect(one({ organizer: null }).organizer).toBeNull();
  });
});

describe('EventHero', () => {
  const hero = (over: Record<string, unknown> = {}) => (
    <EventHero
      event={quoteEvent(over)}
      ctaLabel={quoteEvent(over).ctaLabel}
      onPressCta={noop}
      onPressDetails={noop}
    />
  );

  it('shows the stage, the facts, and who the brief reached', () => {
    const text = textOf(render(hero()));

    expect(text).toContain('Quotes received');
    expect(text).toContain('Naming ceremony');
    expect(text).toContain('5 Sep 2026 · Kukatpally · 150 guests');
    expect(text).toContain(
      'Your request went to 4 organizers · 3 have replied',
    );
    expect(text).toContain('Closes in 4 days');
  });

  it('lists each reply with what it costs against the cheapest', () => {
    // Three totals in a column leaves the customer subtracting; the delta is
    // the whole reason the rows are a comparison.
    const text = textOf(render(hero()));

    expect(text).toContain('Venkat Decor & Events');
    expect(text).toContain('₹6,25,000');
    expect(text).toContain('Lowest');
    expect(text).toContain('Mahendra Events');
    expect(text).toContain('₹6,84,000');
    expect(text).toContain('+₹59,000');
    expect(text).toContain('7 line items');
  });

  it('names the organizer who has not replied', () => {
    // "One organizer hasn't replied" is not something a customer can act on.
    expect(textOf(render(hero()))).toContain(
      "Sreeja Wedding Co. hasn't replied yet",
    );
  });

  it('counts the quotes on the button, so the tap says what it gets', () => {
    expect(textOf(render(hero()))).toContain('Compare 3 quotes');
  });

  it('will not claim a denominator a brief never recorded', () => {
    // Briefs from before recipients were stored went to everybody and kept no
    // list — "3 of 4" would be a number this app made up.
    const text = textOf(render(hero({ sentToCount: 0, awaiting: [] })));
    expect(text).toContain('3 organizers have replied');
    expect(text).not.toContain('went to');
  });

  it('falls back to progress before anyone has replied', () => {
    const text = textOf(
      render(
        hero({
          quoteCount: 0,
          lowestQuote: 0,
          highestQuote: 0,
          quotes: [],
          awaiting: [],
        }),
      ),
    );
    expect(text).not.toContain('Lowest');
    expect(text).not.toContain('line items');
  });

  it('is two controls while the rows are not tappable', () => {
    expect(drawnButtons(render(hero()))).toHaveLength(2);
  });

  it('makes each reply a control when there is somewhere to open it', () => {
    const tree = render(
      <EventHero
        event={quoteEvent()}
        ctaLabel={quoteEvent().ctaLabel}
        onPressCta={noop}
        onPressDetails={noop}
        onPressQuote={noop}
      />,
    );
    // Two quotes plus the action and the details link.
    expect(drawnButtons(tree)).toHaveLength(4);
  });
});

describe('HomeHeader', () => {
  const base = {
    initials: 'HK',
    displayName: 'Hem Kumar',
    onPressProfile: noop,
    onPressNotifications: noop,
    onPressSearch: noop,
  };

  it('badges the unread count, and nothing at zero', () => {
    expect(textOf(render(<HomeHeader {...base} unreadCount={2} />))).toContain('2');
    // A badge reading "0" is noise.
    expect(textOf(render(<HomeHeader {...base} unreadCount={0} />))).not.toContain('0');
  });

  it('caps a big count rather than stretching the dot', () => {
    expect(textOf(render(<HomeHeader {...base} unreadCount={42} />))).toContain('9+');
  });

  it('is one row: a search glyph, not a field pretending to be an input', () => {
    /*
     * The field on Home never accepted a keystroke — it was a button drawn as
     * an input, because typing belongs on the search screen where the results
     * and filters are. It cost a whole row of the fold to say what a glyph
     * says, so the row is gone and the icon carries it.
     */
    const tree = render(<HomeHeader {...base} unreadCount={0} />);
    expect(textOf(tree)).not.toContain('Search packages, organizers, decor');

    const labels = tree.root
      .findAll((n) => typeof n.props?.accessibilityLabel === 'string')
      .map((n) => n.props.accessibilityLabel as string);
    expect(labels).toContain('Search');
    // The filter button went with the field; the search screen has its own.
    expect(labels).not.toContain('Filters');
  });

  it('opens the account from the avatar, which is where Profile lives now', () => {
    /*
     * Profile was a fifth tab for a screen nobody navigates between. The
     * avatar is the one way in — and it carries the account's initials, not a
     * photograph, because the customer feed has no avatar image to send.
     */
    let opened = 0;
    const tree = render(
      <HomeHeader {...base} unreadCount={0} onPressProfile={() => { opened += 1; }} />,
    );
    expect(textOf(tree)).toContain('HK');
    // The city picker went with it; the account's city is set in Profile.
    expect(textOf(tree)).not.toContain('Hyderabad');

    const avatar = tree.root.find(
      (n) =>
        typeof n.props?.accessibilityLabel === 'string' &&
        n.props.accessibilityLabel.startsWith('Your profile'),
    );
    avatar.props.onPress();
    expect(opened).toBe(1);
  });

  it('no longer offers saved packages from Home', () => {
    // Still reachable from Profile, where the account's own lists live.
    const tree = render(<HomeHeader {...base} unreadCount={0} />);
    const labels = tree.root
      .findAll((n) => typeof n.props?.accessibilityLabel === 'string')
      .map((n) => n.props.accessibilityLabel as string);
    expect(labels.some((l) => l.includes('Saved packages'))).toBe(false);
  });
});

describe('the occasion grid', () => {
  it('never grows past two rows', () => {
    /*
     * Height is the thing being protected. Eleven occasions as a wrapping
     * grid is three rows, and every row this section grows is a row the
     * sections under it lose — as half-width cards, which is what it used to
     * be, it was six. Anything past the eighth is one swipe away instead.
     */
    const { OCCASION_ROWS, occasionGridStyles } = require('../src/modules/Home/styles');
    expect(OCCASION_ROWS).toBe(2);

    /* A horizontal scroll view with no height of its own claims the column's
       leftover space and stretches its tiles down the page. */
    expect(
      (occasionGridStyles.scroll as Record<string, unknown>).flexGrow,
    ).toBe(0);

    /* Points, not a percentage: inside a horizontal scroll view a percentage
       measures against the content, so every tile would collapse. */
    expect(typeof (occasionGridStyles.tile as Record<string, unknown>).width).toBe(
      'number',
    );
  });

  it('lays each page out four across, in reading order', () => {
    /*
     * It used to chunk column-first — two tiles down, then across — which
     * with six occasions drew three columns, not the four the design asks
     * for. Pages of eight filled left-to-right put four on the top row
     * whatever the count is, and reading order matches the feed order.
     */
    const {
      OCCASION_COLUMNS,
      OCCASION_ROWS,
      OCCASIONS_PER_PAGE,
      occasionGridStyles,
    } = require('../src/modules/Home/styles');
    expect(OCCASION_COLUMNS).toBe(4);
    expect(OCCASIONS_PER_PAGE).toBe(OCCASION_COLUMNS * OCCASION_ROWS);

    const items = Array.from({ length: 11 }, (_, n) => ({
      id: `occasion-${n}`,
      icon: 'ring',
      art: 'wedding',
      label: `Occasion ${n}`,
      note: '',
      photoUrl: '',
    }));
    const data = {
      title: 'Plan something new',
      items,
    } as unknown as React.ComponentProps<typeof OccasionGrid>['data'];

    const tree = render(<OccasionGrid data={data} onPressOccasion={noop} />);
    // Host nodes only: findAll matches the composite View and its host twin.
    const pages = tree.root.findAll(
      (n) => typeof n.type === 'string' && n.props?.style === occasionGridStyles.page,
    );
    // Eleven is eight on screen and three a swipe away, never a third row.
    expect(pages.map((node) => node.children.length)).toEqual([
      OCCASIONS_PER_PAGE,
      3,
    ]);

    // Each page wraps at four, so the first four labels are the top row.
    const labels = textOf(tree);
    expect(labels.indexOf('Occasion 0')).toBeLessThan(labels.indexOf('Occasion 1'));
    expect(labels).toContain('Occasion 10');
  });

  it('drops the strapline: the tiles are the instruction', () => {
    const data = {
      title: 'Plan something new',
      subtitle: 'Pick an occasion — get an instant estimate.',
      items: [
        {
          id: 'wedding',
          icon: 'ring',
          art: 'wedding',
          label: 'Wedding',
          note: 'Most planned',
          photoUrl: '',
        },
      ],
    } as unknown as React.ComponentProps<typeof OccasionGrid>['data'];

    const text = textOf(render(<OccasionGrid data={data} onPressOccasion={noop} />));
    expect(text).toContain('Plan something new');
    expect(text).toContain('Wedding');
    // The strapline is gone, and so is the per-tile line that had no room.
    expect(text).not.toContain('instant estimate');
    expect(text).not.toContain('Most planned');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const offers = mapCoupons(
      feed({
        coupons: [
          {
            id: 'c1',
            code: 'FESTIVE10',
            title: '10% off decor',
            organizerName: '',
            description: '',
            discountType: 'percentage',
            discountValue: 10,
            maxDiscount: 0,
            minBookingAmount: 0,
            endsAt: '2026-09-30T18:29:59.000Z',
            perCustomerLimit: 1,
            timesUsed: 0,
          },
          {
            id: 'c2',
            code: 'MONSOON15',
            title: '15% off monsoon bookings',
            organizerName: 'Mahendra Events',
            description: '',
            discountType: 'fixed',
            discountValue: 4500,
            maxDiscount: 0,
            minBookingAmount: 150000,
            endsAt: null,
            perCustomerLimit: 1,
            timesUsed: 0,
          },
        ] as HomeFeedDTO['coupons'],
      }),
    )!;

    const occasions = mapOccasions(
      feed({
        content: {
          planSection: {
            title: 'Plan something new',
          },
        } as HomeFeedDTO['content'],
        occasions: [
          {
            id: 'wedding',
            label: 'Wedding',
            art: 'wedding',
            fromPrice: 0,
            mostPlanned: true,
          },
          {
            id: 'birthday',
            label: 'Birthday',
            art: 'birthday',
            fromPrice: 40000,
            mostPlanned: false,
          },
          {
            id: 'naming',
            label: 'Naming',
            art: 'naming',
            fromPrice: 55000,
            mostPlanned: false,
          },
          {
            id: 'housewarming',
            label: 'Housewarming',
            art: 'housewarming',
            fromPrice: 35000,
            mostPlanned: false,
          },
          {
            id: 'anniversary',
            label: 'Anniversary',
            art: 'anniversary',
            fromPrice: 30000,
            mostPlanned: false,
          },
          {
            id: 'corporate',
            label: 'Corporate',
            art: 'corporate',
            fromPrice: 0,
            mostPlanned: false,
          },
        ] as HomeFeedDTO['occasions'],
      }),
    )!;

    const panels: Array<[string, string]> = [
      [
        'Home — top',
        toHtml(
          render(
            <>
              <HomeHeader
                initials="HK"
                displayName="Hem Kumar"
                unreadCount={2}
                onPressProfile={noop}
                onPressNotifications={noop}
                onPressSearch={noop}
              />
              <EventHero
                event={quoteEvent()}
                ctaLabel={quoteEvent().ctaLabel}
                onPressCta={noop}
                onPressDetails={noop}
                onPressQuote={noop}
              />
              <Offers data={offers} onPressOffer={noop} onPressSeeAll={noop} />
            </>,
          ).toJSON(),
        ),
      ],
      [
        'Home — one card, then rows',
        toHtml(
          render(
            <>
              <EventHero
                event={quoteEvent()}
                ctaLabel={quoteEvent().ctaLabel}
                onPressCta={noop}
                onPressDetails={noop}
                onPressQuote={noop}
              />
              <View
                style={
                  require('../src/modules/Home/styles').sectionStyles.block
                }
              >
                <View
                  style={
                    require('../src/modules/Home/styles').sectionStyles.headRow
                  }
                >
                  <EventlyTextForDump
                    variant="h2"
                    style={
                      require('../src/modules/Home/styles').sectionStyles.title
                    }
                  >
                    Your other events
                  </EventlyTextForDump>
                  <EventlyTextForDump
                    variant="subtitle"
                    style={
                      require('../src/modules/Home/styles').sectionStyles.action
                    }
                  >
                    See all 11
                  </EventlyTextForDump>
                </View>
                {[
                  {
                    refId: 'r1',
                    title: 'Wedding',
                    stageLabel: 'PLAN IN PROGRESS',
                    factsLine: '17 September 2026 · 100 guests',
                    quoteCount: 0,
                  },
                  {
                    refId: 'r2',
                    title: 'Naming ceremony',
                    stageLabel: 'QUOTES RECEIVED',
                    factsLine: '5 October 2026 · Kukatpally',
                    quoteCount: 3,
                  },
                  {
                    refId: 'r3',
                    title: 'Housewarming',
                    stageLabel: 'AWAITING ORGANIZER RESPONSE',
                    factsLine: '2 November 2026 · Gachibowli',
                    quoteCount: 0,
                  },
                ].map(over => {
                  const [row] = mapOtherEvents(
                    feed({ otherEvents: [briefDTO(over)] }),
                  );
                  return (
                    <EventRow
                      key={over.refId}
                      event={{ ...row, ...over }}
                      onPress={noop}
                    />
                  );
                })}
              </View>
            </>,
          ).toJSON(),
        ),
      ],
      [
        'Home — plan something new',
        toHtml(
          render(
            <OccasionGrid data={occasions} onPressOccasion={noop} />,
          ).toJSON(),
        ),
      ],
      [
        'Home — organizers near you',
        toHtml(
          render(
            <TopOrganizers
              data={{
                title: 'Organizers near you',
                city: 'Hyderabad',
                scope: 'city' as const,
                scopeNote: '',
                items: [
                  {
                    id: 'o1',
                    name: 'Sreeja Wedding Co.',
                    initials: 'SW',
                    avatarColor: '#1d9e75',
                    tier: 'Gold',
                    rating: 4.8,
                    reviews: 51,
                    events: 0,
                    tags: [],
                    fromLabel: '₹7L',
                    repliesLabel: 'Replies in 1h',
                    bookedLabel: '19 booked this month',
                  },
                  {
                    id: 'o2',
                    name: 'Mahendra Events',
                    initials: 'ME',
                    avatarColor: '#e8633a',
                    tier: 'Silver',
                    rating: 0,
                    reviews: 0,
                    events: 0,
                    tags: [],
                    fromLabel: '',
                    repliesLabel: 'Replies in 3h',
                    bookedLabel: '',
                  },
                ],
              }}
              onPressOrganizer={noop}
              onPressSeeAll={noop}
              onPressChangeCity={noop}
            />,
          ).toJSON(),
        ),
      ],
      [
        'Home — trust',
        toHtml(
          render(
            <TrustStrip
              items={[
                { icon: 'shield', label: 'Verified organizers only' },
                { icon: 'zap', label: 'Advance held till confirmed' },
                { icon: 'star', label: 'Comparing is always free' },
              ]}
            />,
          ).toJSON(),
        ),
      ],
    ];

    fs.writeFileSync(
      out,
      page(panels, {
        title: 'Home',
        width: 390,
        background: '#faf8f7',
        padding: 0,
      }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});

/* The basics block, as a picture. Run with EVENTLY_RENDER_OUT set. */
describe('basics render dump', () => {
  it('writes an HTML rendering when EVENTLY_BASICS_OUT is set', () => {
    const out: string | undefined = process.env.EVENTLY_BASICS_OUT;
    if (!out) return;

    const { Banner } = require('../src/modules/Home/sections/Banner');
    const { brand } = require('../src/theme');
    const noop = () => {};

    const banner = {
      greeting: '',
      headingLead: 'What shall we',
      headingAccent: 'celebrate',
      headingTail: 'next?',
      subtitle:
        'Verified organizers send tailored quotes within a day. You compare, you choose.',
      draftLabel: '',
      defaultDraft: { occasion: '', when: '', where: '', guests: '' },
      options: { occasion: [], when: [], where: [], guests: [] },
      trust: [
        { icon: 'zap', label: 'Quotes in under a day' },
        { icon: 'shield', label: 'Verified organizers only' },
        { icon: 'star', label: '4.8 average rating' },
      ],
    };

    const state = (over: Record<string, unknown> = {}) => (
      <Banner
        data={banner}
        heroDraft={{
          occasion: 'Naming ceremony',
          when: '2026-09-20',
          where: 'Hyderabad',
          guests: '300',
        }}
        onEditField={noop}
        onPickDate={noop}
        shareBudget={false}
        budget=""
        onToggleBudget={noop}
        onPressBudgetRange={noop}
        onSubmit={noop}
        isSubmitting={false}
        quotesRequested={false}
        quotesErrorMessage={null}
        onEditAgain={noop}
        {...over}
      />
    );

    const panels: Array<[string, string]> = [
      ['Basics — budget off', toHtml(render(state()).toJSON())],
      [
        'Basics — budget on',
        toHtml(
          render(state({ shareBudget: true, budget: '₹5L – ₹10L' })).toJSON(),
        ),
      ],
    ];

    fs.writeFileSync(
      out,
      page(panels, {
        title: 'Basics',
        width: 390,
        background: brand.bg,
        padding: 0,
      }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
