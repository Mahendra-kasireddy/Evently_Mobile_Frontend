/**
 * @format
 *
 * The workspace screen's data shaping, and the navigation rule that gets a
 * customer back to My Bookings from either of the two places that open it.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { View } from 'react-native';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, size, color }: { name: string; size?: number; color?: string }) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});

import { page, toHtml } from '../test-utils/rn-to-html';
import { mapWorkspace, formatINR, workspaceBackAction } from '../src/modules/Workspace/utils';
import { WorkspaceHero } from '../src/modules/Workspace/sections/WorkspaceHero';
import {
  EventFacts,
  Milestones,
  Payment,
  Tasks,
  Timeline,
} from '../src/modules/Workspace/sections/WorkspaceSections';
import { IdeasSummary, InvitationSummary } from '../src/modules/Workspace/sections/WorkspaceLinks';
import type { BookingDetailDTO } from '../src/modules/Workspace/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const detail = (over: Partial<BookingDetailDTO> = {}): BookingDetailDTO =>
  ({
    id: 'bk1',
    ref: 'EVT-2026-1977',
    title: 'Your Naming · 5 Sept 2026',
    description: '',
    occasion: 'naming',
    location: 'Jubilee Hills, Hyderabad',
    eventDate: '2026-09-05T00:00:00.000Z',
    daysToGo: 8,
    amount: 240000,
    advanceAmount: 72000,
    advancePercentage: 30,
    balanceAmount: 168000,
    paymentStatus: 'advance_paid',
    amountPaid: 72000,
    progress: 25,
    status: 'confirmed',
    steps: [
      { label: 'Organizer booked', done: true },
      { label: 'Vendors locked', done: false },
    ],
    tasks: [],
    timeline: [],
    organizer: {
      id: 'o1',
      name: 'MAHENDRA EVENTS',
      initials: 'ME',
      avatarColor: '#7C5CE6',
      tier: 'Silver',
      rating: 0,
    },
    ...over,
  }) as BookingDetailDTO;

describe('mapWorkspace', () => {
  it('names the workspace after the occasion', () => {
    expect(mapWorkspace(detail()).workspaceName).toBe('Your naming workspace');
    // A booking with no occasion still needs a name for the header.
    expect(mapWorkspace(detail({ occasion: '' })).workspaceName).toBe('Your event workspace');
  });

  it('shows only the facts the booking actually carries', () => {
    const full = mapWorkspace(detail()).facts.map((f) => f.label);
    expect(full).toEqual(['When', 'Where', 'Organizer', 'Reference']);

    // A booking with no venue or organizer drops those rows rather than
    // rendering a dash the customer would read as an answer.
    const sparse = mapWorkspace(detail({ location: '', organizer: null })).facts.map((f) => f.label);
    expect(sparse).toEqual(['When', 'Reference']);
  });

  it('distinguishes "no date" from "today"', () => {
    // 0 days to go is a real answer; a booking with no date has none at all,
    // and the hero hides its countdown rather than reading "0 days to go".
    expect(mapWorkspace(detail({ daysToGo: 0 })).daysToGo).toBe(0);
    expect(mapWorkspace(detail({ eventDate: null })).daysToGo).toBeNull();
  });

  it('reports the payment split from the booking, not a re-derivation', () => {
    const { payment } = mapWorkspace(detail());

    expect(payment.totalLabel).toBe('₹2,40,000');
    expect(payment.paidLabel).toBe('₹72,000');
    expect(payment.dueLabel).toBe('₹1,68,000');
    expect(payment.statusLabel).toBe('Advance paid');
    expect(payment.paidPercent).toBe(30);
  });

  it('never prints ₹0 for an amount nobody has set', () => {
    expect(formatINR(0)).toBe('');
    expect(formatINR(undefined)).toBe('');
    expect(mapWorkspace(detail({ amount: 0, amountPaid: 0, balanceAmount: 0 })).payment.totalLabel).toBe('');
  });

  it('puts the newest activity first', () => {
    const vm = mapWorkspace(
      detail({
        timeline: [
          { status: 'pending', label: 'Booking placed', note: '', at: '2026-08-01T10:00:00.000Z' },
          { status: 'confirmed', label: 'Organizer confirmed', note: '', at: '2026-08-02T10:00:00.000Z' },
        ],
      }),
    );

    expect(vm.timeline.map((t) => t.label)).toEqual(['Organizer confirmed', 'Booking placed']);
    expect(vm.timeline[0].atLabel).toContain('2 Aug 2026');
  });

  it('drops a timeline entry with no label rather than drawing a blank row', () => {
    const vm = mapWorkspace(
      detail({ timeline: [{ status: 'x', label: '', note: 'n', at: '2026-08-01T10:00:00.000Z' }] }),
    );
    expect(vm.timeline).toHaveLength(0);
  });
});

describe('workspaceBackAction', () => {
  it('pops when the customer came from My Bookings', () => {
    expect(workspaceBackAction(['Main', 'Bookings', 'Workspace'])).toBe('goBack');
  });

  it('replaces itself when the customer came from Home', () => {
    // Pushing the list instead would put it on top of the workspace, and its
    // own back button would come straight back here.
    expect(workspaceBackAction(['Main', 'Workspace'])).toBe('replace');
  });
});


describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) {
      return;
    }

    const rich = mapWorkspace(
      detail({
        tasks: [
          {
            id: 't1',
            title: 'Stage decor & floral',
            status: 'in_progress',
            assigneeName: 'Bloom & Co',
            amount: 45000,
            dueDate: '2026-09-01T00:00:00.000Z',
          },
          {
            id: 't2',
            title: 'Catering — 200 plates',
            status: 'done',
            assigneeName: 'Spice Route',
            amount: 96000,
            dueDate: null,
          },
          { id: 't3', title: 'Photography', status: 'pending', assigneeName: '', amount: 0, dueDate: null },
        ],
        timeline: [
          { status: 'pending', label: 'Booking placed', note: 'Advance paid', at: '2026-08-01T10:00:00.000Z' },
          { status: 'confirmed', label: 'Organizer confirmed', note: '', at: '2026-08-02T09:30:00.000Z' },
        ],
      }),
    );

    const sparse = mapWorkspace(
      detail({
        eventDate: null,
        location: '',
        organizer: null,
        amount: 0,
        amountPaid: 0,
        balanceAmount: 0,
        paymentStatus: 'unpaid',
        progress: 0,
        status: 'awaiting_organizer',
        steps: [],
      }),
    );

    const Screen = ({
      data,
      counts,
      invitation,
    }: {
      data: ReturnType<typeof mapWorkspace>;
      counts: { shared: number; planned: number; awaitingApproval: number } | null;
      invitation: Parameters<typeof InvitationSummary>[0]['invitation'];
    }) => (
      <View>
        <WorkspaceHero data={data} />
        <Milestones data={data} />
        <IdeasSummary counts={counts} organizerName={data.organizerName} onPress={() => {}} />
        <InvitationSummary invitation={invitation} organizerName={data.organizerName} onPress={() => {}} />
        <EventFacts data={data} />
        <Payment data={data} />
        <Tasks data={data} />
        <Timeline data={data} />
      </View>
    );

    const render = (el: React.ReactElement) => {
      let tree!: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(el);
      });
      return toHtml(tree.toJSON());
    };

    const panels: Array<[string, string]> = [
      [
        'A confirmed booking with vendors',
        render(
          <Screen
            data={rich}
            counts={{ shared: 3, planned: 2, awaitingApproval: 1 }}
            invitation={{ status: 'sent' } as never}
          />,
        ),
      ],
      [
        'Paid, nothing agreed or scheduled yet',
        render(<Screen data={sparse} counts={{ shared: 0, planned: 0, awaitingApproval: 0 }} invitation={null} />),
      ],
    ];

    fs.writeFileSync(out, page(panels, { title: 'Workspace', width: 390, background: '#fff', padding: 0 }), 'utf8');
    expect(fs.existsSync(out)).toBe(true);
  });
});
