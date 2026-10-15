import { View } from 'react-native';
import { EventlyIcon, AppText } from '../../../Components';
import {
  BLOCK_ICON,
  BLOCK_ICON_FALLBACK,
  BLOCK_RENDERER,
  COVER_BLOCK_KEY,
  INVITATION_COPY as COPY,
  INV_ACCENT,
  INV_GREEN,
  INV_NAVY,
  OWNER_BADGE,
} from '../constants';
import { bannerStyles, heroStyles, previewStyles } from '../styles';
import type { InvitationBlockDTO, InvitationDTO } from '../types';
import { CoverBlock } from './CoverBlock';

/**
 * Which renderer draws a block.
 *
 * The cover is a design and is drawn by the cover renderer; everything else is
 * a heading and some words. A block whose type this build has never seen falls
 * through to the generic renderer rather than vanishing, which is what makes
 * it safe for the server to add one.
 */
export function rendererFor(block: InvitationBlockDTO): 'cover' | 'generic' {
  /* A server that predates typed blocks sends no type at all; the cover's key
     has been stable since the invitation existed, so it still identifies it. */
  const type =
    block.type ?? (block.key === COVER_BLOCK_KEY ? 'cover' : 'generic');
  return BLOCK_RENDERER[type] ?? 'generic';
}

export function blockIcon(icon: string): string {
  return BLOCK_ICON[icon] ?? BLOCK_ICON_FALLBACK;
}

/**
 * "corporate" -> "Corporate".
 *
 * The occasion is stored as the key the rest of the platform uses; on an
 * invitation it is read by the family, so it is set as a word rather than as
 * a slug.
 */
export function titleize(value: string): string {
  const v = (value ?? '').trim();
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : '';
}

export function dateLabel(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * The hero, and the one sentence that matters most on this screen: whether
 * anything is live yet. Nothing reaches a guest until the customer approves,
 * so the status says which side of that line they are on.
 */
export function InvitationHero({
  invitation,
  organizerName,
}: {
  invitation: InvitationDTO;
  organizerName: string;
}) {
  const approved = invitation.status === 'approved';

  return (
    <View style={heroStyles.card}>
      <AppText variant="label" style={heroStyles.eyebrow} numberOfLines={1}>
        {COPY.eyebrow(organizerName)}
      </AppText>
      <AppText variant="h2" style={heroStyles.heading}>
        {COPY.heading}
      </AppText>
      <AppText variant="caption" style={heroStyles.sub}>
        {COPY.sub}
      </AppText>

      <View style={heroStyles.statusRow}>
        <View
          style={[
            heroStyles.statusDot,
            { backgroundColor: approved ? INV_GREEN : INV_ACCENT },
          ]}
        />
        <AppText variant="label" style={heroStyles.statusText}>
          {approved ? COPY.approvedNote : COPY.awaitingNote}
        </AppText>
      </View>
    </View>
  );
}

/** What the two section badges mean — otherwise they are just coloured words. */
export function OwnerBanner() {
  return (
    <View style={bannerStyles.wrap}>
      <EventlyIcon name="creation" size={18} color={INV_ACCENT} />
      <View style={bannerStyles.text}>
        <AppText variant="bodyLarge" style={bannerStyles.title}>
          {COPY.bannerTitle}
        </AppText>
        <AppText variant="body" style={bannerStyles.body}>
          {COPY.bannerBody}
        </AppText>
      </View>
    </View>
  );
}

interface GuestPreviewProps {
  invitation: InvitationDTO;
  /** One section only — what the eye on that row opens. */
  blockKey?: string | undefined;
}

/**
 * What a guest opening the link would see, in a phone frame.
 *
 * Hidden sections are left out — this is a preview of the published thing, not
 * of the editor — and the count of what is hidden is stated underneath, so the
 * customer can tell an intentionally short invitation from a broken one.
 *
 * Given a `blockKey` it shows that one section under the invitation's own
 * header, which is the context a guest reads it in. A hidden section has no
 * guest appearance at all, and the preview says exactly that rather than
 * rendering something no guest will ever see.
 */
export function GuestPreview({ invitation, blockKey }: GuestPreviewProps) {
  const { blocks, subEvents } = invitation;
  const one = blockKey ? blocks.find(b => b.key === blockKey) : undefined;
  const visible = one
    ? one.hidden
      ? []
      : [one]
    : blocks.filter(b => !b.hidden);
  const hiddenCount = one ? 0 : blocks.length - visible.length;
  const showSchedule = !blockKey && subEvents.length > 0;

  /* The cover is drawn as the cover, not as another heading-and-words row. */
  const rest = visible.filter(b => rendererFor(b) !== 'cover');

  return (
    <View style={previewStyles.wrap}>
      <View style={previewStyles.phone}>
        {/* A phone's own furniture, so the frame reads as a device rather
            than as another card on the screen. */}
        <View style={previewStyles.notch} />
        {/* The cover, by the renderer that draws it everywhere else — so the
            preview cannot drift from what the link actually opens. */}
        <CoverBlock invitation={invitation} mode="guest" />

        {rest.map(block => (
          <View key={block.key} style={previewStyles.block}>
            <View style={previewStyles.blockHead}>
              <EventlyIcon
                name={blockIcon(block.icon)}
                size={16}
                color={INV_ACCENT}
              />
              <AppText variant="caption" style={previewStyles.blockTitle}>
                {block.heading || block.title}
              </AppText>
            </View>
            {block.body ? (
              <AppText variant="caption" style={previewStyles.blockBody}>
                {block.body}
              </AppText>
            ) : null}
          </View>
        ))}

        {showSchedule ? (
          <>
            <AppText variant="caption" style={previewStyles.scheduleTitle}>
              Schedule
            </AppText>
            {subEvents.map(event => (
              <View key={event.id} style={previewStyles.subEvent}>
                <View
                  style={[
                    previewStyles.subEventBar,
                    event.colour ? { backgroundColor: event.colour } : null,
                  ]}
                />
                <View>
                  <AppText variant="caption" style={previewStyles.subEventName}>
                    {event.name}
                  </AppText>
                  <AppText variant="caption" style={previewStyles.subEventMeta}>
                    {[
                      dateLabel(event.eventDate),
                      event.eventTime,
                      event.venueName,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </AppText>
                </View>
              </View>
            ))}
          </>
        ) : null}

        {/* Nothing to render: the section exists, but not for guests. */}
        {one?.hidden ? (
          <AppText variant="caption" style={previewStyles.hiddenNote}>
            {COPY.previewHiddenSection}
          </AppText>
        ) : one && !one.body ? (
          <AppText variant="caption" style={previewStyles.hiddenNote}>
            {COPY.previewEmptySection}
          </AppText>
        ) : null}

        <View style={previewStyles.homeBar} />
      </View>

      {hiddenCount > 0 ? (
        <AppText variant="caption" style={previewStyles.hiddenNote}>
          {COPY.previewHiddenNote(hiddenCount)}
        </AppText>
      ) : null}
    </View>
  );
}

export function ownerStyleFor(block: InvitationBlockDTO) {
  return block.owner === 'customer'
    ? OWNER_BADGE.customer
    : OWNER_BADGE.organizer;
}

export { INV_NAVY };
