import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyIcon, EventlyImage, EventlyText, OccasionArt } from '../../../Components';
import type { OccasionArtKey } from '../../../Components/OccasionArt';
import { absoluteFileUrl } from '../../../services/urls';
import {
  COVER_FALLBACK_TEMPLATE,
  COVER_FONT_FALLBACK,
  COVER_FONT_STYLE,
  COVER_FONT_UPPERCASE,
  INVITATION_COPY as COPY,
} from '../constants';
import { coverStyles as s } from '../styles';
import { dateLabel, titleize } from './InvitationParts';
import { canPlayVideo, HeroVideo } from './HeroVideo';
import type { InvitationDTO, InvitationTemplateDTO } from '../types';

const ART_KEYS: OccasionArtKey[] = [
  'wedding',
  'birthday',
  'housewarming',
  'naming',
  'anniversary',
  'corporate',
];

function artFor(occasion: string): OccasionArtKey {
  const key = (occasion ?? '').trim().toLowerCase();
  return (ART_KEYS as string[]).includes(key) ? (key as OccasionArtKey) : 'wedding';
}

/**
 * A served template, made safe to paint with.
 *
 * A deployed server that predates `heroStops` sends a template carrying only
 * the CSS `hero` string, so the colours a native gradient needs are simply
 * absent. Every reader goes through here, so one missing field is a theme
 * drawn in the fallback's colours rather than a screen that fails to render.
 */
export function normalizeTemplate(
  template: InvitationTemplateDTO | undefined,
): InvitationTemplateDTO {
  if (!template) return COVER_FALLBACK_TEMPLATE;
  const stops = Array.isArray(template.heroStops) ? template.heroStops.filter(Boolean) : [];
  return {
    ...template,
    heroStops: stops.length >= 2 ? stops : COVER_FALLBACK_TEMPLATE.heroStops,
    accent: template.accent || COVER_FALLBACK_TEMPLATE.accent,
  };
}

/** The chosen theme, or the one this build falls back to. */
export function templateFor(invitation: InvitationDTO): InvitationTemplateDTO {
  const id = invitation.details.template;
  const found = invitation.templates?.find((t) => t.id === id);
  return normalizeTemplate(found ?? invitation.templates?.[0]);
}

/**
 * What the cover says, worked out once.
 *
 * Every value is the invitation's own stored detail; nothing here is composed
 * or invented. Exported because the editor previews exactly what the guest
 * gets, from the same reading of the same fields.
 */
export function coverContent(invitation: InvitationDTO) {
  const { details } = invitation;
  const hosts = [details.hostOne, details.hostTwo]
    .filter(Boolean)
    .join(` ${details.joiner || '&'} `)
    .trim();
  /* Never the booking list's own title — "Corporate · 2026-09-29" is composed
     for a list of bookings and reads as a database row on an invitation. */
  const names = hosts || titleize(invitation.occasion) || COPY.headerUnnamed;

  const when = [
    dateLabel(details.eventDate) || dateLabel(invitation.eventDate),
    details.eventTime,
  ]
    .filter(Boolean)
    .join(' · ');

  /* One venue: the name and the address are routinely the same paste. */
  const name = (details.venueName ?? '').trim();
  const address = (details.venueAddress ?? '').trim();
  const flat = (v: string) => v.toLowerCase().replace(/[\s,.]/g, '');
  const venue =
    name && address && (flat(address).includes(flat(name)) || flat(name).includes(flat(address)))
      ? [name, address].sort((a, b) => b.length - a.length)[0]
      : [name, address].filter(Boolean).join(', ');

  return {
    eyebrow: (details.eyebrow ?? '').trim(),
    names,
    when,
    venue,
    message: (details.message ?? '').trim(),
  };
}

interface CoverBlockProps {
  invitation: InvitationDTO;
  /**
   * `guest` is the finished cover, full bleed and with nothing to operate.
   * `editor` is the same cover plus the one note a customer may need about
   * media — shown inside the editor, never to a guest.
   */
  mode: 'guest' | 'editor';
}

/**
 * The invitation's cover, drawn the way a guest receives it.
 *
 * It is a stack: the theme's own gradient, then either the uploaded photo or
 * video or — when there is none — the occasion's artwork over that gradient,
 * then a scrim so the words hold on any photograph, then the words. There is
 * no stock photography in the empty state: a picture of somebody else's
 * wedding on your invitation is a lie, and a theme is not.
 *
 * Guests get no control of any kind here — no edit, no upload, no save. Those
 * live in the editor sheet, which is only ever opened from the customer's own
 * screen.
 */
