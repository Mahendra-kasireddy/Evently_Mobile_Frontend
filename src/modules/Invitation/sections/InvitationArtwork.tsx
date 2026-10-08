import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
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
  onAspect,
}: {
  artwork: Artwork;
  style: object;
  /** `ambient` in the card (a tap opens the viewer); `player` full screen. */
  mode?: VideoMode;
  /** Reports a video's own shape once it has loaded. */
  onAspect?: (aspect: number) => void;
}) {
  if (artwork.kind === 'video') {
    /* A video this build cannot play is not a broken invitation — it is one
       the customer has to be told about rather than shown a black box. */
    if (!canPlayVideo) {
      return (
        <View style={[style, s.unplayable]}>
          <EventlyIcon
            name="play-circle-outline"
            size={34}
            color={colors.onPrimaryMuted}
          />
          <EventlyText variant="caption" style={s.unplayableText}>
            {COPY.artworkVideoNoPlayer}
          </EventlyText>
        </View>
      );
    }
    return (
      <HeroVideo
        uri={absoluteFileUrl(artwork.url)}
        style={style}
        mode={mode}
        /* The card's frame takes the video's shape once it reports it, so
           cover crops nothing then — and until it does, cover fills the
           frame instead of showing bands that look like a broken player.
           Full screen keeps the whole frame. */
        fit={mode === 'player' ? 'contain' : 'cover'}
        onAspect={onAspect}
      />
    );
  }
  return (
    <EventlyImage
      source={{ uri: absoluteFileUrl(artwork.url) }}
      style={style}
      resizeMode="contain"
    />
  );
}

/** Width ÷ height the frame starts at, before the media's own shape is known. */
const DEFAULT_ASPECT = 4 / 5;
/** The tallest the preview may be, so the decision below stays on screen. */
const MAX_HEIGHT = 420;

/** "2:15" for a video's length, or '' when it is not known. */
function lengthLabel(seconds: number): string {
  if (!seconds || seconds <= 0) return '';
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/**
 * What the organizer sent, at its own shape.
 *
 * The frame takes the artwork's proportions — measured from the image, or
 * reported by the video once it loads — so a landscape reel is a landscape
 * card and a portrait card is a portrait one, edge to edge. A fixed portrait
 * frame put a widescreen video between two black bands that read as a broken
 * player. Capped in height so the decision under it stays in view; opening it
 * full screen is the chip on its corner.
 */
export function InvitationArtwork({
  artwork,
  onView,
}: {
  artwork: Artwork;
  onView: () => void;
}) {
  const { width: screen } = useWindowDimensions();
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);
  const url = absoluteFileUrl(artwork.url);

  useEffect(() => {
    if (artwork.kind !== 'image' || !url) return;
    let alive = true;
    Image.getSize(
      url,
      (w, h) => {
        if (alive && w > 0 && h > 0) setAspect(w / h);
      },
      () => undefined,
    );
    return () => {
      alive = false;
    };
  }, [artwork.kind, url]);

  const maxWidth = screen - 32;
  let width = maxWidth;
  let height = width / aspect;
  if (height > MAX_HEIGHT) {
    height = MAX_HEIGHT;
    width = height * aspect;
  }
  const length = artwork.kind === 'video' ? lengthLabel(artwork.seconds) : '';

  return (
    <View style={s.block}>
      <TouchableOpacity
        style={[s.frame, { width, height }]}
        activeOpacity={0.92}
        onPress={onView}
        accessibilityRole="button"
        accessibilityLabel={COPY.artworkView}
        testID="invitation-artwork"
      >
        <Media artwork={artwork} style={s.media} onAspect={setAspect} />
        {artwork.kind === 'video' ? (
          <View style={s.kindChip} pointerEvents="none">
            <EventlyIcon name="play" size={12} color="#ffffff" />
            <EventlyText variant="caption" style={s.kindChipText}>
              {length
                ? `${COPY.artworkVideoChip} · ${length}`
                : COPY.artworkVideoChip}
            </EventlyText>
          </View>
        ) : null}
        <View
          style={s.expandChip}
          pointerEvents="none"
          testID="invitation-view"
        >
          <EventlyIcon name="arrow-expand" size={14} color="#ffffff" />
          <EventlyText variant="caption" style={s.expandChipText}>
            {COPY.artworkViewShort}
          </EventlyText>
        </View>
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
    <Modal
      visible={visible && artwork !== null}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.viewer}>
        {artwork ? (
          <Media artwork={artwork} style={s.viewerMedia} mode="player" />
        ) : null}
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
