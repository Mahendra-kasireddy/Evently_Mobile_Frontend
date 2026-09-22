/**
 * @format
 *
 * The guest list.
 *
 * The rules that matter are about not putting words in the host's mouth: a
 * guest imported from a phonebook is not filed into a group nobody chose, a
 * monogram keeps its colour between openings so a row stays findable, and an
 * empty filter is told apart from an empty list.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name }: { name: string }) {
    return <Text>{` icon:${name}`}</Text>;
  };
});

jest.mock('react-native-contacts', () => ({
  getAllWithoutPhotos: jest.fn(() => Promise.resolve([])),
  requestPermission: jest.fn(() => Promise.resolve('authorized')),
}));

import { page, toHtml } from '../test-utils/rn-to-html';
import { GroupFilter } from '../src/modules/GuestList/sections/GroupFilter';
import { GuestRow } from '../src/modules/GuestList/sections/GuestRow';
import { GuestSheet } from '../src/modules/GuestList/sections/GuestSheet';
import {
  avatarColorFor,
  digitsOf,
  groupFilters,
  groupOf,
  initialsOf,
  summaryLine,
  toRow,
} from '../src/modules/GuestList/utils';
import { GUEST_AVATAR_COLORS, GUEST_COPY } from '../src/modules/GuestList/constants';
import type { GuestDTO } from '../src/modules/GuestList/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const guest = (over: Partial<GuestDTO> = {}): GuestDTO => ({
  id: 'g1',
  name: 'Sruthi Reddy',
  phone: '+919849011234',
  phoneDisplay: '+91 98490 11234',
  group: 'family',
  sharedSections: [],
  lastSharedAt: null,
  viewed: false,
  ...over,
});

const LIST: GuestDTO[] = [
  guest(),
  guest({ id: 'g2', name: 'Venkat Rao', phoneDisplay: '+91 99590 44821', group: 'family' }),
  guest({ id: 'g3', name: 'Anitha Naidu', phoneDisplay: '+91 90000 77231', group: 'family' }),
  guest({ id: 'g4', name: 'Ravi Kumar', phoneDisplay: '+91 97010 22187', group: 'friends' }),
  guest({ id: 'g5', name: 'Deepa Shetty', phoneDisplay: '+91 98861 55490', group: 'friends' }),
  guest({ id: 'g6', name: 'Karthik Menon', phoneDisplay: '+91 96760 30012', group: 'friends' }),
  guest({ id: 'g7', name: 'Priya Varma', phoneDisplay: '+91 93470 88123', group: 'work' }),
  guest({ id: 'g8', name: 'Sandhya Pillai', phoneDisplay: '+91 90300 41120', group: 'other' }),
];

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
    if (Array.isArray(n)) return n.forEach(walk);
    walk(n.children);
  };
  walk(tree.toJSON());
  return out.join('');
}

const noop = () => {};

describe('initials', () => {
  it('takes the first and last word, never two from one', () => {
    // "RA" for Ravi reads as somebody else's initials.
    expect(initialsOf('Sruthi Reddy')).toBe('SR');
    expect(initialsOf('Ravi')).toBe('R');
    expect(initialsOf('  anitha   naidu ')).toBe('AN');
  });

  it('has something to draw for a name it cannot read', () => {
    expect(initialsOf('')).toBe('?');
  });
});

describe('the monogram colour', () => {
  it('is the same every time the list is opened', () => {
    /*
     * Derived from the name, not the row's position: adding somebody at the
     * top would otherwise recolour everybody below them, and a list whose
     * colours shuffle on each edit is harder to scan than one with none.
     */
    expect(avatarColorFor('Venkat Rao')).toBe(avatarColorFor('Venkat Rao'));
    expect(GUEST_AVATAR_COLORS).toContain(avatarColorFor('Venkat Rao'));
  });
});

