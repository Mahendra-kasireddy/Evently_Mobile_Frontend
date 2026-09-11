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
  return function MockIcon({ name, size, color }: { name: string; size?: number; color?: string }) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});

import { page, toHtml } from '../test-utils/rn-to-html';
import { EventHero } from '../src/modules/Home/sections/EventHero';
import { HomeHeader } from '../src/modules/Home/sections/HomeHeader';
import { OccasionGrid } from '../src/modules/Home/sections/OccasionGrid';
import { Offers } from '../src/modules/Home/sections/Offers';
import { TrustStrip } from '../src/modules/Home/sections/TrustStrip';
import {
  formatCompactINR,
  mapCurrentEvent,
  mapOccasions,
  mapCoupons,
  mapPackages,
} from '../src/modules/Home/utils';
import { CURRENT_EVENT_CTA, SEARCH_PLACEHOLDER } from '../src/modules/Home/constants';
import type { HomeFeedDTO } from '../src/modules/Home/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

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
        ...over,
      } as HomeFeedDTO['currentEvent'],
    }),
  )!;

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
    expect(quoteEvent().spreadLabel).toBe('Lowest ₹6,25,000 · highest ₹7,42,000');
    // A lone "lowest" reads as the price, and the point of the line is a range.
    expect(quoteEvent({ highestQuote: 0 }).spreadLabel).toBe('');
    expect(quoteEvent({ lowestQuote: 0, highestQuote: 0 }).spreadLabel).toBe('');
  });

  it('counts the quotes that arrived, never a total it was never told', () => {
    /*
     * A broadcast request does not record how many organizers it reached, so
     * "3 of 4 quotes in" would be a denominator this system cannot produce.
     */
    expect(quoteEvent().quotedLabel).toBe('3 organizers have quoted');
    expect(quoteEvent({ quoteCount: 1 }).quotedLabel).toBe('1 organizer have quoted');
    expect(quoteEvent({ quoteCount: 0 }).quotedLabel).toBe('');
  });
});

