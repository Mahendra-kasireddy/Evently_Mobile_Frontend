/**
 * @format
 *
 * The guest invitation — the customer's half of the approval loop.
 *
 * The rules that matter: only a section the customer owns is theirs to edit,
 * nothing is shareable until the invitation is approved, a hidden section is
 * not part of what guests see, and the preview shows the published thing
 * rather than the editor.
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
import { GuestPreview, InvitationHero, OwnerBanner, blockIcon } from '../src/modules/Invitation/sections/InvitationParts';
import { SectionRow } from '../src/modules/Invitation/sections/SectionRow';
import { PreviewSheet, ShareSheet } from '../src/modules/Invitation/sections/Sheets';
import { mapInvitationList } from '../src/modules/Invitation/utils';
import type {
  GuestDTO,
  InvitationBlockDTO,
  InvitationDTO,
  InvitationSummaryDTO,
} from '../src/modules/Invitation/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const block = (over: Partial<InvitationBlockDTO> = {}): InvitationBlockDTO => ({
  key: 'story',
  title: 'Our story',
  icon: 'sparkles',
  owner: 'customer',
  hidden: false,
  heading: '',
  body: '',
  ...over,
});

const invitation = (over: Partial<InvitationDTO> = {}): InvitationDTO =>
  ({
    id: 'inv1',
    bookingId: 'bk1',
    bookingRef: 'EVT-2026-1977',
    bookingTitle: 'Your Naming · 5 Sept 2026',
    occasion: 'naming',
    eventDate: '2026-09-05T00:00:00.000Z',
    location: 'Jubilee Hills, Hyderabad',
    status: 'sent',
    sentAt: null,
    approvedAt: null,
    details: {
      eyebrow: 'Together with our families',
      hostOne: 'Meera',
      hostTwo: 'Arjun',
      joiner: '&',
      eventDate: '2026-09-05T00:00:00.000Z',
      eventTime: '6:30 pm',
      venueName: 'Taj Krishna',
      venueAddress: 'Banjara Hills',
    },
    blocks: [
      block({ key: 'header', title: 'Invitation header', icon: 'image' }),
      block({ key: 'countdown', title: 'Countdown', icon: 'clock', owner: 'organizer' }),
      block({ key: 'ride', title: 'Book a ride', icon: 'car', owner: 'organizer', hidden: true }),
    ],
    subEvents: [],
    changeRequests: [],
    ...over,
  }) as InvitationDTO;

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

function labels(tree: ReactTestRenderer.ReactTestRenderer): string[] {
  const out: string[] = [];
  const walk = (n: any) => {
    if (n == null || typeof n === 'string') return;
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (n.props?.accessibilityRole === 'button' && n.props.accessibilityLabel) {
      out.push(String(n.props.accessibilityLabel));
    }
    walk(n.children);
  };
  walk(tree.toJSON());
  return out;
}

const noop = () => {};

describe('InvitationHero', () => {
  it('says plainly whether anything is live yet', () => {
    expect(textOf(render(<InvitationHero invitation={invitation()} organizerName="MAHENDRA EVENTS" />))).toContain(
      'Nothing is live yet. Approve to publish the guest link.',
    );
    expect(
      textOf(render(<InvitationHero invitation={invitation({ status: 'approved' })} organizerName="ME" />)),
    ).toContain('the guest link is live');
  });

  it('credits the organizer who prepared it', () => {
    const text = textOf(render(<InvitationHero invitation={invitation()} organizerName="MAHENDRA EVENTS" />));
    expect(text).toContain('PREPARED BY MAHENDRA EVENTS');
  });
});

describe('SectionRow', () => {
  const row = (b: InvitationBlockDTO, canShare = false, pending = 0) =>
    render(
      <SectionRow
        block={b}
        pendingRequests={pending}
        canShare={canShare}
        onPersonalize={noop}
        onRequestChange={noop}
        onShare={noop}
        onPreview={noop}
      />,
    );

  it('lets the customer edit only what they own', () => {
    // The API rejects personalizing a block the customer does not own, so the
    // row must not offer an edit that would 403.
    expect(labels(row(block()))).toContain('Personalize: Our story');
    expect(labels(row(block({ owner: 'organizer' })))).not.toContain('Personalize: Our story');
  });

  it("offers a change request on the organizer's sections", () => {
    expect(labels(row(block({ owner: 'organizer' })))).toContain('Request change: Our story');
    // The customer's own section is theirs to change directly.
    expect(labels(row(block()))).not.toContain('Request change: Our story');
  });

  it('offers sharing only once the invitation is published', () => {
    expect(labels(row(block(), false))).not.toContain('Share: Our story');
    expect(labels(row(block(), true))).toContain('Share: Our story');
  });

  it('never offers to share a hidden section', () => {
    // It is not part of the published invitation; the API rejects it too.
    expect(labels(row(block({ hidden: true }), true))).not.toContain('Share: Our story');
  });

  it('marks a section as hidden rather than silently dropping it', () => {
    expect(textOf(row(block({ hidden: true })))).toContain('Hidden from guests');
    expect(textOf(row(block()))).toContain('Ready');
  });

  it('says when an ask is already with the organizer', () => {
    expect(textOf(row(block({ owner: 'organizer' }), false, 1))).toContain(
      '1 change request with your organizer',
    );
    expect(textOf(row(block({ owner: 'organizer' }), false, 2))).toContain('2 change requests');
  });

  it('shows the heading the customer wrote, falling back to the section name', () => {
    expect(textOf(row(block({ heading: 'How we met' })))).toContain('How we met');
    expect(textOf(row(block()))).toContain('Our story');
  });

  it('offers a guest preview of every section, hidden ones included', () => {
    // "What does this look like to a guest" is a question about a row, so the
    // answer lives on the row — including for a hidden section, where the
    // answer is that guests never see it.
    expect(labels(row(block()))).toContain('Preview: Our story');
    expect(labels(row(block({ hidden: true })))).toContain('Preview: Our story');
    expect(labels(row(block({ owner: 'organizer' })))).toContain('Preview: Our story');
  });
});

describe('GuestPreview', () => {
  it('shows one section under the invitation header when asked for one', () => {
    const text = textOf(render(<GuestPreview invitation={invitation()} blockKey="countdown" />));

    // The header is the context a guest reads the section in.
    expect(text).toContain('Meera & Arjun');
    expect(text).toContain('Countdown');
    // ...but only the section that was asked for.
    expect(text).not.toContain('Invitation header');
  });

  it('says a hidden section has no guest appearance at all', () => {
    const text = textOf(render(<GuestPreview invitation={invitation()} blockKey="ride" />));

    expect(text).toContain('This section is hidden, so guests never see it');
    expect(text).not.toContain('Book a ride');
  });

  it('shows what a guest would see, and no hidden section', () => {
    const text = textOf(render(<GuestPreview invitation={invitation()} />));

    expect(text).toContain('Meera & Arjun');
    expect(text).toContain('Together with our families');
    expect(text).toContain('Countdown');
    // Hidden from guests, so hidden from a preview of what guests see.
    expect(text).not.toContain('Book a ride');
  });

  it('counts what is hidden, so a short invitation is not mistaken for a broken one', () => {
    expect(textOf(render(<GuestPreview invitation={invitation()} />))).toContain(
      '1 section is hidden from guests.',
    );
  });

  it('falls back to the booking title when no hosts are named', () => {
    const bare = invitation({
      details: { ...invitation().details, hostOne: '', hostTwo: '' },
    });
    expect(textOf(render(<GuestPreview invitation={bare} />))).toContain('Your Naming · 5 Sept 2026');
  });
});

describe('blockIcon', () => {
  it('maps the backend vocabulary onto the app icon set', () => {
    expect(blockIcon('sparkles')).toBe('creation');
    expect(blockIcon('car')).toBe('car-outline');
    // An unknown key must not render a blank square.
    expect(blockIcon('nonesuch')).toBe('card-text-outline');
  });
});

const guest = (over: Partial<GuestDTO> = {}): GuestDTO => ({
  id: 'g1',
  name: 'Rahul',
  phone: '+919000000000',
  phoneDisplay: '+91 90000 00000',
  sharedSections: [],
  lastSharedAt: null,
  viewed: false,
  ...over,
});

describe('ShareSheet', () => {
  const sheet = (props: Partial<React.ComponentProps<typeof ShareSheet>> = {}) =>
    render(
      <ShareSheet
        visible
        guests={[guest()]}
        isLoadingGuests={false}
        isSending={false}
        errorMessage={null}
        outcomes={null}
        onSend={noop}
        onOpenHandoff={noop}
        onClose={noop}
        {...props}
      />,
    );

  it('states the WhatsApp caveat before the customer relies on it', () => {
    // We cannot verify a number has WhatsApp; a message to one that does not
    // simply never arrives.
    expect(textOf(sheet())).toContain("We can’t check whether a number has WhatsApp");
  });

  it('marks a guest who already has this section', () => {
    const text = textOf(sheet({ sectionKey: 'story', guests: [guest({ sharedSections: ['story'] })] }));
    expect(text).toContain('Already sent');
  });

  it("does not mark a guest who has a different section", () => {
    const text = textOf(sheet({ sectionKey: 'story', guests: [guest({ sharedSections: ['countdown'] })] }));
    expect(text).not.toContain('Already sent');
  });

  it('refuses to send to nobody', () => {
    const onSend = jest.fn();
    const tree = sheet({ onSend });
    const send = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((n) => n.props.accessibilityLabel === 'Send on WhatsApp');

    ReactTestRenderer.act(() => send!.props.onPress());
    expect(onSend).not.toHaveBeenCalled();
    expect(textOf(tree)).toContain('Choose at least one guest, or add a new one.');
  });

  it('reports each send, and offers the handoff link where one is needed', () => {
    const text = textOf(
      sheet({
        outcomes: [
          { guest: guest(), status: 'handoff', url: 'https://x', handoffUrl: 'https://wa.me/x' },
          { guest: guest({ id: 'g2', name: 'Priya' }), status: 'failed', url: 'https://y', error: 'No number' },
        ],
      }),
    );

    expect(text).toContain('Open WhatsApp');
    expect(text).toContain('Priya — No number');
    expect(text).toContain('press send there to deliver it');
  });
});

describe('PreviewSheet', () => {
  const sheet = (props: Partial<React.ComponentProps<typeof PreviewSheet>> = {}) =>
    render(
      <PreviewSheet
        visible
        invitation={invitation({ status: 'approved' })}
        canShare
        onShare={noop}
        onClose={noop}
        {...props}
      />,
    );

  it('titles itself, instead of repeating a caption inside the preview', () => {
    const text = textOf(sheet({ blockKey: 'header' }));

    expect(text).toContain('“Invitation header” as guests see it');
    // The old inline caption was a second title saying the same thing.
    expect(text).not.toContain('What your guests see when they open the link');
  });

  it('names who owns the section being previewed', () => {
    expect(textOf(sheet({ blockKey: 'header' }))).toContain('Yours to personalize');
    expect(textOf(sheet({ blockKey: 'countdown' }))).toContain('Built by your organizer');
  });

  it('offers the send straight from the preview', () => {
    // Having just seen what a guest would receive is when a customer decides
    // to send it; closing the sheet to find the button loses that moment.
    const onShare = jest.fn();
    const tree = sheet({ blockKey: 'header', onShare });
    const send = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((n) => n.props.accessibilityLabel === 'Send this section');

    expect(send).toBeDefined();
    ReactTestRenderer.act(() => send!.props.onPress());
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it('withholds the send before approval, and says why', () => {
    const tree = sheet({ invitation: invitation({ status: 'sent' }), canShare: false, blockKey: 'header' });

    expect(labels(tree)).not.toContain('Send this section');
    expect(textOf(tree)).toContain('Approve the invitation first');
  });

  it('withholds the send on a hidden section, and says why', () => {
    // The API rejects sending one; a dead button would be worse than none.
    const tree = sheet({ blockKey: 'ride' });

    expect(labels(tree)).not.toContain('Send this section');
    expect(textOf(tree)).toContain('Hidden sections can’t be sent');
  });

  it('sends the whole invitation when no section is being previewed', () => {
    expect(labels(sheet())).toContain('Send to guests');
  });
});

const summary = (over: Partial<InvitationSummaryDTO> = {}): InvitationSummaryDTO =>
  ({
    bookingId: 'bk1',
    status: 'sent',
    bookingTitle: 'Your Naming · 5 Sept 2026',
    bookingRef: 'EVT-2026-1977',
    occasion: 'naming',
    eventDate: '2026-09-05T00:00:00.000Z',
    sentAt: null,
    approvedAt: null,
    ...over,
  }) as InvitationSummaryDTO;

describe('mapInvitationList', () => {
  it('gives every row a name of its own', () => {
    // The list previously rendered a constant title, so two invitations were
    // indistinguishable — the endpoint returned only an id and a status.
    const rows = mapInvitationList([
      summary(),
      summary({ bookingId: 'bk2', bookingTitle: 'Your Wedding · 12 Dec 2026' }),
    ]);

    expect(rows.map((r) => r.title)).toEqual([
      'Your Naming · 5 Sept 2026',
      'Your Wedding · 12 Dec 2026',
    ]);
    expect(rows[0].ref).toBe('EVT-2026-1977');
    expect(rows[0].dateLabel).toBe('5 Sept 2026');
  });

  it('puts what needs the customer first', () => {
    const rows = mapInvitationList([
      summary({ bookingId: 'approved', status: 'approved' }),
      summary({ bookingId: 'waiting', status: 'sent' }),
    ]);

    expect(rows[0].bookingId).toBe('waiting');
    expect(rows[0].needsYou).toBe(true);
    expect(rows[0].statusLabel).toBe('Needs your approval');
  });

  it('orders the rest by how soon the event is', () => {
    const rows = mapInvitationList([
      summary({ bookingId: 'later', status: 'approved', eventDate: '2027-01-01T00:00:00.000Z' }),
      summary({ bookingId: 'sooner', status: 'approved', eventDate: '2026-09-05T00:00:00.000Z' }),
    ]);

    expect(rows.map((r) => r.bookingId)).toEqual(['sooner', 'later']);
  });

  it('sorts on the timestamp, not on the formatted label', () => {
    // "5 Sept 2026" does not parse back into a Date, and a comparator
    // returning NaN leaves the list in arrival order.
    const rows = mapInvitationList([
      summary({ bookingId: 'b', status: 'approved', eventDate: '2026-12-12T00:00:00.000Z' }),
      summary({ bookingId: 'a', status: 'approved', eventDate: '2026-09-05T00:00:00.000Z' }),
    ]);
    expect(rows.map((r) => r.bookingId)).toEqual(['a', 'b']);
  });

  it('names an untitled booking rather than rendering nothing', () => {
    expect(mapInvitationList([summary({ bookingTitle: '' })])[0].title).toBe('Your event');
  });

  it('survives a booking with no date', () => {
    const rows = mapInvitationList([
      summary({ bookingId: 'dated', status: 'approved' }),
      summary({ bookingId: 'undated', status: 'approved', eventDate: null }),
    ]);

    expect(rows[0].bookingId).toBe('dated');
    expect(rows[1].dateLabel).toBe('');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const full = invitation({
      blocks: [
        block({ key: 'header', title: 'Invitation header', icon: 'image', heading: 'Meera & Arjun', body: 'Together with our families, we invite you.' }),
        block({ key: 'countdown', title: 'Countdown', icon: 'clock', owner: 'organizer' }),
        block({ key: 'story', title: 'Our story', icon: 'sparkles', body: 'Ten years, one courtyard.' }),
        block({ key: 'ride', title: 'Book a ride', icon: 'car', owner: 'organizer', hidden: true }),
      ],
      changeRequests: [
        { id: 'c1', blockKey: 'countdown', blockTitle: 'Countdown', note: 'Start at 6pm', at: '' },
      ],
      subEvents: [
        {
          id: 'se1',
          name: 'Mehendi',
          eventDate: '2026-09-04T00:00:00.000Z',
          eventTime: '4:00 pm',
          endTime: '',
          venueName: 'Courtyard',
          venueAddress: '',
          dressCode: '',
          note: '',
          colour: '#e8633a',
        },
      ],
    });

    const review = (
      <>
        <InvitationHero invitation={full} organizerName="MAHENDRA EVENTS" />
        <OwnerBanner />
        {full.blocks.map((b) => (
          <SectionRow
            key={b.key}
            block={b}
            pendingRequests={b.key === 'countdown' ? 1 : 0}
            canShare={false}
            onPersonalize={noop}
            onRequestChange={noop}
            onShare={noop}
            onPreview={noop}
          />
        ))}
      </>
    );

    const panels: Array<[string, string]> = [
      ['Review — before approval', toHtml(render(review).toJSON())],
      [
        'The eye on one section — approved',
        toHtml(
          render(
            <PreviewSheet
              visible
              invitation={{ ...full, status: 'approved' }}
              blockKey="story"
              canShare
              onShare={noop}
              onClose={noop}
            />,
          ).toJSON(),
        ),
      ],
      [
        'The eye on a hidden section',
        toHtml(
          render(
            <PreviewSheet
              visible
              invitation={{ ...full, status: 'approved' }}
              blockKey="ride"
              canShare
              onShare={noop}
              onClose={noop}
            />,
          ).toJSON(),
        ),
      ],
      [
        'The whole invitation, before approval',
        toHtml(
          render(
            <PreviewSheet visible invitation={full} canShare={false} onShare={noop} onClose={noop} />,
          ).toJSON(),
        ),
      ],
    ];

    fs.writeFileSync(out, page(panels, { title: 'Guest invitation', width: 390, background: '#fff', padding: 0 }), 'utf8');
    expect(fs.existsSync(out)).toBe(true);
  });
});
