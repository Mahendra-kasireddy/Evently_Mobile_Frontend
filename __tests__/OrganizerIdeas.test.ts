import {
  buildPostBody,
  buildReplyBody,
  buildVisionBody,
  countsFor,
  errorMessage,
  filterChips,
  filterIdeas,
  hasErrors,
  isNotFound,
  mapIdea,
  mapPhotos,
  matchesFilter,
  mergeIdea,
  normalizeBoard,
  photosLeft,
  progressModel,
  replyFormFor,
  toIdeaImage,
  validatePostText,
  validateReplyForm,
  validateVisionForm,
  visionFormFrom,
  visionRows,
} from '../src/organizerModules/IdeasBoard/utils';
import {
  boardEndpoint,
  replyEndpoint,
  visionEndpoint,
} from '../src/organizerModules/IdeasBoard/constants';
import type {
  BoardVisionDTO,
  IdeaBoardDTO,
  IdeaDTO,
} from '../src/organizerModules/IdeasBoard/types';
import { absoluteFileUrl } from '../src/services/urls';

const NOW = Date.parse('2026-10-30T12:00:00.000Z');

const idea = (over: Partial<IdeaDTO> = {}): IdeaDTO => ({
  id: 'i1',
  authorRole: 'customer',
  authorName: 'Asha Rao',
  type: 'idea',
  text: 'Marigold arch at the entrance',
  images: [],
  confidential: false,
  reply: null,
  approval: 'none',
  approvalLabel: '',
  approvedAt: null,
  createdAt: '2026-10-30T10:00:00.000Z',
  ...over,
});

const vision = (over: Partial<BoardVisionDTO> = {}): BoardVisionDTO => ({
  theme: '',
  vibe: '',
  surprise: '',
  food: '',
  surpriseConfidential: true,
  captured: false,
  ...over,
});

const ITEMS: IdeaDTO[] = [
  idea({ id: 'a' }),
  idea({
    id: 'b',
    reply: { status: 'planned', text: 'On it', at: null },
    approval: 'pending',
    approvalLabel: 'Approve the arch',
  }),
  idea({
    id: 'c',
    type: 'question',
    reply: { status: 'done', text: 'Yes', at: null },
    approval: 'approved',
  }),
  idea({
    id: 'd',
    authorRole: 'organizer',
    authorName: 'Bloom Events',
    type: 'update',
    reply: { status: 'in_progress', text: 'x', at: null },
    approval: 'pending',
  }),
];

describe('endpoints', () => {
  it('match the organizer idea routes', () => {
    expect(boardEndpoint('b1')).toBe('/idea/organizer/b1');
    expect(replyEndpoint('i 1')).toBe('/idea/organizer/i%201/reply');
    expect(visionEndpoint('b1')).toBe('/idea/organizer/b1/vision');
  });
});

describe('filters', () => {
  it('matches each filter', () => {
    expect(filterIdeas(ITEMS, 'all').map(i => i.id)).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
    expect(filterIdeas(ITEMS, 'toReply').map(i => i.id)).toEqual(['a']);
    expect(filterIdeas(ITEMS, 'waiting').map(i => i.id)).toEqual(['b', 'd']);
    expect(filterIdeas(ITEMS, 'approved').map(i => i.id)).toEqual(['c']);
    expect(filterIdeas(ITEMS, 'questions').map(i => i.id)).toEqual(['c']);
  });

  it('only counts customer posts as needing a reply', () => {
    expect(matchesFilter(idea({ authorRole: 'organizer' }), 'toReply')).toBe(
      false,
    );
  });

  it('offers only chips with something in them, with counts', () => {
    const chips = filterChips(
      [idea({ id: 'a' }), idea({ id: 'q', type: 'question' })],
      'all',
    );
    expect(chips.map(c => [c.value, c.count])).toEqual([
      ['all', 2],
      ['toReply', 2],
      ['questions', 1],
    ]);
  });

  it('keeps the selected chip even when it is empty', () => {
    const chips = filterChips([idea()], 'approved');
    expect(chips.map(c => c.value)).toEqual(['all', 'toReply', 'approved']);
  });

  it('shows no row when only "All" would remain', () => {
    expect(filterChips([], 'all')).toEqual([]);
  });
});

