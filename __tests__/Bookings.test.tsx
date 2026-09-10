/**
 * @format
 *
 * Your events.
 *
 * The rules that matter: every status the backend can emit has a label, an
 * event that is over has no countdown, "Next:" comes from the booking's own
 * milestones rather than from a guess, and every "Jump to" tile counts
 * something this system actually records.
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
import { EventCard } from '../src/modules/Booking/sections/EventCard';
import { EventTabs } from '../src/modules/Booking/sections/EventTabs';
import { EventsHeader } from '../src/modules/Booking/sections/EventsHeader';
import { JumpToGrid } from '../src/modules/Booking/sections/JumpToGrid';
import {
  compactDays,
  focusEvent,
  formatINR,
  initials,
  isPast,
  jumpTilesFor,
  mapBookings,
  nextStepOf,
} from '../src/modules/Booking/utils';
import { BOOKING_STATUS_COPY, JUMP_TILES } from '../src/modules/Booking/constants';
import { eventCardStyles, jumpToStyles } from '../src/modules/Booking/styles';
import type {
  BookingDTO,
  BookingStatus,
  EventExtras,
  JumpKey,
} from '../src/modules/Booking/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

/** The server's own lifecycle checklist, as `/booking/my-bookings` sends it. */
const STEPS = [
  { label: 'Booking placed', done: true },
  { label: 'Advance paid', done: true },
  { label: 'Invitation', done: false },
  { label: 'Completed', done: false },
];

const dto = (over: Partial<BookingDTO> = {}): BookingDTO =>
  ({
    id: 'bk1',
    ref: 'EVT-2026-1977',
    title: 'Naming ceremony',
    occasion: 'naming',
    location: 'Jubilee Hills, Hyderabad',
    eventDate: '2026-09-05T00:00:00.000Z',
    daysToGo: 3,
    amount: 240000,
    amountPaid: 72000,
    advanceAmount: 72000,
    balanceAmount: 168000,
    paymentStatus: 'advance_paid',
    progress: 35,
    status: 'confirmed',
    steps: STEPS,
    organizer: {
      id: 'o1',
      name: 'Mahendra Events',
      initials: 'ME',
      avatarColor: '#7C5CE6',
      tier: 'Silver',
      rating: 0,
    },
    createdAt: '2026-08-01T00:00:00.000Z',
    ...over,
  }) as BookingDTO;

const item = (over: Partial<BookingDTO> = {}) => mapBookings([dto(over)])[0];

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

/**
 * Buttons as actually drawn. `findAllByProps` counts the composite element and
 * its host view separately, so one control reported as several.
 */
function drawnButtons(tree: ReactTestRenderer.ReactTestRenderer): any[] {
  const out: any[] = [];
  const walk = (n: any) => {
    if (n == null || typeof n === 'string') return;
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (n.props?.accessibilityRole === 'button') out.push(n);
    walk(n.children);
  };
  walk(tree.toJSON());
  return out;
}

/**
 * The same controls as functions to call. `drawnButtons` walks the rendered
 * host tree, which is what makes it honest about how many controls a user
 * actually sees — but a host View carries no `onPress`, so pressing goes
 * through the composite element instead.
 */
function pressables(tree: ReactTestRenderer.ReactTestRenderer): any[] {
  const seen = new Set<unknown>();
  return tree.root
    .findAllByProps({ accessibilityRole: 'button' })
    .filter((n: any) => {
      // One control shows up several times — the composite element and the
      // views it renders all carry the props. They share one handler, so the
      // handler's identity is what tells them apart from a second control.
      if (typeof n.props.onPress !== 'function' || seen.has(n.props.onPress)) return false;
      seen.add(n.props.onPress);
      return true;
    });
}

const noop = () => {};
const card = (over: Partial<BookingDTO> = {}, focused = false) =>
  render(<EventCard item={item(over)} focused={focused} onPress={noop} />);

const NO_EXTRAS: EventExtras = { ideas: null, guests: null };

