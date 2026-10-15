import { Dimensions, Platform, StyleSheet } from 'react-native';
import { ONBOARDING_BG, ONBOARDING_INK, ONBOARDING_MUTED } from './constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// The picture area: as wide as the page allows, never taller than ~45% of it.
const STAGE = Math.min(SCREEN_WIDTH - 40, SCREEN_HEIGHT * 0.45, 380);

const shadow = (opacity: number, radius: number, elevation: number) =>
  Platform.select({
    ios: {
      shadowColor: '#7a4a6a',
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: radius / 2 },
    },
    android: { elevation },
  });

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ONBOARDING_BG },
  wash: { position: 'absolute', borderRadius: 999 },
  washTop: {
    top: -140,
    right: -120,
    width: 320,
    height: 320,
    backgroundColor: 'rgba(255,214,196,0.4)',
  },
  washBottom: {
    bottom: -150,
    left: -130,
    width: 340,
    height: 340,
    backgroundColor: 'rgba(226,218,255,0.45)',
  },

  skipRow: {
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  skipText: { color: ONBOARDING_MUTED, fontSize: 15, fontWeight: '600' },

  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  /* The picture, on a soft round glow. */
  artStage: {
    width: STAGE,
    height: STAGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: STAGE * 0.86,
    height: STAGE * 0.86,
    borderRadius: STAGE,
    opacity: 0.85,
  },
  glowRing: {
    position: 'absolute',
    width: STAGE * 0.98,
    height: STAGE * 0.98,
    borderRadius: STAGE,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    opacity: 0.9,
  },
  artImage: { width: STAGE, height: STAGE * 0.92 },
  artImageTall: { width: STAGE * 0.8, height: STAGE * 0.98, marginTop: 10 },

  /* Slide 1: tilted event photos and little bubbles. */
  photoCard: {
    position: 'absolute',
    width: STAGE * 0.3,
    height: STAGE * 0.3,
    borderRadius: 16,
    padding: 4,
    backgroundColor: '#ffffff',
    ...shadow(0.18, 10, 6),
  },
  photoImg: { width: '100%', height: '100%', borderRadius: 12 },
  photoLeft: {
    top: STAGE * 0.08,
    left: 0,
    transform: [{ rotate: '-9deg' }],
  },
  photoRight: {
    top: STAGE * 0.02,
    right: 4,
    transform: [{ rotate: '8deg' }],
  },
  photoHeart: {
    position: 'absolute',
    bottom: -8,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(0.15, 4, 3),
  },
  bubble: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...shadow(0.15, 6, 4),
  },
  bubblePin: { top: STAGE * 0.5, right: 6 },
  bubbleHeart: { top: STAGE * 0.52, left: 12 },

  spark: { position: 'absolute', zIndex: 2 },
  sparkA: { top: STAGE * 0.36, left: STAGE * 0.06 },
  sparkB: { top: STAGE * 0.4, right: STAGE * 0.04 },
  sparkC: { bottom: STAGE * 0.1, left: STAGE * 0.12 },

  /* Text. */
  copy: { alignItems: 'center', marginTop: 18 },
  heading: {
    color: ONBOARDING_INK,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitle: {
    color: ONBOARDING_MUTED,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 320,
  },

  /* Dots and button. */
  footer: { paddingHorizontal: 22, paddingBottom: 12 },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e7ddea',
    overflow: 'hidden',
  },
  dotFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  button: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#c1477a',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
    }),
  },
  buttonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
});
