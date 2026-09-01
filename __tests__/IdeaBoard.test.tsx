/**
 * @format
 *
 * The ideas & planning board.
 *
 * The rules that matter: the banner reports the server's counts rather than a
 * re-derivation, only a post the organizer flagged offers an approve action,
 * a "surprise" is marked confidential, and a filter that would show nothing is
 * not offered.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, size, color }: { name: string; size?: number; color?: string }) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});

jest.mock('react-native-image-picker', () => ({ launchImageLibrary: jest.fn() }));

import { page, toHtml } from '../test-utils/rn-to-html';
import {
  BoardEmpty,
  BoardFilters,
  BoardHero,
  IdeaCard,
  VisionCard,
} from '../src/modules/Workspace/sections/BoardFeed';
import { BoardComposer } from '../src/modules/Workspace/sections/BoardComposer';
import {
  initials,
  matchesBoardFilter,
  plannedPercent,
  relativeTime,
} from '../src/modules/Workspace/constants';
import type { BoardVision, IdeaDTO } from '../src/modules/Workspace/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const idea = (over: Partial<IdeaDTO> = {}): IdeaDTO =>
  ({
    id: 'i1',
    authorRole: 'customer',
    authorName: 'Meera Rao',
    type: 'idea',
    text: 'Marigold and white for the mandap, nothing too loud.',
    images: [],
    confidential: false,
    reply: null,
    approval: 'none',
    approvalLabel: '',
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    ...over,
  }) as IdeaDTO;

const vision: BoardVision = {
  theme: 'Marigold & ivory, courtyard style',
  vibe: 'Warm, unhurried, lots of seating',
  surprise: '',
  food: 'Andhra thali, live dosa counter',
  surpriseConfidential: false,
  captured: true,
};

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
 * Buttons in the rendered host tree. `root.findAllByProps` also matches the
 * composite wrappers around each host element, so counting with it reports one
 * control as several.
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

/** For pressing: the outermost match carries the real onPress. */
function buttons(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root.findAllByProps({ accessibilityRole: 'button' });
}

const noop = () => {};
const noUpload = async () => ({ url: 'u', key: 'k', originalName: 'n' });

describe('BoardHero', () => {
  it('reports the server counts, singular where it matters', () => {
    const text = textOf(
      render(<BoardHero counts={{ shared: 1, planned: 0, awaitingApproval: 2 }} organizerName="MAHENDRA EVENTS" />),
    );

    expect(text).toContain('1Idea shared');
    expect(text).toContain('2Awaiting you');
    expect(text).toContain('MAHENDRA EVENTS turns each idea into a real plan');
  });
});

describe('IdeaCard', () => {
  it('offers approval only on a post the organizer flagged', () => {
    expect(drawnButtons(render(<IdeaCard idea={idea()} isApproving={false} onApprove={noop} />))).toHaveLength(0);

    const pending = render(
      <IdeaCard idea={idea({ approval: 'pending', approvalLabel: 'Confirm the palette' })} isApproving={false} onApprove={noop} />,
    );
    expect(drawnButtons(pending)).toHaveLength(1);
    expect(textOf(pending)).toContain('Confirm the palette');
  });

  it('shows an approved post as settled, with no second approve', () => {
    const tree = render(<IdeaCard idea={idea({ approval: 'approved' })} isApproving={false} onApprove={noop} />);

    expect(textOf(tree)).toContain('Approved by you');
    expect(drawnButtons(tree)).toHaveLength(0);
  });

  it("shows the organizer's plan and its status", () => {
    const text = textOf(
      render(
        <IdeaCard
          idea={idea({ reply: { status: 'in_progress', text: 'Florist briefed', at: null } })}
          isApproving={false}
          onApprove={noop}
        />,
      ),
    );

    expect(text).toContain('Turned into a plan');
    expect(text).toContain('In progress');
    expect(text).toContain('Florist briefed');
  });

  it('marks a confidential post as kept private', () => {
    const text = textOf(
      render(<IdeaCard idea={idea({ type: 'surprise', confidential: true })} isApproving={false} onApprove={noop} />),
    );
    expect(text).toContain('Kept private');
    expect(text).toContain('Surprise');
  });
});