describe('counts & progress', () => {
  it('counts like the server: customer posts only for shared/planned', () => {
    expect(countsFor(ITEMS)).toEqual({
      shared: 3,
      planned: 2,
      awaitingApproval: 2,
    });
  });

  it('builds the progress model', () => {
    const p = progressModel(countsFor(ITEMS), ITEMS);
    expect(p).toMatchObject({
      shared: 3,
      planned: 2,
      waiting: 2,
      approved: 1,
      plannedPercent: 67,
    });
    expect(p.summary).toBe('2 of 3 customer ideas have a plan');
  });

  it('handles an empty board', () => {
    const p = progressModel(countsFor([]), []);
    expect(p.plannedPercent).toBe(0);
    expect(p.summary).toBe('No ideas from the customer yet');
  });
});

describe('board state', () => {
  const board: IdeaBoardDTO = {
    items: [idea({ id: 'a' })],
    counts: { shared: 1, planned: 0, awaitingApproval: 0 },
    vision: vision(),
  };

  it('puts a new post on top and recounts', () => {
    const next = mergeIdea(
      board,
      idea({ id: 'n', authorRole: 'organizer', type: 'update' }),
    );
    expect(next.items.map(i => i.id)).toEqual(['n', 'a']);
    expect(next.counts.shared).toBe(1);
  });

  it('replaces a replied post in place and recounts', () => {
    const next = mergeIdea(
      board,
      idea({
        id: 'a',
        reply: { status: 'planned', text: 'ok', at: null },
        approval: 'pending',
      }),
    );
    expect(next.items).toHaveLength(1);
    expect(next.counts).toEqual({
      shared: 1,
      planned: 1,
      awaitingApproval: 1,
    });
  });

  it('normalizes a sparse response', () => {
    const n = normalizeBoard({
      items: [{ ...idea(), images: undefined as never }],
    });
    expect(n.items[0].images).toEqual([]);
    expect(n.counts.shared).toBe(1);
    expect(n.vision).toEqual(vision());
    expect(normalizeBoard(null).items).toEqual([]);
  });
});

describe('mapIdea', () => {
  it('maps a customer post awaiting approval', () => {
    const card = mapIdea(ITEMS[1], NOW);
    expect(card).toMatchObject({
      fromOrganizer: false,
      authorName: 'Asha Rao',
      initials: 'AR',
      timeAgo: '2h ago',
      approval: {
        tone: 'waiting',
        label: 'Waiting for customer · Approve the arch',
      },
      reply: { status: 'planned', statusLabel: 'Planned', text: 'On it' },
      replyCta: 'Update your reply…',
    });
  });

  it('maps approval and reply CTAs', () => {
    expect(mapIdea(ITEMS[2], NOW).approval).toEqual({
      tone: 'approved',
      label: 'Approved by customer',
    });
    expect(mapIdea(ITEMS[0], NOW).replyCta).toBe('Reply with a plan…');
    expect(mapIdea(ITEMS[0], NOW).approval).toBeNull();
    expect(
      mapIdea(idea({ authorRole: 'organizer', authorName: '' }), NOW),
    ).toMatchObject({
      fromOrganizer: true,
      authorName: 'You',
      replyCta: 'Add a status or ask for approval…',
    });
  });

  it('absolutises every photo into a uri field', () => {
    const photos = mapPhotos([
      { url: '/api/upload/file/a.png', key: 'k1', originalName: 'a.png' },
      { url: 'https://cdn.x/b.png', key: '', originalName: '' },
      { url: '', key: 'k3', originalName: '' },
    ]);
    expect(photos).toEqual([
      {
        key: 'k1',
        uri: absoluteFileUrl('/api/upload/file/a.png'),
        label: 'a.png',
      },
      {
        key: 'https://cdn.x/b.png-1',
        uri: 'https://cdn.x/b.png',
        label: 'Reference photo',
      },
    ]);
  });
});

describe('posting', () => {
  it('builds the body with trimmed text and stored images', () => {
    const built = buildPostBody({
      text: '  Moodboard v2  ',
      type: 'update',
      images: [toIdeaImage({ url: '/u/a.png', key: 'k' }, 'a.png')],
    });
    expect(built).toEqual({
      body: {
        text: 'Moodboard v2',
        type: 'update',
        images: [{ url: '/u/a.png', key: 'k', originalName: 'a.png' }],
      },
      error: null,
    });
  });

  it('keeps a question a question, and refuses other types', () => {
    expect(
      buildPostBody({ text: 'Veg only?', type: 'question', images: [] }).body
        ?.type,
    ).toBe('question');
    expect(
      buildPostBody({ text: 'x', type: 'idea' as never, images: [] }).body
        ?.type,
    ).toBe('update');
  });

  it('validates the text', () => {
    expect(validatePostText('   ')).toBe('Write something first.');
    expect(validatePostText('a'.repeat(4001))).toMatch(/4000/);
    expect(validatePostText('ok')).toBeNull();
    expect(
      buildPostBody({ text: '', type: 'update', images: [] }).body,
    ).toBeNull();
  });

  it('counts photos left', () => {
    expect(photosLeft(2, 6)).toBe(4);
    expect(photosLeft(8, 6)).toBe(0);
  });
});