describe('mapBookings', () => {
  it('labels every status the backend can emit', () => {
    // `awaiting_organizer` and `expired` were missing from the mobile union,
    // so they fell through to a generic grey label.
    const statuses: BookingStatus[] = [
      'pending',
      'awaiting_organizer',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'rejected',
      'expired',
    ];

    for (const status of statuses) {
      expect(BOOKING_STATUS_COPY[status]).toBeDefined();
      expect(mapBookings([dto({ status })])[0].statusLabel).toBe(BOOKING_STATUS_COPY[status].label);
    }
  });

  it('gives the pill the same words in upper case, not a second vocabulary', () => {
    expect(item({ status: 'confirmed' }).statusPill).toBe('CONFIRMED');
    expect(item({ status: 'awaiting_organizer' }).statusPill).toBe('AWAITING ORGANIZER');
  });

  it('treats an unanswered booking as a failure, not a neutral state', () => {
    expect(item({ status: 'expired' }).statusTone).toBe('danger');
    expect(item({ status: 'awaiting_organizer' }).statusTone).toBe('warning');
  });

  it('drops the countdown once an event is over', () => {
    // "3 days to go" on a completed event is nonsense.
    expect(item({ status: 'completed', daysToGo: 3 }).daysToGo).toBeNull();
    expect(item({ status: 'completed', daysToGo: 3 }).daysLabel).toBe('');
    // 0 is a real answer: the event is today.
    expect(item({ daysToGo: 0 }).daysLabel).toBe('Today');
  });

  it('writes the countdown short beside the bar and long for a screen reader', () => {
    expect(compactDays(3)).toBe('3 days');
    expect(compactDays(1)).toBe('1 day');
    expect(compactDays(0)).toBe('Today');
    expect(compactDays(null)).toBe('');
    expect(textOf(card()).includes('3 days')).toBe(true);
    expect(drawnButtons(card())[0].props.accessibilityLabel).toContain('3 days to go');
  });

  it('sorts an event into the tab that matches its status', () => {
    expect(item({ status: 'in_progress' }).tab).toBe('active');
    expect(item({ status: 'rejected' }).tab).toBe('past');
    expect(isPast('expired')).toBe(true);
    expect(isPast('pending')).toBe(false);
  });

  it('shows a payment only when both halves are known', () => {
    // "₹72,000" on its own says nothing about what is still owed.
    expect(item().paidLabel).toBe('₹72,000 of ₹2,40,000');
    expect(item({ amount: 0 }).paidLabel).toBe('');
    expect(item({ amountPaid: 0 }).paidLabel).toBe('');
  });

  it('never prints ₹0 for an amount nobody has set', () => {
    expect(formatINR(0)).toBe('');
    expect(formatINR(undefined)).toBe('');
  });

  it('falls back to a monogram it can actually draw', () => {
    expect(initials('Mahendra Events')).toBe('ME');
    expect(initials('')).toBe('·');
  });
});

describe('nextStepOf', () => {
  it('takes the first milestone the booking has not reached', () => {
    expect(nextStepOf(STEPS)).toBe('approve the guest invitation');
  });

  it('says a lifecycle milestone as the thing still to come', () => {
    /*
     * The server's checklist is written in the past — "Organizer confirmed" —
     * so "Next: Organizer confirmed" would name something already done.
     */
    expect(nextStepOf([{ label: 'Organizer confirmed', done: false }])).toBe('organizer to confirm');
    expect(nextStepOf([{ label: 'Advance paid', done: false }])).toBe('pay the advance');
  });

  it('says nothing at all when there is nothing outstanding', () => {
    // Better a shorter card than an invented task.
    expect(nextStepOf([{ label: 'Booking confirmed', done: true }])).toBe('');
    expect(nextStepOf([])).toBe('');
    expect(nextStepOf(undefined)).toBe('');
  });

  it('shows an unknown milestone exactly as the server wrote it', () => {
    // Better the server's own words than a rewording that changes the meaning.
    expect(nextStepOf([{ label: 'Sign the venue contract', done: false }])).toBe(
      'Sign the venue contract',
    );
  });

  it('drops the footer from a card with no outstanding milestone', () => {
    expect(textOf(card({ steps: [] }))).not.toContain('Next:');
    expect(textOf(card())).toContain('Next: approve the guest invitation');
  });
});

describe('focusEvent', () => {
  it('picks the event happening soonest, not the one booked most recently', () => {
    const soon = item({ id: 'soon', daysToGo: 3 });
    const later = item({ id: 'later', daysToGo: 16 });
    expect(focusEvent([later, soon])?.id).toBe('soon');
  });

  it('sorts an event with no date last rather than first', () => {
    // A null countdown must not read as "zero days away".
    const dated = item({ id: 'dated', daysToGo: 16 });
    const undated = item({ id: 'undated', eventDate: '' });
    expect(focusEvent([undated, dated])?.id).toBe('dated');
  });

  it('has no focus when nothing is active', () => {
    expect(focusEvent([])).toBeNull();
  });
});

