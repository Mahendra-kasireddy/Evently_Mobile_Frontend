import {
  artworkOf,
  clockLabel,
  countdownFormFrom,
  countdownPatch,
  countdownTargets,
  detailsFormFrom,
  detailsPatch,
  emptySubEvent,
  errorText,
  isNotFound,
  lengthLabel,
  limitsOf,
  mapHub,
  memoryProblem,
  moveItem,
  normalizeTimeText,
  phaseOf,
  progressSteps,
  sectionCards,
  sendModel,
  storyCardForm,
  storyFormFrom,
  storyPatch,
  subEventInput,
  subEventsFormFrom,
  subEventsPatch,
  toGuestInvitation,
  validateDetails,
  validateStory,
  validateSubEvent,
  videoProblem,
  videoTypeOf,
} from '../src/organizerModules/Invitation/utils';
import type {
  InvitationSubEventDTO,
  OrganizerInvitationDTO,
} from '../src/organizerModules/Invitation/types';

const sub = (
  over: Partial<InvitationSubEventDTO> = {},
): InvitationSubEventDTO => ({
  id: 'e1',
  name: 'Mehendi',
  eventDate: '2026-12-10',
  eventTime: '18:00',
  endTime: '',
  timezone: 'Asia/Kolkata',
  venueName: 'The Leela',
  venueAddress: 'MG Road',
  dressCode: '',
  note: '',
  colour: 'rose',
  visibility: 'all',
  groups: [],
  liveEnabled: true,
  liveTitle: 'Watch live',
  liveUrl: 'https://www.youtube.com/embed/x',
  live360Url: '',
  liveVrUrl: '',
  liveStartedAt: '2026-12-10T12:30:00.000Z',
  ...over,
});

const invitation = (
  over: Partial<OrganizerInvitationDTO> = {},
): OrganizerInvitationDTO => ({
  id: 'i1',
  bookingId: 'b1',
  bookingRef: 'EV-1',
  bookingTitle: 'Asha & Rohan',
  occasion: 'wedding',
  eventDate: '2026-12-12T00:00:00.000Z',
  location: 'Bengaluru',
  status: 'draft',
  sentAt: null,
  approvedAt: null,
  hasUnsentChanges: false,
  details: {
    template: 'midnight',
    eyebrow: 'TOGETHER WITH THEIR FAMILIES',
    hostOne: 'Asha',
    hostTwo: 'Rohan',
    joiner: 'and',
    eventDate: '2026-12-12',
    eventTime: '',
    venueName: 'Palace Grounds',
    venueAddress: '',
    message: '',
    timezone: 'Asia/Kolkata',
    heroMediaType: 'image',
    heroMediaUrl: '/api/upload/file/cover.png',
    heroMediaKey: 'cover.png',
    heroMediaDurationSec: 0,
    storyTitle: 'Our story',
    countdownSubEventId: '',
    oneDayNotificationEnabled: true,
    oneDayNotificationMessage: 'Almost there',
    missedNotificationMessage: 'Hope you had fun',
    postEventMessage: '',
  },
  blocks: [],
  subEvents: [sub()],
  storyCards: [
    { id: 's2', imageUrl: '/b.jpg', imageKey: 'b', caption: 'Two', order: 1 },
    { id: 's1', imageUrl: '/a.jpg', imageKey: 'a', caption: 'One', order: 0 },
  ],
  countdown: {
    subEventId: '',
    name: '',
    startsAt: '2026-12-11T18:30:00.000Z',
    timezone: 'Asia/Kolkata',
    venueName: '',
    venueAddress: '',
    postEventMessage: '',
  },
  templates: [
    {
      id: 'midnight',
      label: 'Midnight',
      heroStops: ['#101B33', '#1A2E5A', '#2B1E32'],
      wash: '#FBF7F1',
      accent: '#FFB48A',
    },
  ],
  fonts: [],
  limits: {
    welcomeMessage: 200,
    heroVideoSeconds: 300,
    storyCards: 12,
    storyCaption: 120,
  },
  changeRequests: [],
  ...over,
});

