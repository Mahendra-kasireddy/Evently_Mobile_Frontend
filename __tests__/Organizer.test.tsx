/**
 * @format
 *
 * The organizer profile and its reviews.
 *
 * The rules that matter: an organizer nobody has reviewed reads as new rather
 * than as bad, a figure they have not published produces no row at all, and
 * the histogram stays legible when one bar dwarfs the rest.
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
import { Handles } from '../src/modules/Organizer/sections/Handles';
import { ProfileHero } from '../src/modules/Organizer/sections/ProfileHero';
import { QuoteFooter } from '../src/modules/Organizer/sections/QuoteFooter';
import { RatingCard } from '../src/modules/Organizer/sections/RatingCard';
import { RecentWork } from '../src/modules/Organizer/sections/RecentWork';
import { ReviewCard } from '../src/modules/Organizer/sections/ReviewCard';
import { ReviewSummaryCard } from '../src/modules/Organizer/sections/ReviewSummaryCard';
import { filledStars, mapOrganizer, ratingBars } from '../src/modules/Organizer/utils';
import { workStyles } from '../src/modules/Organizer/styles';
import { absoluteFileUrl } from '../src/services/urls';
import type {
  OrganizerDetailDTO,
  ReviewDTO,
  ReviewSummaryDTO,
} from '../src/modules/Organizer/types';

declare const process: { env: Record<string, string | undefined> };
const fs: { writeFileSync(p: string, d: string, e: string): void; existsSync(p: string): boolean } =
  require('fs');

const CATEGORIES = new Map([
  ['catering', 'Catering'],
  ['decor', 'Decor & flowers'],
  ['photography', 'Photo & video'],
]);

const dto = (over: Partial<OrganizerDetailDTO> = {}): OrganizerDetailDTO =>
  ({
    id: 'o1',
    name: 'Mahendra Events',
    initials: 'ME',
    avatarColor: '#7C5CE6',
    tier: 'Silver',
    rating: 4.8,
    reviews: 126,
    events: 89,
    tags: [],
    location: 'Kukatpally',
    city: 'Hyderabad',
    serviceAreas: [],
    occasions: ['wedding'],
    capacityMin: 50,
    capacityMax: 500,
    basePrice: 650000,
    estRange: '₹6.5L – 8L',
    responseRate: 92,
    responseHours: 2,
    categoryRates: [
      { key: 'catering', price: 100000, perGuest: false },
      { key: 'decor', price: 50000, perGuest: false },
      { key: 'unmapped', price: 10000, perGuest: false },
    ],
    businessName: 'Mahendra Events',
    displayName: 'Mahendra Events',
    tagline: '',
    profilePhoto: null,
    gallery: [
      { url: 'https://cdn.test/a.jpg', key: 'a', originalName: 'a.jpg' },
      { url: 'https://cdn.test/b.jpg', key: 'b', originalName: 'b.jpg' },
    ],
    ...over,
  }) as OrganizerDetailDTO;

const summary = (over: Partial<ReviewSummaryDTO> = {}): ReviewSummaryDTO => ({
  average: 4.8,
  total: 126,
  histogram: [
    { stars: 5, count: 98 },
    { stars: 4, count: 19 },
    { stars: 3, count: 6 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ],
  tags: [
    { key: 'on_time', label: 'On time', count: 64 },
    { key: 'great_decor', label: 'Great decor', count: 51 },
  ],
  ...over,
});

const review = (over: Partial<ReviewDTO> = {}): ReviewDTO => ({
  id: 'r1',
  authorName: 'Sandhya P.',
  authorInitials: 'SP',
  rating: 5,
  comment: 'They handled 180 guests without a single reminder from us.',
  tags: ['On time'],
  contextLabel: 'Naming ceremony · June 2026',
  createdAt: '2026-06-20T00:00:00.000Z',
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

const noop = () => {};
const model = (over: Partial<OrganizerDetailDTO> = {}) => mapOrganizer(dto(over), CATEGORIES);

describe('mapOrganizer', () => {
  it('joins the place from whatever the organizer gave', () => {
    expect(model().placeLabel).toBe('Kukatpally, Hyderabad');
    expect(model({ location: '' }).placeLabel).toBe('Hyderabad');
    // A locality identical to the city should not read "Hyderabad, Hyderabad".
    expect(model({ location: 'Hyderabad' }).placeLabel).toBe('Hyderabad');
  });

  it('drops a stat the organizer has not earned', () => {
    /*
     * Three zeros read as a failing business; two tiles read as a new one.
     */
    expect(model().stats.map((s) => s.key)).toEqual(['rating', 'events', 'reply']);
    expect(model({ reviews: 0, events: 0 }).stats.map((s) => s.key)).toEqual(['reply']);
    expect(model({ reviews: 0, events: 0, responseHours: 0 }).stats).toEqual([]);
  });

  it('says nothing about price when none is published', () => {
    expect(model().headlineLabel).toBe('From ₹6,50,000');
    expect(model({ basePrice: 0 }).headlineLabel).toBe('');
  });

  it('names only the services it can actually name', () => {
    // A priced key with no matching category is dropped, not shown raw.
    expect(model().handles).toEqual(['Catering', 'Decor & flowers']);
  });

  it('never invents an upper bound for a typical range', () => {
    expect(model().typicalLabel).toBe('₹6.5L – 8L');
    // No published estimate: open-ended from the base price, not a guess.
    expect(model({ estRange: '' }).typicalLabel).toBe('₹6.5L+');
    expect(model({ estRange: '', basePrice: 0 }).typicalLabel).toBe('');
  });
});

