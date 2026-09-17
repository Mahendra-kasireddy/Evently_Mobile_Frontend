/**
 * @format
 *
 * What Home actually puts on screen.
 *
 * Every other Home test checks the mappers — the view models are right, the
 * copy is right. This one checks the render, because a correct view model that
 * the screen never draws looks exactly like a missing record to the customer,
 * and that is the failure that cost the most time: a confirmed booking and a
 * live brief, and only the booking on screen.
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
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, reset: jest.fn() }),
  useFocusEffect: () => {},
}));

// Not part of what is being checked here, and it reaches for state this test
// does not set up.
jest.mock('../src/modules/NameCapture', () => ({ NameGateSheet: () => null }));

jest.mock('../src/modules/Chat', () => ({
  useOpenWithOrganizer: () => ({
    loading: false,
    execute: jest.fn(),
    error: null,
  }),
}));

const mockContainer = jest.fn();
jest.mock('../src/modules/Home/container', () => ({
  useHomeContainer: () => mockContainer(),
}));

import { HomeScreen } from '../src/modules/Home/HomeScreen';
import type { HomeContainerResult } from '../src/modules/Home/container';
import type { CurrentEventViewModel } from '../src/modules/Home/types';

/** A hero-ready event, of whatever stage the test needs. */
const event = (
  over: Partial<CurrentEventViewModel> = {},
): CurrentEventViewModel =>
  ({
    refId: 'req-anniv',
    title: 'Anniversary',
    occasion: 'Anniversary',
    when: '',
    where: '',
    guests: '',
    source: 'quote',
    progress: 40,
    daysToGo: null,
    stage: 'quotes_received',
    factsLine: '',
    stageLabel: 'QUOTES RECEIVED',
    quoteCount: 1,
    spreadLabel: '',
    quotedLabel: '1 organizer has quoted',
    reachLine: '1 organizer has replied',
    closesLabel: 'Closes in 7 days',
    quoteRows: [],
    awaitingLabel: '',
    ctaLabel: 'See the quote',
    ...over,
  } as CurrentEventViewModel);

const booked = {
  id: 'bk1',
  ref: 'EVT-2026-1977',
  title: 'Naming',
  statusLabel: 'BOOKED',
  dateLabel: '5 Sept 2026',
  factsLine: '5 Sept 2026 · Kukatpally',
  daysLabel: 'Today',
  organizerId: 'o1',
  organizerName: 'MAHENDRA EVENTS',
  organizerInitials: 'ME',
  organizerAvatarColor: '#6d5bd0',
  organizerLine: 'Managing your event',
  progress: 25,
  stepsLabel: '1 of 4 steps done',
  steps: [
    { label: 'Organizer booked', state: 'done' },
    { label: 'Vendors locked', state: 'next' },
    { label: 'Invitation', state: 'pending' },
    { label: 'Final walkthrough', state: 'pending' },
  ],
  ctaLabel: 'Open workspace',
} as unknown as HomeContainerResult['bookedEvent'];

/** The container's answer, with only the parts this screen reads set. */
const result = (over: Partial<HomeContainerResult> = {}): HomeContainerResult =>
  ({
    banner: null,
    bookedEvent: null,
    currentEvent: null,
    otherEvents: [],
    categories: null,
    occasions: null,
    offers: null,
    packages: null,
    topOrganizers: null,
    howItWorks: null,
    tools: null,
    header: { locationLabel: 'Hyderabad', unreadCount: 0, savedCount: 0 },
    isLoading: false,
    isError: false,
    errorMessage: null,
    refetch: jest.fn(),
    heroDraft: null,
    setHeroField: jest.fn(),
    submitHeroDraft: jest.fn(),
    isRequestingQuotes: false,
    quotesRequested: false,
    quotesErrorMessage: null,
    resetQuotesRequest: jest.fn(),
    organizerRequestedIds: [],
    organizerRequestingId: null,
    organizerRequestError: null,
    requestQuoteFrom: jest.fn(),
    savedPackageIds: [],
    toggleSavedPackage: jest.fn(),
    ...over,
  } as unknown as HomeContainerResult);

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

