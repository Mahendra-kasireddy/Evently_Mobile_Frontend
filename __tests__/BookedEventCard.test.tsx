/**
 * @format
 *
 * Home's ongoing-booking card.
 *
 * The card's one hard rule is that the bar and the dots under it always tell
 * the same story: `progress` is the backend's count of completed milestones,
 * and the card renders it rather than deriving a second, different number.
 *
 * The rest is about not saying things the booking cannot back — no headcount
 * for a booking that came from no brief, no vendor count before anyone is
 * assigned, no message button where there is no organizer to message.
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
import { bookedEventStyles } from '../src/modules/Home/styles';
import type { BookedEventViewModel, HomeFeedDTO } from '../src/modules/Home/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

/** A whole booking as the server sends it, so the mapper is exercised too. */
const dto = (over: Record<string, unknown> = {}) => ({
  id: 'bk1',
  ref: 'EVT-2026-1977',
  title: 'Naming ceremony',
  description: 'Mahendra Events is managing every vendor.',
  dateLabel: '5 Sep 2026',
  location: 'Kukatpally',
  guests: '150',
  progress: 25,
  daysToGo: 3,
  status: 'confirmed',
  organizerConfirmed: true,
  organizerName: 'Mahendra Events',
  organizerId: 'org1',
  organizerInitials: 'ME',
  organizerAvatarColor: '#1a2e5a',
  vendorCount: 6,
  steps: [
    { label: 'Organizer booked', done: true },
    { label: 'Vendors locked', done: false },
    { label: 'Invitation', done: false },
    { label: 'Final walkthrough', done: false },
  ],
  ...over,
});

const feed = (booking: unknown) => ({ booking } as unknown as HomeFeedDTO);
const model = (over: Record<string, unknown> = {}): BookedEventViewModel =>
  mapBookedEvent(feed(dto(over)))!;

const booked = model();
const awaiting = model({
  status: 'awaiting_organizer',
  organizerConfirmed: false,
  vendorCount: 0,
  daysToGo: 1,
});
const underway = model({
  status: 'in_progress',
  progress: 100,
  daysToGo: 0,
  vendorCount: 9,
  steps: [
    { label: 'Organizer booked', done: true },
    { label: 'Vendors locked', done: true },
    { label: 'Invitation', done: true },
    { label: 'Final walkthrough', done: true },
  ],
});

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
  return out.join('|');
}

/** Every style object the tree actually applied, flattened. */
function stylesOf(tree: ReactTestRenderer.ReactTestRenderer): any[] {
  const out: any[] = [];
  const walk = (n: any) => {
    if (n == null || typeof n === 'string') return;
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (n.props?.style) out.push(Object.assign({}, ...[n.props.style].flat(4).filter(Boolean)));
    walk(n.children);
  };
  walk(tree.toJSON());
  return out;
}

/**
 * The card's real controls, with callable handlers.
 *
 * The rendered host node for a TouchableOpacity carries responder props rather
 * than `onPress`, so the handler is read from the composite instead — deduped
 * by identity, because one composite yields several matching host nodes.
 */
function pressables(tree: ReactTestRenderer.ReactTestRenderer) {
  const seen = new Set<unknown>();
  return tree.root
    .findAllByProps({ accessibilityRole: 'button' })
    .filter((node) => typeof node.props.onPress === 'function')
    .filter((node) => (seen.has(node.props.onPress) ? false : seen.add(node.props.onPress)));
}

const noop = () => {};

