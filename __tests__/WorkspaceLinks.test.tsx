/**
 * @format
 *
 * The workspace's two "open something bigger" sections: the ideas board and
 * the guest invitation. Both summarise real state, and both have a state that
 * is easy to get wrong — a board nobody has posted to, and an invitation the
 * organizer has not shared yet.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, size, color }: { name: string; size?: number; color?: string }) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});

import { IdeasSummary } from '../src/modules/Workspace/sections/WorkspaceLinks';
import { InvitationTab } from '../src/modules/Workspace/sections/InvitationTab';
import { mapWorkspace } from '../src/modules/Workspace/utils';
import type { IdeaDTO, InvitationDTO } from '../src/modules/Workspace/types';

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
  return out.join('');
}

const noop = () => {};

const idea = (over: Partial<IdeaDTO> = {}): IdeaDTO =>
  ({
    id: 'i1',
    authorRole: 'organizer',
    authorName: 'MAHENDRA EVENTS',
    type: 'idea',
    text: 'Thinking a marigold and white palette for the stage.',
    images: [],
    confidential: false,
    reply: null,
    approval: 'none',
    approvalLabel: '',
    createdAt: new Date().toISOString(),
    ...over,
  }) as IdeaDTO;

describe('IdeasSummary', () => {
  it('says what the board is for rather than reporting three zeros', () => {
    const text = textOf(
      render(
        <IdeasSummary
          counts={{ shared: 0, planned: 0, awaitingApproval: 0 }}
          organizerName="MAHENDRA EVENTS"
          latest={null}
          onPress={noop}
        />,
      ),
    );

    expect(text).toContain('Ideas & Planning');
    expect(text).toContain('Explore ideas, themes and tips');
    expect(text).not.toContain('0 ideas shared');
    expect(text).toContain('Start');
  });

  it('reports the real board state once something has been shared', () => {
    const text = textOf(
      render(
        <IdeasSummary
          counts={{ shared: 3, planned: 2, awaitingApproval: 1 }}
          organizerName="MAHENDRA EVENTS"
          latest={null}
          onPress={noop}
        />,
      ),
    );

    expect(text).toContain('3 ideas shared · 2 planned · 1 awaiting your approval');
    expect(text).toContain('Explore');
  });

  it('says "1 idea", not "1 ideas"', () => {
    const text = textOf(
      render(
        <IdeasSummary
          counts={{ shared: 1, planned: 0, awaitingApproval: 0 }}
          organizerName={null}
          latest={null}
          onPress={noop}
        />,
      ),
    );
    expect(text).toContain('1 idea shared');
  });

  it('still renders while the counts are loading', () => {
    // The board loads alongside the booking, so the card must not vanish
    // (or crash) in the gap.
    const text = textOf(
      render(<IdeasSummary counts={null} organizerName="ME" latest={null} onPress={noop} />),
    );
    expect(text).toContain('Ideas & Planning');
  });

  /*
   * The organizer's newest post, on the card. The customer should not have to
   * open the board to find out that something is waiting there.
   */
  it('shows the organizer\'s newest post and who it came from', () => {
    const text = textOf(
      render(
        <IdeasSummary
          counts={{ shared: 2, planned: 0, awaitingApproval: 0 }}
          organizerName="MAHENDRA EVENTS"
          latest={idea()}
          onPress={noop}
        />,
      ),
    );

    expect(text).toContain('marigold and white palette');
    expect(text).toContain('From MAHENDRA EVENTS');
  });

  it('shows the board\'s own word for a post that has been signed off', () => {
    const text = textOf(
      render(
        <IdeasSummary
          counts={{ shared: 2, planned: 1, awaitingApproval: 0 }}
          organizerName="MAHENDRA EVENTS"
          latest={idea({ approval: 'approved', approvalLabel: 'You approved this' })}
          onPress={noop}
        />,
      ),
    );

    // The board's label, not a sentence this card made up about it.
    expect(text).toContain('You approved this');
    expect(text).not.toContain('From MAHENDRA EVENTS');
  });

  it('draws no post block at all when the organizer has written nothing', () => {
    const text = textOf(
      render(
        <IdeasSummary
          counts={{ shared: 1, planned: 0, awaitingApproval: 0 }}
          organizerName="MAHENDRA EVENTS"
          latest={null}
          onPress={noop}
        />,
      ),
    );
    expect(text).not.toContain('From MAHENDRA EVENTS');
  });
});

