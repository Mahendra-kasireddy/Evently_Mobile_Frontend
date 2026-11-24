import {
  applyCategory,
  categoryChips,
  categoryLabel,
  effectiveFilter,
  formatPhone,
  initialsOf,
  isAlreadyLinked,
  mapMember,
  mapPending,
  performanceTone,
  phoneError,
  sanitizePhoneInput,
  splitRoster,
} from '../src/organizerModules/SubVendors/utils';
import { removeEndpoint } from '../src/organizerModules/SubVendors/constants';
import type {
  SubVendorLinkDTO,
  SubVendorRefDTO,
} from '../src/organizerModules/SubVendors/types';

const NOW = new Date(2026, 9, 29, 12, 0);

const sv = (over: Partial<SubVendorRefDTO> = {}): SubVendorRefDTO => ({
  id: 'sv1',
  fullName: 'Ravi Kumar',
  initials: 'RK',
  avatarColor: '#1d9e75',
  category: 'food',
  serviceArea: 'Hyderabad',
  baseRate: 450,
  baseRateUnit: 'plate',
  active: true,
  ...over,
});

const link = (over: Partial<SubVendorLinkDTO> = {}): SubVendorLinkDTO => ({
  linkId: 'l1',
  status: 'active',
  invitedPhone: null,
  invitedAt: null,
  rating: 0,
  subVendor: sv(),
  eventsCount: 4,
  performancePercent: 90,
  ...over,
});

describe('phone input', () => {
  it('keeps digits only and caps at ten', () => {
    expect(sanitizePhoneInput('98765 43210')).toBe('9876543210');
    expect(sanitizePhoneInput('98765432101')).toBe('9876543210');
    expect(sanitizePhoneInput('98a7')).toBe('987');
  });

  it('drops a pasted +91 or trunk 0', () => {
    expect(sanitizePhoneInput('+91 98765 43210')).toBe('9876543210');
    expect(sanitizePhoneInput('09876543210')).toBe('9876543210');
  });

  it('validates exactly ten digits, as the backend does', () => {
    expect(phoneError('9876543210')).toBeNull();
    expect(phoneError('987654321')).toMatch(/10-digit/);
    expect(phoneError('')).toMatch(/10-digit/);
  });

  it('formats a stored mobile for display', () => {
    expect(formatPhone('9876543210')).toBe('+91 98765 43210');
    expect(formatPhone('+919876543210')).toBe('+91 98765 43210');
    expect(formatPhone('12345')).toBe('12345');
    expect(formatPhone(null)).toBe('');
  });
});

describe('categories', () => {
  it('labels known keys and title-cases unknown ones', () => {
    expect(categoryLabel('food')).toBe('Catering');
    expect(categoryLabel('PHOTOGRAPHY')).toBe('Photography');
    expect(categoryLabel('florist')).toBe('Florist');
    expect(categoryLabel('')).toBe('Other');
  });
});

describe('mapMember', () => {
  it('maps a linked sub-vendor to a card', () => {
    const m = mapMember(link());
    expect(m).toMatchObject({
      linkId: 'l1',
      name: 'Ravi Kumar',
      initials: 'RK',
      category: 'food',
      categoryLabel: 'Catering',
      serviceArea: 'Hyderabad',
      rate: '₹450 / plate',
      performance: 90,
      eventsDone: 4,
      chip: { label: 'Active', tone: 'green' },
    });
  });

  it('says when the vendor is not taking work', () => {
    expect(mapMember(link({ subVendor: sv({ active: false }) })).chip).toEqual({
      label: 'Not taking work',
      tone: 'grey',
    });
  });

  it('leaves the rate empty when unset, and the score null with no jobs', () => {
    const m = mapMember(
      link({
        subVendor: sv({ baseRate: 0 }),
        eventsCount: 0,
        performancePercent: 0,
      }),
    );
    expect(m.rate).toBe('');
    expect(m.performance).toBeNull();
  });

  it('shows a score whenever the API sends a non-zero one', () => {
    expect(
      mapMember(link({ eventsCount: 0, performancePercent: 50 })).performance,
    ).toBe(50);
  });

  it('clamps the percentage and derives initials when missing', () => {
    const m = mapMember(
      link({
        performancePercent: 140,
        subVendor: sv({ initials: '', fullName: 'meena devi rao' }),
      }),
    );
    expect(m.performance).toBe(100);
    expect(m.initials).toBe('MD');
  });
});