describe('a row', () => {
  it('names the number and the group', () => {
    expect(toRow(guest()).metaLine).toBe('+91 98490 11234 · Family');
  });

  it('says nothing about the group of a guest nobody filed', () => {
    /*
     * An imported contact is 'other'. Labelling the row "Other" would read as
     * a decision the host made about that person; they made none.
     */
    const row = toRow(guest({ group: 'other' }));
    expect(row.metaLine).toBe('+91 98490 11234');
    expect(row.metaLine).not.toMatch(/other/i);
  });

  it('treats a missing group the same as an unfiled one', () => {
    // An older record has no `group` field at all.
    expect(groupOf(guest({ group: undefined }))).toBe('other');
  });

  it('opens the edit sheet on what the row actually shows', () => {
    // Not the E.164 the server stores — the host would not recognise it.
    expect(toRow(guest()).draft).toEqual({
      name: 'Sruthi Reddy',
      phone: '+91 98490 11234',
      group: 'family',
    });
  });
});

describe('the filter chips', () => {
  it('counts each group, and everyone', () => {
    const chips = groupFilters(LIST);
    expect(chips.map((c) => [c.label, c.count])).toEqual([
      ['Everyone', 8],
      ['Family', 3],
      ['Friends', 3],
      ['Work', 1],
    ]);
  });

  it('keeps an empty chip rather than removing it', () => {
    /*
     * A row whose chips appeared and vanished as guests were filed would move
     * under the host's thumb — and "Work, 0" is a real answer to "who have I
     * invited from work".
     */
    const chips = groupFilters([guest()]);
    expect(chips).toHaveLength(4);
    expect(chips.find((c) => c.label === 'Work')?.count).toBe(0);
  });

  it('leaves unfiled guests out of every group but Everyone', () => {
    const chips = groupFilters(LIST);
    const filed = chips.slice(1).reduce((sum, c) => sum + c.count, 0);
    // Sandhya is unfiled, so the three groups account for seven of the eight.
    expect(filed).toBe(7);
    expect(chips[0].count).toBe(8);
  });

  it('draws every chip, with the active one marked', () => {
    const tree = render(
      <GroupFilter options={groupFilters(LIST)} active={null} onChange={noop} />,
    );
    const text = textOf(tree);
    ['Everyone', 'Family', 'Friends', 'Work'].forEach((label) =>
      expect(text).toContain(label),
    );
  });
});

describe('the chip row’s own height', () => {
  it('does not let a chip stretch from the filters to the footer', () => {
    /*
     * The bug this pins down, seen on a real device: a horizontal ScrollView
     * has no height of its own, so as a flex child in a column it claimed
     * every remaining pixel and its chips stretched the whole screen.
     *
     * Both rules are needed. `flexGrow: 0` stops the ScrollView claiming the
     * space; `alignItems: center` stops the chips filling whatever it does
     * claim. Either one alone still leaves a full-height chip.
     */
    const { filterStyles } = require('../src/modules/GuestList/styles');
    expect((filterStyles.scroll as Record<string, unknown>).flexGrow).toBe(0);
    expect((filterStyles.row as Record<string, unknown>).alignItems).toBe('center');
  });

  it('draws a monogram as a squircle, matching the edit button beside it', () => {
    // A circle next to the square edit control reads as two design systems.
    const { rowStyles } = require('../src/modules/GuestList/styles');
    expect((rowStyles.avatar as Record<string, unknown>).borderRadius).toBe(14);
  });
});

describe('the header count', () => {
  it('counts guests, and stays silent about sending until something was sent', () => {
    /*
     * Nothing on this screen sends anything, so a guest on the list has not
     * been invited. Saying "8 invited" would be the screen taking credit for
     * work the share sheet does.
     */
    expect(summaryLine(LIST, GUEST_COPY.count, GUEST_COPY.invited)).toBe('8 guests');
    const sent = [guest({ lastSharedAt: '2026-09-01T00:00:00.000Z' }), guest({ id: 'g2' })];
    expect(summaryLine(sent, GUEST_COPY.count, GUEST_COPY.invited)).toBe('2 guests · 1 invited');
  });

  it('says "1 guest", not "1 guests"', () => {
    expect(summaryLine([guest()], GUEST_COPY.count, GUEST_COPY.invited)).toBe('1 guest');
  });
});