const invitation = (over: Partial<InvitationDTO> = {}): InvitationDTO =>
  ({
    id: 'i1',
    bookingId: 'b1',
    bookingTitle: 'T',
    status: 'sent',
    sentAt: null,
    approvedAt: null,
    details: {
      eyebrow: 'Together with their families',
      hostOne: 'Aarav',
      hostTwo: 'Diya',
      joiner: '&',
      eventDate: '2026-11-06',
      eventTime: '7:00 PM',
      venueName: 'Taj Krishna',
      venueAddress: '',
    },
    subEvents: [],
    ...over,
  }) as InvitationDTO;

const workspace = mapWorkspace({
  id: 'b1',
  ref: 'EVT-1',
  title: 'Birthday',
  description: '',
  occasion: 'birthday',
  location: 'Hitech city, Hyderabad',
  eventDate: '2026-11-06T00:00:00.000Z',
  daysToGo: 30,
  amount: 100000,
  advanceAmount: 30000,
  advancePercentage: 30,
  balanceAmount: 70000,
  paymentStatus: 'unpaid',
  amountPaid: 0,
  progress: 40,
  status: 'confirmed',
  steps: [],
  tasks: [],
  timeline: [],
  organizer: { id: 'o1', name: 'MAHENDRA EVENTS', initials: 'ME', avatarColor: '#333' },
  customer: null,
} as unknown as Parameters<typeof mapWorkspace>[0]);

const tab = (props: Partial<Parameters<typeof InvitationTab>[0]> = {}) => (
  <InvitationTab
    workspace={workspace}
    invitation={invitation()}
    guests={null}
    onOpenInvitation={noop}
    onOpenGuests={noop}
    {...props}
  />
);

describe('InvitationTab', () => {
  it('reads as a step under way, not an error, before the organizer shares it', () => {
    const text = textOf(render(tab({ invitation: null })));

    expect(text).toContain('Being designed');
    expect(text).toContain('MAHENDRA EVENTS is crafting your invitation');
    // Nothing to open yet, so no review is offered — but the guest list can start.
    expect(text).not.toContain('Review invitation');
    expect(text).toContain('Start guest list');
  });

  it('draws the invitation itself: its hosts, date and venue', () => {
    const text = textOf(render(tab()));
    expect(text).toContain('Aarav & Diya');
    expect(text).toContain('7:00 PM');
    expect(text).toContain('Taj Krishna');
  });

  it('asks for a review once it has been shared, and opens it rather than approving here', () => {
    const onOpenInvitation = jest.fn();
    const tree = render(tab({ onOpenInvitation }));
    const text = textOf(tree);
    expect(text).toContain('Ready for your review');

    // Approving is a decision made after reading the thing.
    const button = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((n) => String(n.props.accessibilityLabel).startsWith('Review invitation'));
    expect(button).toBeDefined();
    ReactTestRenderer.act(() => button!.props.onPress());
    expect(onOpenInvitation).toHaveBeenCalledTimes(1);
  });

  it('reports the live guest link once approved', () => {
    const text = textOf(render(tab({ invitation: invitation({ status: 'approved' }) })));
    expect(text).toContain('Approved & live');
    expect(text).toContain('View & share');
  });

  it('says in one line how far an approved invitation has reached', () => {
    const text = textOf(
      render(
        tab({
          invitation: invitation({ status: 'approved' }),
          guests: { total: 12, sent: 5, viewed: 3 },
        }),
      ),
    );
    expect(text).toContain('Sent to 5 of 12 guests');
    // One screen, one decision: no guest rings, no second tile, no programme.
    expect(text).not.toContain('Invited');
    expect(text).not.toContain('The programme');
  });

  it('offers exactly one main action', () => {
    const tree = render(tab());
    const buttons = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .filter((n) => typeof n.props.onPress === 'function')
      .map((n) => String(n.props.accessibilityLabel));
    // The card itself (opens the invitation) and the one next-step button.
    expect(new Set(buttons)).toEqual(new Set(['Open your guest invitation', 'Review invitation']));
  });

  it('starts the guest list while the invitation is still being designed', () => {
    const onOpenGuests = jest.fn();
    const tree = render(tab({ invitation: null, guests: { total: 0, sent: 0, viewed: 0 }, onOpenGuests }));
    const button = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((n) => n.props.accessibilityLabel === 'Start guest list');
    expect(button).toBeDefined();
    ReactTestRenderer.act(() => button!.props.onPress());
    expect(onOpenGuests).toHaveBeenCalledTimes(1);
  });
});
