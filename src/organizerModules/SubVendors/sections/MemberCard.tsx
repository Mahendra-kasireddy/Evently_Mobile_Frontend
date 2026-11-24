import { ActivityIndicator, Pressable, View } from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { SUBVENDORS_COPY as COPY } from '../constants';
import { AVATAR_TINTS, ORG_ACCENT, ORG_INK, PERFORMANCE_TONE } from '../design';
import { cardStyles as s, chipToneStyles } from '../styles';
import type { MemberItem } from '../types';
import { performanceTone } from '../utils';

function tintFor(id: string): [string, string] {
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i);
  return AVATAR_TINTS[sum % AVATAR_TINTS.length];
}

/**
 * One person on the team: who they are, what they do and where, what they
 * charge, and how reliably they've delivered — with Remove as the one action.
 */
export function MemberCard({
  item,
  removing,
  onRemove,
}: {
  item: MemberItem;
  removing: boolean;
  onRemove: () => void;
}) {
  const tone = chipToneStyles[item.chip.tone];
  const perf = item.performance;
  const barColor =
    perf === null ? ORG_INK.inkFaint : PERFORMANCE_TONE[performanceTone(perf)];

  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={s.avatar}>
          <GradientFill colors={tintFor(item.linkId)} direction="diagonal" />
          <AppText variant="body" style={s.initials}>
            {item.initials}
          </AppText>
        </View>
        <View style={s.headText}>
          <AppText variant="h3" style={s.name} numberOfLines={1}>
            {item.name}
          </AppText>
          <View style={s.category}>
            <EventlyIcon
              name={item.categoryIcon}
              size={15}
              color={ORG_INK.inkSoft}
            />
            <AppText variant="bodySmall" style={s.categoryText}>
              {item.categoryLabel}
            </AppText>
          </View>
        </View>
        <View style={[s.chip, tone.box]}>
          <AppText variant="label" style={[s.chipText, tone.text]}>
            {item.chip.label}
          </AppText>
        </View>
      </View>

      <View style={s.facts}>
        {item.serviceArea ? (
          <View style={s.fact}>
            <EventlyIcon
              name="map-marker-outline"
              size={15}
              color={ORG_INK.inkSoft}
            />
            <AppText variant="bodySmall" style={s.factText}>
              {item.serviceArea}
            </AppText>
          </View>
        ) : null}
        <View style={s.fact}>
          <EventlyIcon name="tag-outline" size={15} color={ORG_INK.inkSoft} />
          <AppText
            variant="bodySmall"
            style={[s.factText, !item.rate && s.factMuted]}
          >
            {item.rate || COPY.rateMissing}
          </AppText>
        </View>
      </View>

      <View style={s.perf}>
        <View style={s.perfRow}>
          <AppText variant="label" style={s.perfLabel}>
            {COPY.performance}
          </AppText>
          <AppText variant="label" style={s.perfValue}>
            {perf === null ? COPY.noJobsYet : `${perf}%`}
          </AppText>
        </View>
        <View
          style={s.track}
          accessibilityRole="progressbar"
          accessibilityLabel={COPY.performance}
          accessibilityValue={{ min: 0, max: 100, now: perf ?? 0 }}
        >
          {perf !== null ? (
            <View
              style={[
                s.fill,
                { width: `${Math.max(3, perf)}%`, backgroundColor: barColor },
              ]}
            />
          ) : null}
        </View>
      </View>

      <View style={s.foot}>
        <View style={s.events}>
          <EventlyIcon
            name="calendar-check-outline"
            size={16}
            color={ORG_ACCENT.jade}
          />
          <AppText variant="bodySmall" style={s.eventsText}>
            {COPY.eventsDone(item.eventsDone)}
          </AppText>
        </View>
        <Pressable
          style={s.ghost}
          onPress={onRemove}
          disabled={removing}
          accessibilityRole="button"
          accessibilityLabel={`${COPY.remove} ${item.name}`}
          accessibilityState={{ disabled: removing, busy: removing }}
        >
          {removing ? (
            <ActivityIndicator size="small" color={ORG_ACCENT.sindoor} />
          ) : (
            <EventlyIcon
              name="account-remove-outline"
              size={16}
              color={ORG_ACCENT.sindoor}
            />
          )}
          <AppText variant="bodySmall" style={s.ghostText}>
            {COPY.remove}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

export default MemberCard;
