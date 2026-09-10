/**
 * @format
 *
 * Notifications.
 *
 * Three things decide whether this screen is trustworthy: how old something is
 * has to be written the way a reader would say it, read and unread have to be
 * distinguishable by more than a four-pixel dot, and a tap must never land on a
 * screen the notification was not about.
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
import { NotificationRow } from '../src/modules/Notification/sections/NotificationRow';
import {
  groupByDay,
  mapNotifications,
  relativeTime,
  routeFor,
} from '../src/modules/Notification/utils';
import {
  NOTIFICATION_COPY as COPY,
  NOTIFICATION_LOOK,
} from '../src/modules/Notification/constants';
import { notificationRowStyles } from '../src/modules/Notification/styles';
import type { NotificationDTO } from '../src/modules/Notification/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

/** A fixed "now" so nothing here depends on when the suite runs. */
const NOW = new Date('2026-09-04T14:00:00.000Z');

const dto = (over: Partial<NotificationDTO> = {}): NotificationDTO => ({
  id: 'n1',
  type: 'quote',
  title: 'New quote from Mahendra Events',
  body: '₹2,05,200 for your Haldi on 12 Oct.',
  link: '',
  read: false,
  createdAt: '2026-09-04T12:00:00.000Z',
  ...over,
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
  return out.join('');
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
    if (n.props?.style) {
      const flat = [n.props.style].flat(4).filter(Boolean);
      out.push(Object.assign({}, ...flat));
    }
    walk(n.children);
  };
  walk(tree.toJSON());
  return out;
}

const noop = () => {};

describe('relativeTime', () => {
  it('counts minutes and hours while it is still today', () => {
    expect(relativeTime('2026-09-04T13:59:40.000Z', NOW)).toBe('Just now');
    expect(relativeTime('2026-09-04T13:35:00.000Z', NOW)).toBe('25m ago');
    expect(relativeTime('2026-09-04T12:00:00.000Z', NOW)).toBe('2h ago');
  });

  it('says the word for yesterday and dates anything older', () => {
    // "34 days ago" is arithmetic the reader should not have to do.
    expect(relativeTime('2026-09-03T12:00:00.000Z', NOW)).toBe('Yesterday');
    expect(relativeTime('2026-08-29T12:00:00.000Z', NOW)).toBe('29 Aug');
  });

  it('never rounds an hour-old notification down to "0h ago"', () => {
    expect(relativeTime('2026-09-04T12:59:00.000Z', NOW)).toBe('1h ago');
  });

  it('says nothing rather than "Invalid Date"', () => {
    expect(relativeTime(null, NOW)).toBe('');
    expect(relativeTime(undefined, NOW)).toBe('');
    expect(relativeTime('not-a-date', NOW)).toBe('');
  });
});

describe('mapNotifications', () => {
  it('carries the wording and the read state through', () => {
    const [item] = mapNotifications([dto()], NOW);
    expect(item.title).toContain('Mahendra Events');
    expect(item.body).toContain('2,05,200');
    expect(item.read).toBe(false);
    expect(item.relativeTime).toBe('2h ago');
  });

  it('falls back to a plain notice for a type this build does not know', () => {
    // A newer backend must not be able to crash the row by indexing the
    // look-up map to undefined.
    const [item] = mapNotifications([dto({ type: 'refund' as any })], NOW);
    expect(item.type).toBe('system');
    expect(NOTIFICATION_LOOK[item.type]).toBeDefined();
  });

  it('treats a missing link and a missing body as absent, not as "undefined"', () => {
    const [item] = mapNotifications([dto({ link: undefined, body: undefined as any })], NOW);
    expect(item.link).toBe('');
    expect(item.body).toBe('');
  });

  it('has nothing to map when the server sends nothing', () => {
    expect(mapNotifications([], NOW)).toEqual([]);
    expect(mapNotifications(undefined as any, NOW)).toEqual([]);
  });
});

