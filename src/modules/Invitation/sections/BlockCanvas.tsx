import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { INVITATION_COPY as COPY, INV_ACCENT, INV_NAVY } from '../constants';
import { canvasStyles as s } from '../styles';
import { dateLabel, titleize } from './InvitationParts';
import type { InvitationBlockDTO, InvitationDTO } from '../types';

/** The monogram on the header card, from whoever the invitation is for. */
function monogramOf(name: string): string {
  const first = (name ?? '').trim().charAt(0);
  return first ? first.toUpperCase() : '·';
}

interface HeaderCardProps {
  invitation: InvitationDTO;
  /** Opens the header block's editor. Absent when the organizer owns it. */
  onEdit: (() => void) | undefined;
}

/**
 * The invitation's own header, as a guest will read it.
 *
 * This is the thing being approved, so the screen shows it rather than
 * describing it: the hosts' names, the eyebrow above them, and the one line
 * of when and where. Everything on it is the invitation's stored details —
 * nothing is composed here.
 */
export function InvitationHeaderCard({ invitation, onEdit }: HeaderCardProps) {
  const { details } = invitation;
  const hosts = [details.hostOne, details.hostTwo]
    .filter(Boolean)
    .join(` ${details.joiner || '&'} `)
    .trim();
  /*
   * The hosts, or the occasion — never the booking's own title.
   *
   * That title is composed for a list ("Corporate · 2026-09-29"), and an
   * invitation headed with an ISO date reads as a database row. Until the
   * customer writes their names in, the occasion alone is the honest
   * placeholder, and the Edit button below says what to do about it.
   */
  const title =
    hosts || titleize(invitation.occasion) || COPY.headerUnnamed;
  const when = [
    dateLabel(details.eventDate) || dateLabel(invitation.eventDate),
    details.eventTime,
  ]
    .filter(Boolean)
    .join(' · ');
  /*
   * One venue, not the same one twice.
   *
   * Organizers routinely paste the full address into both the name and the
   * address field, and joining them printed the street twice in a row. The
   * longer of the two contains the other when that happens, so it is the one
   * worth showing.
   */
  /* Read defensively: an older invitation record carries only the fields it
     was written with, and a missing venue is blank rather than a crash. */
  const name = (details.venueName ?? '').trim();
  const address = (details.venueAddress ?? '').trim();
  const flat = (v: string) => v.toLowerCase().replace(/[\s,.]/g, '');
  const venue =
    name && address && (flat(address).includes(flat(name)) || flat(name).includes(flat(address)))
      ? [name, address].sort((a, b) => b.length - a.length)[0]
      : [name, address].filter(Boolean).join(', ');
  const line = [when, venue].filter(Boolean).join(' · ');

  return (
    <View style={s.header}>
      <View style={s.monogram}>
        <EventlyText variant="h2" style={s.monogramText}>
          {monogramOf(title)}
        </EventlyText>
      </View>

      {details.eyebrow ? (
        <EventlyText variant="caption" style={s.headerEyebrow} numberOfLines={2}>
          {details.eyebrow.toUpperCase()}
        </EventlyText>
      ) : null}

      <EventlyText variant="h1" style={s.headerTitle} numberOfLines={3}>
        {title}
      </EventlyText>

      {/* The mark the reference puts between the name and the details — a
          divider that is one dot wide. */}
      <View style={s.diamond} />

      {line ? (
        <EventlyText variant="body" style={s.headerLine}>
          {line}
        </EventlyText>
      ) : null}

      {onEdit ? (
        <TouchableOpacity
          style={s.headerEdit}
          activeOpacity={0.85}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={COPY.editHeader}
          testID="edit-invitation-header"
        >
          <EventlyIcon name="pencil-outline" size={14} color="#ffffff" />
          <EventlyText variant="caption" style={s.headerEditText}>
            {COPY.editHeader}
          </EventlyText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

interface BlockCanvasProps {
  block: InvitationBlockDTO;
  /** True where the customer owns it — theirs to edit rather than to ask about. */
  onEdit: () => void;
}

/**
 * One section, on the page rather than in a row.
 *
 * The list of section cards this replaced described the invitation — a title,
 * a badge and two buttons per section — without ever showing it. The
 * invitation is a document, so it is laid out as one: its own words, with the
 * one control that acts on them sitting quietly above.
 */
export function BlockCanvas({ block, onEdit }: BlockCanvasProps) {
  const body = block.body.trim();
  const isCustomers = block.owner === 'customer';

  return (
    <View style={s.block}>
      <TouchableOpacity
        style={s.edit}
        activeOpacity={0.85}
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel={`${isCustomers ? COPY.edit : COPY.requestChanges} — ${
          block.title
        }`}
        testID={`edit-block-${block.key}`}
      >
        <EventlyIcon
          name={isCustomers ? 'pencil-outline' : 'message-question-outline'}
          size={13}
          color={INV_ACCENT}
        />
        <EventlyText variant="caption" style={s.editText}>
          {isCustomers ? COPY.edit : COPY.ask}
        </EventlyText>
      </TouchableOpacity>

      <EventlyText variant="caption" style={s.eyebrow} numberOfLines={2}>
        {(block.heading || block.title).toUpperCase()}
      </EventlyText>

      {/*
        An empty section is addressed to whoever can fill it.

        It used to tell the customer their organizer had not written it —
        on sections the customer owns, which is their own to write and the
        Edit button beside it proves it.
      */}
      <EventlyText variant="body" style={[s.body, !body && s.bodyEmpty]}>
        {body || (isCustomers ? COPY.blockEmptyYours : COPY.blockEmpty)}
      </EventlyText>

      <View style={s.rule}>
        <View style={s.ruleLine} />
        <View style={s.ruleDot} />
        <View style={s.ruleLine} />
      </View>
    </View>
  );
}

/** The one thing a hidden section needs to say. */
export function HiddenNote({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={s.hiddenNote}>
      <EventlyIcon name="eye-off-outline" size={14} color={INV_NAVY} />
      <EventlyText variant="caption" style={s.hiddenNoteText}>
        {COPY.hiddenCount(count)}
      </EventlyText>
    </View>
  );
}

export default BlockCanvas;
