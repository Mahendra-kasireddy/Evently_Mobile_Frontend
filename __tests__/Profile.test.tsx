/**
 * @format
 *
 * The profile screen.
 *
 * Mostly about not inventing an account's details: a person with no name gets
 * a prompt rather than a stand-in, a badge only appears for a count that is
 * really there, and no row leads to a screen this app does not have.
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
import { ProfileGroup } from '../src/modules/Profile/sections/ProfileGroup';
import { ProfileIdentity } from '../src/modules/Profile/sections/ProfileIdentity';
import { groupsFor, mapProfile, maskPhone } from '../src/modules/Profile/utils';
import { PROFILE_COPY, PROFILE_GROUPS } from '../src/modules/Profile/constants';
import { groupStyles, rowStyles } from '../src/modules/Profile/styles';
import type { ProfileAction, UserDetailsDTO } from '../src/modules/Profile/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const user = (over: Partial<UserDetailsDTO> = {}): UserDetailsDTO =>
  ({
    id: 'u1',
    name: 'Kasireddy',
    phone: '9849012321',
    email: 'kasireddy@example.com',
    phoneVerified: true,
    city: 'Hyderabad',
    roles: ['customer'],
    status: 'active',
    createdAt: '2026-02-11T00:00:00.000Z',
    ...over,
  }) as UserDetailsDTO;

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

/** One control per handler; host nodes repeat the composite's props. */
function pressables(tree: ReactTestRenderer.ReactTestRenderer): any[] {
  const seen = new Set<unknown>();
  return tree.root.findAllByProps({ accessibilityRole: 'button' }).filter((n: any) => {
    if (typeof n.props.onPress !== 'function' || seen.has(n.props.onPress)) return false;
    seen.add(n.props.onPress);
    return true;
  });
}

const noop = () => {};
const noBadge = () => '';

describe('mapProfile', () => {
  it('prompts for a name rather than inventing one', () => {
    // The old fallback printed the literal word "there" as a person's name.
    expect(mapProfile(user({ name: '' })).displayName).toBe('');
    expect(mapProfile(user()).displayName).toBe('Kasireddy');
  });

  it('falls back to a monogram it can actually draw', () => {
    expect(mapProfile(user({ name: 'Meera Rao' })).initials).toBe('MR');
    // One name is still two letters — a lone capital reads as a placeholder.
    expect(mapProfile(user({ name: 'Kasireddy' })).initials).toBe('KA');
    expect(mapProfile(user({ name: '', phone: '' })).initials).toBe('·');
  });

  it('names every role the account holds, not just the first', () => {
    expect(mapProfile(user({ roles: ['customer', 'organizer'] })).roles).toEqual([
      'Customer',
      'Organizer',
    ]);
  });
});

describe('maskPhone', () => {
  it('hides the middle and keeps enough to recognise the number', () => {
    expect(maskPhone('9849012321')).toBe('+91 98490 ••• 21');
  });

  it('uses one dot per hidden digit, so the length is not misstated', () => {
    // A fixed run of dots would make an 8-digit number look like a 10-digit one.
    const masked = maskPhone('9849012321');
    expect((masked.match(/•/g) ?? []).length).toBe(10 - 5 - 2);
  });

  it('leaves a number too short to mask alone', () => {
    // Hiding one digit of a short string protects nothing and just obscures it.
    expect(maskPhone('12345')).toBe('+91 12345');
    expect(maskPhone('')).toBe('');
  });

  it('reads the digits out of whatever formatting it is given', () => {
    expect(maskPhone('+91 98490 12321')).toBe('+91 98490 ••• 21');
  });
});

describe('the menu', () => {
  it('offers to list a business only to someone who has not', () => {
    const asCustomer = groupsFor(false)
      .flatMap((g) => g.rows)
      .map((r) => r.action);
    const asOrganizer = groupsFor(true)
      .flatMap((g) => g.rows)
      .map((r) => r.action);

    expect(asCustomer).toContain('listBusiness');
    expect(asOrganizer).not.toContain('listBusiness');
    // Dropped, not disabled — a greyed row invites a tap that does nothing.
    expect(asOrganizer).toContain('help');
    expect(asOrganizer).toContain('signOut');
  });

  it('does not promise a stored address book', () => {
    /*
     * What the app has is one Location screen reading the device's position.
     * There is nowhere to keep a list of addresses, so the row is not called
     * "Saved locations".
     */
    const labels = PROFILE_GROUPS.flatMap((g) => g.rows).map((r) => r.label);
    expect(labels).toContain('Location');
    expect(labels).not.toContain('Saved locations');
  });

  it('sets a group heading apart from the rows inside it', () => {
    // A label at the same size, weight and colour as its rows stops grouping.
    const heading = groupStyles.title as Record<string, unknown>;
    const label = rowStyles.label as Record<string, unknown>;
    expect(Number(heading.fontSize)).toBeLessThan(Number(label.fontSize));
    expect(heading.color).not.toBe(label.color);
  });
});