describe('mapPending', () => {
  it('formats the number and when it was sent', () => {
    const p = mapPending(
      link({
        status: 'pending',
        subVendor: null,
        invitedPhone: '9876543210',
        invitedAt: new Date(NOW.getTime() - 2 * 3_600_000).toISOString(),
      }),
      NOW,
    );
    expect(p).toEqual({
      linkId: 'l1',
      phone: '+91 98765 43210',
      sentAgo: 'Sent 2h ago',
    });
  });

  it('omits the time when the API has none', () => {
    expect(
      mapPending(link({ status: 'pending', subVendor: null }), NOW).sentAgo,
    ).toBe('');
  });
});

describe('splitRoster', () => {
  it('separates the team from pending invites and drops removed links', () => {
    const { members, pending } = splitRoster(
      [
        link({ linkId: 'a', subVendor: sv({ fullName: 'Zara' }) }),
        link({ linkId: 'b', subVendor: sv({ fullName: 'Anil' }) }),
        link({
          linkId: 'c',
          status: 'pending',
          subVendor: null,
          invitedPhone: '9000011223',
        }),
        link({ linkId: 'd', status: 'removed' }),
      ],
      NOW,
    );
    expect(members.map(m => m.linkId)).toEqual(['b', 'a']);
    expect(pending.map(p => p.linkId)).toEqual(['c']);
  });

  it('copes with no data', () => {
    expect(splitRoster(null)).toEqual({ members: [], pending: [] });
  });
});

describe('category chips and filtering', () => {
  const members = splitRoster([
    link({ linkId: 'a', subVendor: sv({ category: 'decor' }) }),
    link({ linkId: 'b', subVendor: sv({ category: 'food' }) }),
    link({ linkId: 'c', subVendor: sv({ category: 'food' }) }),
  ]).members;

  it('puts All first, then categories biggest first, with counts', () => {
    expect(categoryChips(members)).toEqual([
      { key: 'all', label: 'All', count: 3 },
      { key: 'food', label: 'Catering', count: 2 },
      { key: 'decor', label: 'Decor', count: 1 },
    ]);
  });

  it('filters by category', () => {
    expect(applyCategory(members, 'food')).toHaveLength(2);
    expect(applyCategory(members, 'all')).toHaveLength(3);
  });

  it('falls back to All when the chosen category has emptied', () => {
    const chips = categoryChips(members);
    expect(effectiveFilter('decor', chips)).toBe('decor');
    expect(effectiveFilter('music', chips)).toBe('all');
  });
});

describe('helpers', () => {
  it('grades performance', () => {
    expect(performanceTone(90)).toBe('good');
    expect(performanceTone(75)).toBe('fair');
    expect(performanceTone(40)).toBe('low');
  });

  it('spots an invite answered with an existing link', () => {
    const links = [link({ linkId: 'x' })];
    expect(isAlreadyLinked('x', links)).toBe(true);
    expect(isAlreadyLinked('y', links)).toBe(false);
    expect(
      isAlreadyLinked('x', [link({ linkId: 'x', status: 'removed' })]),
    ).toBe(false);
  });

  it('makes initials', () => {
    expect(initialsOf('  ')).toBe('•');
    expect(initialsOf('Asha')).toBe('A');
  });

  it('builds the remove endpoint', () => {
    expect(removeEndpoint('abc123')).toBe('/organizer/subvendors/abc123');
  });
});
