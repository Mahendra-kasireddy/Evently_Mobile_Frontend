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
import {
  GuestPreview,
  InvitationHero,
  blockIcon,
} from '../src/modules/Invitation/sections/InvitationParts';
import {
  InsideList,
  PrimaryAction,
} from '../src/modules/Invitation/sections/InvitationOverview';
import { CoverBlock } from '../src/modules/Invitation/sections/CoverBlock';
import {
  ArtworkPending,
  InvitationArtwork,
  artworkOf,
} from '../src/modules/Invitation/sections/InvitationArtwork';
import { canPlayVideo } from '../src/modules/Invitation/sections/HeroVideo';
import { StoryBlock } from '../src/modules/Invitation/sections/StoryBlock';
import { CountdownBlock } from '../src/modules/Invitation/sections/CountdownBlock';
import { SaveTheDate } from '../src/modules/Invitation/sections/SaveTheDate';
import { LiveBlock, liveOf } from '../src/modules/Invitation/sections/LiveBlock';
import { isPlayerUrl } from '../src/modules/Invitation/sections/LivePlayer';
import { PreviewSheet, ShareSheet } from '../src/modules/Invitation/sections/Sheets';
import { blockIsWritten, mapInvitationList } from '../src/modules/Invitation/utils';
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
  approved: false,
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

import { ApproveRow } from '../src/modules/Invitation/sections/ApproveRow';

describe('the approval pass', () => {
  it('shows the section itself, not a summary of it', () => {
    /*
     * Approving something you have not read is the one thing this screen must
     * not make easy, so the row carries the words a guest would read.
     */
    const tree = render(
      <ApproveRow
        block={block({
          title: 'How it began',
          body: 'Two families, one long evening of chai and plans.',
        })}
        isApproving={false}
        canShare={false}
        onShare={() => {}}
        onAccept={() => {}}
        onRequestChange={() => {}}
      />,
    );
    const text = textOf(tree);
    expect(text).toContain('Two families, one long evening of chai');
    expect(text).toContain('WAITING ON YOU');
  });

  it('says so, and offers nothing to press, once a section is signed off', () => {
    const tree = render(
      <ApproveRow
        block={block({ approved: true })}
        isApproving={false}
        canShare={false}
        onShare={() => {}}
        onAccept={() => {}}
        onRequestChange={() => {}}
      />,
    );
    expect(textOf(tree)).toContain('Approved by you');
    expect(
      tree.root.findAll(
        (n) =>
          typeof n.props?.testID === 'string' &&
          n.props.testID.startsWith('approve-block-'),
      ),
    ).toHaveLength(0);
  });

  it('offers to send a section only once the invitation is published', () => {
    /*
     * Signing one section off does not publish the invitation — the API
     * refuses to send anything off an unapproved one — so the button appears
     * with the last approval, not the first.
     */
    const approved = block({ approved: true });
    const locked = render(
      <ApproveRow
        block={approved}
        isApproving={false}
        canShare={false}
        onShare={() => {}}
        onAccept={() => {}}
        onRequestChange={() => {}}
      />,
    );
    expect(textOf(locked)).not.toContain('Share this block');

    const live = render(
      <ApproveRow
        block={approved}
        isApproving={false}
        canShare
        onShare={() => {}}
        onAccept={() => {}}
        onRequestChange={() => {}}
      />,
    );
    expect(textOf(live)).toContain('Share this block');
  });

  it('names the empty section rather than asking for approval of nothing', () => {
    const tree = render(
      <ApproveRow
        block={block({ body: '' })}
        isApproving={false}
        canShare={false}
        onShare={() => {}}
        onAccept={() => {}}
        onRequestChange={() => {}}
      />,
    );
    expect(textOf(tree)).toContain('has not written this section yet');
  });
});

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

