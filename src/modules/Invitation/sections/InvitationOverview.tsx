import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  INVITATION_COPY as COPY,
  INV_ACCENT,
  INV_GREEN,
  INV_NAVY,
  INV_NAVY_DEEP,
} from '../constants';
import { overviewStyles as s } from '../styles';
import { blockIsWritten } from '../utils';
import { blockIcon, rendererFor } from './InvitationParts';
import type {
  InvitationBlockDTO,
  InvitationDTO,
  InvitationStage,
} from '../types';

interface InsideListProps {
  /** The invitation the blocks belong to — the cover is judged by its own. */
  invitation: InvitationDTO;
  blocks: InvitationBlockDTO[];
  onPressBlock: (block: InvitationBlockDTO) => void;
}

/**
 * What is in the invitation, as a list of names rather than a stack of cards.
 *
 * The sections used to be the page — ten cards, each with its own buttons and
 * badges, so reading the invitation meant scrolling past its editor. They are
 * a contents page now: what is in it, whether each part is written, and a way
 * into any one of them.
 */
export function InsideList({
  invitation,
  blocks,
  onPressBlock,
}: InsideListProps) {
  const yoursToWrite = blocks.filter(
    b => b.owner === 'customer' && !blockIsWritten(invitation, b),
  ).length;

  return (
    <View style={s.inside}>
      {/* The heading answers "how much of this is there", so the list under it
          does not have to be counted row by row. */}
      <View style={s.insideHead}>
        <EventlyText variant="subtitle" style={s.insideTitle}>
          {COPY.insideTitle}
        </EventlyText>
        <EventlyText variant="caption" style={s.insideCount}>
          {COPY.insideCount(blocks.length, yoursToWrite)}
        </EventlyText>
      </View>

      <View style={s.insideCard}>
        {blocks.map((block, index) => {
          const written = blockIsWritten(invitation, block);
          const yours = block.owner === 'customer';
          const cover = rendererFor(block) === 'cover';
          const name = cover ? COPY.coverRow : block.title;
          /* One state per row, and only where it changes what the customer
             would do. Five rows all reading "Not written yet" is noise; a
             quiet icon says the same thing without being read. */
          const needsYou = yours && !written;
          const state = needsYou
            ? COPY.insideYours
            : block.approved
            ? COPY.insideApproved
            : written
            ? COPY.insideWritten
            : COPY.insideEmpty;

          return (
            <TouchableOpacity
              key={block.key}
              style={[s.insideRow, index > 0 && s.insideRowRuled]}
              activeOpacity={0.8}
              onPress={() => onPressBlock(block)}
              accessibilityRole="button"
              accessibilityLabel={`${name}. ${state}`}
              testID={`inside-${block.key}`}
            >
              <View
                style={[
                  s.insideIcon,
                  written && s.insideIconWritten,
                  block.approved && s.insideIconApproved,
                  needsYou && s.insideIconYours,
                ]}
              >
                <EventlyIcon
                  name={cover ? 'image-outline' : blockIcon(block.icon)}
                  size={16}
                  color={
                    needsYou
                      ? INV_ACCENT
                      : block.approved
                      ? INV_GREEN
                      : written
                      ? INV_NAVY_DEEP
                      : colors.textMuted
                  }
                />
              </View>

              <EventlyText
                variant="body"
                style={s.insideName}
                numberOfLines={1}
              >
                {name}
              </EventlyText>

              <EventlyText
                variant="caption"
                style={[
                  s.insideState,
                  needsYou && s.insideStateYours,
                  block.approved && s.insideStateApproved,
                ]}
                numberOfLines={1}
              >
                {state}
              </EventlyText>
              <EventlyIcon
                name="chevron-right"
                size={16}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/** The one thing to do next, said as the thing itself. */
export function PrimaryAction({
  stage,
  disabled,
  onPress,
}: {
  stage: InvitationStage;
  disabled?: boolean;
  onPress: () => void;
}) {
  const icon =
    stage === 'write'
      ? 'pencil-outline'
      : stage === 'approve'
      ? 'check'
      : 'whatsapp';

  return (
    <View>
      <TouchableOpacity
        style={[
          s.cta,
          stage === 'approve' && s.ctaApprove,
          disabled && s.ctaDisabled,
        ]}
        activeOpacity={0.9}
        disabled={disabled}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={COPY.stageCta[stage]}
        testID="invitation-primary"
      >
        <EventlyIcon name={icon} size={17} color={colors.onPrimary} />
        <EventlyText variant="subtitle" style={s.ctaText}>
          {COPY.stageCta[stage]}
        </EventlyText>
      </TouchableOpacity>
      <EventlyText variant="caption" style={s.ctaNote}>
        {COPY.stageCtaNote[stage]}
      </EventlyText>
    </View>
  );
}

export const invitationAccents = { INV_ACCENT, INV_GREEN, INV_NAVY };