describe('small helpers', () => {
  it('types HH:MM as it is entered', () => {
    expect(normalizeTimeText('1930')).toBe('19:30');
    expect(normalizeTimeText('9')).toBe('9');
    expect(normalizeTimeText('7:5a')).toBe('7:5');
  });

  it('reads times and lengths for people', () => {
    expect(clockLabel('18:30')).toBe('6:30 PM');
    expect(clockLabel('00:05')).toBe('12:05 AM');
    expect(clockLabel('25:00')).toBe('');
    expect(lengthLabel(135)).toBe('2:15');
    expect(lengthLabel(0)).toBe('');
  });

  it('moves an item, clamped, and leaves the list alone when it cannot', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
    expect(moveItem(['a', 'b', 'c'], 2, 9)).toEqual(['a', 'b', 'c']);
    const same = ['a', 'b'];
    expect(moveItem(same, 0, -1)).toBe(same);
    expect(moveItem(same, -1, 1)).toBe(same);
  });

  it('shows the server’s sentence, joining validation lists', () => {
    expect(errorText({ message: ['a too long', 'b bad'] }, 'x')).toBe(
      'a too long b bad',
    );
    expect(errorText({ message: 'Nope' }, 'x')).toBe('Nope');
    expect(errorText(null, 'fallback')).toBe('fallback');
  });

  it('treats 404 and 403 as not found', () => {
    expect(isNotFound({ status: 404 })).toBe(true);
    expect(isNotFound({ status: 403 })).toBe(true);
    expect(isNotFound({ status: 500 })).toBe(false);
  });

  it('prefers the server’s limits', () => {
    expect(limitsOf(invitation()).heroVideoSeconds).toBe(300);
    expect(limitsOf(null).storyCards).toBe(12);
  });
});

describe('hub', () => {
  it('finds the artwork only when type and url are both there', () => {
    expect(artworkOf(invitation().details)).toEqual({
      kind: 'image',
      seconds: 0,
    });
    expect(artworkOf({ heroMediaType: '', heroMediaUrl: '/x.png' })).toBeNull();
    expect(artworkOf({ heroMediaType: 'video', heroMediaUrl: '' })).toBeNull();
  });

  it('puts open change requests ahead of the status', () => {
    const ask = {
      id: 'r1',
      blockKey: '',
      blockTitle: '',
      note: 'Bigger names',
      at: '2026-10-01T00:00:00.000Z',
    };
    expect(phaseOf(invitation())).toBe('draft');
    expect(phaseOf(invitation({ status: 'sent', changeRequests: [ask] }))).toBe(
      'changes',
    );
    expect(phaseOf(invitation({ status: 'approved' }))).toBe('approved');
    const hub = mapHub(
      invitation({ status: 'approved', changeRequests: [ask] }),
    );
    expect(hub.requests).toEqual([
      expect.objectContaining({
        id: 'r1',
        title: 'The invitation overall',
        note: 'Bigger names',
      }),
    ]);
  });

  it('ticks the web editor’s three steps', () => {
    expect(
      progressSteps(invitation({ status: 'sent' })).map(s => s.done),
    ).toEqual([true, true, false]);
    expect(
      progressSteps(
        invitation({ details: { ...invitation().details, heroMediaUrl: '' } }),
      ).map(s => s.done),
    ).toEqual([false, false, false]);
  });

  it('offers Send only when it would tell the customer something new', () => {
    const noArt = invitation({
      details: { ...invitation().details, heroMediaUrl: '' },
    });
    expect(sendModel(noArt).canSend).toBe(false);
    expect(sendModel(invitation()).canSend).toBe(true);
    expect(sendModel(invitation()).label).toBe('Send to customer');

    const waiting = invitation({ status: 'sent', hasUnsentChanges: false });
    expect(sendModel(waiting).canSend).toBe(false);
    expect(sendModel({ ...waiting, hasUnsentChanges: true }).label).toBe(
      'Send update to customer',
    );
    expect(
      sendModel({
        ...waiting,
        changeRequests: [
          { id: 'r', blockKey: '', blockTitle: '', note: 'x', at: '' },
        ],
      }),
    ).toEqual(
      expect.objectContaining({
        canSend: true,
        label: 'Re-send after changes',
      }),
    );
  });

  it('says what each section still needs', () => {
    const cards = sectionCards(invitation());
    expect(cards.map(c => c.id)).toEqual([
      'artwork',
      'details',
      'story',
      'dates',
      'countdown',
      'memories',
    ]);
    expect(cards.map(c => c.state)).toEqual([
      'done',
      'done',
      'done',
      'done',
      'done',
      'info',
    ]);
    const bare = sectionCards(
      invitation({
        details: { heroMediaUrl: '' },
        storyCards: [],
        subEvents: [sub({ name: ' ' })],
        countdown: null,
      }),
    );
    expect(bare.map(c => c.state)).toEqual([
      'todo',
      'todo',
      'optional',
      'todo',
      'todo',
      'info',
    ]);
  });
});

