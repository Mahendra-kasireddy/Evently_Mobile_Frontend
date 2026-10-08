import { TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { CornerBloom, EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  IDEA_TYPE_META,
  WORKSPACE_ACCENT,
  WORKSPACE_COPY,
  WORKSPACE_GREEN,
  relativeTime,
} from '../constants';
import { ideasCardStyles as c } from '../styles';
import type { IdeaCounts, IdeaDTO } from '../types';


interface IdeasSummaryProps {
  counts: IdeaCounts | null;
  organizerName: string | null;
  /** The organizer's newest post, or null if they have not written one. */
  latest: IdeaDTO | null;
  onPress: () => void;
}

/**
 * The ideas & planning board, on the card that opens it.
 *
 * No heading over it: the tab it sits under is already called Ideas &
 * planning, and a card captioned with the name of the tab above it is the
 * same words twice.
 *
 * The line under the title is the board's real state — how many ideas the
 * customer has shared, how many the organizer has turned into a plan, and how
 * many are waiting on the customer's sign-off. Before anything has been
 * shared it says what the board is for instead of reporting three zeros.
 */
export function IdeasSummary({ counts, organizerName, latest, onPress }: IdeasSummaryProps) {
  const organizer = organizerName ?? 'your organizer';
  const shared = counts?.shared ?? 0;
  const started = shared > 0;

  const body = started
    ? `${shared} ${shared === 1 ? 'idea' : 'ideas'} shared · ${counts?.planned ?? 0} planned · ${
        counts?.awaitingApproval ?? 0
      } awaiting your approval`
    : WORKSPACE_COPY.ideasBlurb;

  const meta = latest ? IDEA_TYPE_META[latest.type] : null;

  /*
   * The button sits beside the words when there is nothing else on the card,
   * and under them when the organizer's post is there — three columns and a
   * post would leave the blurb a thumb wide.
   */
  const explore = (
    <TouchableOpacity
      style={[c.cta, !latest && c.ctaInline]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${started ? 'Open' : 'Start'} the ideas and planning board`}
    >
      <EventlyText variant="subtitle" style={c.ctaText}>
        {started ? WORKSPACE_COPY.ideasOpen : WORKSPACE_COPY.ideasStart}
      </EventlyText>
      <EventlyIcon name="chevron-right" size={16} color={colors.onPrimary} />
    </TouchableOpacity>
  );

  return (
    <View style={c.card}>
      {/* The card's own light, warming from the left to the accent's tint at
          the right, where the blossom sits. */}
      <View style={c.wash} pointerEvents="none">
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="wsIdeas" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0" stopColor="#fffaf7" />
              <Stop offset="1" stopColor="#fdece3" />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill="url(#wsIdeas)" />
        </Svg>
      </View>
      <View style={c.bloom} pointerEvents="none">
        <CornerBloom size={120} petal={WORKSPACE_ACCENT} stem={WORKSPACE_GREEN} />
      </View>

      <View style={c.row}>
        <View style={c.badge}>
          <EventlyIcon name="lightbulb-on-outline" size={24} color={WORKSPACE_ACCENT} />
        </View>
        <View style={c.text}>
          <EventlyText variant="h2" style={c.title}>
            {WORKSPACE_COPY.ideas}
          </EventlyText>
          <EventlyText variant="caption" style={c.body}>
            {body}
          </EventlyText>
        </View>
        {latest ? null : explore}
      </View>

      {/*
        The organizer's newest post, read here rather than a screen away.

        Only theirs: the customer does not need their own idea handed back to
        them on the card they would use to write the next one. The line under
        it is what the board says has happened to it — approved, waiting, or
        simply who it came from — rather than a guess dressed as a status.
      */}
      {latest && meta ? (
        <View style={c.latest}>
          <View style={c.latestHead}>
            <View style={[c.typeChip, { backgroundColor: meta.bg }]}>
              <EventlyIcon name={meta.icon} size={12} color={meta.color} />
              <EventlyText variant="caption" style={[c.typeChipText, { color: meta.color }]}>
                {meta.label}
              </EventlyText>
            </View>
            <EventlyText variant="caption" style={c.latestWhen}>
              {relativeTime(latest.createdAt)}
            </EventlyText>
          </View>

          <EventlyText variant="body" style={c.latestText} numberOfLines={3}>
            {latest.text}
          </EventlyText>

          <View style={c.latestFoot}>
            <EventlyIcon
              name={latest.approval === 'approved' ? 'check-circle' : 'clock-outline'}
              size={13}
              color={latest.approval === 'approved' ? WORKSPACE_GREEN : colors.textMuted}
            />
            <EventlyText
              variant="caption"
              style={[
                c.latestFootText,
                latest.approval === 'approved' && c.latestFootDone,
              ]}
              numberOfLines={1}
            >
              {latest.approval === 'none'
                ? `From ${latest.authorName || organizer}`
                : latest.approvalLabel}
            </EventlyText>
          </View>
        </View>
      ) : null}

      {latest ? explore : null}
    </View>
  );
}
