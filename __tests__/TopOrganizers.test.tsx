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
  tags: ['Weddings', 'Catering'],
};

const section = (over: Partial<TopOrganizersViewModel> = {}): TopOrganizersViewModel => ({
  title: 'Top organizers near you',
  items: [newcomer],
  scope: 'city',
  city: 'Hyderabad',
  ...over,
});

const base = {
  onPressProfile: () => {},
  onPressQuote: () => {},
  requestedIds: [] as string[],
  requestingId: null,
  requestErrorMessage: null,
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
  it('draws no filled stars for an organizer with no reviews', () => {
    // The web card renders five filled stars unconditionally, so a brand-new
    // organizer reads as a five-star business beside the text "0 (0)".
    const tree = render(<TopOrganizers {...base} data={section()} />);

    expect(iconsOf(tree).filter((n) => n === 'star')).toHaveLength(0);
    expect(textOf(tree).join('|')).toContain('No reviews yet');
  });

  it('fills only the stars a real rating has earned', () => {
    const tree = render(<TopOrganizers {...base} data={section({ items: [established] })} />);
    const stars = iconsOf(tree);

    expect(stars.filter((n) => n === 'star')).toHaveLength(5); // 4.6 rounds to 5
    // Joined without a separator: React splits an interpolated string into
    // several text children, so the rendered line only reads back whole here.
    const line = textOf(tree).join('');
    expect(line).toContain('4.6');
    expect(line).toContain('(128) · 74 events');
  });

  it('rounds a middling rating rather than always filling the row', () => {
    const tree = render(
      <TopOrganizers {...base} data={section({ items: [{ ...established, rating: 3.2 }] })} />,
    );
    const stars = iconsOf(tree);

    expect(stars.filter((n) => n === 'star')).toHaveLength(3);
    expect(stars.filter((n) => n === 'star-outline')).toHaveLength(2);
  });

  it('says so when the organizers are not actually nearby', () => {
    const local = textOf(render(<TopOrganizers {...base} data={section({ scope: 'city' })} />)).join('|');
    expect(local).not.toContain('showing highly-rated organizers');

    const distant = textOf(render(<TopOrganizers {...base} data={section({ scope: 'all' })} />)).join('|');
    expect(distant).toContain('No organizers in Hyderabad yet');
  });

  it('offers a way forward instead of an empty list under a "near you" heading', () => {
    const tree = render(<TopOrganizers {...base} data={section({ items: [] })} />);
    const text = textOf(tree).join('|');

    expect(text).toContain('Looking for organizers in your area?');
    expect(text).toContain('Change city');
  });

  it('sends the quote request for the organizer whose button was pressed', () => {
    const onPressQuote = jest.fn();
    const tree = render(
      <TopOrganizers
        {...base}
        data={section({ items: [newcomer, established] })}
        onPressQuote={onPressQuote}
      />,
    );

    const button = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((n) => n.props.accessibilityLabel === 'Get quote from Sunrise Weddings');
    expect(button).toBeDefined();

    ReactTestRenderer.act(() => button!.props.onPress());
    expect(onPressQuote).toHaveBeenCalledWith('o2');
  });

  it('replaces the actions with a receipt once a request has gone out', () => {
    const tree = render(<TopOrganizers {...base} data={section()} requestedIds={['o1']} />);
    const text = textOf(tree).join('|');

    expect(text).toContain('Request sent');
    expect(text).not.toContain('Get quote');
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
        <TopOrganizers {...base} data={section({ items: [established], scope: 'all' })} />,
      ],
      ['Request sent', <TopOrganizers {...base} data={section()} requestedIds={['o1']} />],
      ['No organizers at all', <TopOrganizers {...base} data={section({ items: [] })} />],
    ];

    const panels: Array<[string, string]> = states.map(([label, el]) => [label, toHtml(render(el).toJSON())]);

    fs.writeFileSync(
      out,
      page(panels, { title: 'TopOrganizers', width: 390, background: '#fff', padding: 0 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