function renderTree(): ReactTestRenderer.ReactTestRenderer {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<HomeScreen />);
  });
  return tree;
}

function render(): string {
  return textOf(renderTree());
}

/** Whether a control with this testID is on screen at all. */
function hasControl(
  tree: ReactTestRenderer.ReactTestRenderer,
  testID: string,
): boolean {
  return (
    tree.root.findAll(node => node.props?.testID === testID, { deep: true })
      .length > 0
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('the event cards Home draws', () => {
  it('draws a booking and a separate live brief together', () => {
    /*
     * The reported bug. Home used to render the booked card OR the hero, so a
     * customer with a confirmed Naming booking and an open Anniversary brief
     * saw only the booking, and had no way of telling from Home that their
     * request existed at all.
     */
    mockContainer.mockReturnValue(
      result({
        bookedEvent: booked,
        currentEvent: null,
        otherEvents: [event()],
      }),
    );

    const text = render();
    expect(text).toContain('EVT-2026-1977');
    expect(text).toContain('Anniversary');
  });

  it('draws the booked card alone when nothing else is live', () => {
    mockContainer.mockReturnValue(
      result({ bookedEvent: booked, otherEvents: [] }),
    );

    const text = render();
    expect(text).toContain('EVT-2026-1977');
    expect(text).not.toContain('Anniversary');
  });

  it('draws the hero for an account with a brief and no booking', () => {
    mockContainer.mockReturnValue(
      result({ currentEvent: event(), otherEvents: [] }),
    );

    const text = render();
    expect(text).toContain('Anniversary');
  });

  it('never draws the leading event twice', () => {
    // `otherEvents` excludes `currentEvent` server-side; if that ever regressed
    // the customer would see the same event stacked on itself.
    mockContainer.mockReturnValue(
      result({ currentEvent: event(), otherEvents: [] }),
    );

    expect(render().match(/Anniversary/g)).toHaveLength(1);
  });

  it('draws every live event, not just the second', () => {
    mockContainer.mockReturnValue(
      result({
        bookedEvent: booked,
        otherEvents: [event(), event({ refId: 'req-wed', title: 'Wedding' })],
      }),
    );

    const text = render();
    expect(text).toContain('Anniversary');
    expect(text).toContain('Wedding');
  });

  /*
   * How long Home is, for a customer who uses it.
   *
   * Every live event used to be a full navy hero, so ten events were ten
   * screens of card before anything else — offers, packages, organizers — was
   * reachable at all. Home now lists three and links to the tab that holds
   * them all, which keeps its height the same whether a customer has four
   * events or forty.
   */
  const many = (count: number) =>
    Array.from({ length: count }, (_, i) =>
      event({ refId: `req-${i}`, title: `Event ${i}` }),
    );

  it('lists at most three of the other events', () => {
    mockContainer.mockReturnValue(
      result({
        currentEvent: event({ title: 'Leading' }),
        otherEvents: many(10),
      }),
    );

    const text = render();
    expect(text).toContain('Leading');
    expect(text).toContain('Event 0');
    expect(text).toContain('Event 2');
    expect(text).not.toContain('Event 3');
  });

  it('links out with the real total, not the number on screen', () => {
    // Eleven events: the leading card plus ten others. A link reading "See all
    // 3" would be counting what it already showed.
    mockContainer.mockReturnValue(
      result({
        currentEvent: event({ title: 'Leading' }),
        otherEvents: many(10),
      }),
    );

    const link = renderTree().root.findAll(
      node =>
        node.props?.testID === 'see-all-events' &&
        node.props?.accessibilityRole === 'button',
      { deep: true },
    )[0];
    expect(link.props.accessibilityLabel).toBe('See all 11 events');
  });

  it('offers no link when every event is already on screen', () => {
    mockContainer.mockReturnValue(
      result({
        currentEvent: event({ title: 'Leading' }),
        otherEvents: many(2),
      }),
    );

    const tree = renderTree();
    expect(textOf(tree)).toContain('Event 1');
    expect(hasControl(tree, 'see-all-events')).toBe(false);
  });
});