describe('the invitation cover', () => {
  const card = (over: Partial<InvitationDTO> = {}) =>
    render(<CoverBlock invitation={invitation(over)} mode="guest" />);

  it('never heads the invitation with the booking list title', () => {
    /*
     * "Corporate · 2026-09-29" is composed for a list of bookings. On the
     * card a guest will read, it is a database row.
     */
    const text = textOf(
      card({
        bookingTitle: 'Corporate · 2026-09-29',
        occasion: 'corporate',
        details: { ...invitation().details, hostOne: '', hostTwo: '' },
      }),
    );
    expect(text).toContain('Corporate');
    expect(text).not.toContain('2026-09-29');
  });

  it('prints one venue when the name and the address are the same place', () => {
    // Organizers routinely paste the full address into both fields.
    const full = 'Hi-tech city, Patrika Nagar, Hyderabad';
    const text = textOf(
      card({ details: { ...invitation().details, venueName: full, venueAddress: full } }),
    );
    expect(text.split('Patrika Nagar')).toHaveLength(2);
  });

  it('invites the guest to read on rather than to operate anything', () => {
    expect(textOf(card())).toContain('SCROLL FOR DETAILS');
  });
});

describe('the uploaded invitation', () => {
  const withArtwork = (over: Record<string, unknown> = {}) =>
    invitation({
      details: {
        ...invitation().details,
        heroMediaType: 'image',
        heroMediaUrl: '/api/upload/file/invites/meera-arjun.png',
        ...over,
      },
    });

  it('finds the artwork the organizer uploaded', () => {
    expect(artworkOf(withArtwork())).toEqual({
      kind: 'image',
      url: '/api/upload/file/invites/meera-arjun.png',
      seconds: 0,
    });
  });

  it('reports nothing before the organizer has uploaded one', () => {
    /*
     * A real state, not a failure: the organizer is still designing it. The
     * screen says so rather than framing an empty box.
     */
    expect(artworkOf(invitation())).toBeNull();
  });

  it('ignores a url with no media type behind it', () => {
    // Half a record is not an invitation; rendering it would be a broken image.
    expect(
      artworkOf(
        invitation({
          details: { ...invitation().details, heroMediaUrl: '/x.png', heroMediaType: '' },
        }),
      ),
    ).toBeNull();
  });

  it('offers one way in: the invitation, full screen, as a guest gets it', () => {
    const tree = render(
      <InvitationArtwork
        artwork={{ kind: 'image', url: '/x.png', seconds: 0 }}
        onView={noop}
      />,
    );
    expect(textOf(tree)).toContain('View full screen');
    // The artwork and the button, and nothing else to operate.
    expect(labels(tree)).toEqual(['View full screen', 'View full screen']);
  });

  it('says plainly when a video invitation cannot be played here', () => {
    /*
     * The organizer sent a video and this build ships no player. Saying so is
     * better than a black rectangle the customer would report as a bug.
     */
    const text = textOf(
      render(
        <InvitationArtwork
          artwork={{ kind: 'video', url: '/x.mp4', seconds: 22 }}
          onView={noop}
        />,
      ),
    );
    expect(canPlayVideo ? 'skipped' : text).toContain(
      canPlayVideo ? 'skipped' : 'can’t play video yet',
    );
  });
});