describe('ProfileIdentity', () => {
  it('shows the name, the masked number and a way to change them', () => {
    const text = textOf(render(<ProfileIdentity profile={mapProfile(user())} onEdit={noop} />));

    expect(text).toContain('Kasireddy');
    expect(text).toContain('+91 98490 ••• 21');
    expect(text).toContain(PROFILE_COPY.edit);
  });

  it('asks for a name when the account has none', () => {
    const text = textOf(
      render(<ProfileIdentity profile={mapProfile(user({ name: '' }))} onEdit={noop} />),
    );

    expect(text).toContain(PROFILE_COPY.noName);
  });

  it('opens the screen where details are actually changed', () => {
    const onEdit = jest.fn();
    const tree = render(<ProfileIdentity profile={mapProfile(user())} onEdit={onEdit} />);

    ReactTestRenderer.act(() => pressables(tree)[0].props.onPress());
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});

describe('ProfileGroup', () => {
  const events = PROFILE_GROUPS[0];

  it('is one tap target per row, and reports which was pressed', () => {
    const pressed: ProfileAction[] = [];
    const tree = render(
      <ProfileGroup group={events} badgeFor={noBadge} onPress={(a) => pressed.push(a)} />,
    );

    expect(drawnButtons(tree)).toHaveLength(events.rows.length);
    ReactTestRenderer.act(() => pressables(tree).forEach((b) => b.props.onPress()));
    expect(pressed).toEqual([
      'bookings',
      'savedPackages',
      'invitations',
      // The guest list is its own row: Invitations is the card, this is who
      // receives it, and a host keeps the list long before anything is sent.
      'guestList',
      'payments',
    ]);
  });

  it('shows a badge only for a count that is really there', () => {
    // A pill reading "0 saved" is noise, not information.
    const badgeFor = (action: ProfileAction) =>
      action === 'invitations' ? PROFILE_COPY.approveBadge(2) : '';
    const tree = render(<ProfileGroup group={events} badgeFor={badgeFor} onPress={noop} />);
    expect(textOf(tree)).toContain('2 to approve');
    expect(textOf(tree)).not.toContain('saved');
  });

  it('speaks the badge as part of the row, not as a separate thing', () => {
    const tree = render(
      <ProfileGroup
        group={events}
        badgeFor={(a) => (a === 'savedPackages' ? PROFILE_COPY.savedBadge(1) : '')}
        onPress={noop}
      />,
    );
    const labels = drawnButtons(tree).map((b) => b.props.accessibilityLabel);

    expect(labels).toContain('Saved packages, 1 saved');
    expect(labels).toContain('Bookings');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const screen = (dto: UserDetailsDTO, badges: Partial<Record<ProfileAction, string>>) => {
      const profile = mapProfile(dto);
      return (
        <>
          <ProfileIdentity profile={profile} onEdit={noop} />
          {groupsFor(profile.isOrganizer).map((group) => (
            <ProfileGroup
              key={group.key}
              group={group}
              badgeFor={(action) => badges[action] ?? ''}
              onPress={noop}
            />
          ))}
        </>
      );
    };

    const panels: Array<[string, string]> = [
      [
        'A customer with things waiting',
        toHtml(
          render(
            screen(user(), {
              savedPackages: PROFILE_COPY.savedBadge(1),
              invitations: PROFILE_COPY.approveBadge(2),
            }),
          ).toJSON(),
        ),
      ],
      [
        'A new account, nothing filled in',
        toHtml(render(screen(user({ name: '', phone: '' }), {})).toJSON()),
      ],
      [
        'An account that already runs a business',
        toHtml(render(screen(user({ roles: ['customer', 'organizer'] }), {})).toJSON()),
      ],
    ];

    fs.writeFileSync(
      out,
      page(panels, { title: 'Profile', width: 390, background: '#faf8f7', padding: 0 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
