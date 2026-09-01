import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { INVITATION_COPY as COPY, INV_ACCENT, INV_GREEN, INV_NAVY, OWNER_BADGE } from '../constants';
import { sectionStyles as s } from '../styles';
import type { InvitationBlockDTO } from '../types';
import { blockIcon } from './InvitationParts';

interface SectionRowProps {
  block: InvitationBlockDTO;
  /** Open asks on this section, so the row can say the organizer already has one. */
  pendingRequests: number;
  /** Sharing needs a published invitation. */
  canShare: boolean;
  onPersonalize: () => void;
  onRequestChange: () => void;
  onShare: () => void;
  /** Shows this one section the way a guest will read it. */
  onPreview: () => void;
}

/**
 * One section of the invitation.
 *
 * Which action the row offers follows who owns it: a section the customer owns
 * is theirs to edit, and one the organizer built can only be asked about. That
 * is the same rule the API enforces — the personalize route rejects a block the
 * customer does not own — so the row never offers an edit that would 403.
 */
export function SectionRow({
  block,
  pendingRequests,
  canShare,
  onPersonalize,
  onRequestChange,
  onShare,
  onPreview,
}: SectionRowProps) {
  const isCustomers = block.owner === 'customer';

  return (
    <View style={[s.row, block.hidden && s.rowHidden]}>
      <View style={s.head}>
        <View style={[s.iconChip, isCustomers && s.iconChipCustomer]}>
          <EventlyIcon
            name={blockIcon(block.icon)}
            size={18}
            color={isCustomers ? INV_ACCENT : colors.textMuted}
          />
        </View>
        <View style={s.headText}>
          <EventlyText variant="body" style={s.rowTitle} numberOfLines={1}>
            {block.heading || block.title}
          </EventlyText>
          <EventlyText
            variant="caption"
            style={[s.ownerBadge, isCustomers ? s.ownerCustomer : s.ownerOrganizer]}
          >
            {OWNER_BADGE[block.owner] ?? OWNER_BADGE.organizer}
          </EventlyText>
        </View>
        <View style={[s.stateChip, block.hidden ? s.stateHidden : s.stateReady]}>
          <EventlyText
            variant="caption"
            style={[s.stateText, { color: block.hidden ? colors.textMuted : INV_GREEN }]}
          >
            {block.hidden ? COPY.hidden : COPY.ready}
          </EventlyText>
        </View>

        {/*
          One eye per section, rather than a single preview of the whole
          invitation at the foot of the screen: the question a customer has
          while reading a row is what *this* section looks like, and answering
          it where they asked saves them matching a long preview back to the
          row they were looking at.
        */}
        <TouchableOpacity
          style={s.eyeButton}
          activeOpacity={0.7}
          onPress={onPreview}
          accessibilityRole="button"
          accessibilityLabel={`${COPY.previewSection}: ${block.title}`}
        >
          <EventlyIcon name="eye-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {block.body ? (
        <EventlyText variant="caption" style={s.body} numberOfLines={3}>
          {block.body}
        </EventlyText>
      ) : null}

      {/* Says the ask is already with the organizer, so it is not sent twice. */}
      {pendingRequests > 0 ? (
        <View style={s.pending}>
          <EventlyIcon name="clock-outline" size={14} color={colors.accent} />
          <EventlyText variant="caption" style={s.pendingText}>
            {COPY.pendingRequests(pendingRequests)}
          </EventlyText>
        </View>
      ) : null}

      <View style={s.actions}>
        {isCustomers ? (
          <TouchableOpacity
            style={[s.action, s.actionPrimary]}
            activeOpacity={0.85}
            onPress={onPersonalize}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.personalize}: ${block.title}`}
          >
            <EventlyIcon name="pencil-outline" size={14} color={colors.onPrimary} />
            <EventlyText variant="caption" style={s.actionPrimaryText}>
              {COPY.personalize}
            </EventlyText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={s.action}
            activeOpacity={0.8}
            onPress={onRequestChange}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.requestChange}: ${block.title}`}
          >
            <EventlyIcon name="message-question-outline" size={14} color={INV_NAVY} />
            <EventlyText variant="caption" style={s.actionText}>
              {COPY.requestChange}
            </EventlyText>
          </TouchableOpacity>
        )}

        {/* A hidden section is not part of the published invitation, so there
            is nothing to send — the API rejects it too. */}
        {canShare && !block.hidden ? (
          <TouchableOpacity
            style={s.action}
            activeOpacity={0.8}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.share}: ${block.title}`}
          >
            <EventlyIcon name="share-variant-outline" size={14} color={INV_NAVY} />
            <EventlyText variant="caption" style={s.actionText}>
              {COPY.share}
            </EventlyText>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export default SectionRow;
