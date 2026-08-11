import { Dimensions, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import {
  CATEGORY_ICON_BADGE_COLOR,
  HERO_ACCENT_COLOR,
  HERO_ACCENT_WARM_COLOR,
  HERO_BACKGROUND_COLOR,
  HERO_DECOR_CIRCLE_COLOR,
  HERO_FIELD_ICON_BG,
} from './constants';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorText: { color: colors.danger, textAlign: 'center' },
});

export const homeHeaderStyles = StyleSheet.create({
  container: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  locationButton: { ...globalStyles.row, flexShrink: 1, marginRight: spacing.md },
  locationLabel: { color: colors.text, marginLeft: spacing.xs, flexShrink: 1 },
  bellButton: { padding: spacing.xs },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.onPrimary, fontSize: 10, lineHeight: 12 },
});

export const bannerStyles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: HERO_BACKGROUND_COLOR,
    borderRadius: 20,
    margin: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -10,
    width: 130,
    height: 130,
    borderRadius: 999,
    backgroundColor: HERO_DECOR_CIRCLE_COLOR,
  },
  decorConfetti: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.25 },
  decorGarland: { position: 'absolute', top: -12, right: -46, width: 150, height: 130, opacity: 0.8 },
  content: { position: 'relative' },
  greeting: { color: colors.onPrimaryMuted },
  heading: { color: colors.onPrimary, marginTop: spacing.xs },
  accent: { color: HERO_ACCENT_WARM_COLOR },
  subtitle: { color: colors.onPrimaryMuted, marginTop: spacing.sm },
  // Single tappable "search" trigger — a solid floating white card (matching
  // web's actual solid-white search bar) with a bold accent CTA, replacing
  // both the boxed field grid and the earlier washed-out glass pill.
  searchTrigger: {
    ...globalStyles.row,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.sm,
    marginTop: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  searchIconChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: HERO_FIELD_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTextWrap: { flex: 1, marginLeft: spacing.sm },
  searchLabel: { color: colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' },
  searchSummary: { color: CATEGORY_ICON_BADGE_COLOR, marginTop: 2, fontWeight: '700' },
  searchArrowButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: HERO_ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  successText: { color: colors.onPrimary, textAlign: 'center', marginTop: spacing.xs },
  successEdit: { color: HERO_ACCENT_WARM_COLOR, marginTop: spacing.sm, textDecorationLine: 'underline' },
  formErrorText: { color: colors.danger, marginTop: spacing.sm, textAlign: 'center' },
  // Bottom sheet — chip pickers for all four fields plus the submit button.
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheetContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: '82%',
  },
  sheetTitle: { color: colors.text },
  sheetSubtitle: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.sm },
  chipGroup: { marginTop: spacing.md },
  chipGroupHeader: { ...globalStyles.row, marginBottom: spacing.sm },
  chipGroupIconChip: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: HERO_FIELD_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  chipGroupLabel: { color: colors.text, fontWeight: '700' },
  chipRow: { paddingRight: spacing.lg },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: CATEGORY_ICON_BADGE_COLOR, borderColor: CATEGORY_ICON_BADGE_COLOR },
  chipText: { color: colors.text },
  chipTextActive: { color: colors.onPrimary, fontWeight: '700' },
  getQuotesButton: { marginTop: spacing.lg },
});

export const currentEventStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  card: { ...globalStyles.card, padding: spacing.md },
  titleRow: { ...globalStyles.row },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: { color: colors.text, flexShrink: 1 },
  stageRow: { marginTop: spacing.sm },
  stagePill: {
    ...globalStyles.row,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: spacing.xs,
  },
  stageDot: { width: 6, height: 6, borderRadius: 3 },
  stageText: { fontWeight: '700' },
  footerRow: { ...globalStyles.row, justifyContent: 'space-between', marginTop: spacing.sm },
  daysToGoBadge: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  daysToGo: { color: colors.primary, fontWeight: '700' },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  progressLabel: { color: colors.textMuted },
});

// Narrow enough that the 2nd card shows fully and a sliver of the 3rd is
// visible too — a real, literal multi-card carousel, not a decorative peek.
export const CATEGORY_CARD_WIDTH = Dimensions.get('window').width * 0.42;
export const CATEGORY_CARD_SPACING = spacing.md;
const CATEGORY_CARD_HEIGHT = CATEGORY_CARD_WIDTH / 0.82;

