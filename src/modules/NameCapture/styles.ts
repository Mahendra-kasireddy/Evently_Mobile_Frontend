import { Platform, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import {
  NAME_GATE_ACCENT,
  NAME_GATE_BORDER,
  NAME_GATE_NAVY,
  NAME_GATE_TEXT_MUTED,
} from './constants';

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif' });
const AVATAR = 150;

const softShadow = Platform.select({
  ios: {
    shadowColor: '#c8907a',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 3 },
});

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fbf6f2' },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },

  /* The photo and its greeting. */
  hero: {
    alignSelf: 'center',
    width: AVATAR + 120,
    height: AVATAR + 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: AVATAR + 40,
    height: AVATAR + 40,
    borderRadius: (AVATAR + 40) / 2,
    backgroundColor: '#fde9de',
  },
  avatarPress: { width: AVATAR, height: AVATAR },
  avatarCircle: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: '#fdd9c7',
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...softShadow,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarBusy: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(26,46,90,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: NAME_GATE_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    position: 'absolute',
    top: 10,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    backgroundColor: '#ffffff',
    ...softShadow,
  },
  bubbleText: { fontSize: 17, fontWeight: '700', color: NAME_GATE_NAVY },
  photoLink: { alignSelf: 'center', marginTop: spacing.xs, paddingVertical: 4 },
  photoLinkText: { color: NAME_GATE_ACCENT, fontWeight: '700' },

  /* Words, left-aligned as designed. */
  heading: {
    fontFamily: SERIF,
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 38,
    color: NAME_GATE_NAVY,
    marginTop: spacing.lg,
  },
  subtitle: {
    color: NAME_GATE_TEXT_MUTED,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.xs,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 58,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: NAME_GATE_BORDER,
    backgroundColor: colors.background,
  },
  inputRowFocused: { borderColor: NAME_GATE_ACCENT },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: NAME_GATE_NAVY,
  },
  errorText: { color: colors.danger, marginTop: spacing.sm },

  cta: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    backgroundColor: NAME_GATE_ACCENT,
  },
  ctaIdle: { opacity: 0.6 },
  ctaPressed: { opacity: 0.88 },
  ctaLabel: { color: '#ffffff', fontSize: 17, fontWeight: '700', lineHeight: 22 },
  ctaArrow: { position: 'absolute', right: 22 },
});
