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
  header: { paddingHorizontal: GUTTER, paddingTop: spacing.sm, paddingBottom: spacing.sm + 2 },
  /*
   * 26 with its own line height.
   *
   * It was 34 and inherited the `h1` token's smaller line box, so the word sat
   * taller than the line it was given and the tops of the letters were sliced
   * off under the status bar. Any size set here has to bring a line height
   * with it; 26 is also nearer the rest of the app's screen titles.
   */
  title: {
    color: CHAT_NAVY_DEEP,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.6,
  },

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
    fontSize: 14.5,
    lineHeight: 19,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
  when: { color: colors.textMuted, fontSize: 12.5, flexShrink: 0, marginLeft: 'auto' },
  preview: { color: colors.textMuted, fontSize: 14, marginTop: 2, lineHeight: 19 },
  /* A thread nobody has written in yet. Set apart from a real message, so the
     row never reads as a message that failed to load. */
  previewEmpty: { color: colors.textMuted, fontStyle: 'italic' },
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
  /* Just the chevron. The disc behind it was a second shape to notice for a
     control every screen has in the same corner, and the touch target is the
     box, not the paint. */
  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
    flexShrink: 0,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerAvatarText: { color: colors.onPrimary, fontSize: 13, fontWeight: '700' },
  headerText: { flex: 1 },
  /*
    * Every size on this screen is a step down from where it was.
    *
    * The thread was set at reading sizes — a 17.5 name over 15.5 bubbles —
    * which on a phone left four lines of a three-line message and pushed the
    * composer's suggestions off the fold. A conversation is scanned, not read
    * like a page.
    */
  headerName: {
    color: CHAT_NAVY_DEEP,
    fontSize: 15.5,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  /* Green because it is a reassurance, and only rendered when it is measured —
     see `replyLabel`. */
  headerReply: { color: CHAT_GREEN, fontSize: 12.5, lineHeight: 16, marginTop: 1 },
  quote: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: CHAT_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexShrink: 0,
  },
  quoteText: { color: CHAT_NAVY_DEEP, fontSize: 13, fontWeight: '700' },

  list: { padding: spacing.md, paddingBottom: spacing.sm },
  spinner: { marginTop: 40 },
  dayLabel: {
    color: colors.textMuted,
    fontSize: 11.5,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  bubble: { maxWidth: '78%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, marginTop: 8 },
  mine: { alignSelf: 'flex-end', backgroundColor: CHAT_NAVY_DEEP },
  theirs: { alignSelf: 'flex-start', backgroundColor: CHAT_THEIRS },
  mineText: { color: colors.onPrimary, fontSize: 14.5, lineHeight: 20 },
  theirsText: { color: '#141c2b', fontSize: 14.5, lineHeight: 20 },
  time: { fontSize: 11, marginTop: 6 },
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
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.sm,
  },

  /* Suggestions and the box sit together on one white foot, so the thread
     scrolls behind a single surface rather than two stacked strips. */
  /*
   * The composer's own surface. Its bottom padding is set at render time:
   * the home-indicator inset while the keyboard is down, and 10 while it is
   * up — the keyboard already covers that strip, and padding it twice leaves
   * a band of white above the keys.
   */
  foot: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: CHAT_HAIRLINE,
    paddingTop: 10,
  },
  suggestions: { paddingHorizontal: spacing.md, gap: 8, paddingBottom: 10 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: CHAT_HAIRLINE,
    backgroundColor: colors.background,
    paddingHorizontal: 13,
    paddingVertical: 8,
    /* The row scrolls sideways; a chip that shrank to fit would wrap its
       question over four lines and stop being a chip. */
    flexShrink: 0,
  },
  chipText: { color: CHAT_NAVY_DEEP, fontSize: 12.5, lineHeight: 16 },

  composer: {
    ...globalStyles.row,
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: spacing.md,
  },
  /*
   * The pill is a View; the field inside it is bare.
   *
   * A multiline TextInput that draws its own border, radius and padding puts
   * its text wherever the platform's font metrics say — and on iOS, with a
   * custom family and a line height, that was outside the box: the typed word
   * sat above the pill with the caret under it. Nothing about that is fixable
   * by nudging padding. So the box is a plain View that cannot move, and the
   * input inside it carries no padding, no border and no line height of its
   * own — it only lays out text, and the View grows with it.
   */
  inputWrap: {
    flex: 1,
    /* One line of 14pt text is 17; 40 is that plus 11 above and below. The
       box grows from there and stops at four lines. */
    minHeight: 40,
    maxHeight: 96,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CHAT_HAIRLINE,
    backgroundColor: CHAT_CANVAS,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  input: {
    padding: 0,
    margin: 0,
    maxHeight: 80,
    color: colors.text,
    fontSize: 14,
    fontFamily: fontFor('400'),
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: CHAT_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sendDisabled: { opacity: 0.4 },
  sendError: { color: colors.danger, fontSize: 12, paddingHorizontal: spacing.md, paddingBottom: 6 },
});
