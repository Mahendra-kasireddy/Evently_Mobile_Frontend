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

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name }: { name: string }) {
    return <Text>{` icon:${name}`}</Text>;
  };
});

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
  [...source.matchAll(/name="([A-Za-z]+)"/g)].map(m => m[1]);

describe('one screen, one route', () => {
  /*
   * BookingScreen was once registered twice: as the Events tab, and as a
   * pushed `Bookings` route. Two routes rendering the same screen is what made
   * the loop possible. It is now the pushed route only — the Events tab is the
   * public events catalogue.
   */
  it('registers the bookings list once, as a pushed route', () => {
    expect(routeNamesIn(read('navigation', 'RootNavigator.tsx'))).toContain(
      'Bookings',
    );
    expect(read('navigation', 'MainTabNavigator.tsx')).not.toMatch(
      /component=\{BookingScreen\}/,
    );
  });

  it('reaches Bookings from the menu', () => {
    expect(read('modules/Profile', 'ProfileScreen.tsx')).toMatch(
      /navigate\('Bookings'\)/,
    );
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
      [...source.matchAll(/component=\{([A-Za-z]+)\}/g)].map(m => m[1]);

    const tabs = componentsIn(read('navigation', 'MainTabNavigator.tsx'));
    const stack = componentsIn(read('navigation', 'RootNavigator.tsx'));

    expect(tabs.filter(c => stack.includes(c))).toEqual([]);
  });

  /*
   * The catalogue has to be reachable.
   *
   * It was registered on the root stack with nothing linking to it, which is a
   * screen that exists and cannot be opened — every route in the app resolved,
   * every test passed, and a customer had no way in. A tab is the way in, and
   * this is what notices if it disappears.
   */
  it('puts public events on the bottom bar, where a customer can find them', () => {
    const tabs = read('navigation', 'MainTabNavigator.tsx');
    expect(tabs).toMatch(/name="Events"[\s\S]*?component=\{PublicEventsScreen\}/);
    // One tab for it — the old Discover tab is gone.
    expect(routeNamesIn(tabs)).not.toContain('Discover');
    expect(read('navigation', 'types.ts')).not.toMatch(/^\s*Discover:/m);
  });

  /* The ticket a customer already bought needs a door too — it opens from the
     catalogue's header rather than spending a sixth tab on it. */
  it('offers a way into My Tickets from the catalogue', () => {
    const screen = read('modules/PublicEvents', 'PublicEventsScreen.tsx');
    expect(screen).toMatch(/navigate\('MyTickets'\)/);
  });

  it('declares the Bookings route it registers', () => {
    // A route the navigator registers but the param list does not know is a
    // navigate() call that will not type-check — and the reverse is a crash.
    expect(read('navigation', 'types.ts')).toMatch(/^\s*Bookings:/m);
  });

  it('shows public-event tickets on the Bookings screen', () => {
    expect(read('modules/Booking', 'BookingScreen.tsx')).toMatch(/EventTicketsSection/);
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

describe('where an event opens', () => {
  /*
   * "See your request" opened the Plan wizard.
   *
   * The old routing turned on the stage: quotes_received with at least one
   * quote went to CompareQuotes, a booking went to the Events tab, and
   * everything else — including a submitted request nobody had replied to yet
   * — fell through to `navigate('Plan')`. So the commonest state of a brand
   * new request, the one the label is written for, opened a blank new plan.
   */
  /* One handler, shared by Home's card and the All events list — two screens
     that led to different places for the same event would be drift nobody
     notices until a customer reports it. */
  const home = () => read('modules', 'Home', 'useOpenEvent.ts');

  it('opens a request on its own screen, replied to or not', () => {
    // CompareQuotes loads one request and every quote on it. None is still a
    // number of quotes, and the brief is on that screen either way.
    const source = home();
    expect(source).toMatch(/source === 'quote'[\s\S]{0,1400}navigate\('CompareQuotes'/);
  });

  it('sends an accepted quote to the advance, not back to the comparison', () => {
    /*
     * Accepting picks the organizer; the advance is what books it. A customer
     * who accepted and then closed the app came back to a card reading
     * "ACCEPTED · ₹83,662 advance to confirm" whose button offered them the
     * comparison again — a decision they had already made — while the one
     * thing left to do had no way in at all.
     */
    const source = home();
    expect(source).toMatch(
      /stage === 'quote_accepted'[\s\S]{0,120}navigate\('Payment'/,
    );
  });

  it('goes straight to the side-by-side at exactly two quotes', () => {
    /*
     * "Compare 2 quotes" promises a comparison, and with two there is nothing
     * left to choose — a list whose only rows are the two the customer would
     * have ticked is a screen that asks a question with one answer.
     *
     * Exactly two, not "at least two": at three, which pair to open is a real
     * decision, and making it for them would bury a quote they never saw.
     */
    const source = home();
    expect(source).toMatch(/quoteRows\.length === 2[\s\S]{0,200}navigate\('LineByLine'/);
    expect(source).not.toContain('quoteRows.length >= 2');
  });

  it('no longer gates that on a quote having arrived', () => {
    expect(home()).not.toContain(
      "stage === 'quotes_received' && event.quoteCount > 0",
    );
  });

  it('opens a booking at its workspace, not at the events list', () => {
    const source = home();
    expect(source).toMatch(
      /source === 'booking'[\s\S]{0,160}navigate\('Workspace'/,
    );
  });

  it('sends only a draft back to the wizard', () => {
    // One `navigate('Plan')`, in the fall-through — the case that genuinely
    // has nothing else to open.
    expect(home().match(/navigate\('Plan'\)/g) ?? []).toHaveLength(1);
  });

  it('decides in one place, so the two lists cannot drift', () => {
    /*
     * Home's card and the All events list show the same events. Routing them
     * separately is the kind of divergence nobody notices until a customer
     * reports that one of them goes somewhere else, so both defer to the hook
     * and neither reimplements the per-source branch.
     */
    const screen = read('modules', 'Home', 'HomeScreen.tsx');
    const list = read('modules', 'Home', 'SeeAllScreen.tsx');

    expect(screen).toContain('useOpenEvent');
    expect(list).toContain('useOpenEvent');
    // The branch itself — `source === 'booking'` deciding a destination —
    // appears only in the hook. (Both screens may still link to a screen
    // directly for something that is not "open this event": the hero's
    // per-quote rows, the booked card's own tap.)
    expect(screen).not.toContain("source === 'booking'");
    expect(list).not.toContain("source === 'booking'");
  });
});

describe('the bookings header', () => {
  it('has a back arrow, because Bookings is opened from the menu', () => {
    // A pushed screen with no way back strands the customer on it.
    const source = read('modules', 'Booking', 'BookingScreen.tsx');
    expect(source).toMatch(/<AppHeader[\s\S]{0,80}onBackPress=\{navigation\.goBack\}/);
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
    for (const file of walk(SRC).filter(f => /\.tsx?$/.test(f))) {
      const text = fs.readFileSync(file, 'utf8');
      for (const m of text.matchAll(/navigate\(\s*'([A-Z][A-Za-z]*)'/g))
        used.add(m[1]);
      for (const m of text.matchAll(/replace\(\s*'([A-Z][A-Za-z]*)'/g))
        used.add(m[1]);
    }

    const registered = new Set([
      ...routeNamesIn(read('navigation', 'MainTabNavigator.tsx')),
      ...routeNamesIn(read('navigation', 'RootNavigator.tsx')),
    ]);

    expect([...used].filter(name => !registered.has(name))).toEqual([]);
  });
});
