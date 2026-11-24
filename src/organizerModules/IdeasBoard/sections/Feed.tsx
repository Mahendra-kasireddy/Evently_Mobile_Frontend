import { ScrollView, View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  EventlyImage,
  PressableScale,
} from '../../../Components';
import { boardStyles as b } from '../../../modules/Workspace/styles';
import { colors } from '../../../theme';
import { IDEAS_COPY } from '../constants';
import { BOARD_ACCENT, BOARD_GREEN, IDEA_TYPE_META } from '../design';
import { feedStyles as s, typeInk, typeTint } from '../styles';
import type {
  FilterChip,
  IdeaCardModel,
  IdeasFilter,
  PhotoModel,
  StatusChipModel,
  StatusChipTone,
} from '../types';

const COPY = IDEAS_COPY.feed;

/** Filter chips; only the ones with something in them (see filterChips). */
export function Filters({
  chips,
  value,
  onChange,
}: {
  chips: FilterChip[];
  value: IdeasFilter;
  onChange: (filter: IdeasFilter) => void;
}) {
  if (chips.length === 0) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={b.filters}
      accessibilityRole="tablist"
    >
      {chips.map(chip => {
        const on = chip.value === value;
        return (
          <PressableScale
            key={chip.value}
            style={[b.filter, on && b.filterOn]}
            onPress={() => onChange(chip.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${chip.label}, ${chip.count}`}
          >
            <AppText
              variant="label"
              style={[b.filterText, on && b.filterTextOn]}
            >
              {`${chip.label} · ${chip.count}`}
            </AppText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const CHIP_TONE: Record<
  StatusChipTone,
  { box: object; text: object; color: string; icon: string }
> = {
  waiting: {
    box: s.waiting,
    text: s.waitingText,
    color: BOARD_ACCENT,
    icon: 'clock-outline',
  },
  planned: {
    box: s.planned,
    text: s.plannedText,
    color: BOARD_ACCENT,
    icon: 'progress-clock',
  },
  approved: {
    box: s.approved,
    text: s.approvedText,
    color: BOARD_GREEN,
    icon: 'check-circle',
  },
  done: {
    box: s.done,
    text: s.doneText,
    color: BOARD_GREEN,
    icon: 'check-circle',
  },
};

function StatusChip({ chip }: { chip: StatusChipModel }) {
  const tone = CHIP_TONE[chip.tone];
  return (
    <View style={[s.chip, tone.box]}>
      <EventlyIcon name={tone.icon} size={13} color={tone.color} />
      <AppText
        variant="label"
        style={[s.chipText, tone.text]}
        numberOfLines={2}
      >
        {chip.label}
      </AppText>
    </View>
  );
}

interface IdeaCardProps {
  card: IdeaCardModel;
  onOpenPhoto: (photos: PhotoModel[], index: number) => void;
  onReply: () => void;
}

/**
 * One post: who, when, what, its photos, where it stands, and the
 * organizer's reply under it — with the reply box as the card's only action.
 */
export function IdeaCard({ card, onOpenPhoto, onReply }: IdeaCardProps) {
  const meta = IDEA_TYPE_META[card.type] ?? IDEA_TYPE_META.idea;
  const tint = typeTint[card.type] ?? typeTint.idea;
  const ink = typeInk[card.type] ?? typeInk.idea;
  return (
    <View style={b.card}>
      <View style={b.cardHead}>
        <View style={[b.avatar, card.fromOrganizer && b.avatarSquare]}>
          <AppText variant="bodySmall" style={b.avatarText}>
            {card.initials}
          </AppText>
        </View>
        <View style={b.who}>
          <View style={b.whoRow}>
            <AppText variant="body" style={b.name} numberOfLines={1}>
              {card.authorName}
            </AppText>
            <AppText
              variant="label"
              style={card.fromOrganizer ? b.youTag : s.customerTag}
            >
              {card.fromOrganizer ? COPY.you : COPY.customer}
            </AppText>
          </View>
          <AppText variant="caption" style={b.time}>
            {card.timeAgo}
          </AppText>
        </View>
        <View style={[b.typeChip, tint]}>
          <EventlyIcon name={meta.icon} size={12} color={meta.color} />
          <AppText variant="label" style={[b.typeChipText, ink]}>
            {meta.label}
          </AppText>
        </View>
      </View>

      <AppText variant="body" style={b.cardText}>
        {card.text}
      </AppText>

      {card.photos.length > 0 ? (
        <View style={b.images}>
          {card.photos.map((photo, i) => (
            <PressableScale
              key={photo.key}
              style={s.photo}
              onPress={() => onOpenPhoto(card.photos, i)}
              accessibilityRole="imagebutton"
              accessibilityLabel={`${COPY.openPhoto}: ${photo.label}`}
            >
              <EventlyImage source={{ uri: photo.uri }} style={b.image} />
            </PressableScale>
          ))}
        </View>
      ) : null}

      {card.confidential || card.approval ? (
        <View style={s.chips}>
          {card.approval ? <StatusChip chip={card.approval} /> : null}
          {card.confidential ? (
            <View style={b.secretChip}>
              <EventlyIcon
                name="lock-outline"
                size={12}
                color={colors.textMuted}
              />
              <AppText variant="caption" style={b.secretChipText}>
                {COPY.confidential}
              </AppText>
            </View>
          ) : null}
        </View>
      ) : null}

      {card.reply ? (
        <View style={b.reply}>
          <View style={b.replyHead}>
            <AppText variant="bodySmall" style={b.replyTitle}>
              {COPY.yourPlan}
            </AppText>
            <StatusChip
              chip={{
                tone: card.reply.status === 'done' ? 'done' : 'planned',
                label: card.reply.statusLabel,
              }}
            />
          </View>
          {card.reply.text ? (
            <AppText variant="bodySmall" style={b.replyText}>
              {card.reply.text}
            </AppText>
          ) : null}
          {card.reply.timeAgo ? (
            <AppText variant="caption" style={s.replyTime}>
              {card.reply.timeAgo}
            </AppText>
          ) : null}
        </View>
      ) : null}

      <PressableScale
        style={s.replyRow}
        onPress={onReply}
        accessibilityRole="button"
        accessibilityLabel={card.replyCta}
      >
        <EventlyIcon name="reply-outline" size={16} color={BOARD_ACCENT} />
        <AppText
          variant="bodySmall"
          style={s.replyPlaceholder}
          numberOfLines={1}
        >
          {card.replyCta}
        </AppText>
      </PressableScale>
    </View>
  );
}

/** Nothing at all, or nothing in this filter — two different situations. */
export function EmptyFeed({ hasAnyPosts }: { hasAnyPosts: boolean }) {
  return (
    <View style={b.empty}>
      <View style={b.emptyIcon}>
        <EventlyIcon
          name={hasAnyPosts ? 'filter-variant' : 'creation'}
          size={24}
          color={BOARD_ACCENT}
        />
      </View>
      <AppText variant="h2" style={b.emptyTitle}>
        {hasAnyPosts ? IDEAS_COPY.filters.emptyTitle : IDEAS_COPY.empty.title}
      </AppText>
      <AppText variant="body" style={b.emptyBody}>
        {hasAnyPosts ? IDEAS_COPY.filters.emptyBody : IDEAS_COPY.empty.body}
      </AppText>
    </View>
  );
}