describe('BookedEventCard', () => {
  it('states the booking, the event and the countdown', () => {
    const text = textOf(render(<BookedEventCard data={booked} onPress={noop} />));

    expect(text).toContain('BOOKED');
    expect(text).toContain('EVT-2026-1977');
    expect(text).toContain('Naming ceremony');
    expect(text).toContain('5 Sep 2026 · Kukatpally · 150 guests');
    expect(text).toContain('3');
    expect(text).toContain('days to go');
    expect(text).toContain('Open workspace');
  });

  it('names the organizer and what they are doing', () => {
    const text = textOf(render(<BookedEventCard data={booked} onPress={noop} />));
    expect(text).toContain('Mahendra Events');
    expect(text).toContain('ME');
    expect(text).toContain('Managing 6 vendors for you');
  });

  it('draws the bar at exactly the progress the milestones report', () => {
    const tree = render(<BookedEventCard data={booked} onPress={noop} />);
    const fill = stylesOf(tree).find(
      (s) => s.backgroundColor === bookedEventStyles.fill.backgroundColor && s.width !== undefined,
    );
    expect(fill.width).toBe('25%');

    // …and the count beside it agrees, from the same milestones.
    expect(textOf(tree)).toContain('1 of 4 steps done');
    const done = booked.steps.filter((s) => s.done).length;
    expect(Math.round((done / booked.steps.length) * 100)).toBe(booked.progress);
  });

  it('marks the next milestone, not just the finished ones', () => {
    // Done / next / not yet, told apart by the dot and the label together —
    // the whole point of the row is showing what happens next.
    const tree = render(<BookedEventCard data={booked} onPress={noop} />);
    const dots = stylesOf(tree).filter((s) => s.borderRadius === 999 && s.width === 8);
    expect(dots).toHaveLength(4);
    expect(dots[0].backgroundColor).toBe(bookedEventStyles.stepDotDone.backgroundColor);
    expect(dots[1].backgroundColor).toBe(bookedEventStyles.stepDotNext.backgroundColor);
    expect(dots[2].backgroundColor).toBe(bookedEventStyles.stepDot.backgroundColor);
  });

  it('marks nothing as next once everything is done', () => {
    const tree = render(<BookedEventCard data={underway} onPress={noop} />);
    const dots = stylesOf(tree).filter((s) => s.borderRadius === 999 && s.width === 8);
    expect(dots.every((d) => d.backgroundColor === bookedEventStyles.stepDotDone.backgroundColor)).toBe(
      true,
    );
  });

  it('still reads BOOKED before the organizer has confirmed', () => {
    // The customer has chosen an organizer and paid; what is outstanding is the
    // organizer's acceptance, which the organizer line states outright.
    const text = textOf(render(<BookedEventCard data={awaiting} onPress={noop} />));
    expect(text).toContain('BOOKED');
    expect(text).toContain('Confirming your booking');
    expect(text).toContain('day to go');
    expect(text).not.toContain('days to go');
  });

  it('switches the badge once the event is underway, and drops the units on the day', () => {
    const text = textOf(render(<BookedEventCard data={underway} onPress={noop} />));
    expect(text).toContain('IN PROGRESS');
    expect(text).toContain('Today');
    // A countdown of nothing does not need the units it is not counting.
    expect(text).not.toContain('days to go');
  });

  it('opens the workspace, and the organizer thread separately', () => {
    const onPress = jest.fn();
    const onMessage = jest.fn();
    const tree = render(
      <BookedEventCard data={booked} onPress={onPress} onMessageOrganizer={onMessage} />,
    );

    const drawn = pressables(tree);
    expect(drawn).toHaveLength(2);

    const message = drawn.find((n) => n.props.accessibilityLabel.startsWith('Message'))!;
    const workspace = drawn.find((n) => n.props.accessibilityLabel.startsWith('Open workspace'))!;
    expect(message.props.accessibilityLabel).toBe('Message Mahendra Events');

    ReactTestRenderer.act(() => message.props.onPress());
    ReactTestRenderer.act(() => workspace.props.onPress());
    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('offers no message button when there is no organizer to message', () => {
    // A button that fails on tap is worse than no button.
    const tree = render(<BookedEventCard data={booked} onPress={noop} />);
    expect(pressables(tree)).toHaveLength(1);
  });
});

describe('mapBookedEvent', () => {
  it('refuses to draw a booking with no reference or title', () => {
    expect(mapBookedEvent(feed(null))).toBeNull();
    expect(mapBookedEvent(feed(dto({ ref: '' })))).toBeNull();
    expect(mapBookedEvent(feed(dto({ title: '' })))).toBeNull();
  });

  it('refuses to draw a booking it could not open', () => {
    // The card's main action is opening this booking's workspace, which is
    // keyed by id — a record without one would render a button to nowhere.
    expect(mapBookedEvent(feed(dto({ id: '' })))).toBeNull();
    expect(mapBookedEvent(feed(dto()))).not.toBeNull();
  });

  it('states only the facts the booking holds', () => {
    // A booking that came from no brief has no headcount, and a line reading
    // "5 Sep 2026 · Kukatpally · guests" is worse than one that stops early.
    expect(model({ guests: '' }).factsLine).toBe('5 Sep 2026 · Kukatpally');
    expect(model({ guests: '', location: '' }).factsLine).toBe('5 Sep 2026');
    expect(model({ guests: '', location: '', dateLabel: '' }).factsLine).toBe('');
  });

  it('will not say "managing 0 vendors"', () => {
    // A fresh booking has no tasks; quoting a count of none is the kind of
    // line that makes a customer stop believing the rest of the card.
    expect(model({ vendorCount: 0 }).organizerNote).toBe('Managing your event');
    expect(model({ vendorCount: 1 }).organizerNote).toBe('Managing 1 vendor for you');
    expect(model({ vendorCount: 6 }).organizerNote).toBe('Managing 6 vendors for you');
  });

  it('says what is true before the organizer has accepted', () => {
    expect(model({ organizerConfirmed: false, vendorCount: 4 }).organizerNote).toBe(
      'Confirming your booking',
    );
  });

  it('counts the steps done the same way the bar measures them', () => {
    expect(booked.stepsDoneLabel).toBe('1 of 4 steps done');
    expect(underway.stepsDoneLabel).toBe('4 of 4 steps done');
  });

  it('drops milestones with no label rather than drawing blank dots', () => {
    const vm = model({
      steps: [{ label: 'Organizer booked', done: true }, { label: '', done: false }, {}],
    });
    expect(vm.steps).toEqual([{ label: 'Organizer booked', done: true }]);
  });

  it('clamps a nonsense progress instead of drawing an impossible bar', () => {
    expect(model({ progress: 140 }).progress).toBe(100);
    expect(model({ progress: -5 }).progress).toBe(0);
    expect(model({ progress: 'nope' }).progress).toBe(0);
  });

  it('falls back to initials it can derive when the server sent none', () => {
    expect(model({ organizerInitials: '' }).organizerInitials).toBe('ME');
    expect(model({ organizerInitials: '', organizerName: 'Sruthi' }).organizerInitials).toBe('SR');
  });

  it('treats a record predating organizerConfirmed as confirmed', () => {
    // Claiming "awaiting confirmation" for an old row would be a scarier
    // statement than the truth.
    const vm = mapBookedEvent(
      feed({ id: 'b', ref: 'EVT-1', title: 'T', progress: 10, daysToGo: 1, steps: [] }),
    );
    expect(vm?.organizerConfirmed).toBe(true);
    expect(vm?.organizerName).toBe('Your organizer');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const states: Array<[string, BookedEventViewModel]> = [
      ['Confirmed — one milestone done', booked],
      ['Paid, organizer has not accepted yet', awaiting],
      ['Event underway', underway],
    ];

    const panels: Array<[string, string]> = states.map(([label, data]) => [
      label,
      toHtml(
        render(
          <BookedEventCard data={data} onPress={noop} onMessageOrganizer={noop} />,
        ).toJSON(),
      ),
    ]);

    // The card sits on the Home screen's canvas, full-bleed to the phone's
    // edges, so the review panel has no padding of its own.
    fs.writeFileSync(
      out,
      page(panels, { title: 'BookedEventCard', width: 390, background: '#faf8f7', padding: 0 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
