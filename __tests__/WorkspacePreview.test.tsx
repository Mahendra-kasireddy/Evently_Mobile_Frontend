/**
 * @format
 *
 * The customer workspace, as a picture — for reviewing layout without a
 * device. Does nothing unless EVENTLY_WS_PREVIEW_OUT is set.
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
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: () => () => {},
  }),
  useRoute: () => ({ params: { bookingId: 'b1' } }),
  useFocusEffect: () => {},
}));
jest.mock('../src/Components/Motion', () => {
  const actual = jest.requireActual('../src/Components/Motion');
  const { View } = require('react-native');
  const Still = ({ children, style }: any) => (
    <View style={style}>{children}</View>
  );
  return { ...actual, FadeInUp: Still, PopIn: Still };
});
jest.mock('../src/modules/Chat', () => ({
  useOpenWithOrganizer: () => ({
    loading: false,
    execute: jest.fn(),
    error: null,
  }),
}));
jest.mock('../src/modules/Organizer', () => ({
  useCanReview: () => ({ data: { canReview: false }, refetch: jest.fn() }),
  LeaveReviewSheet: () => null,
}));
jest.mock('../src/modules/Workspace/sections/PinnedHeader', () => ({
  PinnedHeader: () => null,
}));
const mockContainer = jest.fn();
jest.mock('../src/modules/Workspace/container', () => ({
  useWorkspaceContainer: () => mockContainer(),
}));

const RN = require('react-native');
jest
  .spyOn(RN.Dimensions, 'get')
  .mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 1 });

const { WorkspaceScreen } = require('../src/modules/Workspace/WorkspaceScreen');
const { mapWorkspace } = require('../src/modules/Workspace/utils');
import { page, toHtml } from '../test-utils/rn-to-html';
declare const process: { env: Record<string, string | undefined> };
const fs = require('fs');

const dto = {
  id: 'b1',
  ref: 'EVT-2026-5733',
  title: 'Birthday',
  description: '',
  occasion: 'Birthday',
  location: 'Hitech city,Pathrika nagar, road no 3,Hyderabad, Hyderabad',
  eventDate: '2026-11-06T06:30:00.000Z',
  daysToGo: 18,
  amount: 313538,
  advanceAmount: 72000,
  advancePercentage: 30,
  advanceMethod: 'online',
  balanceAmount: 168000,
  paymentStatus: 'unpaid',
  amountPaid: 0,
  progress: 40,
  status: 'confirmed',
  steps: [
    { label: 'Booked', done: true },
    { label: 'Advance paid', done: true },
    { label: 'Planning', done: false },
    { label: 'Event day', done: false },
  ],
  tasks: [
    {
      id: 't1',
      title: 'Finalise decor theme',
      status: 'done',
      assigneeName: 'Sreeja',
      amount: 0,
      dueDate: null,
    },
    {
      id: 't2',
      title: 'Book photographer',
      status: 'in_progress',
      assigneeName: 'Sreeja',
      amount: 35000,
      dueDate: null,
    },
    {
      id: 't3',
      title: 'Confirm menu tasting',
      status: 'pending',
      assigneeName: 'You',
      amount: 0,
      dueDate: null,
    },
  ],
  timeline: [
    {
      status: 'confirmed',
      label: 'Booking confirmed',
      note: '',
      at: new Date(Date.now() - 3 * 864e5).toISOString(),
    },
    {
      status: 'advance_paid',
      label: 'Advance paid',
      note: '₹72,000',
      at: new Date(Date.now() - 2 * 864e5).toISOString(),
    },
  ],
  organizer: {
    id: 'o1',
    name: 'Mahendra Events',
    initials: 'ME',
    avatarColor: '#7a3b52',
    tier: 'Gold',
    rating: 4.8,
  },
  customer: { id: 'c1', name: 'Hem' },
};

function shot(): string {
  mockContainer.mockReturnValue({
    workspace: mapWorkspace(dto),
    ideaCounts: { total: 4, fromOrganizer: 2, open: 1 },
    latestFromOrganizer: null,
    invitation: null,
    guestSummary: { total: 120, sent: 80, viewed: 52 },
    isLoading: false,
    isError: false,
    errorMessage: null,
    refetch: jest.fn(),
  });
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<WorkspaceScreen />);
  });
  const html = toHtml(tree.toJSON());
  ReactTestRenderer.act(() => tree.unmount());
  return html;
}

describe('Workspace preview', () => {
  it('writes the workspace when EVENTLY_WS_PREVIEW_OUT is set', () => {
    const out = process.env.EVENTLY_WS_PREVIEW_OUT;
    if (!out) return;
    fs.writeFileSync(
      out,
      page([['Workspace — details', shot()]], {
        title: 'Workspace',
        width: 390,
        background: '#f7f5fb',
        padding: 0,
      }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
