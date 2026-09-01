import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { EventlyIcon, EventlyImage, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  BOARD_FILTERS,
  IDEAS_COPY,
  IDEA_APPROVAL_LABEL,
  IDEA_PLAN_STATUS_COLOR,
  IDEA_PLAN_STATUS_LABEL,
  IDEA_TYPE_META,
  VISION_SLOTS,
  WORKSPACE_ACCENT,
  initials,
  matchesBoardFilter,
} from '../constants';
import { boardStyles as s } from '../styles';
import { relativeTime } from '../constants';
import type { BoardFilter, BoardVision, IdeaCounts, IdeaDTO } from '../types';

/** The board's banner. Every figure is the server's own count. */
export function BoardHero({ counts, organizerName }: { counts: IdeaCounts; organizerName: string }) {
  const stats: Array<[number, string]> = [
    [counts.shared, counts.shared === 1 ? 'Idea shared' : 'Ideas shared'],
    [counts.planned, IDEAS_COPY.statPlanned],
    [counts.awaitingApproval, IDEAS_COPY.statAwaiting],
  ];

  return (
    <View style={s.hero}>
      <View style={s.heroPill}>
        <EventlyIcon name="creation" size={13} color={colors.onPrimary} />
        <EventlyText variant="caption" style={s.heroPillText}>
          {IDEAS_COPY.heroPill}
        </EventlyText>
      </View>
      <EventlyText variant="h1" style={s.heroTitle}>
        {IDEAS_COPY.heroTitle}
      </EventlyText>
      <EventlyText variant="body" style={s.heroSubtitle}>
        {IDEAS_COPY.heroSubtitle(organizerName)}
      </EventlyText>

      <View style={s.stats}>
        {stats.map(([value, label]) => (
          <View key={label} style={s.stat}>
            <EventlyText variant="h1" style={s.statValue}>
              {value}
            </EventlyText>
            <EventlyText variant="caption" style={s.statLabel}>
              {label}
            </EventlyText>
          </View>
        ))}
      </View>
    </View>
  );
}

interface BoardFiltersProps {
  value: BoardFilter;
  items: IdeaDTO[];
  onChange: (filter: BoardFilter) => void;
}

/**
 * A filter that would show nothing is not offered — the customer should not
 * have to tap through empty slices to discover which ones have anything in
 * them. "All" always stays.
 */
