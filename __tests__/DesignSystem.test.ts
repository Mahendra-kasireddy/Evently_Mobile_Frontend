/**
 * @format
 *
 * The design system's production values.
 *
 * These are the numbers the design hands over, so they are pinned rather than
 * described: a token quietly edited to 17 because one screen looked better is
 * how a scale stops being one.
 */

import { typography, typographyTokens } from '../src/theme/typography';
import { spacing, layout } from '../src/theme/spacing';
import { fontFamilies, fontFor } from '../src/theme/fonts';

describe('the type scale', () => {
  it('is exactly what the design system specifies', () => {
    expect(typographyTokens).toEqual({
      display: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
      screenTitle: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
      sectionTitle: { fontSize: 18, fontWeight: '700', lineHeight: 24 },
      cardTitle: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
      body: { fontSize: 15, fontWeight: '400', lineHeight: 21 },
      bodyMedium: { fontSize: 15, fontWeight: '500', lineHeight: 21 },
      label: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
      small: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
      caption: { fontSize: 11, fontWeight: '400', lineHeight: 14 },
      button: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
      input: { fontSize: 15, fontWeight: '400', lineHeight: 20 },
      placeholder: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    });
  });

  it('uses only the four weights the design system supports', () => {
    // A weight with no face behind it falls back to the system font on
    // Android, which is far more visible than being 100 too light.
    const supported = ['400', '500', '600', '700'];
    for (const token of Object.values(typographyTokens)) {
      expect(supported).toContain(token.fontWeight);
    }
  });

  it('gives every level its own line height', () => {
    // Poppins' default leading is tight for its x-height, and a heading set
    // without one collides on the second line — where a two-line event title
    // lands.
    for (const token of Object.values(typographyTokens)) {
      expect(typeof token.lineHeight).toBe('number');
    }
  });

  it('keeps the names the app already writes, as aliases onto tokens', () => {
    /*
     * `variant="h2"` appears in some seven hundred places. They are aliases,
     * not a second scale: each one IS a token, so a screen written either way
     * renders identically.
     */
    expect(typography.h1).toBe(typographyTokens.screenTitle);
    expect(typography.h2).toBe(typographyTokens.sectionTitle);
    expect(typography.subtitle).toBe(typographyTokens.bodyMedium);
    expect(typography.body).toBe(typographyTokens.body);
    expect(typography.caption).toBe(typographyTokens.caption);
  });
});

describe('the font', () => {
  it('is Poppins, one file per bundled weight', () => {
    expect(fontFamilies).toEqual({
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semibold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
      extrabold: 'Poppins-ExtraBold',
    });
  });

  it('names a face for every weight, never a bare family', () => {
    // Android ignores `fontWeight` on a custom family and renders Regular, so
    // the weight has to become a face before it reaches Text.
    expect(fontFor('400')).toBe(fontFamilies.regular);
    expect(fontFor('500')).toBe(fontFamilies.medium);
    expect(fontFor('600')).toBe(fontFamilies.semibold);
    expect(fontFor('700')).toBe(fontFamilies.bold);
    expect(fontFor('bold')).toBe(fontFamilies.bold);
  });

  it('resolves every weight to a real face, never a bare family', () => {
    /*
     * The design system uses four weights; ExtraBold stays mapped so anything
     * that still asks for 800 gets a face rather than falling through to
     * Roboto, which is what an unmapped weight renders as on Android.
     */
    expect(fontFor('800')).toBe(fontFamilies.extrabold);
    expect(fontFor('300')).toBe(fontFamilies.regular);
    expect(fontFor(undefined)).toBe(fontFamilies.regular);
  });
});

describe('the spacing scale', () => {
  it('holds every step the design system uses, and nothing else', () => {
    expect(Object.values(spacing).sort((a, b) => a - b)).toEqual([
      4, 8, 12, 16, 20, 24, 32, 40,
    ]);
  });
});

describe('the header and control measurements', () => {
  it('fixes the header, so one screen is the same height as another', () => {
    expect(layout.headerHeight).toBe(56);
    expect(layout.headerPadding).toBe(16);
    expect(layout.headerGap).toBe(8);
    expect(layout.headerActionIcon).toBe(22);
  });

  it('separates the back icon from its touch target', () => {
    // The icon is what you see, the target is what you hit. 20pt of chevron
    // inside 44pt of tappable area.
    expect(layout.backIcon).toBe(20);
    expect(layout.backTouch).toBe(44);
  });

  it('gives inputs and buttons the same height', () => {
    expect(layout.inputHeight).toBe(48);
    expect(layout.buttonHeight).toBe(48);
    expect(layout.buttonRadius).toBeGreaterThanOrEqual(10);
    expect(layout.buttonRadius).toBeLessThanOrEqual(12);
  });
});