// Web's reference card is 164x160 with an 11px/34px badge and a 92x74 art
// block starting 34px from the top — scaled by card width so the same
// relative geometry holds at our (larger, taller) card size.
const WEB_CARD_REFERENCE_WIDTH = 164;
const CATEGORY_SCALE = CATEGORY_CARD_WIDTH / WEB_CARD_REFERENCE_WIDTH;
export const CATEGORY_ICON_BADGE_SIZE = 34 * CATEGORY_SCALE;
export const CATEGORY_ICON_BADGE_OFFSET = 11 * CATEGORY_SCALE;
export const CATEGORY_ART_WIDTH = 92 * CATEGORY_SCALE;
export const CATEGORY_ART_HEIGHT = 74 * CATEGORY_SCALE;
export const CATEGORY_ART_TOP = 34 * CATEGORY_SCALE;

export const categoriesStyles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
  },
  header: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  title: { color: colors.text },
  seeAll: { color: colors.primary },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  card: {
    width: CATEGORY_CARD_WIDTH,
    height: CATEGORY_CARD_HEIGHT,
    borderRadius: 16,
    marginRight: CATEGORY_CARD_SPACING,
    overflow: 'hidden',
  },
  cardBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  confettiLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  artLayer: {
    position: 'absolute',
    top: CATEGORY_ART_TOP,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  iconBadge: {
    position: 'absolute',
    top: CATEGORY_ICON_BADGE_OFFSET,
    left: CATEGORY_ICON_BADGE_OFFSET,
    width: CATEGORY_ICON_BADGE_SIZE,
    height: CATEGORY_ICON_BADGE_SIZE,
    borderRadius: CATEGORY_ICON_BADGE_SIZE * 0.3,
    backgroundColor: colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaBlock: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  label: { color: colors.onPrimary },
  ctaRow: {
    ...globalStyles.row,
    marginTop: spacing.xs,
  },
  meta: { color: colors.onPrimaryMuted, marginRight: spacing.xs },
});

export const featuredEventsStyles = StyleSheet.create({
  section: { marginTop: spacing.lg },
  header: { paddingHorizontal: spacing.md },
  title: { color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  card: {
    ...globalStyles.card,
    width: 220,
    padding: spacing.md,
    marginRight: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  eventTitle: { color: colors.text, marginTop: spacing.sm },
  metaRow: { ...globalStyles.row, marginTop: spacing.sm },
  metaText: { color: colors.textMuted, marginLeft: spacing.xs },
  budgetText: { color: colors.primary, fontWeight: '700', marginLeft: spacing.xs },
  tagRow: { ...globalStyles.row, marginTop: spacing.sm, flexWrap: 'wrap' },
  tag: {
    color: colors.textMuted,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  buildRow: { paddingHorizontal: spacing.md, marginTop: spacing.md },
});

export const recommendedEventsStyles = StyleSheet.create({
  section: { marginTop: spacing.lg },
  header: {
    ...globalStyles.row,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  title: { color: colors.text },
  seeAll: { color: colors.primary },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  card: {
    ...globalStyles.card,
    width: 180,
    padding: spacing.md,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  // A thin tier-colored strip along the top gives each organizer card its
  // own identity at a glance, instead of every card looking identical.
  tierStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.onPrimary },
  name: { color: colors.text, marginTop: spacing.sm },
  tierBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  tierBadgeText: { fontWeight: '700', color: colors.onPrimary },
  ratingRow: { ...globalStyles.row, marginTop: spacing.sm },
  ratingText: { color: colors.text, marginLeft: spacing.xs },
  reviews: { color: colors.textMuted },
  tagRow: { ...globalStyles.row, marginTop: spacing.sm, flexWrap: 'wrap' },
  tag: {
    color: colors.textMuted,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
});

export const howItWorksStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  title: { color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs },
  list: { marginTop: spacing.lg },
  // A connected timeline: an icon "node" per step, linked by a vertical
  // line, with the step content beside it — reads as a guided journey
  // rather than a stack of identical boxes.
  stepRow: { flexDirection: 'row' },
  timelineCol: { width: 56, alignItems: 'center' },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadge: {
    position: 'absolute',
    bottom: -4,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: { fontWeight: '700', fontSize: 10, lineHeight: 12 },
  connector: { width: 2, flex: 1, marginTop: spacing.xs, marginBottom: spacing.xs },
  stepContent: { flex: 1, paddingLeft: spacing.md, paddingBottom: spacing.xl },
  cardTitle: { color: colors.text, marginBottom: spacing.xs },
  cardDesc: { color: colors.textMuted },
});

export const planSmarterStyles = StyleSheet.create({
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  title: { color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: spacing.xs },
  // A 2x2 grid of colorful tiles reads as a set of distinct tools at a
  // glance, rather than four identical bordered boxes stacked vertically.
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  card: {
    ...globalStyles.card,
    width: '48%',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: { color: colors.text, marginBottom: spacing.xs },
  cardDesc: { color: colors.textMuted },
});
