import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { INVITATION_COPY as COPY, INV_GREEN, INV_NAVY } from '../constants';
import { approveStyles as s } from '../styles';
import type { InvitationBlockDTO } from '../types';
import { blockIcon } from './InvitationParts';

interface ApproveRowProps {
  block: InvitationBlockDTO;
  isApproving: boolean;
  /**
   * True once the whole invitation is approved.
   *
   * Sharing one section still needs a published invitation — the API refuses
   * to send anything off an unapproved one — so a section signed off while
   * others are still waiting says so and offers nothing to press.
   */
  canShare: boolean;
  onAccept: () => void;
  onRequestChange: () => void;
  onShare: () => void;
}

/**
 * One section, on the approval pass.
 *
 * It shows what a guest would read — the heading and the words themselves,
 * not a summary of them — because approving a section you have not read is
 * the one thing this screen must not make easy.
 *
 * A section already signed off keeps its place and says so rather than
 * disappearing: the invitation is a document, and a document that reorders
 * itself as you work down it loses the reader.
 */
export function ApproveRow({
  block,
  isApproving,
  canShare,
  onAccept,
  onRequestChange,
  onShare,
}: ApproveRowProps) {
  const body = block.body.trim();

  return (
    <View style={s.card}>
      <View style={s.head}>
        <EventlyIcon name={blockIcon(block.icon)} size={17} color={INV_NAVY} />
        <EventlyText variant="subtitle" style={s.cardTitle} numberOfLines={1}>
          {block.title}
        </EventlyText>

        {block.approved ? (
          <View style={s.approvedChip}>
            <EventlyIcon name="check-circle" size={14} color={INV_GREEN} />
            <EventlyText variant="caption" style={s.approvedText}>
              {COPY.accepted}
            </EventlyText>
          </View>
        ) : (
          <EventlyText variant="caption" style={s.waiting}>
            {COPY.waitingOnYou}
          </EventlyText>
        )}
      </View>

      {block.heading ? (
        <EventlyText variant="caption" style={s.eyebrow} numberOfLines={2}>
          {block.heading.toUpperCase()}
        </EventlyText>
      ) : null}

      {/* An empty section is a real state — the organizer has not written it
          yet — and saying so is better than an approve button over nothing. */}
      <EventlyText
        variant="body"
        style={[s.body, !body && s.bodyEmpty]}
        numberOfLines={6}
      >
        {body || COPY.blockEmpty}
      </EventlyText>

      {/* Approved and sendable: the moment somebody signs a section off is
          the moment they want to send it, and making them go back to the
          organizer tab to find the button loses that. */}
      {block.approved && canShare ? (
        <TouchableOpacity
          style={s.share}
          activeOpacity={0.9}
          onPress={onShare}
          accessibilityRole="button"
          accessibilityLabel={`${COPY.shareBlock} — ${block.title}`}
          testID={`share-block-${block.key}`}
        >
          <EventlyIcon name="arrow-right" size={15} color={colors.onPrimary} />
          <EventlyText variant="caption" style={s.shareText}>
            {COPY.shareBlock}
          </EventlyText>
        </TouchableOpacity>
      ) : null}

      {block.approved ? null : (
        <View style={s.actions}>
          <TouchableOpacity
            style={s.accept}
            activeOpacity={0.9}
            disabled={isApproving}
            onPress={onAccept}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.accept} — ${block.title}`}
            testID={`approve-block-${block.key}`}
          >
            {isApproving ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <EventlyIcon name="check" size={15} color={colors.onPrimary} />
            )}
            <EventlyText variant="caption" style={s.acceptText}>
              {COPY.accept}
            </EventlyText>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.ask}
            activeOpacity={0.85}
            onPress={onRequestChange}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.requestChanges} — ${block.title}`}
          >
            <EventlyIcon
              name="message-question-outline"
              size={15}
              color={INV_NAVY}
            />
            <EventlyText variant="caption" style={s.askText}>
              {COPY.requestChanges}
            </EventlyText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default ApproveRow;
