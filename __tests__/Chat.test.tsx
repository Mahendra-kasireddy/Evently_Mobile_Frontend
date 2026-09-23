/**
 * @format
 *
 * Messaging.
 *
 * Mostly about time and about not claiming things: how recent a message is
 * decides how its timestamp is written, a day heading answers "when" once for
 * everything under it, and nothing is shown as sent that was not.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, size, color }: { name: string; size?: number; color?: string }) {
    return <Text style={{ fontSize: size, color }}>{` icon:${name}`}</Text>;
  };
});

import { View } from 'react-native';
import { page, toHtml } from '../test-utils/rn-to-html';
import { EventlyIcon, EventlyText } from '../src/Components';
import { styles as inboxStyles, threadStyles } from '../src/modules/Chat/styles';
import { ConversationRow } from '../src/modules/Chat/sections/ConversationRow';
import { ThreadHeader } from '../src/modules/Chat/sections/ThreadHeader';
import { SuggestionBar } from '../src/modules/Chat/sections/SuggestionBar';
import {
  dayLabel,
  groupMessages,
  mapConversations,
  replyLabel,
  showDayLabels,
  suggestionsFor,
  whenLabel,
} from '../src/modules/Chat/utils';
import {
  CHAT_COPY,
  FOLLOW_UP_SUGGESTIONS,
  MIN_REPLY_SAMPLES,
  OPENING_SUGGESTIONS,
} from '../src/modules/Chat/constants';
import type { ConversationDTO, MessageDTO } from '../src/modules/Chat/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

/** A fixed "now" so nothing here depends on when the suite runs. */
const NOW = new Date('2026-09-04T14:00:00.000Z');
const at = (iso: string) => iso;

const conversation = (over: Partial<ConversationDTO> = {}): ConversationDTO => ({
  id: 'c1',
  withName: 'Mahendra Events',
  withInitials: 'ME',
  withAvatarColor: '#7C5CE6',
  organizerId: 'o1',
  lastMessageText: 'We can do the marigold stage for 150.',
  lastMessageAt: at('2026-09-04T12:05:00.000Z'),
  unread: 2,
  ...over,
});

