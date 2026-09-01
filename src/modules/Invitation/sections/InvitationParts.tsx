import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import {
  BLOCK_ICON,
  BLOCK_ICON_FALLBACK,
  INVITATION_COPY as COPY,
  INV_ACCENT,
  INV_GREEN,
  INV_NAVY,
  OWNER_BADGE,
} from '../constants';
import { bannerStyles, heroStyles, previewStyles } from '../styles';
import type { InvitationBlockDTO, InvitationDTO } from '../types';

export function blockIcon(icon: string): string {
  return BLOCK_ICON[icon] ?? BLOCK_ICON_FALLBACK;
}

export function dateLabel(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
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
      <EventlyText variant="caption" style={heroStyles.eyebrow} numberOfLines={1}>
        {COPY.eyebrow(organizerName)}
      </EventlyText>
      <EventlyText variant="h1" style={heroStyles.heading}>
        {COPY.heading}
      </EventlyText>
      <EventlyText variant="body" style={heroStyles.sub}>
        {COPY.sub}
      </EventlyText>

      <View style={heroStyles.statusRow}>
        <View style={[heroStyles.statusDot, { backgroundColor: approved ? INV_GREEN : INV_ACCENT }]} />
        <EventlyText variant="caption" style={heroStyles.statusText}>
          {approved ? COPY.approvedNote : COPY.awaitingNote}
        </EventlyText>
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
        <EventlyText variant="caption" style={bannerStyles.title}>
          {COPY.bannerTitle}
        </EventlyText>
        <EventlyText variant="caption" style={bannerStyles.body}>
          {COPY.bannerBody}
        </EventlyText>
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
  const { details, blocks, subEvents } = invitation;
  const one = blockKey ? blocks.find((b) => b.key === blockKey) : undefined;
  const visible = one ? (one.hidden ? [] : [one]) : blocks.filter((b) => !b.hidden);
  const hiddenCount = one ? 0 : blocks.length - visible.length;
  const showSchedule = !blockKey && subEvents.length > 0;

  const hosts = [details.hostOne, details.hostTwo].filter(Boolean).join(` ${details.joiner || '&'} `);
  const when = [dateLabel(details.eventDate) || dateLabel(invitation.eventDate), details.eventTime]
    .filter(Boolean)
    .join(' · ');
  const venue = [details.venueName, details.venueAddress].filter(Boolean).join(', ');

  return (
    <View style={previewStyles.wrap}>
      <View style={previewStyles.phone}>
        {/* A phone's own furniture, so the frame reads as a device rather
            than as another card on the screen. */}
        <View style={previewStyles.notch} />
        <View style={previewStyles.card}>
          {details.eyebrow ? (
            <EventlyText variant="caption" style={previewStyles.eyebrow}>
              {details.eyebrow}
            </EventlyText>
          ) : null}
          <EventlyText variant="h1" style={previewStyles.hosts}>
            {hosts || invitation.bookingTitle}
          </EventlyText>
          {when ? (
            <EventlyText variant="body" style={previewStyles.when}>
              {when}
            </EventlyText>
          ) : null}
          {venue || invitation.location ? (
            <EventlyText variant="caption" style={previewStyles.venue}>
              {venue || invitation.location}
            </EventlyText>
          ) : null}
        </View>

        {visible.map((block) => (
          <View key={block.key} style={previewStyles.block}>
            <View style={previewStyles.blockHead}>
              <EventlyIcon name={blockIcon(block.icon)} size={16} color={INV_ACCENT} />
              <EventlyText variant="caption" style={previewStyles.blockTitle}>
                {block.heading || block.title}
              </EventlyText>
            </View>
            {block.body ? (
              <EventlyText variant="caption" style={previewStyles.blockBody}>
                {block.body}
              </EventlyText>
            ) : null}
          </View>
        ))}

        {showSchedule ? (
          <>
            <EventlyText variant="caption" style={previewStyles.scheduleTitle}>
              Schedule
            </EventlyText>
            {subEvents.map((event) => (
              <View key={event.id} style={previewStyles.subEvent}>
                <View
                  style={[previewStyles.subEventBar, event.colour ? { backgroundColor: event.colour } : null]}
                />
                <View>
                  <EventlyText variant="caption" style={previewStyles.subEventName}>
                    {event.name}
                  </EventlyText>
                  <EventlyText variant="caption" style={previewStyles.subEventMeta}>
                    {[dateLabel(event.eventDate), event.eventTime, event.venueName]
                      .filter(Boolean)
                      .join(' · ')}
                  </EventlyText>
                </View>
              </View>
            ))}
          </>
        ) : null}

        {/* Nothing to render: the section exists, but not for guests. */}
        {one?.hidden ? (
          <EventlyText variant="caption" style={previewStyles.hiddenNote}>
            {COPY.previewHiddenSection}
          </EventlyText>
        ) : one && !one.body ? (
          <EventlyText variant="caption" style={previewStyles.hiddenNote}>
            {COPY.previewEmptySection}
          </EventlyText>
        ) : null}

        <View style={previewStyles.homeBar} />
      </View>

      {hiddenCount > 0 ? (
        <EventlyText variant="caption" style={previewStyles.hiddenNote}>
          {COPY.previewHiddenNote(hiddenCount)}
        </EventlyText>
      ) : null}
    </View>
  );
}

export function ownerStyleFor(block: InvitationBlockDTO) {
  return block.owner === 'customer' ? OWNER_BADGE.customer : OWNER_BADGE.organizer;
}

export { INV_NAVY };