describe('replying', () => {
  it('prefills from the existing reply', () => {
    expect(replyFormFor(ITEMS[2])).toEqual({
      status: 'done',
      text: 'Yes',
      askApproval: false,
      approvalLabel: '',
    });
    expect(replyFormFor(ITEMS[0]).status).toBe('planned');
  });

  it('requires text, and a label when asking for approval', () => {
    const errors = validateReplyForm({
      status: 'planned',
      text: ' ',
      askApproval: true,
      approvalLabel: '',
    });
    expect(errors.text).toBeTruthy();
    expect(errors.approvalLabel).toBeTruthy();
    expect(hasErrors(errors)).toBe(true);
    expect(
      hasErrors(
        validateReplyForm({
          status: 'done',
          text: 'Booked',
          askApproval: false,
          approvalLabel: '',
        }),
      ),
    ).toBe(false);
    expect(
      validateReplyForm({
        status: 'done',
        text: 'x',
        askApproval: true,
        approvalLabel: 'a'.repeat(401),
      }).approvalLabel,
    ).toMatch(/400/);
  });

  it('sends approvalLabel only when asking', () => {
    expect(
      buildReplyBody({
        status: 'in_progress',
        text: ' Sourcing ',
        askApproval: false,
        approvalLabel: 'ignored',
      }),
    ).toEqual({ status: 'in_progress', text: 'Sourcing' });
    expect(
      buildReplyBody({
        status: 'planned',
        text: 'Mockup attached',
        askApproval: true,
        approvalLabel: ' Approve mockup ',
      }),
    ).toEqual({
      status: 'planned',
      text: 'Mockup attached',
      approvalLabel: 'Approve mockup',
    });
  });
});

describe('vision', () => {
  const current = vision({
    theme: 'Marigold & maroon',
    vibe: 'Fun',
    captured: true,
  });

  it('round-trips the form', () => {
    expect(visionFormFrom(current)).toEqual({
      theme: 'Marigold & maroon',
      vibe: 'Fun',
      surprise: '',
      food: '',
      surpriseConfidential: true,
    });
  });

  it('sends only what changed, with "" clearing a slot', () => {
    const form = {
      ...visionFormFrom(current),
      vibe: '',
      food: ' Live counters ',
      surpriseConfidential: false,
    };
    expect(buildVisionBody(form, current)).toEqual({
      vibe: '',
      food: 'Live counters',
      surpriseConfidential: false,
    });
    expect(buildVisionBody(visionFormFrom(current), current)).toEqual({});
  });

  it('validates slot length', () => {
    const errors = validateVisionForm({
      ...visionFormFrom(current),
      theme: 'x'.repeat(121),
    });
    expect(errors.theme).toMatch(/120/);
    expect(hasErrors(validateVisionForm(visionFormFrom(current)))).toBe(false);
  });

  it('builds rows, locking a private surprise', () => {
    const rows = visionRows(vision({ surprise: 'Flash mob', captured: true }));
    expect(rows.map(r => r.key)).toEqual(['theme', 'vibe', 'surprise', 'food']);
    expect(rows[2]).toMatchObject({ value: 'Flash mob', locked: true });
    expect(rows[0]).toMatchObject({ value: '', locked: false });
  });
});

describe('errors', () => {
  it('reads the server message, or falls back', () => {
    expect(errorMessage({ message: ['text too long'] }, 'fb')).toBe(
      'text too long',
    );
    expect(errorMessage({ message: 'Nope' }, 'fb')).toBe('Nope');
    expect(errorMessage(null, 'fb')).toBe('fb');
  });

  it('treats 400/403/404 as not found', () => {
    expect(isNotFound({ status: 403 })).toBe(true);
    expect(isNotFound({ status: 500 })).toBe(false);
    expect(isNotFound(null)).toBe(false);
  });
});
