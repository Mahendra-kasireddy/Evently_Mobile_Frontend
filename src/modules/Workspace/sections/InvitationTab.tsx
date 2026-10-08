import { Image, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  Confetti,
  EventlyIcon,
  EventlyText,
  GradientFill,
  GradientText,
  PressableScale,
} from '../../../Components';
import { absoluteFileUrl } from '../../../services/urls';
import {
  INVITE_TAB_COPY as C,
  OCCASION_THEME,
  STAT_RING,
  WORKSPACE_ACTION_GRADIENT,
} from '../constants';
import { inviteUi as s } from '../premium.styles';
import type { GuestSummary, InvitationDTO, WorkspaceViewModel } from '../types';

interface InvitationTabProps {
  workspace: WorkspaceViewModel;
  /** null while the organizer is still preparing it. */
  invitation: InvitationDTO | null;
  guests: GuestSummary | null;
  onOpenInvitation: () => void;
  onOpenGuests: () => void;
}

/** "Aarav & Diya" from the invitation's own hosts, or the event's name. */
function hostsLine(invitation: InvitationDTO, fallback: string): string {
  const d = invitation.details;
  const one = (d.hostOne ?? '').trim();
  const two = (d.hostTwo ?? '').trim();
  if (one && two) return `${one} ${(d.joiner ?? '').trim() || '&'} ${two}`;
  return one || two || fallback;
}

/** "Sat, 6 Nov 2026" from an ISO date or a date-only string. */
function prettyDate(value: string | null | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

/** The invitation, drawn small: what a guest will open, at a glance. */
function Poster({
  workspace,
  invitation,
}: {
  workspace: WorkspaceViewModel;
  invitation: InvitationDTO | null;
}) {
  const theme = OCCASION_THEME[workspace.art] ?? OCCASION_THEME.wedding;
  const media = invitation?.details.heroMediaType === 'image' ? invitation.details.heroMediaUrl : '';
  const isVideo = invitation?.details.heroMediaType === 'video' && !!invitation.details.heroMediaUrl;
  const date = invitation ? prettyDate(invitation.details.eventDate) : workspace.dateLabel;
  const time = invitation?.details.eventTime ?? '';
  const venue = invitation?.details.venueName || workspace.venue;

  return (
    <View style={s.poster}>
      {media ? (
        <Image source={{ uri: absoluteFileUrl(media) }} style={s.posterImage} resizeMode="cover" />
      ) : (
        <View style={s.posterFill}>
          <Svg width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="invPoster" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#fff7f1" />
                <Stop offset="1" stopColor="#f3ecff" />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width="100%" height="100%" fill="url(#invPoster)" />
          </Svg>
        </View>
      )}
      {media ? <View style={s.posterShade} /> : null}
      <View style={s.posterBorder} pointerEvents="none" />
      {!media ? (
        <View style={s.posterConfetti} pointerEvents="none">
          <Confetti />
        </View>
      ) : null}

      <View style={s.posterBody}>
        <EventlyText style={[s.posterEyebrow, media ? s.onPhoto : null]}>
          {(invitation?.details.eyebrow || C.eyebrow).toUpperCase()}
        </EventlyText>
        {media ? (
          <Text style={[s.posterHosts, s.onPhoto]} numberOfLines={2}>
            {invitation ? hostsLine(invitation, workspace.title) : workspace.title}
          </Text>
        ) : (
          <GradientText
            colors={[theme.via, theme.to]}
            style={s.posterHosts}
            numberOfLines={2}
          >
            {invitation ? hostsLine(invitation, workspace.title) : workspace.title}
          </GradientText>
        )}
        <View style={[s.posterRule, media ? s.posterRuleOnPhoto : { backgroundColor: theme.to }]} />
        {date ? (
          <EventlyText style={[s.posterMeta, media ? s.onPhoto : null]}>
            {[date, time].filter(Boolean).join(' · ')}
          </EventlyText>
        ) : null}
        {venue ? (
          <EventlyText style={[s.posterVenue, media ? s.onPhotoMuted : null]} numberOfLines={2}>
            {venue}
          </EventlyText>
        ) : null}
      </View>

      {isVideo ? (
        <View style={s.videoBadge}>
          <EventlyIcon name="play" size={12} color="#ffffff" />
          <EventlyText variant="caption" style={s.videoBadgeText}>
            {C.video}
          </EventlyText>
        </View>
      ) : null}
    </View>
  );
}

/**
 * The invitation in the workspace: the card, one line saying where it stands,
 * and one button for the next step — nothing else.
 *
 * It used to carry the guest rings, two action tiles and the programme as
 * well, which made a glance at "where is my invitation?" a page to read. The
 * detail is a tap away, in the invitation itself and the guest list.
 */
export function InvitationTab({
  workspace,
  invitation,
  guests,
  onOpenInvitation,
  onOpenGuests,
}: InvitationTabProps) {
  const organizer = workspace.organizerName ?? C.yourOrganizer;
  const state = !invitation ? 'draft' : invitation.status === 'approved' ? 'live' : 'review';
  const look = {
    draft: {
      icon: 'palette-outline',
      colors: ['#9aa7c7', '#6b7a9e'] as [string, string],
      title: C.draftTitle,
      body: C.draftBody(organizer),
    },
    review: {
      icon: 'eye-check-outline',
      colors: ['#ffb547', '#f0791a'] as [string, string],
      title: C.reviewTitle,
      body: C.reviewBody(organizer),
    },
    live: {
      icon: 'check-decagram',
      colors: STAT_RING.ready,
      title: C.liveTitle,
      body:
        guests && guests.total > 0
          ? C.liveGuests(guests.sent, guests.total)
          : C.liveBody,
    },
  }[state];
  /* The one next step: review it, share it, or — before there is anything to
     review — start the guest list so it is ready. */
  const action =
    state === 'review'
      ? { icon: 'eye-check-outline', label: C.reviewAction, onPress: onOpenInvitation }
      : state === 'live'
        ? { icon: 'share-variant', label: C.viewTitle, onPress: onOpenInvitation }
        : {
            icon: 'account-multiple-plus-outline',
            label: guests && guests.total > 0 ? C.manageGuests : C.startGuests,
            onPress: onOpenGuests,
          };

  return (
    <View style={s.wrap}>
      <PressableScale
        onPress={invitation ? onOpenInvitation : undefined}
        disabled={!invitation}
        accessibilityRole="button"
        accessibilityLabel={invitation ? C.openPoster : C.draftTitle}
      >
        <Poster workspace={workspace} invitation={invitation} />
      </PressableScale>

      <View style={s.statusLine}>
        <View style={s.ribbonIcon}>
          <GradientFill colors={look.colors} direction="diagonal" />
          <EventlyIcon name={look.icon} size={18} color="#ffffff" />
        </View>
        <View style={s.ribbonText}>
          <EventlyText variant="subtitle" style={s.ribbonTitle}>
            {look.title}
          </EventlyText>
          <EventlyText variant="caption" style={s.ribbonBody}>
            {look.body}
          </EventlyText>
        </View>
      </View>

      <PressableScale
        style={s.mainButton}
        onPress={action.onPress}
        accessibilityRole="button"
        accessibilityLabel={action.label}
      >
        <GradientFill colors={WORKSPACE_ACTION_GRADIENT} direction="across" />
        <EventlyIcon name={action.icon} size={18} color="#ffffff" />
        <EventlyText variant="subtitle" style={s.mainButtonText}>
          {action.label}
        </EventlyText>
      </PressableScale>
    </View>
  );
}

export default InvitationTab;
