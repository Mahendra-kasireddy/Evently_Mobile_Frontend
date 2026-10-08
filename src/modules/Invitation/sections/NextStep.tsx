import { ActivityIndicator, View } from 'react-native';
import {
  EventlyIcon,
  EventlyText,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { colors } from '../../../theme';
import { INVITATION_COPY as COPY } from '../constants';
import { nextStepStyles as s } from '../styles';
import type { ChangeRequestDTO } from '../types';

/** Where the invitation stands. One of these is always true. */
export type InvitationStage = 'review' | 'update' | 'asked' | 'live';

/** Guests on the list, sent to, and opened — null while it loads. */
export interface GuestProgress {
  total: number;
  sent: number;
  viewed: number;
}

/** Each stage's mark, ink and tint. */
const LOOK: Record<
  InvitationStage,
  {
    icon: string;
    colors: [string, string];
    ink: string;
    wash: string;
    line: string;
  }
> = {
  review: {
    icon: 'eye-check-outline',
    colors: ['#ff8a5c', '#e8433a'],
    ink: '#c94a24',
    wash: '#fff7f2',
    line: '#f6dccd',
  },
  update: {
    icon: 'refresh',
    colors: ['#a084ff', '#5a35e0'],
    ink: '#5a35e0',
    wash: '#f7f4ff',
    line: '#e3dafb',
  },
  asked: {
    icon: 'message-processing-outline',
    colors: ['#ffb547', '#f0791a'],
    ink: '#a8540a',
    wash: '#fdf7ec',
    line: '#f1e0c2',
  },
  live: {
    icon: 'check-decagram',
    colors: ['#3cc9a1', '#0e8a68'],
    ink: '#0e8a68',
    wash: '#f0faf6',
    line: '#cfeee1',
  },
};

const APPROVE: [string, string] = ['#f47b4d', '#e2477a'];
const SHARE: [string, string] = ['#2fd17a', '#128c4a'];

/** "8 Oct" — short enough to sit inside a sentence. */
function shortDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/**
 * What the share button says, from how far the sharing has got.
 *
 * Nobody on the list → start the list. Some still waiting → the number left,
 * so "share" means something. Everyone has it → share again (a reminder).
 */
function shareLabel(guests: GuestProgress | null): {
  label: string;
  icon: string;
} {
  if (!guests) return { label: COPY.shareAll, icon: 'whatsapp' };
  if (guests.total === 0)
    return { label: COPY.nextAddGuests, icon: 'account-plus-outline' };
  const left = guests.total - guests.sent;
  if (left > 0) return { label: COPY.nextShareMore(left), icon: 'whatsapp' };
  return { label: COPY.nextShareAgain, icon: 'whatsapp' };
}

/**
 * The one card under the invitation: where it stands, and the single next
 * thing to do.
 *
 * Every state has at most one button. The other choice — asking for a change,
 * or approving anyway while a change is pending — is a quiet link, so the
 * customer never has to work out which of two big buttons is the right one.
 *
 *   review  → Approve & go live          · Ask for a change
 *   update  → Approve the update         · Ask for a change     (guests keep the approved one)
 *   asked   → (no button: it is the organizer's turn) · Approve this version anyway
 *   live    → Share with N more / Add guests / Share again · Ask for a change
 */
export function NextStep({
  stage,
  publishedAt,
  requests,
  guests,
  approving,
  error,
  requestSent,
  onApprove,
  onShare,
  onAsk,
}: {
  stage: InvitationStage;
  /** When the version guests see was approved. */
  publishedAt: string | null;
  requests: ChangeRequestDTO[];
  guests: GuestProgress | null;
  approving: boolean;
  error: string | null;
  requestSent: boolean;
  onApprove: () => void;
  onShare: () => void;
  onAsk: () => void;
}) {
  const look = LOOK[stage];
  const latest = requests.length > 0 ? requests[requests.length - 1] : null;
  const since = shortDate(publishedAt);

  const title = {
    review: COPY.nextReviewTitle,
    update: COPY.nextUpdateTitle,
    asked: COPY.nextAskedTitle,
    live: COPY.nextLiveTitle,
  }[stage];
  const note = {
    review: COPY.nextReviewNote,
    update: since ? COPY.nextUpdateNoteSince(since) : COPY.artworkUpdateNote,
    asked: COPY.nextAskedNote,
    live: COPY.nextLiveNote,
  }[stage];

  const share = shareLabel(guests);
  const showProgress = stage === 'live' && guests !== null && guests.total > 0;
  const sentPct =
    showProgress && guests ? Math.round((guests.sent / guests.total) * 100) : 0;

  return (
    <View
      style={[s.card, { borderColor: look.line }]}
      testID={`invitation-next-${stage}`}
    >
      <View style={[s.head, { backgroundColor: look.wash }]}>
        <View style={s.icon}>
          <GradientFill colors={look.colors} direction="diagonal" />
          <EventlyIcon name={look.icon} size={20} color={colors.onPrimary} />
        </View>
        <View style={s.headText}>
          <EventlyText
            variant="subtitle"
            style={[s.title, { color: look.ink }]}
          >
            {title}
          </EventlyText>
          <EventlyText variant="caption" style={s.note}>
            {note}
          </EventlyText>
        </View>
      </View>

      <View style={s.body}>
        {/* The organizer's turn: the customer's own words, so they know what was asked. */}
        {stage === 'asked' && latest ? (
          <View style={s.quote}>
            <EventlyText variant="caption" style={s.quoteLabel}>
              {requests.length > 1
                ? COPY.nextYouAskedMany(requests.length)
                : COPY.nextYouAsked}
            </EventlyText>
            <EventlyText variant="body" style={s.quoteText} numberOfLines={3}>
              {`“${latest.note}”`}
            </EventlyText>
          </View>
        ) : null}

        {/* Live: how far the sharing has got, in one line and one bar. */}
        {showProgress && guests ? (
          <View style={s.progress}>
            <View style={s.progressRow}>
              <EventlyText variant="caption" style={s.progressText}>
                {COPY.nextSentOf(guests.sent, guests.total)}
              </EventlyText>
              <EventlyText variant="caption" style={s.progressSub}>
                {COPY.nextOpened(guests.viewed)}
              </EventlyText>
            </View>
            <View style={s.track}>
              <View style={[s.fill, { width: `${Math.max(sentPct, 3)}%` }]} />
            </View>
          </View>
        ) : null}

        {stage === 'live' ? (
          <PressableScale
            style={s.primary}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel={share.label}
            testID="invitation-share"
          >
            <GradientFill colors={SHARE} direction="across" />
            <EventlyIcon name={share.icon} size={18} color={colors.onPrimary} />
            <EventlyText variant="subtitle" style={s.primaryText}>
              {share.label}
            </EventlyText>
          </PressableScale>
        ) : stage !== 'asked' ? (
          <PressableScale
            style={[s.primary, approving && s.primaryBusy]}
            onPress={onApprove}
            disabled={approving}
            accessibilityRole="button"
            accessibilityLabel={
              stage === 'update' ? COPY.artworkApproveUpdate : COPY.nextApprove
            }
            testID="invitation-approve"
          >
            <GradientFill colors={APPROVE} direction="across" />
            {approving ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <EventlyIcon name="check" size={18} color={colors.onPrimary} />
            )}
            <EventlyText variant="subtitle" style={s.primaryText}>
              {approving
                ? COPY.artworkApproving
                : stage === 'update'
                ? COPY.artworkApproveUpdate
                : COPY.nextApprove}
            </EventlyText>
          </PressableScale>
        ) : null}

        {/* The other choice, always quieter than the first. */}
        {stage === 'asked' ? (
          <PressableScale
            style={s.link}
            onPress={onApprove}
            disabled={approving}
            accessibilityRole="button"
            accessibilityLabel={COPY.nextApproveAnyway}
            testID="invitation-approve"
          >
            {approving ? (
              <ActivityIndicator size="small" color={look.ink} />
            ) : null}
            <EventlyText variant="caption" style={s.linkText}>
              {approving ? COPY.artworkApproving : COPY.nextApproveAnyway}
            </EventlyText>
          </PressableScale>
        ) : null}
        <PressableScale
          style={s.link}
          onPress={onAsk}
          accessibilityRole="button"
          accessibilityLabel={
            stage === 'asked' ? COPY.nextAskMore : COPY.artworkAsk
          }
          testID="invitation-ask"
        >
          <EventlyIcon name="message-text-outline" size={15} color="#5d5873" />
          <EventlyText variant="caption" style={s.linkText}>
            {stage === 'asked' ? COPY.nextAskMore : COPY.artworkAsk}
          </EventlyText>
        </PressableScale>

        {error ? (
          <EventlyText variant="caption" style={s.error}>
            {error}
          </EventlyText>
        ) : null}
        {requestSent ? (
          <EventlyText variant="caption" style={s.sent}>
            {COPY.requestSent}
          </EventlyText>
        ) : null}
      </View>
    </View>
  );
}

/**
 * What the day has made more important than the invitation — a stream on air,
 * or memories after the event. One strip at most, above the invitation, and a
 * tap takes the customer to that tab.
 */
export function MomentStrip({
  kind,
  onPress,
}: {
  kind: 'live' | 'memories';
  onPress: () => void;
}) {
  const live = kind === 'live';
  return (
    <PressableScale
      style={s.strip}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={live ? COPY.momentLive : COPY.momentMemories}
      testID={`invitation-moment-${kind}`}
    >
      <GradientFill
        colors={live ? ['#ff5f6d', '#e8433a'] : ['#a084ff', '#5a35e0']}
        direction="across"
      />
      {live ? (
        <View style={s.stripDot} />
      ) : (
        <EventlyIcon name="image-multiple-outline" size={16} color="#ffffff" />
      )}
      <EventlyText variant="caption" style={s.stripText} numberOfLines={1}>
        {live ? COPY.momentLive : COPY.momentMemories}
      </EventlyText>
      <EventlyIcon name="chevron-right" size={18} color="#ffffff" />
    </PressableScale>
  );
}