describe('groupByDay', () => {
  it('separates what arrived today from everything before it', () => {
    const groups = groupByDay(
      mapNotifications(
        [
          dto({ id: 'a', createdAt: '2026-09-04T12:00:00.000Z' }),
          dto({ id: 'b', createdAt: '2026-09-03T12:00:00.000Z' }),
          dto({ id: 'c', createdAt: '2026-08-29T12:00:00.000Z' }),
        ],
        NOW,
      ),
      );

    expect(groups.map((g) => g.key)).toEqual(['today', 'earlier']);
    expect(groups[0].label).toBe(COPY.today);
    expect(groups[0].items.map((i) => i.id)).toEqual(['a']);
    expect(groups[1].items.map((i) => i.id)).toEqual(['b', 'c']);
  });

  it('drops a heading with nothing under it', () => {
    const older = groupByDay(
      mapNotifications([dto({ createdAt: '2026-08-29T12:00:00.000Z' })], NOW),
    );
    expect(older).toHaveLength(1);
    expect(older[0].key).toBe('earlier');
  });

  it('keeps the order the server gave — newest first', () => {
    const groups = groupByDay(
      mapNotifications(
        [
          dto({ id: 'new', createdAt: '2026-09-04T13:00:00.000Z' }),
          dto({ id: 'old', createdAt: '2026-09-04T09:00:00.000Z' }),
        ],
        NOW,
      ),
    );
    expect(groups[0].items.map((i) => i.id)).toEqual(['new', 'old']);
  });

  it('renders no headings at all for an empty list', () => {
    expect(groupByDay([])).toEqual([]);
  });
});

describe('routeFor', () => {
  it('follows a conversation link', () => {
    expect(routeFor('/chat/64b7f2c1a9e4d3b201f5c8a7')).toEqual({
      screen: 'Conversation',
      conversationId: '64b7f2c1a9e4d3b201f5c8a7',
    });
  });

  it('refuses a web path this app has no screen for', () => {
    // "/organizer/quotes" is a console page. Landing a customer on a screen
    // the notification was not about is worse than landing them nowhere.
    expect(routeFor('/organizer/quotes')).toBeNull();
    expect(routeFor('/bookings/64b7f2c1a9e4d3b201f5c8a7')).toBeNull();
    expect(routeFor('')).toBeNull();
    expect(routeFor(undefined as any)).toBeNull();
  });

  it('refuses a chat link that is not an id', () => {
    expect(routeFor('/chat/')).toBeNull();
    expect(routeFor('/chat/../admin')).toBeNull();
    expect(routeFor('/chat/64b7f2c1a9e4d3b201f5c8a7/messages')).toBeNull();
  });
});