describe('BoardComposer', () => {
  const composer = (props: Partial<React.ComponentProps<typeof BoardComposer>> = {}) =>
    render(
      <BoardComposer
        authorName="Meera Rao"
        organizerName="MAHENDRA EVENTS"
        isPosting={false}
        isUploading={false}
        postErrorMessage={null}
        onUpload={noUpload}
        onPost={noop}
        {...props}
      />,
    );

  it('shows the customer their own monogram', () => {
    expect(textOf(composer())).toContain('MR');
    expect(initials('Meera Rao')).toBe('MR');
    expect(initials('')).toBe('·');
  });

  it('offers only the types a customer may post', () => {
    const text = textOf(composer());

    expect(text).toContain('Idea');
    expect(text).toContain('Inspiration');
    expect(text).toContain('Question');
    expect(text).toContain('Surprise');
    // The organizer's status note — the API rewrites it to an idea anyway.
    expect(text).not.toContain('Update');
  });

  it('marks a surprise confidential and says so', () => {
    const tree = composer();
    const surprise = buttons(tree).find((b) => b.props.accessibilityLabel === 'Surprise');

    ReactTestRenderer.act(() => surprise!.props.onPress());
    expect(textOf(tree)).toContain('Only you and MAHENDRA EVENTS will see this');
  });

  it('will not post an empty idea', () => {
    const onPost = jest.fn();
    const tree = composer({ onPost });
    const postButton = buttons(tree).find((b) => b.props.accessibilityLabel === 'Post idea');

    expect(postButton!.props.disabled).toBe(true);
    ReactTestRenderer.act(() => postButton!.props.onPress());
    expect(onPost).not.toHaveBeenCalled();
  });

  it('sends the text, type and confidentiality it was set to', () => {
    const onPost = jest.fn();
    const tree = composer({ onPost });

    const input = tree.root.findAllByProps({ multiline: true })[0];
    ReactTestRenderer.act(() => input.props.onChangeText('Marigold garlands'));
    const surprise = buttons(tree).find((b) => b.props.accessibilityLabel === 'Surprise');
    ReactTestRenderer.act(() => surprise!.props.onPress());
    const postButton = buttons(tree).find((b) => b.props.accessibilityLabel === 'Post idea');
    ReactTestRenderer.act(() => postButton!.props.onPress());

    expect(onPost).toHaveBeenCalledWith({
      text: 'Marigold garlands',
      type: 'surprise',
      confidential: true,
      images: [],
    });
  });

  it('blocks posting while a photo is still uploading', () => {
    // A post submitted mid-upload would lose the attachment.
    const tree = composer({ isUploading: true });
    const postButton = buttons(tree).find((b) => b.props.accessibilityLabel === 'Post idea');
    expect(postButton!.props.disabled).toBe(true);
  });
});

describe('BoardFilters', () => {
  it('offers only filters that would show something', () => {
    const items = [idea(), idea({ id: 'i2', type: 'question' })];
    const text = textOf(render(<BoardFilters value="all" items={items} onChange={noop} />));

    expect(text).toContain('All · 2');
    expect(text).toContain('Ideas · 1');
    // Nothing inspirational, surprising or pending on this board.
    expect(text).not.toContain('Inspiration');
    expect(text).not.toContain('Surprises');
    expect(text).not.toContain('Awaiting you');
  });

  it('hides itself when only "All" would be offered', () => {
    // An organizer update matches no slice of its own, so this board has
    // nothing worth filtering by.
    const tree = render(
      <BoardFilters value="all" items={[idea({ type: 'update', authorRole: 'organizer' })]} onChange={noop} />,
    );
    expect(tree.toJSON()).toBeNull();
  });

  it('keeps the active filter listed even once it empties', () => {
    // Otherwise the row it was selected in would vanish from under the reader.
    const text = textOf(render(<BoardFilters value="awaiting" items={[idea()]} onChange={noop} />));
    expect(text).toContain('Awaiting you · 0');
  });
});

describe('matchesBoardFilter', () => {
  it('routes each post to its slice', () => {
    expect(matchesBoardFilter({ type: 'idea', approval: 'none' }, 'ideas')).toBe(true);
    expect(matchesBoardFilter({ type: 'question', approval: 'none' }, 'ideas')).toBe(false);
    expect(matchesBoardFilter({ type: 'surprise', approval: 'none' }, 'surprises')).toBe(true);
    // "Awaiting" is about the decision, not the kind of post.
    expect(matchesBoardFilter({ type: 'question', approval: 'pending' }, 'awaiting')).toBe(true);
    expect(matchesBoardFilter({ type: 'idea', approval: 'approved' }, 'awaiting')).toBe(false);
    expect(matchesBoardFilter({ type: 'update', approval: 'none' }, 'all')).toBe(true);
  });
});

