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

import { IdeasSummary, InvitationSummary } from '../src/modules/Workspace/sections/WorkspaceLinks';
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
  ({ id: 'i1', bookingId: 'b1', bookingTitle: 'T', status: 'sent', ...over }) as InvitationDTO;

describe('InvitationSummary', () => {
  it('reads as a pending step, not an error, before the organizer shares it', () => {
    const text = textOf(
      render(<InvitationSummary invitation={null} organizerName="MAHENDRA EVENTS" onPress={noop} />),
    );

    expect(text).toContain('MAHENDRA EVENTS is still preparing your guest invitation');
    // Nothing to open yet, so no action is offered.
    expect(text).not.toContain('Review');
  });

  it('asks for a review once it has been shared', () => {
    const text = textOf(render(<InvitationSummary invitation={invitation()} organizerName="ME" onPress={noop} />));

    expect(text).toContain('Your invitation is ready to review');
    expect(text).toContain('awaiting your approval');
    expect(text).toContain('Review');
  });

  it('reports the live guest link once approved', () => {
    const text = textOf(
      render(<InvitationSummary invitation={invitation({ status: 'approved' })} organizerName="ME" onPress={noop} />),
    );

    expect(text).toContain('Your invitation is approved');
    expect(text).toContain('the guest link is live');
    expect(text).toContain('View');
  });

  it('opens the invitation rather than approving from the summary', () => {
    // Approving is a decision made after reading the thing.
    const onPress = jest.fn();
    const tree = render(<InvitationSummary invitation={invitation()} organizerName="ME" onPress={onPress} />);
    const button = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((n) => String(n.props.accessibilityLabel).startsWith('Review'));

    expect(button).toBeDefined();
    ReactTestRenderer.act(() => button!.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