export function CoverBlock({ invitation, mode }: CoverBlockProps) {
  const template = templateFor(invitation);
  const { details } = invitation;
  const { eyebrow, names, when, venue, message } = coverContent(invitation);

  const fontId = details.fontStyle ?? COVER_FONT_FALLBACK;
  const nameFont = COVER_FONT_STYLE[fontId] ?? COVER_FONT_STYLE[COVER_FONT_FALLBACK];
  const nameText = fontId === COVER_FONT_UPPERCASE ? names.toUpperCase() : names;

  const mediaType = details.heroMediaType ?? '';
  const mediaUrl = (details.heroMediaUrl ?? '').trim();
  const showImage = mediaType === 'image' && mediaUrl.length > 0;
  const showVideo = mediaType === 'video' && mediaUrl.length > 0 && canPlayVideo;
  /* A saved video this build cannot play is not a broken cover — it falls back
     to the theme, and only the editor is told why. */
  const videoUnplayable = mediaType === 'video' && mediaUrl.length > 0 && !canPlayVideo;
  const hasMedia = showImage || showVideo;

  const stops = template.heroStops;
  const gradientId = `cover-${template.id}`;

  const body = (
    <>
      <View style={s.layer}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={gradientId} x1="12%" y1="0%" x2="88%" y2="100%">
              {stops.map((colour, i) => (
                <Stop
                  key={`${colour}-${i}`}
                  offset={stops.length === 1 ? 0 : i / (stops.length - 1)}
                  stopColor={colour}
                />
              ))}
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={100} height={100} fill={`url(#${gradientId})`} />
        </Svg>
      </View>

      {/* No media: the theme's own pattern, twice, rather than a stock photo. */}
      {hasMedia ? null : (
        <>
          <View style={s.pattern} pointerEvents="none">
            <OccasionArt art={artFor(invitation.occasion)} />
          </View>
          <View style={s.patternEcho} pointerEvents="none">
            <OccasionArt art={artFor(invitation.occasion)} />
          </View>
        </>
      )}

      {showImage ? (
        <View style={s.layer} pointerEvents="none">
          <EventlyImage
            source={{ uri: absoluteFileUrl(mediaUrl) }}
            style={s.media}
            resizeMode="cover"
          />
        </View>
      ) : null}
      {showVideo ? (
        <View style={s.layer} pointerEvents="none">
          <HeroVideo uri={absoluteFileUrl(mediaUrl)} style={s.media} />
        </View>
      ) : null}

      {/* Photographs are unpredictable; the words on top are not optional. */}
      <View style={[s.layer, hasMedia ? s.scrimStrong : s.scrim]} pointerEvents="none" />

      <View style={s.body}>
        {eyebrow ? (
          <EventlyText
            variant="caption"
            style={[s.eyebrow, { color: template.accent }]}
            numberOfLines={2}
          >
            {eyebrow.toUpperCase()}
          </EventlyText>
        ) : null}

        <EventlyText variant="h1" style={[s.names, nameFont]} numberOfLines={3}>
          {nameText}
        </EventlyText>

        <View style={[s.diamond, { backgroundColor: template.accent }]} />

        {when ? (
          <EventlyText variant="body" style={s.when} numberOfLines={1}>
            {when}
          </EventlyText>
        ) : null}
        {venue ? (
          <EventlyText variant="caption" style={s.venue} numberOfLines={2}>
            {venue}
          </EventlyText>
        ) : null}
        {message ? (
          <EventlyText variant="caption" style={s.message} numberOfLines={4}>
            {message}
          </EventlyText>
        ) : null}

        <View style={s.scroll}>
          <EventlyText variant="caption" style={s.scrollText}>
            {COPY.coverScroll.toUpperCase()}
          </EventlyText>
          <EventlyIcon name="chevron-down" size={18} color="rgba(255,255,255,0.72)" />
        </View>

        {/* Only the customer is told this, and only when it is true. */}
        {mode === 'editor' && videoUnplayable ? (
          <EventlyText variant="caption" style={s.note}>
            {COPY.coverVideoNoPlayer}
          </EventlyText>
        ) : null}
      </View>
    </>
  );

  return (
    <View style={[s.card, mode === 'guest' && s.full]} testID="invitation-cover">
      {body}
    </View>
  );
}

export default CoverBlock;
