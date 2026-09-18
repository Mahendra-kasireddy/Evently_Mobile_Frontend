import { StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import { colors, fontFor, spacing } from '../../theme';
import {
  CHAT_ACCENT,
  CHAT_CANVAS,
  CHAT_GREEN,
  CHAT_HAIRLINE,
  CHAT_NAVY,
  CHAT_NAVY_DEEP,
  CHAT_THEIRS,
} from './constants';

/** The gutter the title, the avatars and the separators all line up on. */
const GUTTER = 20;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  /*
   * A page title, not a bar: no back button, no border, nothing to the right
   * of it. This is the tab's own screen, and a header chrome around a word
   * would only take height away from the list.
   */
  header: { paddingHorizontal: GUTTER, paddingTop: spacing.sm, paddingBottom: spacing.md },
  title: { color: CHAT_NAVY_DEEP, fontSize: 34, fontWeight: '700', letterSpacing: -0.8 },

  /* Rows own their own left padding so the separators can be inset to the
     avatar while the list itself runs to the edge. */
  list: { paddingLeft: GUTTER, paddingBottom: spacing.xl },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centeredIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#fdeee7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
  emptyTitle: { color: CHAT_NAVY, marginTop: spacing.md, textAlign: 'center' },
  emptyBody: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center', lineHeight: 20 },
  errorText: { color: colors.danger, textAlign: 'center', marginTop: spacing.sm },
  retryButton: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: CHAT_HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryText: { color: CHAT_ACCENT, fontWeight: '700' },
  emptyCta: {
    ...globalStyles.row,
    gap: spacing.xs,
    marginTop: spacing.lg,
    borderRadius: 14,
    backgroundColor: CHAT_ACCENT,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
  },
  emptyCtaText: { color: colors.onPrimary, fontWeight: '700' },
});

export const rowStyles = StyleSheet.create({
  /*
   * A hairline between rows rather than a card around each.
   *
   * An inbox is one list, not a stack of separate objects, and the borders and
   * gaps a card needs would let three threads fill the screen. The line starts
   * at the avatar so the eye follows one edge down the page.
   */
  row: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 14,
    paddingRight: GUTTER,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: CHAT_HAIRLINE,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { color: colors.onPrimary, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  text: { flex: 1 },
  headRow: { ...globalStyles.row, alignItems: 'center', gap: 10 },
  /* Set in caps: it is the name of a business, and it keeps a one-line name
     from reading as the first line of the message under it. */
  name: {
    color: CHAT_NAVY_DEEP,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  when: { color: colors.textMuted, fontSize: 13, flexShrink: 0, marginLeft: 'auto' },
  preview: { color: colors.textMuted, fontSize: 14.5, marginTop: 3, lineHeight: 20 },
  previewUnread: { color: '#141c2b', fontWeight: '600' },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: CHAT_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    flexShrink: 0,
  },
  badgeText: { color: colors.onPrimary, fontSize: 12, fontWeight: '700' },
});

export const threadStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CHAT_CANVAS },

  /* The one bar in this module: a thread is somewhere you arrived from
     somewhere else, so it needs a way back and needs to say who you are
     talking to. */
  header: {
    ...globalStyles.row,
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: CHAT_HAIRLINE,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#f2efed',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerAvatarText: { color: colors.onPrimary, fontSize: 14, fontWeight: '700' },
  headerText: { flex: 1 },
  headerName: { color: CHAT_NAVY_DEEP, fontSize: 17.5, fontWeight: '700', letterSpacing: -0.3 },
  /* Green because it is a reassurance, and only rendered when it is measured —
     see `replyLabel`. */
  headerReply: { color: CHAT_GREEN, fontSize: 13.5, marginTop: 1 },
  quote: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: CHAT_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexShrink: 0,
  },
  quoteText: { color: CHAT_NAVY_DEEP, fontSize: 14.5, fontWeight: '600' },

  list: { padding: spacing.md, paddingBottom: spacing.sm },
  spinner: { marginTop: 40 },
  dayLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12, marginTop: 8 },
  mine: { alignSelf: 'flex-end', backgroundColor: CHAT_NAVY_DEEP },
  theirs: { alignSelf: 'flex-start', backgroundColor: CHAT_THEIRS },
  mineText: { color: colors.onPrimary, fontSize: 15.5, lineHeight: 23 },
  theirsText: { color: '#141c2b', fontSize: 15.5, lineHeight: 23 },
  time: { fontSize: 12, marginTop: 8 },
  mineTime: { color: 'rgba(255,255,255,0.55)' },
  theirsTime: { color: colors.textMuted },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  note: {
    color: colors.textMuted,
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.sm,
  },

  /* Suggestions and the box sit together on one white foot, so the thread
     scrolls behind a single surface rather than two stacked strips. */
  foot: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: CHAT_HAIRLINE,
    paddingTop: 12,
    paddingBottom: spacing.md,
  },
  suggestions: { paddingHorizontal: spacing.md, gap: 10, paddingBottom: 12 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: CHAT_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 18,
    paddingVertical: 11,
    /* The row scrolls sideways; a chip that shrank to fit would wrap its
       question over four lines and stop being a chip. */
    flexShrink: 0,
  },
  chipText: { color: CHAT_NAVY_DEEP, fontSize: 14.5 },

  composer: { ...globalStyles.row, alignItems: 'flex-end', gap: 12, paddingHorizontal: spacing.md },
  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 120,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: CHAT_HAIRLINE,
    backgroundColor: CHAT_CANVAS,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    color: colors.text,
    fontSize: 15,
    fontFamily: fontFor('400'),
  },
  send: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: CHAT_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sendDisabled: { opacity: 0.4 },
  sendError: { color: colors.danger, fontSize: 12.5, paddingHorizontal: spacing.md, paddingBottom: 6 },
});
