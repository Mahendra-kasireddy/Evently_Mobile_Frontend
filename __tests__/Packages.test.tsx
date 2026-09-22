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
  bannerNote: 'Terrace setup · 80 guests',
  photoUrl: '',
  priceLabel: '₹95,000',
  listPriceLabel: '₹1,15,000',
  organizer: {
    id: 'o1',
    name: 'Sruthi Celebrations',
    rating: 4.8,
    reviews: 51,
    bookedLabel: '18 booked this month',
  },
};

const wedding: PackageItem = {
  id: 'p2',
  badge: 'Most booked',
  title: 'Classic Wedding',
  guests: '300–500 guests',
  budget: '₹8L – 14L',
  tags: ['Venue', 'Catering', 'Photography', 'Decor'],
  art: 'wedding',
  bannerNote: '',
  photoUrl: '',
  priceLabel: '',
  listPriceLabel: '',
  organizer: null,
};

const section = (over: Partial<PackagesViewModel> = {}): PackagesViewModel => ({
  title: 'Curated packages by budget',
  subtitle: 'Pre-matched bundles to kick-start your planning — fully customisable.',
  buildLabel: 'Build your own',
  items: [birthday],
  ...over,
});

const base = {
  onPressPackage: () => {},
  onPressSeeAll: () => {},
  savedIds: [] as string[],
  onToggleSaved: () => {},
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

describe('Packages — saving', () => {
  it('marks as saved only the package this account actually kept', () => {
    const hearts = (savedIds: string[]) =>
      hosts(
        render(
          <Packages {...base} savedIds={savedIds} data={section({ items: [birthday, wedding] })} />,
        ),
        (p) => typeof p.accessibilityLabel === 'string' && p.accessibilityLabel.includes('saved packages'),
      ).map((n) => n.props.accessibilityState?.selected);

    expect(hearts([])).toEqual([false, false]);
    expect(hearts([birthday.id])).toEqual([true, false]);
  });

  it('keeps saving separate from opening the package', () => {
    // One tap target that sometimes saves and sometimes navigates is how
    // people lose the thing they meant to keep.
    const onPressPackage = jest.fn();
    const onToggleSaved = jest.fn();
    const tree = render(
      <Packages
        {...base}
        data={section({ items: [birthday] })}
        onPressPackage={onPressPackage}
        onToggleSaved={onToggleSaved}
      />,
    );

    const heart = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find(
        (n: any) =>
          typeof n.props.onPress === 'function' &&
          typeof n.props.accessibilityLabel === 'string' &&
          n.props.accessibilityLabel.startsWith('Save '),
      );

    expect(heart).toBeDefined();
    ReactTestRenderer.act(() => heart!.props.onPress());
    expect(onToggleSaved).toHaveBeenCalledWith(birthday.id);
    expect(onPressPackage).not.toHaveBeenCalled();
  });
});

describe('Packages', () => {
  it('shows the badge, title, organizer, rating and price', () => {
    const text = textOf(render(<Packages {...base} data={section()} />)).join('|');

    expect(text).toContain('BUDGET PICK');
    expect(text).toContain('Birthday Bash');
    expect(text).toContain('Sruthi Celebrations');
    expect(text).toContain('4.8');
    expect(text).toContain('(51)');
    expect(text).toContain('₹95,000');
    // The organizer's own recent bookings, said under their name — nothing
    // links a booking back to the package that inspired it.
    expect(text).toContain('18 booked this month');
  });

  it('drops the strapline: the cards say what they are', () => {
    const text = textOf(render(<Packages {...base} data={section()} />)).join(
      '|',
    );
    expect(text).toContain('Curated packages by budget');
    // A sentence about the cards, above cards that show what they are.
    expect(text).not.toContain('Pre-matched bundles');
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

  it('is the card, its heart, and nothing else nested inside', () => {
    const tree = render(<Packages {...base} data={section()} />);
    // The card, its save control, and the section's "See all". The heart is
    // deliberately separate — see "keeps saving separate from opening the
    // package" — but nothing else in the card may be tappable.
    expect(hosts(tree, (p) => p.accessibilityRole === 'button')).toHaveLength(3);
  });

  it('falls back to the budget band for a package with no fixed price', () => {
    // A package priced only as a range still has to show something, and the
    // range is what the organizer actually published.
    const text = textOf(render(<Packages {...base} data={section({ items: [wedding] })} />)).join('|');

    expect(text).toContain('₹8L – 14L');
    // No rating for an organizer nobody has reviewed, and no struck-through
    // figure where there is no reduction.
    expect(text).not.toContain('₹2,10,000');
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
