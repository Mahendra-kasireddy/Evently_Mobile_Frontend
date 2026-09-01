/**
 * @format
 *
 * Behavioural tests for the card that floats at the foot of the Home hero.
 *
 * Its whole point is that it shows the signed-in customer's own event, so the
 * assertions here are mostly about what it must NOT do: present the shared
 * planner defaults as the customer's answers, or invent a date, a place or a
 * headcount the underlying record does not carry.
 *
 * Setting EVENTLY_RENDER_OUT=<path> additionally writes an HTML rendering of
 * every state to that path, built from the component's real resolved styles,
 * so the layout can be reviewed visually without a device.
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
import { EventSummaryCard } from '../src/modules/Home/sections/EventSummaryCard';
import type { CurrentEventViewModel, HeroDraft } from '../src/modules/Home/types';

// This project has no @types/node, and adding it for one optional debug path
// is not worth a dependency — declare only what this file touches.
declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const noop = () => {};

const fullEvent: CurrentEventViewModel = {
  title: "Meera & Arjun's Reception",
  occasion: 'Reception',
  when: '12 December 2026',
  where: 'Banjara Hills, Hyderabad',
  guests: '450',
  progress: 60,
  daysToGo: 74,
  stage: 'booking_created',
  source: 'booking',
};

// An older booking raised outside the quote flow: a fixed date and venue, but
// no originating brief to read a headcount from.
const partialEvent: CurrentEventViewModel = {
  ...fullEvent,
  occasion: '',
  guests: '',
  daysToGo: null,
  progress: 25,
  stage: 'submitted',
  source: 'quote',
};

// The planner's starting selection — the same values for every account.
const seedDraft: HeroDraft = { occasion: 'Wedding', when: '28 Dec', where: 'Hyderabad', guests: '300' };

function render(node: React.ReactElement) {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(node);
  });
  return tree;
}

function collect(tree: ReactTestRenderer.ReactTestRenderer, wantIcons: boolean): string[] {
  const out: string[] = [];
  const walk = (n: any) => {
    if (n == null) {
      return;
    }
    if (typeof n === 'string') {
      const isIcon = n.startsWith(' icon:');
      if (isIcon === wantIcons) {
        out.push(isIcon ? n.slice(' icon:'.length) : n);
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

const textOf = (t: ReactTestRenderer.ReactTestRenderer) => collect(t, false);
const iconsOf = (t: ReactTestRenderer.ReactTestRenderer) => collect(t, true);

const base = {
  draft: null,
  label: 'Your event',
  isLoading: false,
  errorMessage: null,
  isSubmitting: false,
  onPressEvent: noop,
  onEditDraft: noop,
  onSubmitDraft: noop,
  onRetry: noop,
};

describe('EventSummaryCard', () => {
  it('shows the four facts from the customer own event', () => {
    const text = textOf(render(<EventSummaryCard {...base} event={fullEvent} />)).join('|');

    expect(text).toContain('Reception');
    expect(text).toContain('12 December 2026');
    expect(text).toContain('Banjara Hills, Hyderabad');
    expect(text).toContain('450 guests');
  });

  it('lets a real event win over the planner draft', () => {
    const text = textOf(render(<EventSummaryCard {...base} event={fullEvent} draft={seedDraft} />)).join('|');

    // Once the customer has a record of their own, the shared starting
    // selection must not appear anywhere in the card.
    expect(text).not.toContain('28 Dec');
    expect(text).not.toContain('300 guests');
    expect(text).toContain('12 December 2026');
  });

  it('never substitutes anything for a value the record does not carry', () => {
    const text = textOf(render(<EventSummaryCard {...base} event={partialEvent} draft={seedDraft} />)).join('|');

    expect(text).not.toContain('300 guests');
    expect(text).toContain('Guest count not set');
    // occasion is blank here, so it falls back to the event's own title.
    expect(text).toContain("Meera & Arjun's Reception");
  });

  it('points the chevrons where the row actually goes', () => {
    // A real event: the row leaves for the event.
    const real = iconsOf(render(<EventSummaryCard {...base} event={fullEvent} />));
    expect(real.filter((n) => n === 'chevron-right')).toHaveLength(5); // 4 rows + the action
    expect(real.filter((n) => n === 'chevron-down')).toHaveLength(0);

    // A draft: the row opens that field's picker in place.
    const drafted = iconsOf(render(<EventSummaryCard {...base} event={null} draft={seedDraft} />));
    expect(drafted.filter((n) => n === 'chevron-down')).toHaveLength(4);
  });

  it('opens the picker for the row that was tapped', () => {
    const onEditDraft = jest.fn();
    const tree = render(<EventSummaryCard {...base} event={null} draft={seedDraft} onEditDraft={onEditDraft} />);

    const rows = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .filter((n) => typeof n.props.accessibilityLabel === 'string' && n.props.accessibilityLabel.startsWith('Where'));
    expect(rows.length).toBeGreaterThan(0);

    ReactTestRenderer.act(() => rows[0].props.onPress());
    expect(onEditDraft).toHaveBeenCalledWith('where');
  });

  it('names the destination the action actually opens', () => {
    expect(textOf(render(<EventSummaryCard {...base} event={fullEvent} />)).join('|')).toContain('View booking');
    expect(textOf(render(<EventSummaryCard {...base} event={partialEvent} />)).join('|')).toContain('Review your plan');
    expect(
      textOf(render(<EventSummaryCard {...base} event={{ ...fullEvent, source: 'plan' }} />)).join('|'),
    ).toContain('Continue planning');
    expect(textOf(render(<EventSummaryCard {...base} event={null} draft={seedDraft} />)).join('|')).toContain(
      'Get quotes',
    );
  });

  it('shows placeholders while loading and a retry after a failure', () => {
    expect(textOf(render(<EventSummaryCard {...base} event={null} isLoading />)).join('|')).not.toContain('Occasion');

    const text = textOf(
      render(<EventSummaryCard {...base} event={null} errorMessage="Network request failed" />),
    ).join('|');
    expect(text).toContain("Couldn't load your event");
    expect(text).toContain('Network request failed');
    expect(text).toContain('Try again');
  });

  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) {
      return;
    }

    const states: Array<[string, React.ReactElement]> = [
      ['Real event - every field present', <EventSummaryCard {...base} event={fullEvent} />],
      ['Real event - record has no guest count', <EventSummaryCard {...base} event={partialEvent} />],
      ['No event yet - the planner draft', <EventSummaryCard {...base} event={null} draft={seedDraft} />],
      ['Sending the draft', <EventSummaryCard {...base} event={null} draft={seedDraft} isSubmitting />],
      ['Loading', <EventSummaryCard {...base} event={null} isLoading />],
      ['Failed to load', <EventSummaryCard {...base} event={null} errorMessage="Network request failed" />],
    ];

    const panels: Array<[string, string]> = states.map(([label, el]) => [label, toHtml(render(el).toJSON())]);

    // The card lives on the navy hero, so the review panel matches it.
    fs.writeFileSync(
      out,
      page(panels, { title: 'EventSummaryCard', width: 342, background: '#0e1a33' }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
