import {
  changedSections,
  formFrom,
  isDirty,
  mapGallery,
  mapIdentity,
  publicName,
  validate,
} from '../src/organizerModules/Profile/utils';
import type { OrganizerProfileDTO } from '../src/organizerModules/Profile/types';

const profile = (over: Partial<OrganizerProfileDTO> = {}): OrganizerProfileDTO => ({
  id: 'p1',
  onboardingStatus: 'approved',
  firstName: 'Mahendra',
  lastName: 'K',
  businessName: 'Sri Lakshmi Events',
  displayName: '',
  tagline: 'Weddings that feel like you',
  businessDescription: 'We plan weddings.',
  primaryCategory: 'wedding_planner',
  secondaryCategories: ['decor'],
  city: 'Hyderabad',
  profilePhoto: null,
  gallery: [{ url: 'https://cdn.example.com/a.jpg', key: 'a' }],
  ...over,
});

const config = { categories: [{ key: 'wedding_planner', label: 'Wedding Planner' }] };

describe('identity', () => {
  it('names the business, its category and city, with live status and stats', () => {
    expect(
      mapIdentity(profile(), { rating: 4.62, reviews: 12, events: 30, tier: 'Gold', isLive: true }, config),
    ).toMatchObject({
      name: 'Sri Lakshmi Events',
      subtitle: 'Wedding Planner · Hyderabad',
      initials: 'SL',
      tier: 'Gold',
      isLive: true,
      rating: '4.6',
      reviews: 12,
      events: 30,
    });
  });

  it('prefers the display name, and falls back to the person', () => {
    expect(publicName(profile({ displayName: 'SLE' }))).toBe('SLE');
    expect(publicName(profile({ businessName: '', displayName: '' }))).toBe('Mahendra K');
  });

  it('shows "New" before any rating, and not live while unapproved', () => {
    expect(mapIdentity(profile({ onboardingStatus: 'in_progress' }), null, null)).toMatchObject({
      rating: 'New',
      isLive: false,
      tier: 'Silver',
    });
  });

  it('maps the gallery to images', () => {
    expect(mapGallery(profile())).toEqual([{ key: 'a', uri: 'https://cdn.example.com/a.jpg' }]);
  });
});

describe('edit form', () => {
  const before = formFrom(profile());

  it('rejects a business name under two characters', () => {
    expect(validate({ ...before, businessName: ' A ' })).toHaveProperty('businessName');
    expect(validate(before)).toEqual({});
  });

  it('saves only the sections that changed', () => {
    expect(changedSections(before, { ...before, tagline: 'New line' })).toEqual({
      portfolio: { tagline: 'New line', businessDescription: 'We plan weddings.' },
    });
    expect(changedSections(before, { ...before, displayName: 'SLE' })).toEqual({
      basics: { businessName: 'Sri Lakshmi Events', displayName: 'SLE' },
    });
    expect(
      changedSections(before, { ...before, secondaryCategories: ['decor', 'catering'] }),
    ).toEqual({ services: { secondaryCategories: ['decor', 'catering'] } });
  });

  it('is not dirty for whitespace or reordered services', () => {
    expect(isDirty(before, { ...before, tagline: `${before.tagline}  ` })).toBe(false);
    const two = { ...before, secondaryCategories: ['a', 'b'] };
    expect(isDirty(two, { ...two, secondaryCategories: ['b', 'a'] })).toBe(false);
  });
});