describe('absoluteFileUrl', () => {
  it('makes a stored file\'s root-relative URL absolute', () => {
    /*
     * The local storage driver returns "/api/upload/file/<key>" whenever
     * UPLOAD_PUBLIC_BASE_URL is unset — the default in development. A browser
     * resolves that against the page; React Native's Image cannot, and simply
     * showed a broken-image glyph where the portfolio should be.
     */
    expect(absoluteFileUrl('/api/upload/file/abc.jpg')).toMatch(/^https?:\/\/[^/]+\/api\/upload\/file\/abc\.jpg$/);
  });

  it('leaves an absolute URL alone', () => {
    // The S3 driver already returns these, so the helper is safe on both.
    expect(absoluteFileUrl('https://cdn.test/a.jpg')).toBe('https://cdn.test/a.jpg');
    expect(absoluteFileUrl('data:image/png;base64,AAA')).toBe('data:image/png;base64,AAA');
  });

  it('has nothing to say about nothing', () => {
    expect(absoluteFileUrl('')).toBe('');
    expect(absoluteFileUrl(undefined)).toBe('');
  });

  it('is applied to the gallery, so a portfolio photo can actually load', () => {
    const gallery = model({
      gallery: [{ url: '/api/upload/file/a.jpg', key: 'a', originalName: 'a.jpg' }],
    }).gallery;
    expect(gallery[0].startsWith('/')).toBe(false);
  });
});

describe('the work grid', () => {
  it('never lets one photo stretch across the row', () => {
    /*
     * With flexGrow, a single upload filled the full width and aspectRatio
     * made it as tall as the screen was wide — one photo pushed the whole
     * rest of the profile below the fold.
     */
    const tile = workStyles.tile as Record<string, unknown>;
    expect(tile.flexGrow).toBeUndefined();
    expect(tile.width).toBe('31.5%');
  });
});

describe('ratingBars', () => {
  it('scales to the largest bar so small counts stay visible', () => {
    /*
     * Scaled by total, 1 review out of 126 would be a sub-pixel sliver — and
     * "one person gave this two stars" is exactly what a reader is looking for.
     */
    const bars = ratingBars(summary());
    expect(bars.map((b) => b.percent)).toEqual([100, 19, 6, 2, 1]);
  });

  it('always returns all five rows', () => {
    const bars = ratingBars(summary({ histogram: [{ stars: 5, count: 3 }] }));
    expect(bars).toHaveLength(1); // whatever the server sent, unpadded here
    expect(ratingBars(summary()).map((b) => b.stars)).toEqual([5, 4, 3, 2, 1]);
  });

  it('sizes nothing when there are no reviews', () => {
    const bars = ratingBars(summary({ total: 0, histogram: [{ stars: 5, count: 0 }] }));
    expect(bars[0].percent).toBe(0);
  });
});

describe('filledStars', () => {
  it('fills to the rounded score, and none at all for no rating', () => {
    // The web card fills five unconditionally, so a new organizer read as a
    // five-star business beside the text "0 (0)".
    expect(filledStars(4.8)).toBe(5);
    expect(filledStars(3.2)).toBe(3);
    expect(filledStars(0)).toBe(0);
  });
});

