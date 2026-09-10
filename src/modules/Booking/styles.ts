import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing } from '../../theme';
import {
  BOOKING_ACCENT,
  BOOKING_ACCENT_SOFT,
  BOOKING_CANVAS,
  BOOKING_NAVY,
} from './constants';

/** The hairline used for card edges and dividers — warm, to sit on the canvas. */
const HAIRLINE = '#efe9e5';
/** The unfilled half of a progress bar, and the resting pill. */
const TRACK = '#f0ecea';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BOOKING_CANVAS },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: BOOKING_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
  emptyTitle: { color: BOOKING_NAVY, marginTop: spacing.md, textAlign: 'center' },
  emptySubtitle: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyCta: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.lg,
    borderRadius: 14,
    backgroundColor: BOOKING_ACCENT,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
  },
  emptyCtaText: { color: colors.onPrimary, fontWeight: '700' },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: BOOKING_ACCENT, fontWeight: '700' },

  /** The screen's own title, in place of a header bar — this is a tab. */
  headerRow: {
    ...globalStyles.row,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  backButton: { marginLeft: -6, paddingRight: 2, paddingVertical: 2 },
  /*
   * 27/Bold, not 28/ExtraBold. Poppins' ExtraBold is genuinely heavy — at
   * display size it reads as a shout rather than as a page title, and its
   * wider letterforms already give the line the weight the design wanted.
   */
  screenTitle: {
    color: BOOKING_NAVY,
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
  },

  /** Empty-list body inside the scroller, so the tabs stay reachable above it. */
  emptyPanel: { alignItems: 'center', paddingVertical: spacing.xl },
});

export const eventTabsStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  tab: {
    borderRadius: 999,
    backgroundColor: TRACK,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  tabOn: { backgroundColor: BOOKING_NAVY },
  // SemiBold: Poppins Bold inside a small pill closes up the counters.
  tabText: { color: '#6f6a66', fontSize: 14, fontWeight: '600' },
  tabTextOn: { color: colors.onPrimary },
});

export const eventCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAIRLINE,
    padding: spacing.md,
    marginBottom: 14,
  },
  /**
   * The event being worked on right now wears the accent as its edge. One at a
   * time, and only ever the soonest — a list where every card is highlighted
   * highlights nothing.
   */
  cardFocus: { borderColor: BOOKING_ACCENT, borderWidth: 1.5 },

  head: { flexDirection: 'row', gap: 12 },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: BOOKING_ACCENT_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: { flex: 1 },
  titleRow: { ...globalStyles.row, gap: spacing.sm },
  title: { color: BOOKING_NAVY, fontSize: 17, fontWeight: '700', lineHeight: 23, flex: 1 },
  subtitle: { color: colors.textMuted, fontSize: 12.5, marginTop: 2, lineHeight: 18 },

  statusChip: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, flexShrink: 0 },
  /*
   * The longest label this can hold is "EXPIRED — NO RESPONSE". Poppins sets
   * wide, and at 10/ExtraBold with half a point of tracking that pill crowds
   * the title off its own line, so the caps run a shade smaller and lighter.
   */
  statusText: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.4 },

  progressRow: { ...globalStyles.row, gap: 12, marginTop: 14 },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: TRACK, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: BOOKING_ACCENT },
  daysLabel: { color: '#5b6470', fontSize: 13, fontWeight: '600' },

  /** Edge to edge, so the footer reads as its own band rather than a stray rule. */
  divider: {
    height: 1,
    backgroundColor: HAIRLINE,
    marginTop: 14,
    marginHorizontal: -spacing.md,
  },
  nextText: { color: '#414b5c', fontSize: 13, marginTop: 12, lineHeight: 19 },
});

export const jumpToStyles = StyleSheet.create({
  /*
   * A section label, not a title.
   *
   * At 17/Bold navy this line was set exactly like the event card titles above
   * it, so "Jump to" and "Naming ceremony" read as the same rank and the group
   * heading stopped doing its one job — saying that what follows belongs
   * together and sits below what came before.
   *
   * It now wears the label treatment Profile and Settings already use for the
   * same purpose: small, muted, letterspaced caps. Three signals move at once
   * — size, weight against a lighter colour, and case — so the two levels
   * cannot be confused at a glance or by someone who reads the screen through
   * a magnifier. A shade darker and a point larger than those screens' labels,
   * because this one has to hold its own against much bigger cards.
   */
  heading: {
    color: '#7b8595',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    lineHeight: 17,
    marginTop: 14,
    marginBottom: 10,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    // Two per row: half the space, minus half the 12pt gap between them.
    // No flexGrow — see the occasion grid: a lone or trailing tile would
    // otherwise stretch to the full row and read as a different component.
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HAIRLINE,
    padding: 14,
  },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: { color: BOOKING_NAVY, fontSize: 14.5, fontWeight: '600', lineHeight: 20, marginTop: 12 },
  tileSubtitle: { color: colors.textMuted, fontSize: 12.5, marginTop: 3, lineHeight: 17 },
});