const message = (over: Partial<MessageDTO> = {}): MessageDTO => ({
  id: 'm1',
  sender: 'customer',
  text: 'Are you free on the 5th?',
  createdAt: at('2026-09-04T09:00:00.000Z'),
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

const noop = () => {};

/** What the composer's placeholder looks like, for the render dump only. */
const placeholderStyle = { color: '#8a8f98', fontSize: 15 };

describe('whenLabel', () => {
  it('counts how long ago rather than printing a clock time', () => {
    // Scanning an inbox is about how long ago, not about when: "14:32" makes
    // the reader do the subtraction themselves.
    expect(whenLabel('2026-09-04T13:59:40.000Z', NOW)).toBe('Now');
    expect(whenLabel('2026-09-04T13:35:00.000Z', NOW)).toBe('25m');
    expect(whenLabel('2026-09-04T09:00:00.000Z', NOW)).toBe('5h');
  });

  it('says the word for yesterday and dates anything older', () => {
    expect(whenLabel('2026-09-03T12:05:00.000Z', NOW)).toBe('Yesterday');
    expect(whenLabel('2026-09-01T12:05:00.000Z', NOW)).toBe('1 Sept');
    expect(whenLabel('2026-08-01T12:05:00.000Z', NOW)).toBe('1 Aug');
  });

  it('says nothing for a thread nobody has written in', () => {
    expect(whenLabel(null, NOW)).toBe('');
    expect(whenLabel('not-a-date', NOW)).toBe('');
  });
});

describe('dayLabel', () => {
  it('reads as words for the recent days and a full date beyond them', () => {
    expect(dayLabel('2026-09-04T09:00:00.000Z', NOW)).toBe('Today');
    expect(dayLabel('2026-09-03T09:00:00.000Z', NOW)).toBe('Yesterday');
    expect(dayLabel('2026-08-01T09:00:00.000Z', NOW)).toBe('1 August 2026');
  });
});

describe('groupMessages', () => {
  it('puts a day heading over each run rather than stamping every bubble', () => {
    const groups = groupMessages(
      [
        message({ id: 'a', createdAt: at('2026-09-03T09:00:00.000Z') }),
        message({ id: 'b', createdAt: at('2026-09-03T09:05:00.000Z') }),
        message({ id: 'c', createdAt: at('2026-09-04T10:00:00.000Z') }),
      ],
      NOW,
    );

    expect(groups).toHaveLength(2);
    expect(groups[0].dayLabel).toBe('Yesterday');
    expect(groups[0].items.map((i) => i.id)).toEqual(['a', 'b']);
    expect(groups[1].dayLabel).toBe('Today');
  });

  it('keeps the order it was given — oldest first', () => {
    const groups = groupMessages([message({ id: 'a' }), message({ id: 'b' })], NOW);
    expect(groups[0].items.map((i) => i.id)).toEqual(['a', 'b']);
  });

  it('has nothing to group when the thread is empty', () => {
    expect(groupMessages([], NOW)).toEqual([]);
  });
});

describe('mapConversations', () => {
  it('carries the preview, the count and when it last moved', () => {
    const [item] = mapConversations([conversation()], NOW);
    expect(item.preview).toBe('We can do the marigold stage for 150.');
    expect(item.unread).toBe(2);
    expect(item.whenLabel).toBe('1h');
  });

  it('leaves a brand-new thread with no preview and no time', () => {
    const [item] = mapConversations(
      [conversation({ lastMessageText: '', lastMessageAt: null, unread: 0 })],
      NOW,
    );
    expect(item.preview).toBe('');
    expect(item.whenLabel).toBe('');
  });
});

describe('ConversationRow', () => {
  it('shows who it is with, what was said and how many are unread', () => {
    const text = textOf(
      render(<ConversationRow item={mapConversations([conversation()], NOW)[0]} onPress={noop} />),
    );
    expect(text).toContain('Mahendra Events');
    expect(text).toContain('marigold stage');
    expect(text).toContain('2');
  });

  it('shows no badge when there is nothing unread', () => {
    const item = mapConversations([conversation({ unread: 0 })], NOW)[0];
    const tree = render(<ConversationRow item={item} onPress={noop} />);
    // A badge reading "0" is noise.
    expect(tree.root.findAllByProps({ accessibilityRole: 'button' })[0].props.accessibilityLabel)
      .not.toContain('unread');
  });

  it('says a thread is empty rather than showing a name and nothing else', () => {
    /*
     * "Message organizer" opens a thread before anybody writes, so an empty
     * preview is a real state and not a loading one. The row used to drop the
     * line altogether, which left a coloured square, a name, and no clue
     * whether the message had failed to load.
     */
    const item = mapConversations(
      [conversation({ lastMessageText: '', lastMessageAt: null, unread: 0 })],
      NOW,
    )[0];
    const text = textOf(render(<ConversationRow item={item} onPress={noop} />));
    expect(text).toContain('No messages yet');
  });

  it('falls back to a monogram the server did not send', () => {
    // An empty one drew a coloured tile with nothing on it, which reads as an
    // avatar that failed to load.
    const item = mapConversations(
      [conversation({ withInitials: '', withName: 'Mahendra Events' })],
      NOW,
    )[0];
    expect(item.withInitials).toBe('ME');
  });
});

describe('the composer', () => {
  it('states its own height rather than leaving it to the platform', () => {
    /*
     * A multiline field sizes itself from its font metrics, and iOS and
     * Android disagree about them — the same box came out two different
     * heights on the two platforms. One line plus its padding is 44, said
     * here, with the line height to match.
     */
    const styles = require('../src/modules/Chat/styles').threadStyles;
    // The box is a View with a stated height; the field inside it carries no
    // border, padding or line height that the platform could misplace.
    expect(styles.inputWrap.minHeight).toBe(40);
    expect(styles.input.padding).toBe(0);
    expect(styles.input.lineHeight).toBeUndefined();
    expect(styles.input.borderWidth).toBeUndefined();
    // The send button and the box are the same height, or the row looks like
    // the button is falling out of it.
    expect(styles.send.height).toBe(styles.inputWrap.minHeight);
  });

  it('leaves the home-indicator inset to render time', () => {
    // Padding it in the stylesheet would double up once the keyboard is open,
    // which is a band of white above the keys.
    const styles = require('../src/modules/Chat/styles').threadStyles;
    expect(styles.foot.paddingBottom).toBeUndefined();
  });
});

describe('copy', () => {
  it('says how new messages arrive, because the app polls rather than streams', () => {
    // A chat that looks live but is not is worse than one that says what it
    // does — said where somebody looks for it, next to the gesture that does it.
    expect(CHAT_COPY.freshnessNote).toContain('Pull down');
  });

  it('offers no suggestion that asserts anything', () => {
    // A chip is a question the customer might ask, never a claim about the
    // organizer, the price or the date.
    for (const text of [...OPENING_SUGGESTIONS, ...FOLLOW_UP_SUGGESTIONS]) {
      expect(text.endsWith('?')).toBe(true);
    }
  });
});

describe('replyLabel', () => {
  it('will not make the claim before there is a habit to describe', () => {
    // `responseHours` on the profile is a schema default of 24 that nothing
    // writes. One or two replies is not better evidence than that.
    expect(replyLabel(120, 0)).toBe('');
    expect(replyLabel(120, MIN_REPLY_SAMPLES - 1)).toBe('');
  });

  it('writes the measured median the way it would be said', () => {
    expect(replyLabel(25, 8)).toBe('Usually replies in 25m');
    expect(replyLabel(120, 8)).toBe('Usually replies in 2h');
    expect(replyLabel(60 * 26, 8)).toBe('Usually replies in a day');
    expect(replyLabel(60 * 24 * 3, 8)).toBe('Usually replies in 3 days');
  });

  it('never rounds a fast organizer down to "0m"', () => {
    expect(replyLabel(0.4, 8)).toBe('Usually replies in 1m');
  });
});

describe('showDayLabels', () => {
  it('says nothing over a thread that is all one day', () => {
    const oneDay = groupMessages([message({ id: 'a' }), message({ id: 'b' })], NOW);
    expect(showDayLabels(oneDay)).toBe(false);
  });

  it('labels every group once a thread spans two', () => {
    const twoDays = groupMessages(
      [
        message({ id: 'a', createdAt: at('2026-09-03T09:00:00.000Z') }),
        message({ id: 'b', createdAt: at('2026-09-04T09:00:00.000Z') }),
      ],
      NOW,
    );
    expect(showDayLabels(twoDays)).toBe(true);
  });
});

describe('suggestionsFor', () => {
  it('offers an opener before anyone has written', () => {
    expect(suggestionsFor(false)).toEqual(OPENING_SUGGESTIONS);
  });

  it('offers the things people forget to pin down once it is running', () => {
    expect(suggestionsFor(true)).toEqual(FOLLOW_UP_SUGGESTIONS);
  });
});

describe('ThreadHeader', () => {
  const summary = (over: Partial<ConversationDTO> = {}) =>
    mapConversations([conversation(over)], NOW)[0];

  it('shows who it is with and how fast they answer, when that is measured', () => {
    const text = textOf(
      render(
        <ThreadHeader
          summary={summary({ replyMedianMinutes: 120, replySamples: 9 })}
          fallbackName="Mahendra Events"
          onBack={noop}
          onQuote={noop}
        />,
      ),
    );
    expect(text).toContain('Mahendra Events');
    expect(text).toContain('Usually replies in 2h');
    expect(text).toContain('Quote');
  });

  it('drops the reply line rather than guessing at it', () => {
    const text = textOf(
      render(
        <ThreadHeader
          summary={summary({ replyMedianMinutes: 0, replySamples: 0 })}
          fallbackName="Mahendra Events"
          onBack={noop}
        />,
      ),
    );
    expect(text).not.toContain('Usually replies');
  });

  it('names the thread from the route before the summary arrives', () => {
    // A header that is blank for a second reads as a broken screen.
    const text = textOf(
      render(<ThreadHeader summary={null} fallbackName="Sruthi Celebrations" onBack={noop} />),
    );
    expect(text).toContain('Sruthi Celebrations');
  });

  it('offers no quote button when there is no organizer to ask', () => {
    const text = textOf(
      render(<ThreadHeader summary={null} fallbackName="Mahendra Events" onBack={noop} />),
    );
    expect(text).not.toContain('Quote');
  });
});

describe('SuggestionBar', () => {
  it('fills the box rather than sending, so the customer presses send', () => {
    const picked: string[] = [];
    const tree = render(
      <SuggestionBar suggestions={['Can you itemise the decor?']} onPick={(t) => picked.push(t)} />,
    );
    ReactTestRenderer.act(() => {
      tree.root.findAllByProps({ accessibilityRole: 'button' })[0].props.onPress();
    });
    expect(picked).toEqual(['Can you itemise the decor?']);
  });

  it('renders nothing at all when there is nothing to suggest', () => {
    expect(render(<SuggestionBar suggestions={[]} onPick={noop} />).toJSON()).toBeNull();
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const items = mapConversations(
      [
        conversation({
          lastMessageText: 'Both are doable. The dosa counter adds about ₹18,000 for 150 guests.',
          lastMessageAt: at('2026-09-04T09:00:00.000Z'),
          unread: 0,
        }),
        conversation({
          id: 'c2',
          withName: 'Sruthi Celebrations',
          withInitials: 'SC',
          withAvatarColor: '#e8633a',
          lastMessageText: 'Sent you the revised quote with the decor itemised.',
          lastMessageAt: at('2026-09-03T18:20:00.000Z'),
          unread: 2,
        }),
        conversation({
          id: 'c3',
          withName: 'Venkat Decor & Events',
          withInitials: 'VD',
          withAvatarColor: '#1d9e75',
          lastMessageText: 'Thanks for the brief — quote coming by tonight.',
          lastMessageAt: at('2026-09-03T10:00:00.000Z'),
          unread: 0,
        }),
      ],
      NOW,
    );

    const thread = groupMessages(
      [
        message({
          id: 'm1',
          sender: 'organizer',
          text:
            'Namaste! I have your naming ceremony brief for 5 September, 150 guests in ' +
            'Kukatpally. Sending an itemised quote by tonight.',
          createdAt: at('2026-09-04T04:11:00.000Z'),
        }),
        message({
          id: 'm2',
          sender: 'customer',
          text: 'Thank you. Can you include a live dosa counter and keep decor in marigold?',
          createdAt: at('2026-09-04T04:14:00.000Z'),
        }),
        message({
          id: 'm3',
          sender: 'organizer',
          text:
            'Both are doable. The dosa counter adds about ₹18,000 for 150 guests. ' +
            'Marigold is already in the decor line.',
          createdAt: at('2026-09-04T04:22:00.000Z'),
        }),
      ],
      NOW,
    );

    const header = mapConversations(
      [conversation({ replyMedianMinutes: 120, replySamples: 9 })],
      NOW,
    )[0];

    const inbox = (
      <View style={inboxStyles.container}>
        <View style={inboxStyles.header}>
          <EventlyText variant="h1" style={inboxStyles.title}>
            {CHAT_COPY.title}
          </EventlyText>
        </View>
        <View style={inboxStyles.list}>
          {items.map((item) => (
            <ConversationRow key={item.id} item={item} onPress={noop} />
          ))}
        </View>
      </View>
    );

    const conversationScreen = (
      <View style={threadStyles.container}>
        <ThreadHeader summary={header} fallbackName="Mahendra Events" onBack={noop} onQuote={noop} />
        <View style={threadStyles.list}>
          {thread.map((group) => (
            <View key={group.key}>
              {group.items.map((item) => {
                const mine = item.sender === 'customer';
                return (
                  <View key={item.id} style={[threadStyles.bubble, mine ? threadStyles.mine : threadStyles.theirs]}>
                    <EventlyText
                      variant="body"
                      style={mine ? threadStyles.mineText : threadStyles.theirsText}
                    >
                      {item.text}
                    </EventlyText>
                    <EventlyText
                      variant="caption"
                      style={[threadStyles.time, mine ? threadStyles.mineTime : threadStyles.theirsTime]}
                    >
                      {item.timeLabel}
                    </EventlyText>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        <View style={threadStyles.foot}>
          <SuggestionBar suggestions={suggestionsFor(true)} onPick={noop} />
          <View style={threadStyles.composer}>
            <View style={threadStyles.input}>
              <EventlyText variant="body" style={placeholderStyle}>
                Message Mahendra Events…
              </EventlyText>
            </View>
            <View style={threadStyles.send}>
              <EventlyIcon name="arrow-right" size={22} color="#ffffff" />
            </View>
          </View>
        </View>
      </View>
    );

    const panels: Array<[string, string]> = [
      ['Messages', toHtml(render(inbox).toJSON())],
      ['Conversation', toHtml(render(conversationScreen).toJSON())],
    ];

    fs.writeFileSync(
      out,
      page(panels, { title: 'Messaging', width: 390, background: '#faf8f7', padding: 0 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