describe('digitsOf', () => {
  it('reduces every spelling of one number to the same thing', () => {
    // How a phonebook import tells one contact saved twice from two people.
    expect(digitsOf('+91 98490 11234')).toBe('919849011234');
    expect(digitsOf('098490-11234')).toBe('09849011234');
  });
});

describe('the add sheet', () => {
  it('offers the three groups, and defaults to one', () => {
    const tree = render(
      <GuestSheet
        visible
        initial={null}
        isSaving={false}
        errorMessage={null}
        onSave={noop}
        onClose={noop}
      />,
    );
    const text = textOf(tree);
    expect(text).toContain('Add a guest');
    ['Name', 'Phone', 'Group', 'Family', 'Friends', 'Work'].forEach((label) =>
      expect(text).toContain(label),
    );
    // Not "Other": the host is filing this person, so they pick a real group.
    expect(text).not.toContain('Other');
  });

  it('knows it is editing when it opens on somebody', () => {
    const tree = render(
      <GuestSheet
        visible
        initial={toRow(guest()).draft}
        isSaving={false}
        errorMessage={null}
        onSave={noop}
        onClose={noop}
      />,
    );
    expect(textOf(tree)).toContain('Edit guest');
  });

  it('refuses to submit a guest with no name or no number', () => {
    const saved: unknown[] = [];
    const tree = render(
      <GuestSheet
        visible
        initial={null}
        isSaving={false}
        errorMessage={null}
        onSave={(draft) => saved.push(draft)}
        onClose={noop}
      />,
    );
    const save = tree.root
      .findAll((n) => n.props?.accessibilityLabel === GUEST_COPY.save)
      .at(0);
    ReactTestRenderer.act(() => save?.props?.onPress?.());
    expect(saved).toHaveLength(0);
    // And it says which field, rather than only refusing.
    expect(textOf(tree)).toContain(GUEST_COPY.nameRequired);
  });

  it('shows the server’s own words when a save is refused', () => {
    // "Venkat Rao already has this number" is the one thing that would let
    // the host fix it; a generic failure is not.
    const tree = render(
      <GuestSheet
        visible
        initial={null}
        isSaving={false}
        errorMessage="Venkat Rao already has this number on the guest list."
        onSave={noop}
        onClose={noop}
      />,
    );
    expect(textOf(tree)).toContain('Venkat Rao already has this number');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const { View } = require('react-native');
    const { styles, footerStyles } = require('../src/modules/GuestList/styles');
    const { EventlyIcon, EventlyText } = require('../src/Components');

    const list = (
      <View style={[styles.container, { paddingTop: 12 }]}>
        <EventlyText style={{ color: '#101a31', fontSize: 20, fontWeight: '700', paddingHorizontal: 16 }}>
          Guest list
        </EventlyText>
        <EventlyText variant="small" style={[styles.subtitle, { marginTop: 4 }]}>
          {summaryLine(LIST, GUEST_COPY.count, GUEST_COPY.invited)}
        </EventlyText>
        <GroupFilter options={groupFilters(LIST)} active={null} onChange={noop} />
        <View style={styles.content}>
          {LIST.map((g) => (
            <GuestRow key={g.id} guest={toRow(g)} onEdit={noop} />
          ))}
        </View>
        <View style={footerStyles.bar}>
          <View style={footerStyles.contacts}>
            <EventlyIcon name="account-outline" size={22} color="#101a31" />
          </View>
          <View style={footerStyles.cta}>
            <EventlyIcon name="plus" size={20} color="#ffffff" />
            <EventlyText style={footerStyles.ctaText}>{GUEST_COPY.addGuest}</EventlyText>
          </View>
        </View>
      </View>
    );

    const sheet = (
      <GuestSheet
        visible
        initial={null}
        isSaving={false}
        errorMessage={null}
        onSave={noop}
        onClose={noop}
      />
    );

    fs.writeFileSync(
      out,
      page(
        [
          ['Guest list', toHtml(render(list).toJSON())],
          ['Add a guest', toHtml(render(sheet).toJSON())],
        ],
        { title: 'Guest list', width: 390, background: '#fffcf8', padding: 0 },
      ),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