describe('details', () => {
  it('sends only the changed fields, trimmed', () => {
    const base = detailsFormFrom(invitation());
    expect(detailsPatch(base, base)).toEqual({});
    expect(
      detailsPatch(base, { ...base, hostOne: ' Asha R ', timezone: 'UTC' }),
    ).toEqual({ details: { hostOne: 'Asha R', timezone: 'UTC' } });
  });

  it('defaults the timezone and the template', () => {
    const form = detailsFormFrom(invitation({ details: {} }));
    expect(form.timezone).toBe('Asia/Kolkata');
    expect(form.template).toBe('midnight');
  });

  it('checks time format and the welcome message length', () => {
    const base = detailsFormFrom(invitation());
    expect(validateDetails(base)).toEqual({});
    const errors = validateDetails(
      { ...base, eventTime: '7:5', message: 'x'.repeat(201) },
      200,
    );
    expect(Object.keys(errors).sort()).toEqual(['eventTime', 'message']);
  });
});

describe('story', () => {
  it('reads cards in their stored order with renderable uris', () => {
    const form = storyFormFrom(invitation());
    expect(form.cards.map(c => c.key)).toEqual(['s1', 's2']);
    expect(form.cards[0].uri).toMatch(/^https?:\/\/.+\/a\.jpg$/);
  });

  it('sends the whole list when it changed, and the title alone when only it did', () => {
    const base = storyFormFrom(invitation());
    expect(storyPatch(base, base)).toEqual({});
    expect(storyPatch(base, { ...base, title: ' Our journey ' })).toEqual({
      details: { storyTitle: 'Our journey' },
    });
    const moved = { ...base, cards: moveItem(base.cards, 1, 0) };
    expect(storyPatch(base, moved).storyCards).toEqual([
      { imageUrl: '/b.jpg', imageKey: 'b', caption: 'Two' },
      { imageUrl: '/a.jpg', imageKey: 'a', caption: 'One' },
    ]);
    const added = {
      ...base,
      cards: [...base.cards, storyCardForm('new-1', '/c.jpg', '', ' Three ')],
    };
    expect(storyPatch(base, added).storyCards?.[2]).toEqual({
      imageUrl: '/c.jpg',
      caption: 'Three',
    });
  });

  it('names the caption that is too long', () => {
    const base = storyFormFrom(invitation());
    expect(validateStory(base)).toBe('');
    const long = {
      ...base,
      cards: base.cards.map((c, i) =>
        i === 1 ? { ...c, caption: 'x'.repeat(121) } : c,
      ),
    };
    expect(validateStory(long)).toMatch(/Photo 2/);
  });
});

describe('save the date', () => {
  it('echoes the fields this app does not edit, and never liveStartedAt', () => {
    const [form] = subEventsFormFrom(invitation());
    const input = subEventInput(form);
    expect(input).toEqual(
      expect.objectContaining({
        id: 'e1',
        colour: 'rose',
        visibility: 'all',
        liveEnabled: true,
        liveUrl: 'https://www.youtube.com/embed/x',
      }),
    );
    expect(input).not.toHaveProperty('liveStartedAt');
    expect(input).not.toHaveProperty('groups');
    expect(input).not.toHaveProperty('key');
  });

  it('keeps groups only for a targeted card', () => {
    const [form] = subEventsFormFrom(
      invitation({
        subEvents: [sub({ visibility: 'groups', groups: ['family'] })],
      }),
    );
    expect(subEventInput(form).groups).toEqual(['family']);
  });

  it('sends the list only when something in it changed', () => {
    const base = subEventsFormFrom(invitation());
    expect(subEventsPatch(base, base)).toEqual({});
    const added = [
      ...base,
      { ...emptySubEvent('UTC', 'new-1'), name: 'Sangeet' },
    ];
    const body = subEventsPatch(base, added);
    expect(body.subEvents).toHaveLength(2);
    expect(body.subEvents?.[1]).not.toHaveProperty('id');
    expect(body.subEvents?.[1].timezone).toBe('UTC');
    expect(subEventsPatch(base, []).subEvents).toEqual([]);
  });

  it('requires a name and well-formed times', () => {
    const blank = emptySubEvent('Asia/Kolkata', 'k');
    expect(Object.keys(validateSubEvent(blank))).toEqual(['name']);
    expect(
      validateSubEvent({
        ...blank,
        name: 'X',
        eventTime: '18:0',
        endTime: '99:00',
      }),
    ).toEqual(
      expect.objectContaining({
        eventTime: expect.any(String),
        endTime: expect.any(String),
      }),
    );
  });

  it('falls back to the invitation’s zone for a card without one', () => {
    const [form] = subEventsFormFrom(
      invitation({
        details: { ...invitation().details, timezone: 'Europe/London' },
        subEvents: [sub({ timezone: '' })],
      }),
    );
    expect(form.timezone).toBe('Europe/London');
  });
});