describe('jump tiles', () => {
  it('counts what the invitation records — guests reached and opens, never RSVPs', () => {
    /*
     * An invitation carries RSVP settings, but nothing in this system stores a
     * guest's answer: guests have no account to answer from. A tile reading
     * "14 RSVPs pending" would be a number the backend cannot produce.
     */
    const tiles = jumpTilesFor(JUMP_TILES, item(), {
      ideas: null,
      guests: { shared: 14, opened: 8 },
    });
    const invitation = tiles.find((t) => t.key === 'invitation')!;

    expect(invitation.subtitle).toBe('14 guests · 8 opened');
    expect(invitation.subtitle).not.toContain('RSVP');
  });

  it('says what state the invitation is in when there is no one to count', () => {
    expect(
      jumpTilesFor(JUMP_TILES, item(), { ideas: null, guests: { shared: 0, opened: 0 } }).find(
        (t) => t.key === 'invitation',
      )!.subtitle,
    ).toBe('Ready to share');
    // Still the organizer's draft: the guest list 404s, and that is not a zero.
    expect(jumpTilesFor(JUMP_TILES, item(), NO_EXTRAS).find((t) => t.key === 'invitation')!.subtitle).toBe(
      'Not published yet',
    );
  });

  it('puts what is waiting on the customer ahead of what is merely there', () => {
    const withApprovals = jumpTilesFor(JUMP_TILES, item(), {
      guests: null,
      ideas: { shared: 6, planned: 2, awaitingApproval: 2 },
    });
    expect(withApprovals.find((t) => t.key === 'ideas')!.subtitle).toBe('2 awaiting you');

    const quiet = jumpTilesFor(JUMP_TILES, item(), {
      guests: null,
      ideas: { shared: 6, planned: 2, awaitingApproval: 0 },
    });
    expect(quiet.find((t) => t.key === 'ideas')!.subtitle).toBe('6 ideas shared');

    const empty = jumpTilesFor(JUMP_TILES, item(), {
      guests: null,
      ideas: { shared: 0, planned: 0, awaitingApproval: 0 },
    });
    expect(empty.find((t) => t.key === 'ideas')!.subtitle).toBe('Share your first idea');
  });

  it('shows what is still owed on the payments tile', () => {
    expect(jumpTilesFor(JUMP_TILES, item(), NO_EXTRAS).find((t) => t.key === 'payments')!.subtitle).toBe(
      '₹1,68,000 still due',
    );
    expect(
      jumpTilesFor(JUMP_TILES, item({ paymentStatus: 'paid_in_full', balanceAmount: 0 }), NO_EXTRAS).find(
        (t) => t.key === 'payments',
      )!.subtitle,
    ).toBe('Paid in full');
  });

  it('does not promise a budget tool this app does not have', () => {
    // What exists is the plan wizard's budget step; the tile is named for it.
    const budget = JUMP_TILES.find((t) => t.key === 'budget')!;
    expect(budget.title).toBe('Budget guide');
  });

  it('is four tiles, each its own tap target, reporting which was pressed', () => {
    const pressed: JumpKey[] = [];
    const tree = render(
      <JumpToGrid tiles={jumpTilesFor(JUMP_TILES, item(), NO_EXTRAS)} onPress={(k) => pressed.push(k)} />,
    );
    const buttons = drawnButtons(tree);

    expect(buttons).toHaveLength(4);
    ReactTestRenderer.act(() => pressables(tree).forEach((b) => b.props.onPress()));
    expect(pressed).toEqual(['payments', 'invitation', 'budget', 'ideas']);
  });
});

describe('type hierarchy', () => {
  it('does not set a group heading like the item titles under it', () => {
    /*
     * "Jump to" and "Naming ceremony" were both 17/Bold navy, which made the
     * section label read as another card title instead of as the thing that
     * groups the four tiles. Any one of size, weight or colour matching is
     * fine; all three matching is the bug.
     */
    const heading = jumpToStyles.heading as Record<string, unknown>;
    const title = eventCardStyles.title as Record<string, unknown>;
    const same =
      heading.fontSize === title.fontSize &&
      heading.fontWeight === title.fontWeight &&
      heading.color === title.color;

    expect(same).toBe(false);
    // Smaller and lighter, not merely different.
    expect(Number(heading.fontSize)).toBeLessThan(Number(title.fontSize));
  });

  it('keeps a tile title above its own subtitle', () => {
    const tileTitle = jumpToStyles.tileTitle as Record<string, unknown>;
    const tileSubtitle = jumpToStyles.tileSubtitle as Record<string, unknown>;

    expect(Number(tileTitle.fontSize)).toBeGreaterThan(Number(tileSubtitle.fontSize));
    expect(tileTitle.color).not.toBe(tileSubtitle.color);
  });
});

