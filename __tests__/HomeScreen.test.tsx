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
} as unknown as HomeContainerResult['bookedEvents'][number];

/** The container's answer, with only the parts this screen reads set. */
const result = (over: Partial<HomeContainerResult> = {}): HomeContainerResult =>
  ({
    banner: null,
    bookedEvents: [],
    currentEvent: null,
    otherEvents: [],
    categories: null,
    occasions: null,
    offers: null,
    packages: null,
    topOrganizers: null,
    howItWorks: null,
    tools: null,
    header: { initials: 'HK', displayName: 'Hem Kumar', unreadCount: 0, savedCount: 0 },
    isLoading: false,
    isError: false,
    errorMessage: null,
    refetch: jest.fn(),
    /* Never null now: the draft lives in the store, seeded with today's date
       and a hundred guests so the card opens answerable rather than blank. */
    heroDraft: { occasion: '', when: '2026-09-18', where: '', guests: '100' },
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

describe('the basics form', () => {
  /*
   * It used to be gated on having no live event, which sounded reasonable and
   * meant that anyone with a request in flight — most people who use the app
   * twice — never saw it again. Planning a second event is the thing Home is
   * for, so it is always there.
   */
  const withBanner = (over: Partial<HomeContainerResult> = {}) =>
    result({
      banner: {
        greeting: '',
        headingLead: 'What shall we',
        headingAccent: 'celebrate',
        headingTail: 'next?',
        subtitle: 'Verified organizers send tailored quotes within a day.',
        draftLabel: '',
        defaultDraft: { occasion: '', when: '', where: '', guests: '' },
        options: { occasion: [], when: [], where: [], guests: [] },
        trust: [],
      } as unknown as HomeContainerResult['banner'],
      ...over,
    });

  /*
   * Looked for by the form's own rows, not by a heading. The block used to
   * open with "What shall we celebrate next?" and an "or tell us the basics"
   * divider; the rows below them say what they want by their own labels, so
   * the framing went and the assertions moved onto the thing being tested.
   */
  const BASICS_ROW = 'Occasion';

  it('is on screen for an account with nothing on', () => {
    mockContainer.mockReturnValue(withBanner());
    expect(render()).toContain(BASICS_ROW);
  });

  it('stays on screen for an account with a live request', () => {
    mockContainer.mockReturnValue(withBanner({ currentEvent: event() }));
    const text = render();
    expect(text).toContain(BASICS_ROW);
    expect(text).toContain('Anniversary');
  });

  it('stays on screen for an account with a booking', () => {
    mockContainer.mockReturnValue(withBanner({ bookedEvents: [booked] }));
    const text = render();
    expect(text).toContain(BASICS_ROW);
    expect(text).toContain('EVT-2026-1977');
  });

  it('sits on the hero photograph rather than under it', () => {
    /*
     * The reference has its card lifted over the picture's bottom edge. Two
     * styles have to agree on how far — the photo's bottom padding and the
     * card's negative margin — so the distance is one exported number rather
     * than the same value typed twice.
     */
    const {
      HERO_PHOTO_OVERLAP,
      styles: homeStyles,
      homeHeroPhotoStyles,
    } = require('../src/modules/Home/styles');
    const sheet = homeStyles.sheet as Record<string, unknown>;

    expect(sheet.marginTop).toBe(-HERO_PHOTO_OVERLAP);

    /*
     * The photograph is a band, not a backdrop.
     *
     * It reappeared hundreds of points down the page — between the form and
     * the booked card — because only the first block covered it and the rest
     * of the feed let it through. A fixed height on the band and an opaque,
     * flex-growing sheet over everything below are what keep "the picture is
     * at the top" true rather than nearly true.
     */
    expect((homeHeroPhotoStyles.wrap as Record<string, unknown>).height).toBe(268);
    expect(sheet.backgroundColor).toBeTruthy();
    expect(sheet.flexGrow).toBe(1);
  });

  it('opens with the form itself, not with a heading above it', () => {
    mockContainer.mockReturnValue(withBanner());
    const text = render();
    expect(text).not.toContain('celebrate');
    expect(text).not.toContain('or tell us the basics');
  });
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
        bookedEvents: [booked],
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
      result({ bookedEvents: [booked], otherEvents: [] }),
    );

    const text = render();
    expect(text).toContain('EVT-2026-1977');
    expect(text).not.toContain('Anniversary');
  });

  it('puts two bookings side by side rather than stacking them', () => {
    /*
     * A second confirmed booking used to be dropped to a one-line row among
     * the "other events" — the treatment a brief still collecting quotes gets
     * — because the feed could only carry one. Both are cards now, and the
     * row is horizontal so the second one does not cost Home a whole card of
     * height.
     */
    const second = {
      ...booked,
      id: 'bk-2',
      ref: 'EVT-2026-2088',
      title: 'Housewarming',
    } as typeof booked;

    mockContainer.mockReturnValue(
      result({ bookedEvents: [booked, second], otherEvents: [] }),
    );

    const text = render();
    expect(text).toContain('EVT-2026-1977');
    expect(text).toContain('EVT-2026-2088');
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
        bookedEvents: [booked],
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

  it('offers Edit only while the brief can still be changed', () => {
    /*
     * A request nobody has been hired off yet can be revised; a booking
     * cannot. Editing a brief an organizer has already been paid an advance
     * against would change what they agreed to deliver, so the pencil is not
     * offered there at all.
     */
    const brief = event({ title: 'Housewarming' });
    mockContainer.mockReturnValue(
      result({ currentEvent: event({ title: 'Leading' }), otherEvents: [brief] }),
    );
    const pencil = renderTree().root.findAll(
      node =>
        typeof node.props?.testID === 'string' &&
        node.props.testID.startsWith('edit-brief-') &&
        node.props?.accessibilityRole === 'button',
      { deep: true },
    )[0];
    pencil.props.onPress();
    expect(mockNavigate).toHaveBeenCalledWith('Plan', {
      requestId: brief.refId,
    });

    const booked = {
      ...brief,
      source: 'booking',
      stage: 'booking_confirmed',
    } as typeof brief;
    mockContainer.mockReturnValue(
      result({ currentEvent: event({ title: 'Leading' }), otherEvents: [booked] }),
    );
    expect(
      renderTree().root.findAll(
        node =>
          typeof node.props?.testID === 'string' &&
          node.props.testID.startsWith('edit-brief-'),
        { deep: true },
      ),
    ).toHaveLength(0);
  });

  it('closes the page with the three promises', () => {
    /*
     * The strip existed and nothing mounted it, so the commitments the
     * business makes — verified organizers, the advance held until the
     * booking is confirmed — were written in the admin and read by nobody.
     * Last on the page on purpose: it is what somebody reads after the
     * organizers and before they decide to put money down.
     */
    mockContainer.mockReturnValue(
      result({
        banner: {
          greeting: '',
          headingLead: '',
          headingAccent: '',
          headingTail: '',
          subtitle: '',
          draftLabel: '',
          defaultDraft: { occasion: '', when: '', where: '', guests: '' },
          options: { occasion: [], when: [], where: [], guests: [] },
          trust: [{ icon: 'shield', label: 'Verified organizers only' }],
        } as unknown as HomeContainerResult['banner'],
      }),
    );
    expect(render()).toContain('Verified organizers only');
  });

  it('always offers the link, and it opens the full list', () => {
    /*
     * The link used to appear only when there were more events than the three
     * on screen, and to count them — "See all 11". A customer with exactly
     * three had no way out of the preview at all, and the count was a fact
     * about the section rather than a description of where the link went. It
     * is a plain "See all" now, to the events list this section previews, and
     * it is there whenever the section is.
     */
    mockContainer.mockReturnValue(
      result({
        currentEvent: event({ title: 'Leading' }),
        otherEvents: many(2),
      }),
    );
    expect(hasControl(renderTree(), 'see-all-events')).toBe(true);

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
    link.props.onPress();
    expect(mockNavigate).toHaveBeenCalledWith('SeeAll', { kind: 'events' });
  });

});