describe('countdown', () => {
  it('drops a target that is no longer one of the events', () => {
    const form = countdownFormFrom(
      invitation({
        details: { ...invitation().details, countdownSubEventId: 'gone' },
      }),
    );
    expect(form.countdownSubEventId).toBe('');
  });

  it('sends only what changed', () => {
    const base = countdownFormFrom(invitation());
    expect(countdownPatch(base, base)).toEqual({});
    expect(
      countdownPatch(base, {
        ...base,
        countdownSubEventId: 'e1',
        oneDayNotificationEnabled: false,
        postEventMessage: ' Thanks ',
      }),
    ).toEqual({
      details: {
        countdownSubEventId: 'e1',
        oneDayNotificationEnabled: false,
        postEventMessage: 'Thanks',
      },
    });
  });

  it('offers the invitation date, then each saved event', () => {
    const targets = countdownTargets(
      invitation({ subEvents: [sub(), sub({ id: '', name: 'Unsaved' })] }),
    );
    expect(targets.map(t => t.id)).toEqual(['', 'e1']);
  });
});

describe('files', () => {
  it('infers a clip’s type from its extension', () => {
    expect(videoTypeOf({ name: 'a.MOV', type: '' })).toBe('video/quicktime');
    expect(videoTypeOf({ name: 'a.mp4', type: 'video/mp4' })).toBe('video/mp4');
  });

  it('refuses a video that is too long, unreadable or the wrong type', () => {
    const ok = {
      uri: 'file:///a.mp4',
      name: 'a.mp4',
      type: 'video/mp4',
      duration: 60,
    };
    expect(videoProblem(ok, 300)).toBe('');
    expect(videoProblem({ ...ok, duration: 301 }, 300)).toMatch(/301 seconds/);
    expect(videoProblem({ ...ok, duration: 0 }, 300)).toMatch(/length/);
    expect(
      videoProblem({ ...ok, name: 'a.avi', type: 'video/x-msvideo' }, 300),
    ).toMatch(/format/);
    expect(videoProblem({ ...ok, fileSize: 300 * 1024 * 1024 }, 300)).toMatch(
      /too large/,
    );
  });

  it('refuses a memory clip over fifteen minutes', () => {
    expect(
      memoryProblem({
        uri: 'x',
        name: 'x.mp4',
        type: 'video/mp4',
        duration: 901,
      }),
    ).toMatch(/15 minutes/);
    expect(memoryProblem({ uri: 'x', name: 'x.jpg', type: 'image/jpeg' })).toBe(
      '',
    );
  });
});

describe('guest preview', () => {
  it('maps onto the customer invitation and leaves hidden events out', () => {
    const guest = toGuestInvitation(
      invitation({
        subEvents: [
          sub(),
          sub({ id: 'e2', name: 'Secret', visibility: 'hidden' }),
        ],
      }),
    );
    expect(guest.subEvents.map(e => e.id)).toEqual(['e1']);
    expect(guest.details.heroMediaUrl).toBe('/api/upload/file/cover.png');
    expect(guest.countdown?.startsAt).toBe('2026-12-11T18:30:00.000Z');
    expect(guest.changeRequests).toEqual([]);
  });
});
