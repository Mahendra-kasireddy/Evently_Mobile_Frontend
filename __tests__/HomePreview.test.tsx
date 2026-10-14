/**
 * @format
 *
 * Home, whole, as a picture — for reviewing the Marigold Hour redesign
 * without a device. Does nothing unless EVENTLY_HOME_PREVIEW_OUT is set:
 *
 *   EVENTLY_HOME_PREVIEW_OUT=/tmp/home.html \
 *   EVENTLY_RENDER_ASSET_BASE=./ npx jest __tests__/HomePreview.test.tsx
 *
 * Fonts are expected in ./fonts beside the written file (see rn-to-html).
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, size, color }: any) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), reset: jest.fn() }),
  useFocusEffect: () => {},
}));
jest.mock('../src/modules/NameCapture', () => ({ NameGateSheet: () => null }));
jest.mock('../src/modules/Chat', () => ({
  useOpenWithOrganizer: () => ({
    loading: false,
    execute: jest.fn(),
    error: null,
  }),
}));
/* Entrances drawn at rest: a still picture of a screen mid-fade is no use. */
jest.mock('../src/Components/Motion', () => {
  const actual = jest.requireActual('../src/Components/Motion');
  const { View } = require('react-native');
  const Still = ({ children, style }: any) => (
    <View style={style}>{children}</View>
  );
  return { ...actual, FadeInUp: Still, PopIn: Still };
});
const mockContainer = jest.fn();
jest.mock('../src/modules/Home/container', () => ({
  useHomeContainer: () => mockContainer(),
}));

/* A 390-point phone, not Jest's 750: Home sizes its grids from the window
   when its styles load, so this has to be in place before they are required. */
const RN = require('react-native');
jest
  .spyOn(RN.Dimensions, 'get')
  .mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 1 });

const { HomeScreen } = require('../src/modules/Home/HomeScreen');
const { mapOccasions } = require('../src/modules/Home/utils');
import type { HomeFeedDTO } from '../src/modules/Home/types';
import { page, toHtml } from '../test-utils/rn-to-html';

declare const process: { env: Record<string, string | undefined> };
const fs = require('fs');

const occasions = mapOccasions({
  content: { planSection: { title: 'Plan something new' } },
  occasions: [
    ['wedding', 'Wedding'],
    ['birthday', 'Birthday'],
    ['naming', 'Naming ceremony'],
    ['housewarming', 'Housewarming'],
    ['anniversary', 'Anniversary'],
    ['corporate', 'Corporate'],
  ].map(([id, label]) => ({
    id,
    label,
    art: id,
    fromPrice: 0,
    mostPlanned: false,
  })),
} as unknown as HomeFeedDTO);

const base = (over: Record<string, unknown> = {}) => ({
  banner: {
    greeting: '',
    headingLead: '',
    headingAccent: '',
    headingTail: '',
    subtitle: '',
    draftLabel: '',
    defaultDraft: { occasion: '', when: '', where: '', guests: '' },
    options: { occasion: [], when: [], where: [], guests: [] },
    trust: [
      { icon: 'shield', label: 'Verified organizers only' },
      { icon: 'zap', label: 'Advance held till confirmed' },
      { icon: 'star', label: 'Comparing is always free' },
    ],
  },
  bookedEvents: [],
  currentEvent: null,
  otherEvents: [],
  occasions,
  offers: null,
  packages: null,
  topOrganizers: {
    title: 'Organizers near you',
    city: 'Hyderabad',
    scope: 'city',
    scopeNote: '',
    items: [
      {
        id: 'o1',
        name: 'Sreeja Wedding Co.',
        initials: 'SW',
        avatarColor: '#7a3b52',
        tier: 'Gold',
        rating: 4.8,
        reviews: 51,
        events: 0,
        tags: ['Mandap', 'Decor'],
        fromLabel: '₹7L',
        repliesLabel: '',
        bookedLabel: '',
        coverUrl: '',
        logoUrl: '',
        verified: true,
        locationLabel: 'Jubilee Hills, Hyderabad',
      },
      {
        id: 'o2',
        name: 'Mahendra Events',
        initials: 'ME',
        avatarColor: '#2f5a63',
        tier: 'Platinum',
        rating: 4.6,
        reviews: 18,
        events: 0,
        tags: ['Corporate'],
        fromLabel: '',
        repliesLabel: '',
        bookedLabel: '',
        coverUrl: '',
        logoUrl: '',
        verified: true,
        locationLabel: 'Kukatpally, Hyderabad',
      },
    ],
  },
  header: {
    initials: 'HK',
    displayName: 'Hem Kumar',
    unreadCount: 2,
    savedCount: 0,
  },
  location: {
    title: 'Kukatpally',
    subtitle: 'Hyderabad, Telangana',
    locating: false,
  },
  coordinates: null,
  isLoading: false,
  isError: false,
  errorMessage: null,
  refetch: jest.fn(),
  heroDraft: {
    occasion: 'Naming ceremony',
    when: '',
    where: 'Kukatpally',
    guests: '',
  },
  shareBudget: false,
  budget: '',
  toggleShareBudget: jest.fn(),
  setHeroField: jest.fn(),
  submitHeroDraft: jest.fn(),
  isRequestingQuotes: false,
  quotesRequested: false,
  quotesErrorMessage: null,
  resetQuotesRequest: jest.fn(),
  savedPackageIds: [],
  toggleSavedPackage: jest.fn(),
  ...over,
});

function shot(state: Record<string, unknown>): string {
  mockContainer.mockReturnValue(base(state));
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<HomeScreen />);
  });
  const html = toHtml(tree.toJSON());
  ReactTestRenderer.act(() => tree.unmount());
  return html;
}

describe('Home preview', () => {
  it('writes the redesigned Home when EVENTLY_HOME_PREVIEW_OUT is set', () => {
    const out = process.env.EVENTLY_HOME_PREVIEW_OUT;
    if (!out) return;

    const weekend = require('../src/modules/Home/utils').quickDateIso(
      'weekend',
      0,
    );
    const panels: Array<[string, string]> = [
      ['Brief half answered', shot({})],
      [
        'Brief ready — Border Beam on',
        shot({
          heroDraft: {
            occasion: 'Naming ceremony',
            when: weekend,
            where: 'Kukatpally',
            guests: '150',
          },
          shareBudget: true,
          budget: '₹2L – ₹5L',
        }),
      ],
      [
        'Sending — Thinking Orbs',
        shot({
          heroDraft: {
            occasion: 'Wedding',
            when: weekend,
            where: 'Gachibowli',
            guests: '300',
          },
          isRequestingQuotes: true,
        }),
      ],
      [
        'First load',
        shot({
          isLoading: true,
          occasions: null,
          topOrganizers: null,
          banner: null,
        }),
      ],
    ];
    fs.writeFileSync(
      out,
      page(panels, {
        title: 'Home — Marigold Hour',
        width: 390,
        background: '#faf6f0',
        padding: 0,
      }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
