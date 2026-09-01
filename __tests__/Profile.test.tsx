/**
 * @format
 *
 * The profile screen.
 *
 * Mostly about not inventing an account's details: a person with no name gets
 * a prompt rather than a stand-in, a missing fact reads as missing, and every
 * role the account holds is shown rather than only the first.
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
import { ProfileHeader } from '../src/modules/Profile/sections/ProfileHeader';
import { ProfileInfoList } from '../src/modules/Profile/sections/ProfileInfoList';
import { ProfileMenuList } from '../src/modules/Profile/sections/ProfileMenuList';
import { SignOutRow } from '../src/modules/Profile/sections/SignOutRow';
import { ViewSwitch } from '../src/modules/Profile/sections/ViewSwitch';
import { mapProfile } from '../src/modules/Profile/utils';
import type { UserDetailsDTO } from '../src/modules/Profile/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const user = (over: Partial<UserDetailsDTO> = {}): UserDetailsDTO =>
  ({
    id: 'u1',
    name: 'Meera Rao',
    phone: '+91 90000 00000',
    email: 'meera@example.com',
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

const noop = () => {};

describe('mapProfile', () => {
  it('leaves the name empty rather than inventing one', () => {
    // The old fallback printed "there" — borrowed from the greeting "Hi
    // there" — as if it were the person's name.
    expect(mapProfile(user({ name: '' })).displayName).toBe('');
    expect(mapProfile(user()).displayName).toBe('Meera Rao');
  });

  it('still finds a monogram when there is no name', () => {
    expect(mapProfile(user()).initials).toBe('MR');
    expect(mapProfile(user({ name: '', phone: '9000000000' })).initials).toBe('9');
    expect(mapProfile(user({ name: '', phone: '' })).initials).toBe('·');
  });

  it('shows every role the account holds', () => {
    // An account that is both previously read as "Customer" alone.
    expect(mapProfile(user({ roles: ['customer', 'organizer'] })).roles).toEqual([
      'Customer',
      'Organizer',
    ]);
    expect(mapProfile(user({ roles: [] })).roles).toEqual([]);
  });

  it('keeps a missing fact as a prompt, not a blank', () => {
    const facts = mapProfile(user({ city: '', email: undefined })).facts;
    const city = facts.find((f) => f.key === 'city');
    const email = facts.find((f) => f.key === 'email');

    expect(city?.value).toBe('');
    expect(city?.emptyHint).toBe('Not set');
    expect(email?.emptyHint).toBe('Not added');
  });

  it('drops a fact that has neither a value nor a prompt', () => {
    // "Member since" on an account with no usable created date says nothing.
    const facts = mapProfile(user({ createdAt: 'nonsense' })).facts;
    expect(facts.find((f) => f.key === 'since')).toBeUndefined();
  });

  it('carries whether the phone is verified', () => {
    expect(mapProfile(user()).facts.find((f) => f.key === 'phone')?.verified).toBe(true);
    expect(mapProfile(user({ phoneVerified: false })).facts.find((f) => f.key === 'phone')?.verified).toBe(
      false,
    );
  });
});

describe('ProfileHeader', () => {
  it('prompts for a name the account does not have', () => {
    expect(textOf(render(<ProfileHeader data={mapProfile(user({ name: '' }))} />))).toContain(
      'Add your name',
    );
  });

  it('lists both roles for an account that holds both', () => {
    const text = textOf(
      render(<ProfileHeader data={mapProfile(user({ roles: ['customer', 'organizer'] }))} />),
    );
    expect(text).toContain('Customer');
    expect(text).toContain('Organizer');
  });
});

describe('ProfileInfoList', () => {
  it('shows the verification the screen used to fetch and discard', () => {
    expect(textOf(render(<ProfileInfoList data={mapProfile(user())} />))).toContain('Verified');
    expect(textOf(render(<ProfileInfoList data={mapProfile(user({ phoneVerified: false }))} />))).toContain(
      'Not verified',
    );
  });

  it('does not claim a missing number is unverified', () => {
    // No phone at all is a different thing from an unverified one.
    const text = textOf(render(<ProfileInfoList data={mapProfile(user({ phone: '' }))} />));
    expect(text).not.toContain('Not verified');
  });
});

describe('ProfileMenuList', () => {
  it('renders nothing at all for an empty group', () => {
    expect(render(<ProfileMenuList title="Your events" items={[]} />).toJSON()).toBeNull();
  });

  it('titles the group and describes each destination', () => {
    const text = textOf(
      render(
        <ProfileMenuList
          title="Your events"
          items={[{ key: 'b', icon: 'calendar-check-outline', label: 'My Bookings', hint: 'Plans and payments', onPress: noop }]}
        />,
      ),
    );

    expect(text).toContain('Your events');
    expect(text).toContain('My Bookings');
    expect(text).toContain('Plans and payments');
  });
});

describe('ViewSwitch', () => {
  it('names the view it switches to, not the one you are in', () => {
    expect(textOf(render(<ViewSwitch isOrganizerView={false} onPress={noop} />))).toContain(
      'Switch to organizer dashboard',
    );
    expect(textOf(render(<ViewSwitch isOrganizerView onPress={noop} />))).toContain(
      'Switch to the customer app',
    );
  });
});

describe('SignOutRow', () => {
  it('says what it is doing while it does it', () => {
    expect(textOf(render(<SignOutRow onPress={noop} loading={false} />))).toContain('Sign out');
    expect(textOf(render(<SignOutRow onPress={noop} loading />))).toContain('Signing out…');
  });

  it('cannot be pressed twice while signing out', () => {
    const tree = render(<SignOutRow onPress={noop} loading />);
    const button = tree.root.findAllByProps({ accessibilityRole: 'button' })[0];
    expect(button.props.disabled).toBe(true);
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const screen = (dto: UserDetailsDTO, organizer: boolean) => {
      const data = mapProfile(dto);
      return (
        <>
          <ProfileHeader data={data} />
          <ProfileInfoList data={data} />
          {organizer ? <ViewSwitch isOrganizerView={false} onPress={noop} /> : null}
          <ProfileMenuList
            title="Your events"
            items={[
              { key: 'b', icon: 'calendar-check-outline', label: 'My Bookings', hint: 'Plans, payments and progress', onPress: noop },
              { key: 'i', icon: 'email-heart-outline', label: 'My Invitations', hint: 'Review and send to guests', onPress: noop },
            ]}
          />
          <ProfileMenuList
            title="Account"
            items={[
              { key: 's', icon: 'cog-outline', label: 'Settings', hint: 'Notifications and preferences', onPress: noop },
              { key: 'l', icon: 'shield-check-outline', label: 'Legal & Support', hint: 'Terms, privacy and help', onPress: noop },
            ]}
          />
          <SignOutRow onPress={noop} loading={false} />
        </>
      );
    };

    const panels: Array<[string, string]> = [
      ['A complete account', toHtml(render(screen(user({ roles: ['customer', 'organizer'] }), true)).toJSON())],
      [
        'A new account, nothing filled in',
        toHtml(render(screen(user({ name: '', email: undefined, city: '', phoneVerified: false }), false)).toJSON()),
      ],
    ];

    fs.writeFileSync(out, page(panels, { title: 'Profile', width: 390, background: '#fff', padding: 0 }), 'utf8');
    expect(fs.existsSync(out)).toBe(true);
  });
});
