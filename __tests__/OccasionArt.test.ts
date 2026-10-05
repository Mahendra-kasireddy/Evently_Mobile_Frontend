import { artFor } from '../src/Components';

describe('which drawing an occasion gets', () => {
  it('takes the exact word', () => {
    expect(artFor('naming')).toBe('naming');
    expect(artFor('Corporate')).toBe('corporate');
  });

  /*
   * Customers write phrases, not keys. Exact-match-only sent every one of
   * these to the wedding — a naming ceremony drawn in wedding artwork and
   * coloured in wedding blush is a visible lie about somebody's event.
   */
  it('finds the word inside the phrase the customer wrote', () => {
    expect(artFor('Naming ceremony')).toBe('naming');
    expect(artFor('Birthday party')).toBe('birthday');
    expect(artFor('Corporate offsite')).toBe('corporate');
    expect(artFor('House warming pooja')).toBe('housewarming');
    expect(artFor('25th Anniversary')).toBe('anniversary');
  });

  it('knows a few words customers use that are not the key', () => {
    expect(artFor('Engagement')).toBe('wedding');
    expect(artFor('Reception')).toBe('wedding');
    expect(artFor('Griha pravesh')).toBe('housewarming');
    expect(artFor('Naamkaran')).toBe('naming');
  });

  it('falls back rather than drawing nothing', () => {
    expect(artFor('')).toBe('wedding');
    expect(artFor('something else entirely')).toBe('wedding');
  });
});