describe('mapOccasions', () => {
  const tiles = (items: Array<Record<string, unknown>>) =>
    mapOccasions(feed({ occasions: items as unknown as HomeFeedDTO['occasions'] }));

  it('prefers the badge over a price when an occasion has both', () => {
    const vm = tiles([
      { id: 'wedding', label: 'Wedding', art: 'wedding', fromPrice: 250000, mostPlanned: true },
    ]);
    expect(vm?.items[0].note).toBe('Most planned');
  });

  it('shows a from-price only when an organizer published one', () => {
    const vm = tiles([
      { id: 'birthday', label: 'Birthday', art: 'birthday', fromPrice: 40000, mostPlanned: false },
      { id: 'corporate', label: 'Corporate', art: 'corporate', fromPrice: 0, mostPlanned: false },
    ]);
    expect(vm?.items[0].note).toBe('From ₹40,000');
    // "From ₹0" would be a price nobody is offering.
    expect(vm?.items[1].note).toBe('');
  });

  it('falls back to a gradient it can actually paint', () => {
    // An unknown art key would index the gradient map to undefined and crash.
    const vm = tiles([{ id: 'x', label: 'Mystery', art: 'unheard-of', fromPrice: 0 }]);
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

  it('counts the cards actually on screen', () => {
    // A header saying "3 live" over two cards is the kind of small lie that
    // makes a customer stop believing the rest of the screen.
    expect(coupons([coupon(), coupon({ id: 'c2' })])?.countLabel).toBe('2 live');
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
    expect(vm?.items[0].details.find((row) => row.label === 'Valid until')?.value).toBe(
      '30 September',
    );
  });

  it('says nothing rather than padding a coupon with no conditions', () => {
    // "Terms apply" under a coupon with no terms is filler that teaches the
    // reader to skip the line on the coupons that do have some.
    expect(coupons([coupon()])?.items[0].terms).toBe('');
  });

  it('states the cap on a percentage, which is the part that surprises people', () => {
    const vm = coupons([coupon({ maxDiscount: 5000 })]);
    const discount = vm?.items[0].details.find((row) => row.label === 'Discount');
    expect(discount?.value).toContain('up to');
  });

  it('counts down how many uses this customer has left', () => {
    const vm = coupons([coupon({ perCustomerLimit: 3, timesUsed: 2 })]);
    const uses = vm?.items[0].details.find((row) => row.label === 'You can use it');
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
    expect(scoped?.items[0].details.find((row) => row.label === 'Works with')?.value).toBe(
      'Mahendra Events',
    );

    // "Any organizer" on every platform coupon is a row nobody reads twice.
    const platform = coupons([coupon()]);
    expect(platform?.items[0].details.some((row) => row.label === 'Works with')).toBe(false);
  });

  it('alternates the card tone so a run reads as a row', () => {
    const vm = coupons([coupon(), coupon({ id: 'c2' }), coupon({ id: 'c3' })]);
    expect(vm?.items.map((item) => item.tone)).toEqual(['accent', 'navy', 'accent']);
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

  it("attributes recent bookings to the organizer, since that is whose they are", () => {
    expect(one({}).organizer?.bookedLabel).toBe('42 booked this month');
    expect(one({ organizer: null }).organizer).toBeNull();
  });
});

describe('EventHero', () => {
  it('shows the stage, the facts and the spread', () => {
    const text = textOf(
      render(
        <EventHero
          event={quoteEvent()}
          ctaLabel={CURRENT_EVENT_CTA.quotes_received}
          onPressCta={noop}
          onPressDetails={noop}
        />,
      ),
    );

    expect(text).toContain('Quotes received');
    expect(text).toContain('Naming ceremony');
    expect(text).toContain('5 Sep 2026 · Kukatpally · 150 guests');
    expect(text).toContain('3 quotes in');
    expect(text).toContain('3 organizers have quoted');
    expect(text).toContain('Lowest ₹6,25,000 · highest ₹7,42,000');
    expect(text).toContain('Compare quotes');
  });

  it('drops the quote panel before any organizer has replied', () => {
    const text = textOf(
      render(
        <EventHero
          event={quoteEvent({ quoteCount: 0, lowestQuote: 0, highestQuote: 0 })}
          ctaLabel={CURRENT_EVENT_CTA.submitted}
          onPressCta={noop}
          onPressDetails={noop}
        />,
      ),
    );

    expect(text).not.toContain('have quoted');
    expect(text).not.toContain('quotes in');
  });

  it('is two controls: the action and the details link', () => {
    const tree = render(
      <EventHero
        event={quoteEvent()}
        ctaLabel={CURRENT_EVENT_CTA.quotes_received}
        onPressCta={noop}
        onPressDetails={noop}
      />,
    );
    expect(drawnButtons(tree)).toHaveLength(2);
  });
});

describe('HomeHeader', () => {
  const base = {
    locationLabel: 'Hyderabad',
    searchPlaceholder: SEARCH_PLACEHOLDER,
    onPressLocation: noop,
    onPressSaved: noop,
    onPressNotifications: noop,
    onPressSearch: noop,
    onPressFilters: noop,
  };

  it('badges both counts, and neither at zero', () => {
    const withCounts = textOf(render(<HomeHeader {...base} savedCount={1} unreadCount={2} />));
    expect(withCounts).toContain('1');
    expect(withCounts).toContain('2');

    // A badge reading "0" is noise.
    const bare = render(<HomeHeader {...base} savedCount={0} unreadCount={0} />);
    expect(textOf(bare)).not.toContain('0');
  });

  it('caps a big count rather than stretching the dot', () => {
    expect(textOf(render(<HomeHeader {...base} savedCount={0} unreadCount={42} />))).toContain('9+');
  });

  it('names what can actually be searched', () => {
    const text = textOf(render(<HomeHeader {...base} savedCount={0} unreadCount={0} />));
    expect(text).toContain('Search packages, organizers, decor');
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
            subtitle: 'Pick an occasion — the brief takes about two minutes.',
          },
        } as HomeFeedDTO['content'],
        occasions: [
          { id: 'wedding', label: 'Wedding', art: 'wedding', fromPrice: 0, mostPlanned: true },
          { id: 'birthday', label: 'Birthday', art: 'birthday', fromPrice: 40000, mostPlanned: false },
          { id: 'naming', label: 'Naming', art: 'naming', fromPrice: 55000, mostPlanned: false },
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
          { id: 'corporate', label: 'Corporate', art: 'corporate', fromPrice: 0, mostPlanned: false },
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
                locationLabel="Kukatpally, Hyderabad"
                savedCount={1}
                unreadCount={2}
                searchPlaceholder={SEARCH_PLACEHOLDER}
                onPressLocation={noop}
                onPressSaved={noop}
                onPressNotifications={noop}
                onPressSearch={noop}
                onPressFilters={noop}
              />
              <EventHero
                event={quoteEvent()}
                ctaLabel={CURRENT_EVENT_CTA.quotes_received}
                onPressCta={noop}
                onPressDetails={noop}
              />
              <Offers data={offers} onPressOffer={noop} />
            </>,
          ).toJSON(),
        ),
      ],
      [
        'Home — plan something new',
        toHtml(render(<OccasionGrid data={occasions} onPressOccasion={noop} />).toJSON()),
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
      page(panels, { title: 'Home', width: 390, background: '#faf8f7', padding: 0 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