describe('save the date', () => {
  const sub = (over: Record<string, unknown> = {}) => ({
    id: 'se1',
    name: 'Haldi',
    eventDate: '2026-10-09',
    eventTime: '10:00',
    endTime: '',
    timezone: 'Asia/Kolkata',
    venueName: 'Taj Krishna',
    venueAddress: 'Banjara Hills, Hyderabad',
    dressCode: 'Yellow & Floral',
    note: 'Let the celebrations begin!',
    colour: '',
    ...over,
  });

  const block = (subEvents: ReturnType<typeof sub>[]) =>
    render(
      <SaveTheDate
        subEvents={subEvents}
        palette={[{ id: 'saffron', label: 'Saffron', wash: '#fdf6e3', ink: '#9a7b12' }]}
        defaultMinutes={120}
        invitationName="Meera & Arjun"
      />,
    );

  it('is not there at all when the guest is invited to nothing listed', () => {
    /*
     * The whole block, not an empty frame: a guest invited to no listed
     * celebration simply does not have this section.
     */
    expect(block([]).toJSON()).toBeNull();
  });

  it('gives each celebration its day, date, time, venue and dress code', () => {
    const text = textOf(block([sub()]));
    expect(text).toContain('Haldi');
    expect(text).toContain('Friday · 9 October 2026');
    expect(text).toContain('10:00 AM');
    expect(text).toContain('Taj Krishna');
    expect(text).toContain('Banjara Hills, Hyderabad');
    expect(text).toContain('Yellow & Floral');
    expect(text).toContain('Let the celebrations begin!');
  });

  it('keeps the organizer’s order rather than sorting by date', () => {
    // A mehendi listed before a ceremony on the same day carries information
    // a sort would throw away.
    const text = textOf(
      block([sub({ id: 'a', name: 'Sangeet' }), sub({ id: 'b', name: 'Reception' })]),
    );
    expect(text.indexOf('Sangeet')).toBeLessThan(text.indexOf('Reception'));
  });

  it('offers a calendar handoff per celebration', () => {
    expect(labels(block([sub({ id: 'a', name: 'Haldi' }), sub({ id: 'b', name: 'Sangeet' })]))).toEqual([
      'Add to Calendar — Haldi',
      'Add to Calendar — Sangeet',
    ]);
  });

  it('says so rather than offering a dead button when a card has no date', () => {
    const text = textOf(block([sub({ eventDate: '' })]));
    expect(text).toContain('This celebration has no date yet.');
  });
});