export function BoardFilters({ value, items, onChange }: BoardFiltersProps) {
  const available = BOARD_FILTERS.filter(
    (f) => f.value === 'all' || f.value === value || items.some((i) => matchesBoardFilter(i, f.value)),
  );

  if (available.length <= 1) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.filters}
      accessibilityRole="tablist"
    >
      {available.map((filter) => {
        const on = filter.value === value;
        const count = items.filter((i) => matchesBoardFilter(i, filter.value)).length;
        return (
          <TouchableOpacity
            key={filter.value}
            style={[s.filter, on && s.filterOn]}
            activeOpacity={0.8}
            onPress={() => onChange(filter.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${filter.label}, ${count}`}
          >
            <EventlyText variant="caption" style={[s.filterText, on && s.filterTextOn]}>
              {filter.label} · {count}
            </EventlyText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

interface IdeaCardProps {
  idea: IdeaDTO;
  isApproving: boolean;
  onApprove: () => void;
}

/**
 * One post, and whatever has happened to it since: the organizer's plan, its
 * status, and — where the organizer asked for one — the customer's sign-off.
 *
 * Only the customer's approval clears a pending post, which is what the
 * board's "awaiting you" count is derived from, so the action appears exactly
 * when the organizer has asked for it and nowhere else.
 */
export function IdeaCard({ idea, isApproving, onApprove }: IdeaCardProps) {
  const meta = IDEA_TYPE_META[idea.type] ?? IDEA_TYPE_META.idea;
  const fromOrganizer = idea.authorRole === 'organizer';
  const replyStatus = idea.reply?.status;
  const replyColor = replyStatus ? IDEA_PLAN_STATUS_COLOR[replyStatus] : colors.textMuted;

  return (
    <View style={s.card}>
      <View style={s.cardHead}>
        <View style={[s.avatar, fromOrganizer && s.avatarSquare]}>
          <EventlyText variant="caption" style={s.avatarText}>
            {initials(idea.authorName)}
          </EventlyText>
        </View>
        <View style={s.who}>
          <View style={s.whoRow}>
            <EventlyText variant="body" style={s.name} numberOfLines={1}>
              {idea.authorName || (fromOrganizer ? 'Your organizer' : 'You')}
            </EventlyText>
            {!fromOrganizer ? (
              <EventlyText variant="caption" style={s.youTag}>
                {IDEAS_COPY.you}
              </EventlyText>
            ) : null}
          </View>
          <EventlyText variant="caption" style={s.time}>
            {relativeTime(idea.createdAt)}
          </EventlyText>
        </View>
        <View style={[s.typeChip, { backgroundColor: meta.bg }]}>
          <EventlyIcon name={meta.icon} size={12} color={meta.color} />
          <EventlyText variant="caption" style={[s.typeChipText, { color: meta.color }]}>
            {meta.label}
          </EventlyText>
        </View>
      </View>

      <EventlyText variant="body" style={s.cardText}>
        {idea.text}
      </EventlyText>

      {idea.images?.length > 0 ? (
        <View style={s.images}>
          {idea.images.map((image) => (
            <EventlyImage
              key={image.url}
              source={{ uri: image.url }}
              style={s.image}
              accessibilityLabel={image.originalName || 'Reference photo'}
            />
          ))}
        </View>
      ) : null}

      {idea.confidential ? (
        <View style={s.secretChip}>
          <EventlyIcon name="lock-outline" size={12} color={colors.textMuted} />
          <EventlyText variant="caption" style={s.secretChipText}>
            {IDEAS_COPY.confidential}
          </EventlyText>
        </View>
      ) : null}

      {/* The organizer's answer: what they are doing about this. */}
      {idea.reply ? (
        <View style={s.reply}>
          <View style={s.replyHead}>
            <EventlyText variant="caption" style={s.replyTitle}>
              {IDEAS_COPY.plan}
            </EventlyText>
            <View style={[s.statusChip, { backgroundColor: `${replyColor}22` }]}>
              <View style={[s.statusDot, { backgroundColor: replyColor }]} />
              <EventlyText variant="caption" style={[s.statusText, { color: replyColor }]}>
                {replyStatus ? IDEA_PLAN_STATUS_LABEL[replyStatus] : ''}
              </EventlyText>
            </View>
          </View>
          {idea.reply.text ? (
            <EventlyText variant="caption" style={s.replyText}>
              {idea.reply.text}
            </EventlyText>
          ) : null}
        </View>
      ) : null}

      {idea.approval === 'pending' ? (
        <View style={s.approveRow}>
          <EventlyText variant="caption" style={s.approvalLabel} numberOfLines={2}>
            {idea.approvalLabel || IDEA_APPROVAL_LABEL.pending}
          </EventlyText>
          <TouchableOpacity
            style={s.approveButton}
            activeOpacity={0.85}
            disabled={isApproving}
            onPress={onApprove}
            accessibilityRole="button"
            accessibilityLabel={`${IDEAS_COPY.approve}: ${idea.text}`}
          >
            {isApproving ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <EventlyIcon name="check" size={14} color={colors.onPrimary} />
            )}
            <EventlyText variant="caption" style={s.approveText}>
              {IDEAS_COPY.approve}
            </EventlyText>
          </TouchableOpacity>
        </View>
      ) : idea.approval === 'approved' ? (
        <View style={s.approvedRow}>
          <EventlyIcon name="check-circle" size={16} color={colors.success} />
          <EventlyText variant="caption" style={s.approvedText}>
            {IDEAS_COPY.approved}
          </EventlyText>
        </View>
      ) : null}
    </View>
  );
}

/**
 * What the organizer understood the event to be — written by them, read back
 * by the customer, which is the point of it.
 *
 * A slot the organizer has not filled in says so rather than showing a
 * plausible guess, and before anything is captured the card explains that
 * instead of standing empty.
 */
export function VisionCard({ vision, organizerName }: { vision: BoardVision; organizerName: string }) {
  return (
    <View style={s.vision}>
      <EventlyText variant="h2" style={s.visionTitle}>
        {IDEAS_COPY.visionTitle}
      </EventlyText>
      <EventlyText variant="caption" style={s.visionSubtitle}>
        {IDEAS_COPY.visionSubtitle(organizerName)}
      </EventlyText>

      {!vision.captured ? (
        <EventlyText variant="body" style={s.visionEmpty}>
          {IDEAS_COPY.visionEmpty(organizerName)}
        </EventlyText>
      ) : (
        VISION_SLOTS.map((slot) => {
          const value = vision[slot.key];
          return (
            <View key={slot.key} style={s.visionRow}>
              <View style={s.visionChip}>
                <EventlyIcon name={slot.icon} size={16} color={WORKSPACE_ACCENT} />
              </View>
              <View style={s.visionText}>
                <EventlyText variant="caption" style={s.visionLabel}>
                  {slot.label}
                </EventlyText>
                <EventlyText variant="body" style={value ? s.visionValue : s.visionValueEmpty}>
                  {value || IDEAS_COPY.visionSlotEmpty}
                </EventlyText>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

/** Nothing at all, or nothing in this filter — two different situations. */
export function BoardEmpty({ hasAnyPosts, organizerName }: { hasAnyPosts: boolean; organizerName: string }) {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}>
        <EventlyIcon
          name={hasAnyPosts ? 'filter-variant' : 'creation'}
          size={24}
          color={WORKSPACE_ACCENT}
        />
      </View>
      <EventlyText variant="subtitle" style={s.emptyTitle}>
        {hasAnyPosts ? IDEAS_COPY.filterEmptyTitle : IDEAS_COPY.emptyTitle}
      </EventlyText>
      <EventlyText variant="body" style={s.emptyBody}>
        {hasAnyPosts ? IDEAS_COPY.filterEmptyBody : IDEAS_COPY.emptyBody(organizerName)}
      </EventlyText>
    </View>
  );
}
