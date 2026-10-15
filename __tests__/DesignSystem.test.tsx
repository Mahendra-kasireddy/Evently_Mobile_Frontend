/**
 * @format
 *
 * The design system's production values.
 *
 * These are the numbers the design hands over, so they are pinned rather than
 * described: a token quietly edited to 17 because one screen looked better is
 * how a scale stops being one.
 */

import { Platform } from 'react-native';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import {
  typography,
  typographyWeights,
  tabBarLabel,
  MIN_FONT_SIZE,
} from '../src/theme/typography';
import { spacing, layout } from '../src/theme/spacing';
import { fontFamilies, fontFor } from '../src/theme/fonts';
import { textColors } from '../src/theme/textColors';
import { AppText } from '../src/Components/AppText';

const face = (ios: string, android: string) =>
  Platform.OS === 'ios' ? ios : android;

describe('the type scale', () => {
  it('is exactly what the design system specifies', () => {
    const v = (
      fontSize: number,
      lineHeight: number,
      fontFamily: string,
      letterSpacing: number,
    ) => ({ fontSize, lineHeight, fontFamily, letterSpacing });
    expect(typography).toEqual({
      display: v(32, 40, fontFamilies.bold, -0.5),
      h1: v(28, 34, fontFamilies.bold, -0.5),
      h2: v(20, 26, fontFamilies.semibold, -0.25),
      h3: v(17, 22, fontFamilies.semibold, 0),
      bodyLarge: v(16, 24, fontFamilies.regular, 0),
      body: v(14, 20, fontFamilies.regular, 0),
      bodySmall: v(13, 18, fontFamilies.regular, 0),
      button: v(16, 20, fontFamilies.medium, 0.2),
      buttonSmall: v(14, 18, fontFamilies.medium, 0.2),
      label: v(12, 16, fontFamilies.medium, 0.5),
      caption: v(12, 16, fontFamilies.regular, 0),
      overline: {
        ...v(11, 14, fontFamilies.semibold, 1),
        textTransform: 'uppercase',
      },
    });
  });

  it('carries weight as a face, never as fontWeight', () => {
    for (const token of Object.values(typography)) {
      expect(token.fontWeight).toBeUndefined();
      expect(Object.values(fontFamilies)).toContain(token.fontFamily);
    }
    expect(fontFor(typographyWeights.h2)).toBe(typography.h2.fontFamily);
    expect(fontFor(typographyWeights.label)).toBe(typography.label.fontFamily);
  });

  it('never goes below 11', () => {
    for (const token of Object.values(typography)) {
      expect(token.fontSize).toBeGreaterThanOrEqual(MIN_FONT_SIZE);
    }
    expect(tabBarLabel.fontSize).toBe(11);
    expect(tabBarLabel.fontFamily).toBe(fontFamilies.medium);
  });
});

describe('the font', () => {
  it('is Inter, one face per weight', () => {
    expect(fontFamilies).toEqual({
      regular: face('Inter-Regular', 'Inter_400Regular'),
      medium: face('Inter-Medium', 'Inter_500Medium'),
      semibold: face('Inter-SemiBold', 'Inter_600SemiBold'),
      bold: face('Inter-Bold', 'Inter_700Bold'),
    });
  });

  it('rounds every weight to one of the four faces', () => {
    expect(fontFor('400')).toBe(fontFamilies.regular);
    expect(fontFor('500')).toBe(fontFamilies.medium);
    expect(fontFor('600')).toBe(fontFamilies.semibold);
    expect(fontFor('700')).toBe(fontFamilies.bold);
    expect(fontFor('800')).toBe(fontFamilies.bold);
    expect(fontFor('bold')).toBe(fontFamilies.bold);
    expect(fontFor('300')).toBe(fontFamilies.regular);
    expect(fontFor(undefined)).toBe(fontFamilies.regular);
  });
});

describe('the text colours', () => {
  it('match the spec in light and dark', () => {
    expect(textColors.light).toMatchObject({
      textPrimary: '#1A1A1A',
      textSecondary: '#6B6B6B',
      textDisabled: '#A3A3A3',
      textOnPrimary: '#FFFFFF',
    });
    expect(textColors.dark).toMatchObject({
      textPrimary: '#E6E6E6',
      textSecondary: '#A0A0A0',
      textDisabled: '#5C5C5C',
      textOnPrimary: '#FFFFFF',
    });
  });
});

describe('AppText', () => {
  const styleOf = (el: React.ReactElement) => {
    let tree!: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(el);
    });
    return tree.root.findByType('Text' as never).props;
  };

  it('defaults to body in textPrimary, scaling capped at 1.5x', () => {
    const p = styleOf(<AppText>Hi</AppText>);
    expect(p.style).toMatchObject({
      ...typography.body,
      color: textColors.light.textPrimary,
    });
    expect(p.allowFontScaling).toBe(true);
    expect(p.maxFontSizeMultiplier).toBe(1.5);
  });

  it('takes a variant, a colour token, alignment and a weight', () => {
    const p = styleOf(
      <AppText variant="h3" color="textSecondary" align="center" weight="bold">
        Hi
      </AppText>,
    );
    expect(p.style).toMatchObject({
      fontSize: 17,
      color: textColors.light.textSecondary,
      textAlign: 'center',
      fontFamily: fontFamilies.bold,
    });
  });

  it('turns a stray fontWeight into a face and floors tiny sizes', () => {
    const p = styleOf(
      <AppText style={{ fontWeight: '600', fontSize: 9 }}>Hi</AppText>,
    );
    expect(p.style.fontWeight).toBeUndefined();
    expect(p.style.fontFamily).toBe(fontFamilies.semibold);
    expect(p.style.fontSize).toBe(11);
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
    expect(layout.headerHeight).toBe(48);
    expect(layout.headerPadding).toBe(16);
    expect(layout.headerGap).toBe(8);
    expect(layout.headerActionIcon).toBe(22);
  });

  it('separates the back icon from its touch target', () => {
    // The icon is what you see, the target is what you hit. 22pt of chevron
    // inside 44pt of tappable area — the icon always well inside its target.
    expect(layout.backIcon).toBe(22);
    expect(layout.backTouch).toBe(44);
    expect(layout.backIcon).toBeLessThan(layout.backTouch);
  });

  it('gives inputs and buttons the same height', () => {
    expect(layout.inputHeight).toBe(48);
    expect(layout.buttonHeight).toBe(48);
    expect(layout.buttonRadius).toBeGreaterThanOrEqual(10);
    expect(layout.buttonRadius).toBeLessThanOrEqual(12);
  });
});