describe('the live stream', () => {
  const STREAM = 'https://www.youtube.com/embed/abc123';
  const sub = (over: Record<string, unknown> = {}) => ({
    id: 'se1',
    name: 'The Wedding Ceremony',
    eventDate: '2026-10-10',
    eventTime: '18:00',
    endTime: '',
    timezone: 'Asia/Kolkata',
    venueName: 'Taj Krishna',
    venueAddress: 'Banjara Hills, Hyderabad',
    dressCode: 'Traditional / Formal',
    note: '',
    colour: '',
    liveEnabled: true,
    liveUrl: STREAM,
    ...over,
  });

  const block = (subEvents: ReturnType<typeof sub>[]) =>
    render(<LiveBlock subEvents={subEvents} />);

  it('is not there at all while nothing is on air', () => {
    // The whole block, not an empty frame with a dead LIVE badge on it.
    expect(block([]).toJSON()).toBeNull();
    expect(block([sub({ liveEnabled: false })]).toJSON()).toBeNull();
  });

  it('is not there when the switch is on but no url was given', () => {
    expect(liveOf([sub({ liveUrl: '' })])).toBeNull();
    expect(block([sub({ liveUrl: '' })]).toJSON()).toBeNull();
  });

  it('names the event, badges it live, and carries its details', () => {
    const text = textOf(block([sub()]));
    expect(text).toContain('Live Stream');
    expect(text).toContain('LIVE');
    expect(text).toContain('The Wedding Ceremony');
    expect(text).toContain('10 October 2026');
    expect(text).toContain('6:00 PM');
    expect(text).toContain('Taj Krishna');
    expect(text).toContain('Traditional / Formal');
  });

  it('offers only the ways of watching there is a feed for', () => {
    // One feed is not a choice, so no controls are drawn at all.
    expect(textOf(block([sub()]))).not.toContain('360');

    const all = textOf(block([sub({ live360Url: STREAM, liveVrUrl: STREAM })]));
    expect(all).toContain('Standard');
    expect(all).toContain('360');
    expect(all).toContain('VR');
  });

  it('takes the first event that is on when several are', () => {
    expect(liveOf([sub({ id: 'a', name: 'Mehendi' }), sub({ id: 'b', name: 'Ceremony' })])?.name).toBe(
      'Mehendi',
    );
  });

  it('draws every icon it names from the bundled set', () => {
    /*
     * A name the set does not carry renders as a blank square on the device
     * and as nothing at all here — invisible in review, obvious to a guest.
     * `monitor-play` shipped once and did exactly that.
     */
    const glyphs = require('react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json');
    /* The element tree, not `toJSON()`: the icon renders to a glyph, so the
       name it was asked for only exists on the composite node. */
    const named = (tree: ReactTestRenderer.ReactTestRenderer) =>
      tree.root
        .findAll((n: any) => typeof n.props?.name === 'string', { deep: true })
        .map((n: any) => n.props.name as string);
    const names = named(block([sub({ live360Url: STREAM, liveVrUrl: STREAM })]));
    expect(names.length).toBeGreaterThan(0);
    expect(names.filter((n) => !(n in glyphs))).toEqual([]);
  });

  it('plays the stream in place, rather than handing it off', () => {
    /*
     * The web view is a dependency now, so the card embeds the player and the
     * hand-off line is gone. If this ever flips back it means the module
     * stopped resolving, which is exactly the regression worth catching.
     */
    const tree = block([sub()]);
    expect(tree.root.findAllByProps({ testID: 'live-player' }).length).toBeGreaterThan(0);
    expect(textOf(tree)).not.toContain('Opens in your browser or the streaming app.');
  });

  describe('where the embedded player may navigate', () => {
    /*
     * The frame wears the invitation's chrome, so anywhere it can reach is
     * somewhere a guest may believe is still the invitation. Only the player
     * stays inside; everything else is handed to the real browser, where the
     * address bar tells the truth.
     */
    it('stays inside for the player and the hosts it loads from', () => {
      expect(isPlayerUrl('https://www.youtube.com/embed/abc')).toBe(true);
      expect(isPlayerUrl('https://i.ytimg.com/vi/abc/hq.jpg')).toBe(true);
      expect(isPlayerUrl('https://player.vimeo.com/video/76979871')).toBe(true);
      expect(isPlayerUrl('about:blank')).toBe(true);
    });

    it('leaves for anywhere else', () => {
      expect(isPlayerUrl('https://evil.example.com/login')).toBe(false);
      expect(isPlayerUrl('https://accounts.example/pay')).toBe(false);
    });

    it('is not fooled by an allowed host appearing inside another', () => {
      expect(isPlayerUrl('https://www.youtube.com.evil.example/embed')).toBe(false);
      expect(isPlayerUrl('https://notyoutube.com/embed')).toBe(false);
    });
  });
});

describe('the countdown', () => {
  /** Two days, three hours, four minutes and five seconds from a fixed now. */
  const NOW = Date.UTC(2026, 9, 8, 12, 0, 0);
  const target = (ms: number) => ({
    subEventId: 'se1',
    name: 'Wedding Ceremony',
    startsAt: new Date(NOW + ms).toISOString(),
    timezone: 'Asia/Kolkata',
    venueName: 'Taj Krishna',
    venueAddress: 'Banjara Hills',
    postEventMessage: 'We are married!',
  });

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const at = (ms: number) => render(<CountdownBlock countdown={target(ms)} />);

  it('names the event the organizer chose, rather than a fixed title', () => {
    expect(textOf(at(86_400_000))).toContain('Wedding Ceremony');
  });

  it('splits the gap into days, hours, minutes and seconds', () => {
    const text = textOf(at(2 * 86_400_000 + 3 * 3_600_000 + 4 * 60_000 + 5_000));
    expect(text).toContain('2');
    expect(text).toContain('03');
    expect(text).toContain('04');
    expect(text).toContain('05');
    expect(text).toContain('Days');
    expect(text).toContain('Secs');
  });

  it('counts down without the screen being reloaded', () => {
    const tree = at(10_000);
    expect(textOf(tree)).toContain('10');
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(textOf(tree)).toContain('07');
  });

  it('never runs negative once the moment has passed', () => {
    /*
     * The organizer's message replaces the timer. A row of minus signs is the
     * one thing this block must never show on somebody's invitation.
     */
    const text = textOf(at(-3_600_000));
    expect(text).toContain('We are married!');
    expect(text).not.toContain('-');
  });

  it('is not there at all when the event has no date', () => {
    expect(render(<CountdownBlock countdown={null} />).toJSON()).toBeNull();
    expect(
      render(<CountdownBlock countdown={{ ...target(0), startsAt: null }} />).toJSON(),
    ).toBeNull();
  });
});

