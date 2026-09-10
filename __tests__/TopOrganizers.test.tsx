/**
 * @format
 *
 * Behavioural tests for Home's "Top organizers near you" section.
 *
 * The rule that matters here is that the card cannot flatter an organizer: the
 * stars it draws are the rating the organizer has actually earned, and a
 * heading that says "near you" only stands when the results really are local.
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
import { TopOrganizers } from '../src/modules/Home/sections/TopOrganizers';
import { mapTopOrganizers } from '../src/modules/Home/utils';
import type { HomeFeedDTO, OrganizerItem, TopOrganizersViewModel } from '../src/modules/Home/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const newcomer: OrganizerItem = {
  id: 'o1',
  name: 'MAHENDRA EVENTS',
  initials: 'ME',
  avatarColor: '#7C5CE6',
  tier: 'Silver',
  rating: 0,
  reviews: 0,
  events: 0,
  tags: [],
  fromLabel: '₹7L',
  repliesLabel: 'Replies in 1h',
  bookedLabel: '19 booked this month',
};

const established: OrganizerItem = {
  id: 'o2',
  name: 'Sunrise Weddings',
  initials: 'SW',
  avatarColor: '#1a2e5a',
  tier: 'Gold',
  rating: 4.6,
  reviews: 128,
  events: 74,
  tags: [],
  fromLabel: '₹7L',
  repliesLabel: 'Replies in 1h',
  bookedLabel: '19 booked this month',
};

const section = (over: Partial<TopOrganizersViewModel> = {}): TopOrganizersViewModel => ({
  title: 'Organizers near you',
  scopeNote: '',
  items: [newcomer],
  scope: 'city',
  city: 'Hyderabad',
  ...over,
});

const base = {
  onPressOrganizer: () => {},
  onPressSeeAll: () => {},
  onPressChangeCity: () => {},
};

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

describe('TopOrganizers', () => {
  it('says an organizer has no reviews rather than drawing a rating', () => {
    // The web card renders five filled stars unconditionally, so a brand-new
    // organizer reads as a five-star business beside the text "0 (0)".
    const tree = render(<TopOrganizers {...base} data={section()} />);

    expect(iconsOf(tree).filter((n) => n === 'star')).toHaveLength(0);
    expect(textOf(tree).join('')).toContain('No reviews yet');
  });

  it('shows a real rating with the reviews behind it', () => {
    const tree = render(<TopOrganizers {...base} data={section({ items: [established] })} />);

    expect(iconsOf(tree).filter((n) => n === 'star')).toHaveLength(1);
    // Joined without a separator: React splits an interpolated string into
    // several text children, so the rendered line only reads back whole here.
    const line = textOf(tree).join('');
    expect(line).toContain('4.6');
    expect(line).toContain('(128)');
  });

  it('drops a figure the organizer has not published', () => {
    const bare = { ...established, fromLabel: '', repliesLabel: '', bookedLabel: '' };
    const line = textOf(render(<TopOrganizers {...base} data={section({ items: [bare] })} />)).join('');

    // "FROM ₹0" and "Replies in 0h" are worse than saying nothing.
    expect(line).not.toContain('From');
    expect(line).not.toContain('Replies in');
    expect(line).not.toContain('booked this month');
  });

  it('is one tap target per organizer, opening their profile', () => {
    const onPressOrganizer = jest.fn();
    const tree = render(
      <TopOrganizers
        {...base}
        data={section({ items: [newcomer, established] })}
        onPressOrganizer={onPressOrganizer}
      />,
    );

    const row = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find(
        (n) =>
          typeof n.props.onPress === 'function' &&
          typeof n.props.accessibilityLabel === 'string' &&
          n.props.accessibilityLabel.startsWith('Sunrise Weddings'),
      );
    expect(row).toBeDefined();

    ReactTestRenderer.act(() => row!.props.onPress());
    expect(onPressOrganizer).toHaveBeenCalledWith('o2');
  });

  it('offers a way forward instead of a heading with nothing under it', () => {
    const text = textOf(render(<TopOrganizers {...base} data={section({ items: [] })} />)).join('');
    expect(text).toContain('No organizers listed for Hyderabad yet');
  });

  it('says so when the organizers are not actually nearby', () => {
    const local = textOf(render(<TopOrganizers {...base} data={section()} />)).join('');
    expect(local).toContain('Organizers near you');
    expect(local).not.toContain('serve other cities');

    const distant = textOf(
      render(
        <TopOrganizers
          {...base}
          data={section({
            title: 'Organizers on Evently',
            scopeNote: 'No organizers listed in Hyderabad yet — these serve other cities. Change your city.',
          })}
        />,
      ),
    ).join('');
    expect(distant).toContain('No organizers listed in Hyderabad yet');
  });
});

describe('mapTopOrganizers', () => {
  const feed = (over: Record<string, unknown>) =>
    ({ topOrganizers: [], ...over } as unknown as HomeFeedDTO);

  it('hides the section entirely when there are no organizers', () => {
    expect(mapTopOrganizers(feed({}))).toBeNull();
  });

  it('caveats a payload that never claimed the results were local', () => {
    // An older backend sends no scope; assuming 'city' would make the heading
    // assert a locality nothing verified.
    const vm = mapTopOrganizers(feed({ topOrganizers: [{ id: 'o1', tags: [] }] }));
    expect(vm?.scope).toBe('all');
    // And it says so in words rather than heading the list "near you".
    expect(vm?.title).not.toContain('near you');
    expect(vm?.scopeNote).not.toBe('');
  });

  it('does not invent a rating, review count or event count', () => {
    const vm = mapTopOrganizers(
      feed({ topOrganizers: [{ id: 'o1', name: 'X', rating: undefined, reviews: null, events: 'many' }] }),
    );
    expect(vm?.items[0]).toMatchObject({ rating: 0, reviews: 0, events: 0, tags: [] });
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) {
      return;
    }

    const states: Array<[string, React.ReactElement]> = [
      ['New organizer, no reviews yet', <TopOrganizers {...base} data={section()} />],
      [
        'Established organizer',
        <TopOrganizers {...base} data={section({ items: [established] })} />,
      ],
      [
        'Results are not actually local',
        <TopOrganizers
          {...base}
          data={section({
            items: [established],
            scope: 'all',
            title: 'Organizers on Evently',
            scopeNote:
              'No organizers listed in Hyderabad yet — these serve other cities. Change your city.',
          })}
        />,
      ],
      ['No organizers at all', <TopOrganizers {...base} data={section({ items: [] })} />],
    ];

    const panels: Array<[string, string]> = states.map(([label, el]) => [label, toHtml(render(el).toJSON())]);

    fs.writeFileSync(
      out,
      page(panels, { title: 'TopOrganizers', width: 390, background: '#faf8f7', padding: 0 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