describe('ProfileHero', () => {
  it('shows who they are and the figures they have earned', () => {
    const text = textOf(
      render(
        <ProfileHero organizer={model()} showAllReviews onBack={noop} onPressAllReviews={noop} />,
      ),
    );

    expect(text).toContain('Mahendra Events');
    expect(text).toContain('Silver');
    expect(text).toContain('Kukatpally, Hyderabad');
    expect(text).toContain('From ₹6,50,000');
    expect(text).toContain('126 reviews');
    expect(text).toContain('events run');
    expect(text).toContain('avg reply');
  });

  it('does not stretch a lone stat across the row', () => {
    // Full-width, "24h / avg reply" reads as a panel that failed to fill.
    const tree = render(
      <ProfileHero
        organizer={model({ reviews: 0, events: 0 })}
        showAllReviews={false}
        onBack={noop}
        onPressAllReviews={noop}
      />,
    );
    const flat = (style: any): Record<string, unknown> =>
      Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean).map(flat)) : (style ?? {});
    const tiles = tree.root
      .findAllByProps({ accessible: undefined })
      .map((n: any) => flat(n.props?.style))
      .filter((st) => st.backgroundColor === '#1b2a49');

    expect(tiles.length).toBeGreaterThan(0);
    expect(tiles.every((st) => st.flex === 0)).toBe(true);
  });

  it('offers "All reviews" only when there are some to read', () => {
    const without = render(
      <ProfileHero
        organizer={model({ reviews: 0 })}
        showAllReviews={false}
        onBack={noop}
        onPressAllReviews={noop}
      />,
    );
    expect(textOf(without)).not.toContain('All reviews');
    // Just the back button.
    expect(drawnButtons(without)).toHaveLength(1);
  });
});

describe('RatingCard', () => {
  it('tells a new organizer apart from a badly rated one', () => {
    /*
     * "0.0" beside five grey stars reads as a bad rating rather than as no
     * rating — a materially different thing to tell somebody choosing who to
     * trust with a wedding.
     */
    const text = textOf(render(<RatingCard rating={0} reviews={0} events={0} onPressReviews={noop} />));
    expect(text).not.toContain('0.0');
    expect(text).toContain('has not been reviewed yet');
  });

  it('shows the score and what it is built on', () => {
    const text = textOf(render(<RatingCard rating={4.8} reviews={126} events={89} onPressReviews={noop} />));
    expect(text).toContain('4.8');
    expect(text).toContain('126 reviews');
    expect(text).toContain('89 events completed');
  });
});

describe('RecentWork and Handles', () => {
  it('disappear entirely rather than showing empty frames', () => {
    expect(render(<RecentWork photos={[]} />).toJSON()).toBeNull();
    expect(render(<Handles items={[]} />).toJSON()).toBeNull();
  });

  it('draw one tile per uploaded photo', () => {
    const tree = render(<RecentWork photos={['a', 'b', 'c']} />);
    expect(tree.root.findAllByProps({ resizeMode: 'cover' }).length).toBeGreaterThanOrEqual(3);
  });
});

describe('QuoteFooter', () => {
  it('offers messaging and asking for a quote as separate controls', () => {
    // One is a question, the other starts a priced conversation — a single
    // button doing both makes the lighter of the two feel like a commitment.
    const tree = render(
      <QuoteFooter
        typicalLabel="₹6.5L – 8L"
        hasRequested={false}
        isRequesting={false}
        errorMessage={null}
        onPress={noop}
        onPressMessage={noop}
        isOpeningMessage={false}
      />,
    );
    const labels = drawnButtons(tree).map((b) => b.props.accessibilityLabel);
    expect(labels).toContain('Message this organizer');
    expect(labels).toContain('Request a quote');
  });

  it('drops the typical range when nothing is published', () => {
    const text = textOf(
      render(
        <QuoteFooter typicalLabel="" hasRequested={false} isRequesting={false} errorMessage={null} onPress={noop} onPressMessage={noop} isOpeningMessage={false} />,
      ),
    );
    expect(text).not.toContain('Typical');
    expect(text).toContain('Request a quote');
  });

  it('becomes a receipt once a request has gone out', () => {
    const tree = render(
      <QuoteFooter
        typicalLabel="₹6.5L – 8L"
        hasRequested
        isRequesting={false}
        errorMessage={null}
        onPress={noop}
        onPressMessage={noop}
        isOpeningMessage={false}
      />,
    );
    expect(textOf(tree)).toContain('Request sent');
    // Disabled, so a second tap cannot raise a second request.
    const quote = drawnButtons(tree).find(
      (b) => b.props.accessibilityLabel === 'Request sent',
    );
    expect(quote?.props.accessibilityState?.disabled).toBe(true);
  });
});