describe('the story', () => {
  const story = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
      id: `s${i}`,
      imageUrl: `/api/upload/file/story/${i}.jpg`,
      caption: `Moment ${i + 1}`,
      order: i,
    }));

  const block = (cards: ReturnType<typeof story>, title = 'Our Journey') =>
    render(<StoryBlock cards={cards} title={title} onOpen={noop} />);

  it('is not there at all when the organizer has written no story', () => {
    /*
     * The whole block, not an empty frame and not a heading over nothing: an
     * invitation with no story simply does not have this section.
     */
    expect(block([]).toJSON()).toBeNull();
  });

  it('appears as soon as there is one card', () => {
    expect(textOf(block(story(1)))).toContain('Moment 1');
  });

  it('names the section the way the organizer named it', () => {
    // Set in capitals by the stylesheet, so the text itself is as they typed it.
    expect(textOf(block(story(2)))).toContain('Our Journey');
  });

  it('falls back to a name rather than heading the story with nothing', () => {
    expect(textOf(block(story(2), ''))).toContain('Our story');
  });

  it('says the position in words, not only as a coloured dot', () => {
    // Two shades of a dot is not something a tired eye can count.
    expect(textOf(block(story(5)))).toContain('1 / 5');
  });

  it('keeps the organizer’s order', () => {
    const text = textOf(block(story(3)));
    expect(text.indexOf('Moment 1')).toBeLessThan(text.indexOf('Moment 2'));
    expect(text.indexOf('Moment 2')).toBeLessThan(text.indexOf('Moment 3'));
  });

  it('offers every photograph as a way into the full-screen view', () => {
    const opened = labels(block(story(3)));
    expect(opened).toEqual([
      'Open story photograph 1 full screen',
      'Open story photograph 2 full screen',
      'Open story photograph 3 full screen',
    ]);
  });
});

