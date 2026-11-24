import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { BADGES_COPY as COPY } from '../constants';
import { reqStyles as s, styles as base } from '../styles';
import type { RequirementModel } from '../types';

/**
 * What the next tier asks for, each with a tick and how far along it is. The
 * training row is the one the organizer can act on now: it leads to Academy.
 */
export function Requirements({
  tier,
  items,
  metCount,
  onOpenAcademy,
}: {
  tier: string;
  items: RequirementModel[];
  metCount: number;
  onOpenAcademy: () => void;
}) {
  return (
    <View style={base.card}>
      <View style={base.cardHead}>
        <AppText variant="h3" style={base.cardTitle}>
          {COPY.requirementsTitle(tier)}
        </AppText>
        <AppText variant="caption" style={base.cardMeta}>
          {COPY.requirementsMet(metCount, items.length)}
        </AppText>
      </View>
      {items.map((item, i) => (
        <View
          key={item.key}
          style={[s.row, i > 0 && s.divider]}
          accessible={item.key !== 'training' || item.met}
          accessibilityLabel={`${item.label}: ${item.value}`}
        >
          <View style={s.top}>
            <View style={[s.check, item.met && s.checkOn]}>
              {item.met ? (
                <EventlyIcon name="check" size={15} color="#ffffff" />
              ) : null}
            </View>
            <AppText variant="body" style={s.label}>
              {item.label}
            </AppText>
            <AppText
              variant="bodySmall"
              style={[s.value, item.met && s.valueOn]}
            >
              {item.value}
            </AppText>
          </View>
          {item.met ? null : (
            <View style={s.track}>
              <View
                style={[
                  s.fill,
                  { width: `${Math.max(4, Math.round(item.progress * 100))}%` },
                ]}
              />
            </View>
          )}
          {item.key === 'training' && !item.met ? (
            <Pressable
              style={s.action}
              onPress={onOpenAcademy}
              hitSlop={8}
              accessibilityRole="button"
            >
              <AppText variant="bodySmall" style={s.actionText}>
                {`${COPY.goAcademy} →`}
              </AppText>
            </Pressable>
          ) : null}
        </View>
      ))}
    </View>
  );
}

export default Requirements;
