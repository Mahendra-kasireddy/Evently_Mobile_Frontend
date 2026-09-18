/**
 * @format
 *
 * One Home section, in full.
 *
 * Every section on Home is a preview — the events stop at three, the offers
 * are a carousel most of which is off screen — and each "See all" opens this
 * screen with the section it means. The tests are about completeness: what
 * Home caps, this does not, and what the feed carries, this shows.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name }: { name: string }) {
    return <Text>{` icon:${name}`}</Text>;
  };
});

const mockNavigate = jest.fn();
/** Which section the screen was opened for. */
const mockKind = jest.fn(() => 'events');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    canGoBack: () => true,
    goBack: jest.fn(),
  }),
  useRoute: () => ({ params: { kind: mockKind() } }),
  useFocusEffect: () => {},
}));

const mockFeed = jest.fn();
jest.mock('../src/modules/Home/hooks', () => ({
  useHomeFeed: () => mockFeed(),
}));

import { SeeAllScreen } from '../src/modules/Home/SeeAllScreen';
import { mapAllEvents } from '../src/modules/Home/utils';
import type { HomeFeedDTO } from '../src/modules/Home/types';

const eventDTO = (over: Record<string, unknown> = {}) =>
  ({
    stage: 'quotes_received',
    refId: 'req1',
    title: 'Anniversary',
    occasion: 'Anniversary',
    when: '5 Sep 2026',
    where: 'Kukatpally',
    guests: '150 guests',
    source: 'quote',
    progress: 40,
    daysToGo: null,
    quoteCount: 3,
    lowestQuote: 0,
    highestQuote: 0,
    sentToCount: 4,
    closesInDays: 4,
    quotes: [],
    awaiting: [],
    ...over,
  } as NonNullable<HomeFeedDTO['currentEvent']>);

const feed = (over: Partial<HomeFeedDTO> = {}): HomeFeedDTO =>
  ({
    currentEvent: null,
    otherEvents: [],
    booking: null,
    ...over,
  } as HomeFeedDTO);

const loaded = (data: HomeFeedDTO) => ({
  data,
  loading: false,
  error: null,
  refetch: jest.fn(),
});

function render(): ReactTestRenderer.ReactTestRenderer {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<SeeAllScreen />);
  });
  return tree;
}

function textOf(tree: ReactTestRenderer.ReactTestRenderer): string {
  const out: string[] = [];
  const walk = (n: unknown): void => {
    if (n == null) return;
    if (typeof n === 'string') {
      if (!n.startsWith(' icon:')) out.push(n);
      return;
    }
    if (Array.isArray(n)) return n.forEach(walk);
    walk((n as { children?: unknown }).children);
  };
  walk(tree.toJSON());
  return out.join(' | ');
}

const many = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    eventDTO({ refId: `req-${i}`, title: `Event ${i}` }),
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockKind.mockReturnValue('events');
});

describe('what the list holds', () => {
  it('shows every event, past the three Home stops at', () => {
    // The whole reason this screen exists: Home's "See all" promised the rest,
    // and the Events tab it used to open lists bookings only.
    mockFeed.mockReturnValue(loaded(feed({ otherEvents: many(10) })));

    const text = textOf(render());
    expect(text).toContain('Event 0');
    expect(text).toContain('Event 3');
    expect(text).toContain('Event 9');
  });

  it('includes the leading event Home draws as a card', () => {
    // On Home that one is the hero rather than a row. A list called "every
    // event" that left it out would be missing the customer's main one.
    mockFeed.mockReturnValue(
      loaded(
        feed({
          currentEvent: eventDTO({ title: 'Leading' }),
          otherEvents: many(2),
        }),
      ),
    );

    const text = textOf(render());
    expect(text).toContain('Leading');
    expect(text).toContain('Event 1');
  });

  it('counts what it is showing', () => {
    mockFeed.mockReturnValue(
      loaded(
        feed({
          currentEvent: eventDTO({ title: 'Leading' }),
          otherEvents: many(3),
        }),
      ),
    );
    expect(textOf(render())).toContain('4 events');
  });

  it('counts one event without the plural', () => {
    mockFeed.mockReturnValue(loaded(feed({ currentEvent: eventDTO() })));
    expect(textOf(render())).toContain('1 event');
  });

  it('de-duplicates the same way Home does', () => {
    // One event arriving as both `currentEvent` and an `otherEvents` entry is
    // the server bug Home already defends against; this list shares that
    // mapper rather than repeating the event.
    const events = mapAllEvents(
      feed({ currentEvent: eventDTO(), otherEvents: [eventDTO()] }),
    );
    expect(events).toHaveLength(1);
  });
});

describe('when there is nothing', () => {
  it('says so, rather than showing an empty screen', () => {
    mockFeed.mockReturnValue(loaded(feed()));
    expect(textOf(render())).toContain('Nothing live right now');
  });
});

describe('the offers section', () => {
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
    endsAt: '2026-09-30T18:29:59.000Z',
    perCustomerLimit: 1,
    timesUsed: 0,
    ...over,
  });

  const withOffers = (count: number) => {
    mockKind.mockReturnValue('offers');
    mockFeed.mockReturnValue(
      loaded(
        feed({
          coupons: Array.from({ length: count }, (_, i) =>
            coupon({ id: `c${i}`, code: `CODE${i}` }),
          ),
        } as Partial<HomeFeedDTO>),
      ),
    );
  };

  it('lists every live coupon, not the handful the carousel shows', () => {
    withOffers(6);
    const text = textOf(render());
    expect(text).toContain('CODE0');
    expect(text).toContain('CODE5');
  });

  it('counts them, and titles itself for the section it was opened for', () => {
    withOffers(3);
    const text = textOf(render());
    expect(text).toContain('Offers for you');
    expect(text).toContain('3 offers');
  });

  it('says there are none rather than showing a blank screen', () => {
    // The server only sends coupons that are live and still usable, so an
    // empty list genuinely means none — not that something failed to load.
    withOffers(0);
    expect(textOf(render())).toContain('No offers right now');
  });

  it('shows the events copy when opened for events instead', () => {
    // One screen, two sections: the wrong title here would be the screen
    // forgetting which "See all" opened it.
    mockFeed.mockReturnValue(loaded(feed({ otherEvents: many(2) })));
    expect(textOf(render())).toContain('Your events');
  });
});

describe('opening one', () => {
  it('routes by which record it is', () => {
    mockFeed.mockReturnValue(
      loaded(
        feed({
          otherEvents: [
            eventDTO({ refId: 'bk1', source: 'booking', title: 'Naming' }),
          ],
        }),
      ),
    );

    const row = render().root.findAll(
      node =>
        node.props?.testID === 'event-row-booking-bk1' &&
        node.props?.accessibilityRole === 'button',
      { deep: true },
    )[0];
    ReactTestRenderer.act(() => row.props.onPress());

    expect(mockNavigate).toHaveBeenCalledWith('Workspace', {
      bookingId: 'bk1',
      workspaceName: 'Naming',
    });
  });
});