describe('the cover block', () => {
  const templates = [
    {
      id: 'marigold',
      label: 'Marigold',
      heroStops: ['#5A2E0B', '#B4641A', '#3A1D06'],
      wash: '#FFF7EA',
      accent: '#F2A33C',
    },
    {
      id: 'emerald',
      label: 'Emerald',
      heroStops: ['#07281F', '#145C46', '#04160F'],
      wash: '#F1F8F4',
      accent: '#4FC79B',
    },
  ];
  const fonts = [
    { id: 'elegant', label: 'Elegant', note: 'Serif, letter-spaced' },
    { id: 'traditional', label: 'Traditional', note: 'Serif, set in capitals' },
  ];

  const cover = (over: Partial<InvitationDTO> = {}) =>
    render(
      <CoverBlock
        invitation={invitation({ templates, fonts, ...over })}
        mode="guest"
      />,
    );

  it('shows the welcome message a guest reads first', () => {
    const text = textOf(
      cover({ details: { ...invitation().details, message: 'Come celebrate with us.' } }),
    );
    expect(text).toContain('Come celebrate with us.');
  });

  it('offers a guest nothing to operate', () => {
    /*
     * A guest opening the link gets the invitation, not the editor: no edit,
     * no upload, no save, and no button of any kind on the cover itself.
     */
    expect(labels(cover())).toHaveLength(0);
  });

  it('sets the names in the chosen lettering', () => {
    const text = textOf(
      cover({ details: { ...invitation().details, fontStyle: 'traditional' } }),
    );
    expect(text).toContain('MEERA & ARJUN');
  });

  it('falls back to the theme rather than to somebody else\u2019s photograph', () => {
    /*
     * An invitation with no media uploaded has no photograph to show, and a
     * stock one would be a picture of a wedding that is not this one. The
     * cover paints the theme instead — so nothing on it is an <Image>.
     */
    const tree = cover().toJSON();
    const images: string[] = [];
    const walk = (n: any) => {
      if (n == null || typeof n === 'string') return;
      if (Array.isArray(n)) return n.forEach(walk);
      if (n.type === 'Image') images.push(n.type);
      walk(n.children);
    };
    walk(tree);
    expect(images).toHaveLength(0);
  });

  it('renders a theme the deployed server sent without its colours', () => {
    /*
     * `heroStops` is newer than the running API: a template that arrives with
     * only its CSS `hero` string carries nothing a native gradient can paint
     * from. The cover falls back to a palette rather than failing to render.
     */
    const legacy = invitation({
      templates: [{ id: 'garden', label: 'Garden' } as unknown as (typeof templates)[number]],
      details: { ...invitation().details, template: 'garden' },
    });
    expect(textOf(render(<CoverBlock invitation={legacy} mode="guest" />))).toContain(
      'Meera & Arjun',
    );
  });

  it('judges the cover by its own content, not by an empty body', () => {
    /*
     * The cover's content is the names, date, venue, message and media, which
     * live on the details — a cover judged by its body would be permanently
     * unwritten, and the invitation permanently unapprovable.
     */
    const header = block({ key: 'header', title: 'Invitation header', type: 'cover', body: '' });
    expect(blockIsWritten(invitation(), header)).toBe(true);
    const blank = invitation({
      details: {
        ...invitation().details,
        hostOne: '',
        hostTwo: '',
        eventDate: '',
        venueName: '',
      },
    });
    expect(blockIsWritten(blank, header)).toBe(false);
  });
});

