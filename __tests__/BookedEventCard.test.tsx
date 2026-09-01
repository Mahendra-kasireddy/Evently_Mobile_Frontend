/**
 * @format
 *
 * Behavioural tests for Home's ongoing-booking card.
 *
 * The card's one hard rule is that the ring and the ticks under it always tell
 * the same story: `progress` is the backend's count of completed milestones,
 * and the card must render it rather than deriving a second, different number.
 *
 * Setting EVENTLY_RENDER_OUT=<path> writes an HTML rendering of every state to
 * that path, from the component's real resolved styles.
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
import { BookedEventCard } from '../src/modules/Home/sections/BookedEventCard';
import { mapBookedEvent } from '../src/modules/Home/utils';
import { BOOKED_RING_CIRCUMFERENCE } from '../src/modules/Home/constants';
import type { BookedEventViewModel, HomeFeedDTO } from '../src/modules/Home/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const booked: BookedEventViewModel = {
  id: 'bk1',
  ref: 'EVT-2026-1977',
  title: 'Your Naming · 5 Sept 2026',
  description:
    'MAHENDRA EVENTS is managing every vendor. Review the plan, approve your invitation, and track progress — all in one workspace.',
  progress: 25,
  daysToGo: 8,
  status: 'confirmed',
  organizerConfirmed: true,
  organizerName: 'MAHENDRA EVENTS',
  steps: [
    { label: 'Organizer booked', done: true },
    { label: 'Vendors locked', done: false },
    { label: 'Invitation', done: false },
    { label: 'Final walkthrough', done: false },
  ],
};

const awaiting: BookedEventViewModel = {
  ...booked,
  status: 'awaiting_organizer',
  organizerConfirmed: false,
  description: 'MAHENDRA EVENTS has your booking and will confirm it shortly.',
  daysToGo: 1,
};

const underway: BookedEventViewModel = {
  ...booked,
  status: 'in_progress',
  progress: 100,
  daysToGo: 0,
  steps: booked.steps.map((s) => ({ ...s, done: true })),
};

function render(node: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(node);
  });
  return tree;
}

function textOf(tree: ReactTestRenderer.ReactTestRenderer): string[] {
  const out: string[] = [];
  const walk = (n: any) => {
    if (n == null) {
      return;
    }
    if (typeof n === 'string') {
      if (!n.startsWith(' icon:')) {
        out.push(n);
      }
      return;
    }
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    walk(n.children);
  };
  walk(tree.toJSON());
  return out;
}

/**
 * Nodes in the *rendered host tree*. `root.findAll` also matches the composite
 * wrappers around each host element, so counting with it reports one control
 * as several — this walks what actually gets drawn.
 */
function hosts(tree: ReactTestRenderer.ReactTestRenderer, pred: (props: any) => boolean): any[] {
  const out: any[] = [];
  const walk = (n: any) => {
    if (n == null || typeof n === 'string') {
      return;
    }
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (n.props && pred(n.props)) {
      out.push(n);
    }
    walk(n.children);
  };
  walk(tree.toJSON());
  return out;
}

const noop = () => {};

