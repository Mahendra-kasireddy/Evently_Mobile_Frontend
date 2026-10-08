import { Modal, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyImage, EventlyText } from '../../../Components';
import { absoluteFileUrl } from '../../../services/urls';
import { colors } from '../../../theme';
import { INVITATION_COPY as COPY, INV_ACCENT } from '../constants';
import { artworkStyles as s } from '../styles';
import { canPlayVideo, HeroVideo, type VideoMode } from './HeroVideo';
import type { InvitationDTO } from '../types';

/** The uploaded invitation, or nothing at all. */
export interface Artwork {
  kind: 'image' | 'video';
  url: string;
  /** Videos only, in seconds, as the organizer's upload reported it. */
  seconds: number;
}

/**
 * The invitation the organizer uploaded, if they have uploaded one.
 *
 * The invitation is a design — made in whatever tool the organizer already
 * designs in — so the app stores the finished artwork rather than trying to
 * rebuild it out of form fields. Everything below reads this one function, so
 * "is there an invitation yet" is answered in one place.
 */
export function artworkOf(invitation: InvitationDTO): Artwork | null {
  const { details } = invitation;
  const url = (details.heroMediaUrl ?? '').trim();
  if (!url) return null;
  const type = details.heroMediaType ?? '';
  if (type !== 'image' && type !== 'video') return null;
  return { kind: type, url, seconds: details.heroMediaDurationSec ?? 0 };
}

/**
 * The artwork itself, whole.
 *
 * Fitted rather than cropped: an invitation is a composed page, and a cover
 * crop would cut the names off the top of somebody's wedding card. The ground
 * behind it is dark so a card with a white border still reads as a card.
 */
function Media({
  artwork,
  style,
  mode = 'ambient',
}: {
  artwork: Artwork;
  style: object;
  /** `ambient` in the card (a tap opens the viewer); `player` full screen. */
  mode?: VideoMode;
}) {
  if (artwork.kind === 'video') {
    /* A video this build cannot play is not a broken invitation — it is one
       the customer has to be told about rather than shown a black box. */
    if (!canPlayVideo) {
      return (
        <View style={[style, s.unplayable]}>
          <EventlyIcon name="play-circle-outline" size={34} color={colors.onPrimaryMuted} />
          <EventlyText variant="caption" style={s.unplayableText}>
            {COPY.artworkVideoNoPlayer}
          </EventlyText>
        </View>
      );
    }
    return <HeroVideo uri={absoluteFileUrl(artwork.url)} style={style} mode={mode} fit="contain" />;
  }
  return (
    <EventlyImage
      source={{ uri: absoluteFileUrl(artwork.url) }}
      style={style}
      resizeMode="contain"
    />
  );
}

/**
 * What the organizer sent, and the one way to look at it properly.
 *
 * The card is a preview at the size a screen allows; the invitation is meant
 * to be read full-bleed, which is how a guest will get it — so opening it is
 * the only control on this block.
 */
export function InvitationArtwork({
  artwork,
  onView,
}: {
  artwork: Artwork;
  onView: () => void;
}) {
  return (
    <View style={s.block}>
      <TouchableOpacity
        style={s.frame}
        activeOpacity={0.92}
        onPress={onView}
        accessibilityRole="button"
        accessibilityLabel={COPY.artworkView}
        testID="invitation-artwork"
      >
        <Media artwork={artwork} style={s.media} />
      </TouchableOpacity>

      {/* Said under the thumbnail rather than drawn as a full-width button:
          it opens a picture, it is not the decision this screen asks for. */}
      <TouchableOpacity
        style={s.view}
        activeOpacity={0.85}
        onPress={onView}
        accessibilityRole="button"
        accessibilityLabel={COPY.artworkView}
        testID="invitation-view"
      >
        <EventlyIcon name="arrow-expand" size={15} color={INV_ACCENT} />
        <EventlyText variant="subtitle" style={s.viewText}>
          {COPY.artworkView}
        </EventlyText>
      </TouchableOpacity>
    </View>
  );
}

/**
 * The invitation, full screen — what a guest gets.
 *
 * Nothing on it but a way out: this is a look at the finished thing, so an
 * approve button or an edit control here would be furniture over somebody's
 * invitation.
 */
export function ArtworkViewer({
  visible,
  artwork,
  onClose,
}: {
  visible: boolean;
  artwork: Artwork | null;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible && artwork !== null} animationType="fade" onRequestClose={onClose}>
      <View style={s.viewer}>
        {artwork ? <Media artwork={artwork} style={s.viewerMedia} mode="player" /> : null}
        <TouchableOpacity
          style={s.viewerClose}
          activeOpacity={0.8}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={COPY.previewClose}
          testID="invitation-viewer-close"
        >
          <EventlyIcon name="close" size={22} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

/** Nothing has been uploaded yet — a real state, not a failure. */
export function ArtworkPending() {
  return (
    <View style={s.pending}>
      <View style={s.pendingIcon}>
        <EventlyIcon name="email-fast-outline" size={26} color={INV_ACCENT} />
      </View>
      <EventlyText variant="h2" style={s.pendingTitle}>
        {COPY.artworkPendingTitle}
      </EventlyText>
      <EventlyText variant="body" style={s.pendingBody}>
        {COPY.artworkPendingBody}
      </EventlyText>
    </View>
  );
}