describe('the stage', () => {
  const list = (blocks: InvitationBlockDTO[]) =>
    render(<InsideList invitation={invitation()} blocks={blocks} onPressBlock={noop} />);

  it('names a section the customer still has to write', () => {
    /*
     * Nobody can approve an invitation that is still missing the words only
     * the customer can write, so their empty sections are called out as
     * theirs rather than as "not written yet".
     */
    const text = textOf(list([block({ body: '', owner: 'customer' })]));
    expect(text).toContain('Yours to write');
  });

  it('tells a written section from an approved one', () => {
    expect(textOf(list([block({ body: 'Ten years.' })]))).toContain('Written');
    expect(
      textOf(list([block({ body: 'Ten years.', approved: true })])),
    ).toContain('Approved');
  });

  it('says which of the three things happens next, and only that one', () => {
    const { STAGE_CTA } = require('../src/modules/Invitation/constants');
    expect(
      textOf(render(<PrimaryAction stage="write" onPress={noop} />)),
    ).toContain(STAGE_CTA.write);
    expect(
      textOf(render(<PrimaryAction stage="share" onPress={noop} />)),
    ).toContain(STAGE_CTA.share);
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
    // The cover sets its eyebrow in capitals, as the design does.
    expect(text).toContain('TOGETHER WITH OUR FAMILIES');
    expect(text).toContain('Countdown');
    // Hidden from guests, so hidden from a preview of what guests see.
    expect(text).not.toContain('Book a ride');
  });

  it('counts what is hidden, so a short invitation is not mistaken for a broken one', () => {
    expect(textOf(render(<GuestPreview invitation={invitation()} />))).toContain(
      '1 section is hidden from guests.',
    );
  });

  it('falls back to the occasion, not the booking row, when no hosts are named', () => {
    const bare = invitation({
      details: { ...invitation().details, hostOne: '', hostTwo: '' },
    });
    /*
     * Never the booking list's own title — "Your Naming · 5 Sept 2026" is
     * composed for a list of bookings and reads as a database row on an
     * invitation. The occasion, set as a word, is what a guest gets.
     */
    const text = textOf(render(<GuestPreview invitation={bare} />));
    expect(text).toContain('Naming');
    expect(text).not.toContain('5 Sept 2026');
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
        onManageGuests={noop}
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

  it('cannot send to nobody, and names the step that is missing', () => {
    /*
     * The button used to offer "Send on WhatsApp" with nobody ticked and then
     * refuse with an error underneath. It now says what is missing before it
     * is pressed, and cannot be pressed at all — a control that looks live and
     * answers with a complaint is a worse way to say the same thing.
     */
    const onSend = jest.fn();
    const tree = sheet({ onSend });
    const send = tree.root
      .findAll(
        (n) =>
          n.props?.accessibilityLabel === 'Pick who receives it' &&
          typeof n.props?.disabled === 'boolean',
      )
      .at(0);

    expect(send).toBeTruthy();
    expect(send!.props.disabled).toBe(true);
    // And the words are the missing step, not a send it cannot perform.
    expect(textOf(tree)).toContain('Pick who receives it');
    expect(textOf(tree)).not.toContain('Send on WhatsApp');
    expect(onSend).not.toHaveBeenCalled();
  });

  it('offers the guest list rather than a second add-guest form', () => {
    // Adding and filing guests belongs on the screen that also groups them —
    // two add forms is two places for the phone rules to drift.
    const tree = sheet();
    const manage = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((n) => n.props.accessibilityLabel === 'Manage guest list');
    expect(manage).toBeTruthy();
  });

  it('selects only the guests the active chip is showing', () => {
    // Ticking Family and pressing "Select all" must not quietly select the
    // sixty people the host has just filtered out.
    const text = textOf(sheet());
    expect(text).toContain('0 selected');
    expect(text).toContain('Select all');
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
      templates: [
        {
          id: 'marigold',
          label: 'Marigold',
          heroStops: ['#5A2E0B', '#B4641A', '#3A1D06'],
          wash: '#FFF7EA',
          accent: '#F2A33C',
        },
        {
          id: 'emerald',
          label: 'Emerald',
          heroStops: ['#07281F', '#145C46', '#04160F'],
          wash: '#F1F8F4',
          accent: '#4FC79B',
        },
        {
          id: 'roseGold',
          label: 'Rose Gold',
          heroStops: ['#4A2229', '#A35D5A', '#2C1317'],
          wash: '#FFF3F0',
          accent: '#E8A08C',
        },
        {
          id: 'royalBlue',
          label: 'Royal Blue',
          heroStops: ['#0B1B45', '#23407F', '#050C21'],
          wash: '#F1F4FD',
          accent: '#7EA2F5',
        },
      ],
      fonts: [
        { id: 'elegant', label: 'Elegant', note: 'Serif, letter-spaced' },
        { id: 'classic', label: 'Classic', note: 'The app\u2019s own face' },
        { id: 'romantic', label: 'Romantic', note: 'Serif italic' },
        { id: 'modern', label: 'Modern', note: 'Bold and tight' },
        { id: 'traditional', label: 'Traditional', note: 'Serif, set in capitals' },
      ],
      limits: { welcomeMessage: 200, heroVideoSeconds: 30 },
      details: {
        ...invitation().details,
        template: 'roseGold',
        fontStyle: 'elegant',
        message: 'Come early, stay late, and bring an appetite.',
      },
      blocks: [
        block({ key: 'header', title: 'Cover', icon: 'image', type: 'cover' }),
        block({ key: 'story', title: 'Our story', icon: 'sparkles', body: 'Ten years, one courtyard.' }),
        block({ key: 'countdown', title: 'Countdown', icon: 'clock', owner: 'organizer' }),
        block({ key: 'save-the-date', title: 'Save the date', icon: 'calendar', owner: 'organizer' }),
        block({ key: 'live-stream', title: 'Live stream', icon: 'play', owner: 'organizer' }),
        block({ key: 'memories', title: 'Shared memories', icon: 'camera' }),
        block({ key: 'wall', title: 'Share your wishes, messages, photos and blessings', icon: 'users', body: 'Leave a note for the family.' }),
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
        <PrimaryAction stage="write" onPress={noop} />
        <InsideList invitation={full} blocks={full.blocks} onPressBlock={noop} />
      </>
    );

    const shareGuests = [
      guest({ id: 'g1', name: 'Sruthi Reddy', phoneDisplay: '+91 98490 11234', group: 'family' }),
      guest({ id: 'g2', name: 'Venkat Rao', phoneDisplay: '+91 99590 44821', group: 'family' }),
      guest({ id: 'g3', name: 'Anitha Naidu', phoneDisplay: '+91 90000 77231', group: 'family' }),
      guest({ id: 'g4', name: 'Ravi Kumar', phoneDisplay: '+91 97010 22187', group: 'friends' }),
      guest({ id: 'g5', name: 'Deepa Shetty', phoneDisplay: '+91 98861 55490', group: 'friends' }),
    ];

    const panels: Array<[string, string]> = [
      [
        'The invitation the organizer sent',
        toHtml(
          render(
            <InvitationArtwork
              artwork={{ kind: 'image', url: '/x.png', seconds: 0 }}
              onView={noop}
            />,
          ).toJSON(),
        ),
      ],
      ['Nothing uploaded yet', toHtml(render(<ArtworkPending />).toJSON())],
      [
        'The countdown',
        toHtml(
          render(
            <CountdownBlock
              countdown={{
                subEventId: 'se1',
                name: 'The Wedding Ceremony',
                startsAt: new Date(Date.now() + 12 * 86_400_000).toISOString(),
                timezone: 'Asia/Kolkata',
                venueName: 'Taj Krishna',
                venueAddress: 'Banjara Hills, Hyderabad',
                postEventMessage: '',
              }}
            />,
          ).toJSON(),
        ),
      ],
      [
        'The countdown, after the day',
        toHtml(
          render(
            <CountdownBlock
              countdown={{
                subEventId: 'se1',
                name: 'The Wedding Ceremony',
                startsAt: new Date(Date.now() - 86_400_000).toISOString(),
                timezone: 'Asia/Kolkata',
                venueName: 'Taj Krishna',
                venueAddress: 'Banjara Hills, Hyderabad',
                postEventMessage: 'We\u2019re Married!\nThank you for celebrating with us.',
              }}
            />,
          ).toJSON(),
        ),
      ],
      [
        'The story, under the invitation',
        toHtml(
          render(
            <StoryBlock
              title="Our Journey"
              cards={[
                {
                  id: 's1',
                  imageUrl: '/a.jpg',
                  caption: 'Where our story began, on a wet Tuesday in Hyderabad.',
                  order: 0,
                },
                { id: 's2', imageUrl: '/b.jpg', caption: 'Our first adventure together.', order: 1 },
                { id: 's3', imageUrl: '/c.jpg', caption: 'And then came the proposal\u2026', order: 2 },
              ]}
              onOpen={noop}
            />,
          ).toJSON(),
        ),
      ],
      ['Review — before approval', toHtml(render(review).toJSON())],
      [
        'The cover, as a guest gets it',
        toHtml(render(<CoverBlock invitation={full} mode="guest" />).toJSON()),
      ],
      [
        'Share one section',
        toHtml(
          render(
            <ShareSheet
              visible
              sectionKey="story"
              sectionTitle="How it began"
              guests={shareGuests}
              isLoadingGuests={false}
              isSending={false}
              errorMessage={null}
              outcomes={null}
              onSend={noop}
              onOpenHandoff={noop}
              onManageGuests={noop}
              onClose={noop}
            />,
          ).toJSON(),
        ),
      ],
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