describe('BookedEventCard', () => {
  it('shows the reference, title, copy and countdown the backend composed', () => {
    const text = textOf(render(<BookedEventCard data={booked} onPress={noop} />)).join('|');

    expect(text).toContain('EVT-2026-1977');
    expect(text).toContain('Your Naming · 5 Sept 2026');
    expect(text).toContain('MAHENDRA EVENTS is managing every vendor.');
    expect(text).toContain('8');
    expect(text).toContain('days to go');
    expect(text).toContain('Open workspace');
  });

  it('draws the ring at exactly the progress the milestones report', () => {
    const tree = render(<BookedEventCard data={booked} onPress={noop} />);
    const arcs = hosts(tree, (p) => p.strokeDashoffset !== undefined);
    expect(arcs).toHaveLength(1);

    // 25% done => three quarters of the circumference still dashed off.
    expect(arcs[0].props.strokeDashoffset).toBeCloseTo(BOOKED_RING_CIRCUMFERENCE * 0.75, 5);

    const doneCount = booked.steps.filter((s) => s.done).length;
    expect(Math.round((doneCount / booked.steps.length) * 100)).toBe(booked.progress);
  });

  it('still reads BOOKED before the organizer has confirmed', () => {
    // The customer has chosen an organizer and paid; what is outstanding is the
    // organizer's acceptance, which the sub-line states outright.
    const text = textOf(render(<BookedEventCard data={awaiting} onPress={noop} />)).join('|');
    expect(text).toContain('BOOKED');
    expect(text).toContain('will confirm it shortly');
    expect(text).toContain('day to go');
    expect(text).not.toContain('days to go');
  });

  it('switches the badge once the event is underway', () => {
    expect(textOf(render(<BookedEventCard data={underway} onPress={noop} />)).join('|')).toContain('IN PROGRESS');
  });

  it('is a single tap target that opens the workspace', () => {
    const onPress = jest.fn();
    const tree = render(<BookedEventCard data={booked} onPress={onPress} />);

    // One control, one accessible name — the "Open workspace" pill is
    // presentational, not a nested button.
    const drawn = hosts(tree, (p) => p.accessibilityRole === 'button');
    expect(drawn).toHaveLength(1);
    expect(drawn[0].props.accessibilityLabel).toContain('25% ready');

    ReactTestRenderer.act(() =>
      tree.root.findAllByProps({ accessibilityRole: 'button' })[0].props.onPress(),
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('mapBookedEvent', () => {
  const feed = (booking: unknown) => ({ booking } as unknown as HomeFeedDTO);

  it('refuses to draw a booking with no reference or title', () => {
    expect(mapBookedEvent(feed(null))).toBeNull();
    expect(mapBookedEvent(feed({ ref: '', title: 'Your Naming' }))).toBeNull();
    expect(mapBookedEvent(feed({ ref: 'EVT-1', title: '' }))).toBeNull();
  });

  it('refuses to draw a booking it could not open', () => {
    // The card's whole action is opening this booking's workspace, which is
    // keyed by id — a record without one would render a button to nowhere.
    expect(mapBookedEvent(feed({ ref: 'EVT-1', title: 'T', progress: 1, daysToGo: 1, steps: [] }))).toBeNull();
    expect(
      mapBookedEvent(feed({ id: 'b', ref: 'EVT-1', title: 'T', progress: 1, daysToGo: 1, steps: [] })),
    ).not.toBeNull();
  });

  it('drops milestones with no label rather than drawing blank chips', () => {
    const vm = mapBookedEvent(
      feed({
        id: 'b',
        ref: 'EVT-1',
        title: 'Your Naming',
        progress: 50,
        daysToGo: 3,
        status: 'confirmed',
        steps: [{ label: 'Organizer booked', done: true }, { label: '', done: false }, {}],
      }),
    );
    expect(vm?.steps).toEqual([{ label: 'Organizer booked', done: true }]);
  });

  it('clamps a nonsense progress instead of drawing an impossible ring', () => {
    const of = (progress: unknown) =>
      mapBookedEvent(feed({ id: 'b', ref: 'EVT-1', title: 'T', progress, daysToGo: 1, steps: [] }))?.progress;

    expect(of(140)).toBe(100);
    expect(of(-5)).toBe(0);
    expect(of('nope')).toBe(0);
  });

  it('treats a record predating organizerConfirmed as confirmed', () => {
    // Claiming "awaiting confirmation" for an old row would be a scarier
    // statement than the truth.
    const vm = mapBookedEvent(feed({ id: 'b', ref: 'EVT-1', title: 'T', progress: 10, daysToGo: 1, steps: [] }));
    expect(vm?.organizerConfirmed).toBe(true);
    expect(vm?.organizerName).toBe('Your organizer');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) {
      return;
    }

    const states: Array<[string, BookedEventViewModel]> = [
      ['Confirmed - one milestone done', booked],
      ['Paid, organizer has not accepted yet', awaiting],
      ['Event underway', underway],
    ];

    const panels: Array<[string, string]> = states.map(([label, data]) => [
      label,
      toHtml(render(<BookedEventCard data={data} onPress={noop} />).toJSON()),
    ]);

    // The card sits on the Home screen's white background, full-bleed to the
    // phone's edges, so the review panel has no padding of its own.
    fs.writeFileSync(
      out,
      page(panels, { title: 'BookedEventCard', width: 390, background: '#fff', padding: 0 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