describe('NotificationRow', () => {
  it('shows the headline, the detail and how old it is', () => {
    const item = mapNotifications([dto()], NOW)[0];
    const text = textOf(render(<NotificationRow item={item} onPress={noop} />));
    expect(text).toContain('Mahendra Events');
    expect(text).toContain('2,05,200');
    expect(text).toContain('2h ago');
  });

  it('tells read from unread by fill, weight and dot — not by the dot alone', () => {
    const unread = mapNotifications([dto({ read: false })], NOW)[0];
    const read = mapNotifications([dto({ read: true })], NOW)[0];

    const unreadTree = render(<NotificationRow item={unread} onPress={noop} />);
    const readTree = render(<NotificationRow item={read} onPress={noop} />);

    const dots = (t: ReactTestRenderer.ReactTestRenderer) =>
      stylesOf(t).filter((s) => s.borderRadius === notificationRowStyles.unreadDot.borderRadius &&
        s.backgroundColor === notificationRowStyles.unreadDot.backgroundColor).length;

    // 1. the dot
    expect(dots(unreadTree)).toBeGreaterThan(0);
    expect(dots(readTree)).toBe(0);

    // 2. the card's fill, and 3. the title's weight
    const rowOf = (t: ReactTestRenderer.ReactTestRenderer) => stylesOf(t)[0];
    expect(rowOf(unreadTree).backgroundColor).not.toBe(rowOf(readTree).backgroundColor);

    const titleWeight = (t: ReactTestRenderer.ReactTestRenderer) =>
      stylesOf(t).find((s) => s.fontSize === notificationRowStyles.title.fontSize)?.fontFamily;
    expect(titleWeight(unreadTree)).not.toBe(titleWeight(readTree));
  });

  it('drops the detail line rather than leaving an empty gap', () => {
    const item = mapNotifications([dto({ body: '' })], NOW)[0];
    const text = textOf(render(<NotificationRow item={item} onPress={noop} />));
    expect(text).toBe('New quote from Mahendra Events2h ago');
  });

  it('names it to a screen reader, unread state first', () => {
    const item = mapNotifications([dto({ read: false })], NOW)[0];
    const tree = render(<NotificationRow item={item} onPress={noop} />);
    const label = tree.root.findAllByProps({ accessibilityRole: 'button' })[0].props
      .accessibilityLabel;
    expect(label.startsWith('Unread')).toBe(true);
    expect(label).toContain('2h ago');
  });

  it('hands the whole notification back on press, so the screen can route it', () => {
    const item = mapNotifications([dto({ link: '/chat/64b7f2c1a9e4d3b201f5c8a7' })], NOW)[0];
    const pressed: string[] = [];
    const tree = render(
      <NotificationRow item={item} onPress={(i) => pressed.push(i.link)} />,
    );
    ReactTestRenderer.act(() => {
      tree.root.findAllByProps({ accessibilityRole: 'button' })[0].props.onPress();
    });
    expect(pressed).toEqual(['/chat/64b7f2c1a9e4d3b201f5c8a7']);
  });

  it('gives money, conversations and quotes their own colour', () => {
    // Colour is what makes the list scannable without reading it.
    const seen = new Set(
      (['payment', 'message', 'quote', 'system'] as const).map((t) => NOTIFICATION_LOOK[t].fg),
    );
    expect(seen.size).toBe(4);
  });
});

describe('copy', () => {
  it('points at Settings, since the customer chose what arrives here', () => {
    expect(COPY.emptyBody).toContain('Settings');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const groups = groupByDay(
      mapNotifications(
        [
          dto({
            id: 'a',
            type: 'quote',
            title: 'New quote from Mahendra Events',
            body: '₹2,05,200 for your Haldi on 12 Oct. Two more organizers still to reply.',
            createdAt: '2026-09-04T13:35:00.000Z',
            read: false,
          }),
          dto({
            id: 'b',
            type: 'message',
            title: 'Sruthi Celebrations replied',
            body: 'Sending the revised decor list tonight — is marigold still fine?',
            link: '/chat/64b7f2c1a9e4d3b201f5c8a7',
            createdAt: '2026-09-04T11:10:00.000Z',
            read: false,
          }),
          dto({
            id: 'c',
            type: 'booking',
            title: 'Booking confirmed',
            body: 'EVT-2026-1977 is confirmed for 12 Oct at Kompally Function Hall.',
            createdAt: '2026-09-03T18:20:00.000Z',
            read: true,
          }),
          dto({
            id: 'd',
            type: 'system',
            title: 'Add your guest list',
            body: 'Invites go out faster when the list is ready before the date is fixed.',
            createdAt: '2026-08-29T09:00:00.000Z',
            read: true,
          }),
        ],
        NOW,
      ),
    );

    const panels: Array<[string, string]> = [
      [
        'Notifications',
        toHtml(
          render(
            <>
              {groups.map((group) => (
                <React.Fragment key={group.key}>
                  {group.items.map((item) => (
                    <NotificationRow key={item.id} item={item} onPress={noop} />
                  ))}
                </React.Fragment>
              ))}
            </>,
          ).toJSON(),
        ),
      ],
    ];

    fs.writeFileSync(
      out,
      page(panels, { title: 'Notifications', width: 390, background: '#faf8f7', padding: 16 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
