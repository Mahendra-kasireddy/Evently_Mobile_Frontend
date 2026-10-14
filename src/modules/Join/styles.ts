import { Platform, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { brand, spacing } from '../../theme';

/** Same curve as the login hero — the two screens are one flow. */
export const HEADER_RADIUS = 32;

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: brand.navy,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 3 },
});

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: brand.bg },
  header: {
    borderBottomLeftRadius: HEADER_RADIUS,
    borderBottomRightRadius: HEADER_RADIUS,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
    backgroundColor: brand.navy,
  },
  glow: { position: 'absolute', borderRadius: 999 },
  glowCoral: {
    top: -60,
    right: -70,
    width: 220,
    height: 220,
    backgroundColor: 'rgba(244,123,77,0.16)',
  },
  glowViolet: {
    bottom: -90,
    left: -60,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(124,140,255,0.14)',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: '#ffb59a',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginTop: spacing.md,
  },
  title: { color: brand.onNavy, marginTop: 4, fontSize: 30, lineHeight: 36 },
  subtitle: {
    color: 'rgba(255,255,255,0.78)',
    marginTop: spacing.sm,
    lineHeight: 20,
    fontSize: 14,
  },
  chips: {
    ...globalStyles.row,
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.md,
  },
  chip: {
    ...globalStyles.row,
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  chipText: { color: '#ffffff', fontSize: 11, fontWeight: '600' },
  content: { padding: spacing.md, paddingTop: spacing.lg, gap: spacing.s12 },
  pick: { color: brand.navy, fontWeight: '800', fontSize: 17, marginBottom: 2 },
  sameNumber: {
    color: brand.textMuted,
    textAlign: 'center',
    fontSize: 12.5,
    marginTop: 4,
  },
});

export const roleCardStyles = StyleSheet.create({
  card: {
    ...globalStyles.row,
    gap: spacing.s12,
    backgroundColor: brand.surface,
    borderRadius: 22,
    padding: spacing.s12,
    paddingRight: spacing.sm,
    ...CARD_SHADOW,
  },
  iconTile: {
    width: 60,
    height: 60,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  title: { color: brand.navy, fontSize: 17, lineHeight: 22, fontWeight: '800' },
  description: {
    color: brand.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  tag: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  tagText: { fontSize: 11.5, fontWeight: '700' },
  go: { width: 32, alignItems: 'center', justifyContent: 'center' },
});

/* How it works — three steps in one row, on a dotted thread. */
export const footnoteStyles = StyleSheet.create({
  card: {
    marginTop: spacing.sm,
    backgroundColor: brand.surface,
    borderRadius: 22,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: brand.border,
  },
  title: {
    color: brand.navy,
    fontWeight: '800',
    fontSize: 15,
    marginBottom: spacing.s12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  step: { flex: 1, alignItems: 'center', zIndex: 1 },
  iconWrap: { width: 48, height: 48 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brand.bg,
    borderWidth: 1,
    borderColor: brand.border,
  },
  num: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8633a',
    borderWidth: 2,
    borderColor: brand.surface,
  },
  numText: { color: '#ffffff', fontSize: 10.5, fontWeight: '800' },
  stepTitle: {
    color: brand.navy,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  stepBody: { color: brand.textMuted, fontSize: 11.5, marginTop: 1 },
  thread: {
    position: 'absolute',
    top: 24,
    left: '18%',
    right: '18%',
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#d9d4e0',
  },
  /* Kept for anything still reading the old single-line note. */
  text: { flex: 1, color: brand.textMuted },
});