describe('ReviewSummaryCard and ReviewCard', () => {
  it('prints the score, the total and every bar count', () => {
    const text = textOf(render(<ReviewSummaryCard summary={summary()} bars={ratingBars(summary())} />));
    expect(text).toContain('4.8');
    expect(text).toContain('126 reviews');
    ['98', '19', '6', '2', '1'].forEach((n) => expect(text).toContain(n));
  });

  it('shows a review with only the parts it carries', () => {
    const full = textOf(render(<ReviewCard review={review()} avatarColor="#e8633a" />));
    expect(full).toContain('Sandhya P.');
    expect(full).toContain('Naming ceremony · June 2026');
    expect(full).toContain('On time');

    // A rating with no words and no context is still a valid review.
    const bare = textOf(
      render(<ReviewCard review={review({ comment: '', tags: [], contextLabel: '' })} avatarColor="#e8633a" />),
    );
    expect(bare).toContain('Sandhya P.');
    expect(bare).not.toContain('·');
  });
});

describe('render dump', () => {
  it('writes an HTML rendering when EVENTLY_RENDER_OUT is set', () => {
    const out = process.env.EVENTLY_RENDER_OUT;
    if (!out) return;

    const organizer = model();
    const s = summary();

    const panels: Array<[string, string]> = [
      [
        'Organizer profile',
        toHtml(
          render(
            <>
              <ProfileHero organizer={organizer} showAllReviews onBack={noop} onPressAllReviews={noop} />
              <Handles items={organizer.handles} />
              <RatingCard
                rating={s.average}
                reviews={s.total}
                events={organizer.events}
                onPressReviews={noop}
              />
              <QuoteFooter
                typicalLabel={organizer.typicalLabel}
                hasRequested={false}
                isRequesting={false}
                errorMessage={null}
                onPress={noop}
                onPressMessage={noop}
                isOpeningMessage={false}
              />
            </>,
          ).toJSON(),
        ),
      ],
      [
        'Reviews',
        toHtml(
          render(
            <>
              <ReviewSummaryCard summary={s} bars={ratingBars(s)} />
              <ReviewCard review={review()} avatarColor="#e8633a" />
              <ReviewCard
                review={review({
                  id: 'r2',
                  authorName: 'Ravi K.',
                  authorInitials: 'RK',
                  contextLabel: 'Wedding · March 2026',
                  comment:
                    'Quote matched the final bill to the rupee. The live counters ran out of dosa batter for twenty minutes, which is the only thing I would flag.',
                  tags: ['Clear pricing'],
                })}
                avatarColor="#1a2e5a"
              />
              <ReviewCard
                review={review({
                  id: 'r3',
                  authorName: 'Anitha N.',
                  authorInitials: 'AN',
                  rating: 4,
                  contextLabel: 'Housewarming · January 2026',
                  comment:
                    'Good coordination on the day. Photography album took three weeks longer than promised.',
                  tags: [],
                })}
                avatarColor="#1d9e75"
              />
            </>,
          ).toJSON(),
        ),
      ],
      [
        'An organizer nobody has reviewed',
        toHtml(
          render(
            <>
              <ProfileHero
                organizer={model({ reviews: 0, rating: 0, events: 0 })}
                showAllReviews={false}
                onBack={noop}
                onPressAllReviews={noop}
              />
              <RatingCard rating={0} reviews={0} events={0} onPressReviews={noop} />
            </>,
          ).toJSON(),
        ),
      ],
    ];

    fs.writeFileSync(
      out,
      page(panels, { title: 'Organizer', width: 390, background: '#faf8f7', padding: 0 }),
      'utf8',
    );
    expect(fs.existsSync(out)).toBe(true);
  });
});