describe('EventCard', () => {
  it('shows the event, its reference and who is running it', () => {
    const text = textOf(card());

    expect(text).toContain('Naming ceremony');
    expect(text).toContain('EVT-2026-1977 · Mahendra Events');
    expect(text).toContain('CONFIRMED');
    expect(text).toContain('Next: approve the guest invitation');
  });

  it('names an organizer who has not been assigned yet', () => {
    expect(textOf(card({ organizer: null }))).toContain('Organizer to be confirmed');
  });

  it('is one tap target, not a card plus a nested link', () => {
    const buttons = drawnButtons(card());

    expect(buttons).toHaveLength(1);
    expect(buttons[0].props.accessibilityLabel).toContain('Open workspace');
  });

  it('opens the workspace when tapped', () => {
    const onPress = jest.fn();
    const tree = render(<EventCard item={item()} focused onPress={onPress} />);

    ReactTestRenderer.act(() => pressables(tree)[0].props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('EventTabs', () => {
  it('offers both pills even when one side is empty', () => {
    // A customer whose only event has finished still needs to be told where it went.
    const tree = render(
      <EventTabs value="active" onChange={noop} counts={{ active: 2, past: 0 }} />,
    );
    const text = textOf(tree);

    expect(text).toContain('Active');
    expect(text).toContain('Past');
    expect(drawnButtons(tree)).toHaveLength(0); // they are tabs, not buttons
  });

  it('speaks the count it does not print', () => {
    const tree = render(<EventTabs value="active" onChange={noop} counts={{ active: 2, past: 5 }} />);
    const labels = tree.root
      .findAllByProps({ accessibilityRole: 'tab' })
      .map((n: any) => n.props.accessibilityLabel)
      .filter((l: unknown): l is string => typeof l === 'string');

    expect(labels).toContain('Active, 2');
    expect(labels).toContain('Past, 5');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const list = (dtos: BookingDTO[], focusId: string) => (
      <>
        {mapBookings(dtos).map((i) => (
          <EventCard key={i.id} item={i} focused={i.id === focusId} onPress={noop} />
        ))}
      </>
    );

    const activeList: BookingDTO[] = [
      dto(),
      dto({
        id: 'bk2',
        ref: 'EVT-2026-2905',
        title: 'Birthday party',
        occasion: 'birthday',
        status: 'pending',
        progress: 12,
        daysToGo: 16,
        organizer: null,
        steps: [
          { label: 'Booking placed', done: true },
          { label: 'Organizer confirmed', done: false },
          { label: 'Completed', done: false },
        ],
      }),
    ];

    const panels: Array<[string, string]> = [
      [
        'Your events — Active',
        toHtml(
          render(
            <>
              <EventsHeader showBack={false} onBack={noop} />
              <EventTabs value="active" onChange={noop} counts={{ active: 2, past: 1 }} />
              {list(activeList, 'bk1')}
              <JumpToGrid
                tiles={jumpTilesFor(JUMP_TILES, mapBookings(activeList)[0], {
                  guests: { shared: 14, opened: 8 },
                  ideas: { shared: 6, planned: 3, awaitingApproval: 2 },
                })}
                onPress={noop}
              />
            </>,
          ).toJSON(),
        ),
      ],
      [
        'Your events — Past',
        toHtml(
          render(
            <>
              <EventsHeader showBack onBack={noop} />
              <EventTabs value="past" onChange={noop} counts={{ active: 2, past: 2 }} />
              {list(
                [
                  dto({
                    id: 'bk4',
                    status: 'completed',
                    progress: 100,
                    title: 'Anniversary dinner',
                    occasion: 'anniversary',
                    steps: [{ label: 'Completed', done: true }],
                  }),
                  dto({
                    id: 'bk5',
                    status: 'expired',
                    progress: 20,
                    title: 'Housewarming',
                    occasion: 'housewarming',
                    organizer: null,
                    steps: [],
                  }),
                ],
                '',
              )}
            </>,
          ).toJSON(),
        ),
      ],
    ];

    fs.writeFileSync(
      out,
      // Padding 0: the screen paints its own gutters, and a wrapper that adds
      // more would make every measurement in the preview read wider than it is.
      page(panels, { title: 'Your events', width: 390, background: '#faf8f7', padding: 0 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