describe('VisionCard', () => {
  it('explains itself before the organizer has captured anything', () => {
    const text = textOf(
      render(
        <VisionCard
          vision={{ theme: '', vibe: '', surprise: '', food: '', surpriseConfidential: false, captured: false }}
          organizerName="MAHENDRA EVENTS"
        />,
      ),
    );
    expect(text).toContain("MAHENDRA EVENTS hasn't summarised your event yet");
  });

  it('marks an uncaptured slot as outstanding rather than guessing', () => {
    const text = textOf(render(<VisionCard vision={vision} organizerName="ME" />));

    expect(text).toContain('Marigold & ivory, courtyard style');
    // The surprise slot is empty on this vision.
    expect(text).toContain('Not captured yet');
  });
});

describe('BoardEmpty', () => {
  it('tells apart an empty board from an empty filter', () => {
    expect(textOf(render(<BoardEmpty hasAnyPosts={false} organizerName="ME" />))).toContain(
      'Share the first one',
    );
    expect(textOf(render(<BoardEmpty hasAnyPosts organizerName="ME" />))).toContain(
      'Try another filter',
    );
  });
});

describe('helpers', () => {
  it('reads back a post age the way the design does', () => {
    expect(relativeTime(new Date().toISOString())).toBe('just now');
    expect(relativeTime(new Date(Date.now() - 90 * 60_000).toISOString())).toBe('2h ago');
    expect(relativeTime(new Date(Date.now() - 26 * 3600_000).toISOString())).toBe('1 day ago');
    expect(relativeTime(null)).toBe('');
  });

  it('reports zero planned for an empty board, not a division by zero', () => {
    expect(plannedPercent(0, 0)).toBe(0);
    expect(plannedPercent(2, 4)).toBe(50);
    expect(plannedPercent(9, 4)).toBe(100);
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const feed = (
      <>
        <BoardHero counts={{ shared: 3, planned: 2, awaitingApproval: 1 }} organizerName="MAHENDRA EVENTS" />
        <BoardComposer
          authorName="Meera Rao"
          organizerName="MAHENDRA EVENTS"
          isPosting={false}
          isUploading={false}
          postErrorMessage={null}
          onUpload={noUpload}
          onPost={noop}
        />
        <BoardFilters
          value="all"
          items={[idea(), idea({ id: 'i2', type: 'surprise' }), idea({ id: 'i3', approval: 'pending' })]}
          onChange={noop}
        />
        <IdeaCard
          idea={idea({
            reply: { status: 'in_progress', text: 'Florist briefed — samples on Thursday.', at: null },
          })}
          isApproving={false}
          onApprove={noop}
        />
        <IdeaCard
          idea={idea({
            id: 'i2',
            authorRole: 'organizer',
            authorName: 'MAHENDRA EVENTS',
            type: 'update',
            text: 'Mandap frame confirmed with the venue for the 4th.',
            approval: 'pending',
            approvalLabel: 'Confirm the mandap size',
          })}
          isApproving={false}
          onApprove={noop}
        />
        <VisionCard vision={vision} organizerName="MAHENDRA EVENTS" />
      </>
    );

    const empty = (
      <>
        <BoardHero counts={{ shared: 0, planned: 0, awaitingApproval: 0 }} organizerName="MAHENDRA EVENTS" />
        <BoardComposer
          authorName="Meera Rao"
          organizerName="MAHENDRA EVENTS"
          isPosting={false}
          isUploading={false}
          postErrorMessage={null}
          onUpload={noUpload}
          onPost={noop}
        />
        <BoardEmpty hasAnyPosts={false} organizerName="MAHENDRA EVENTS" />
        <VisionCard
          vision={{ theme: '', vibe: '', surprise: '', food: '', surpriseConfidential: false, captured: false }}
          organizerName="MAHENDRA EVENTS"
        />
      </>
    );

    const panels: Array<[string, string]> = [
      ['An active board', toHtml(render(feed).toJSON())],
      ['Nothing shared yet', toHtml(render(empty).toJSON())],
    ];

    fs.writeFileSync(out, page(panels, { title: 'Ideas board', width: 390, background: '#fff', padding: 0 }), 'utf8');
    expect(fs.existsSync(out)).toBe(true);
  });
});
