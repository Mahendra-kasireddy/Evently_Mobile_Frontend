/**
 * @format
 *
 * Where "back" goes.
 *
 * One rule, and every test here is a way of restating it: back returns the
 * customer to the screen they came from. Nothing redirects it somewhere more
 * useful, because "more useful" is how the app ended up sending someone who
 * opened a workspace from Home to an events list they had never visited — and
 * that list's own back arrow then led to a third screen that looked identical
 * to the second.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name }: { name: string }) {
    return <Text>{` icon:${name}`}</Text>;
  };
});

import { EventsHeader } from '../src/modules/Booking/sections/EventsHeader';

/* Minimal shapes rather than @types/node, which this app does not carry —
   the same pattern the other suites use for their render dumps. */
interface Stats {
  isDirectory(): boolean;
}
const fs: {
  readFileSync(p: string, enc: string): string;
  readdirSync(p: string): string[];
  statSync(p: string): Stats;
} = require('fs');
const path: { join(...parts: string[]): string } = require('path');
declare const __dirname: string;

const SRC = path.join(__dirname, '..', 'src');

const read = (...parts: string[]): string =>
  fs.readFileSync(path.join(SRC, ...parts), 'utf8');

/*
 * Route names are read from the navigators' source rather than by rendering
 * them: both are hook-using components that need a store and a container, and
 * the question here is only which names they register.
 */
const routeNamesIn = (source: string): string[] =>
  [...source.matchAll(/name="([A-Za-z]+)"/g)].map((m) => m[1]);

describe('one screen, one route', () => {
  /*
   * BookingScreen was registered twice: as the Events tab, and as a pushed
   * `Bookings` route. Two routes rendering the same screen is what made the
   * loop possible — the customer could not tell which copy they were on.
   */
  it('registers the events list once, as a tab', () => {
    expect(routeNamesIn(read('navigation', 'MainTabNavigator.tsx'))).toContain('Events');
  });

  it('has no pushed duplicate of the events list', () => {
    expect(routeNamesIn(read('navigation', 'RootNavigator.tsx'))).not.toContain('Bookings');
  });

  it('puts no screen in both navigators', () => {
    /*
     * The general form of the bug, so it cannot come back under another name.
     *
     * A screen registered as a tab AND as a stack route exists twice at once:
     * one copy has the bottom tabs, the pushed copy does not, and they are
     * otherwise identical. Backing out of the pushed one lands on the tab, and
     * the customer sees the same screen twice without having moved anywhere
     * they recognise.
     */
    const componentsIn = (source: string): string[] =>
      [...source.matchAll(/component=\{([A-Za-z]+)\}/g)].map((m) => m[1]);

    const tabs = componentsIn(read('navigation', 'MainTabNavigator.tsx'));
    const stack = componentsIn(read('navigation', 'RootNavigator.tsx'));

    expect(tabs.filter((c) => stack.includes(c))).toEqual([]);
  });

  it('does not keep a Bookings route in the param list', () => {
    // A route name that no navigator registers is a crash waiting to be typed.
    expect(read('navigation', 'types.ts')).not.toMatch(/^\s*Bookings:/m);
  });
});

describe('the workspace back arrow', () => {
  it('goes back, rather than redirecting somewhere else', () => {
    /*
     * The whole bug in one assertion. `replace('Bookings')` swapped the
     * workspace for a screen the customer had not come from, so back did not
     * mean back.
     */
    const source = read('modules', 'Workspace', 'WorkspaceScreen.tsx');

    expect(source).not.toContain('replace(');
    expect(source).toContain('navigation.goBack()');
  });
});

describe('the events header', () => {
  it('shows no back arrow, because a tab has nothing behind it', () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EventsHeader />);
    });

    const icons: string[] = [];
    const walk = (n: unknown): void => {
      if (n == null) return;
      if (typeof n === 'string') {
        if (n.startsWith(' icon:')) icons.push(n);
        return;
      }
      if (Array.isArray(n)) return n.forEach(walk);
      walk((n as { children?: unknown }).children);
    };
    walk(tree.toJSON());

    expect(icons.join(' ')).not.toContain('chevron-left');
  });
});

describe('the routes the app can reach', () => {
  it('registers every screen the code navigates to', () => {
    /*
     * A `navigate('X')` for an X no navigator registers fails only when a
     * customer taps it. This walks the source for the names actually used and
     * checks each one is registered somewhere.
     */
    const walk = (dir: string): string[] =>
      fs.readdirSync(dir).flatMap((entry: string) => {
        const full = path.join(dir, entry);
        return fs.statSync(full).isDirectory() ? walk(full) : [full];
      });

    const used = new Set<string>();
    for (const file of walk(SRC).filter((f) => /\.tsx?$/.test(f))) {
      const text = fs.readFileSync(file, 'utf8');
      for (const m of text.matchAll(/navigate\(\s*'([A-Z][A-Za-z]*)'/g)) used.add(m[1]);
      for (const m of text.matchAll(/replace\(\s*'([A-Z][A-Za-z]*)'/g)) used.add(m[1]);
    }

    const registered = new Set([
      ...routeNamesIn(read('navigation', 'MainTabNavigator.tsx')),
      ...routeNamesIn(read('navigation', 'RootNavigator.tsx')),
    ]);

    expect([...used].filter((name) => !registered.has(name))).toEqual([]);
  });
});
