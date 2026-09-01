/**
 * @format
 *
 * Behavioural tests for Home's "Curated packages by budget" section.
 */

import React from 'react';
import { Dimensions } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, size, color }: { name: string; size?: number; color?: string }) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});

import { page, toHtml } from '../test-utils/rn-to-html';
import { Packages } from '../src/modules/Home/sections/Packages';
import { mapPackages } from '../src/modules/Home/utils';
import { PACKAGE_SNAP_INTERVAL } from '../src/modules/Home/styles';
import type { HomeFeedDTO, PackageItem, PackagesViewModel } from '../src/modules/Home/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const birthday: PackageItem = {
  id: 'p1',
  badge: 'Budget pick',
  title: 'Birthday Bash',
  guests: '50–100 guests',
  budget: '₹40K – 80K',
  tags: ['Decor', 'Cake', 'Entertainment'],
  art: 'birthday',
};

const wedding: PackageItem = {
  id: 'p2',
  badge: 'Most booked',
  title: 'Classic Wedding',
  guests: '300–500 guests',
  budget: '₹8L – 14L',
  tags: ['Venue', 'Catering', 'Photography', 'Decor'],
  art: 'wedding',
};

const section = (over: Partial<PackagesViewModel> = {}): PackagesViewModel => ({
  title: 'Curated packages by budget',
  subtitle: 'Pre-matched bundles to kick-start your planning — fully customisable.',
  buildLabel: 'Build your own',
  items: [birthday],
  ...over,
});

const base = { onPressPackage: () => {}, onPressBuildYourOwn: () => {} };

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

/** Style arrays are only comparable once merged the way RN merges them. */
function flatten(style: any, into: Record<string, any> = {}): Record<string, any> {
  if (!style) {
    return into;
  }
  if (Array.isArray(style)) {
    style.forEach((one) => flatten(one, into));
    return into;
  }
  Object.assign(into, style);
  return into;
}

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

describe('Packages', () => {
  it('shows the badge, title, guests, budget and every tag', () => {
    const text = textOf(render(<Packages {...base} data={section()} />)).join('|');

    expect(text).toContain('Budget pick');
    expect(text).toContain('Birthday Bash');
    expect(text).toContain('50–100 guests');
    expect(text).toContain('₹40K – 80K');
    expect(text).toContain('Decor');
    expect(text).toContain('Cake');
    expect(text).toContain('Entertainment');
    expect(text).toContain('Explore package');
  });

  it('gives each card its own gradient id', () => {
    // A shared SVG id would make every banner on the screen paint whichever
    // gradient rendered last.
    const tree = render(<Packages {...base} data={section({ items: [birthday, wedding] })} />);
    const ids = hosts(tree, (p) => typeof p.name === 'string' && p.name.startsWith('packageBanner')).map(
      (n) => n.props.name,
    );

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThan(0);
  });

  it('opens the planner for the package that was tapped', () => {
    const onPressPackage = jest.fn();
    const tree = render(
      <Packages {...base} data={section({ items: [birthday, wedding] })} onPressPackage={onPressPackage} />,
    );

    const card = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((n) => String(n.props.accessibilityLabel).startsWith('Classic Wedding'));
    expect(card).toBeDefined();

    ReactTestRenderer.act(() => card!.props.onPress());
    expect(onPressPackage).toHaveBeenCalledWith(wedding);
  });

  it('is one tap target per card, not a card plus a nested button', () => {
    const tree = render(<Packages {...base} data={section()} />);
    // The card itself, plus the section's "Build your own".
    expect(hosts(tree, (p) => p.accessibilityRole === 'button')).toHaveLength(2);
  });

  it('scrolls horizontally and tracks which card is showing', () => {
    const tree = render(<Packages {...base} data={section({ items: [birthday, wedding] })} />);

    const list = tree.root.findAllByProps({ horizontal: true })[0];
    expect(list).toBeDefined();
    expect(list.props.snapToInterval).toBe(PACKAGE_SNAP_INTERVAL);

    // One dot per package, the first active.
    const dots = () => hosts(tree, (p) => flatten(p.style).width === 6 || flatten(p.style).width === 18);
    expect(dots()).toHaveLength(2);
    expect(flatten(dots()[0].props.style).width).toBe(18);

    ReactTestRenderer.act(() =>
      list.props.onScroll({ nativeEvent: { contentOffset: { x: PACKAGE_SNAP_INTERVAL } } }),
    );
    expect(flatten(dots()[1].props.style).width).toBe(18);

    // An overscroll bounce past the end must not light a dot that isn't there.
    ReactTestRenderer.act(() =>
      list.props.onScroll({ nativeEvent: { contentOffset: { x: PACKAGE_SNAP_INTERVAL * 9 } } }),
    );
    expect(flatten(dots()[1].props.style).width).toBe(18);
  });

  it('omits "Build your own" when the backend supplies no label', () => {
    const text = textOf(render(<Packages {...base} data={section({ buildLabel: null })} />)).join('|');
    expect(text).not.toContain('Build your own');
  });
});

describe('mapPackages', () => {
  const feed = (over: Record<string, unknown>) => ({ packages: [], ...over } as unknown as HomeFeedDTO);

  it('hides the section when there are no packages', () => {
    expect(mapPackages(feed({}))).toBeNull();
  });

  it('falls back to a known art key rather than an undefined gradient', () => {
    // An unknown key would index the gradient map to undefined and crash the
    // banner at render time.
    const vm = mapPackages(feed({ packages: [{ id: 'p', title: 'T', art: 'quinceanera' }] }));
    expect(vm?.items[0].art).toBe('wedding');
  });

  it('keeps a valid art key', () => {
    const vm = mapPackages(feed({ packages: [{ id: 'p', title: 'T', art: 'housewarming' }] }));
    expect(vm?.items[0].art).toBe('housewarming');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) {
      return;
    }

    const states: Array<[string, React.ReactElement]> = [
      ['A carousel of packages', <Packages {...base} data={section({ items: [birthday, wedding] })} />],
      ['A single package — no dots', <Packages {...base} data={section({ items: [wedding] })} />],
      [
        'No "build your own" label',
        <Packages {...base} data={section({ buildLabel: null, items: [birthday] })} />,
      ],
    ];

    const panels: Array<[string, string]> = states.map(([label, el]) => [label, toHtml(render(el).toJSON())]);

    // The card width is derived from the window, so the review panel uses the
    // same window the component measured — otherwise the carousel's
    // proportions in the picture would not be the ones on a device.
    fs.writeFileSync(
      out,
      page(panels, {
        title: 'Packages',
        width: Math.round(Dimensions.get('window').width),
        background: '#fff',
        padding: 0,
      }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
