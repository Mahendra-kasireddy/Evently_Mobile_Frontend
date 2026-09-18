import { Alert, Pressable, Switch, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  BUDGET_TOGGLE_COPY,
  HERO_ACCENT_COLOR,
  HOME_HAIRLINE,
  HOME_NAVY,
} from '../constants';
import { basicsStyles as s } from '../styles';

interface BudgetToggleCardProps {
  enabled: boolean;
  /** The range the customer picked, '' while they have not. */
  value: string;
  onToggle: (enabled: boolean) => void;
  onPressRange: () => void;
}

/**
 * Whether the organizer sees a budget, and which range.
 *
 * Off by default, and off means nothing is sent. A range makes the replies
 * comparable, which is worth asking for, but a customer who does not want to
 * anchor the price should be able to get quotes without inventing a number —
 * so this is a switch rather than a fifth required row.
 *
 * Both rows live in one card. The range used to be a second bordered box
 * stacked under this one, which met it edge to edge: two hairlines against
 * each other and four rounded corners notching into the seam.
 */
export function BudgetToggleCard({
  enabled,
  value,
  onToggle,
  onPressRange,
}: BudgetToggleCardProps) {
  return (
    <View style={[s.budgetCard, enabled && s.budgetOn]}>
      <View style={s.budgetRow}>
        <EventlyIcon name="currency-inr" size={22} color={HERO_ACCENT_COLOR} />
        <View style={s.budgetText}>
          <EventlyText variant="subtitle" style={s.budgetTitle}>
            {BUDGET_TOGGLE_COPY.title}
          </EventlyText>
          <Pressable
            onPress={() =>
              Alert.alert(
                BUDGET_TOGGLE_COPY.title,
                BUDGET_TOGGLE_COPY.explainer,
              )
            }
            accessibilityRole="button"
            accessibilityLabel={BUDGET_TOGGLE_COPY.link}
            hitSlop={6}
          >
            <EventlyText variant="caption" style={s.budgetLink}>
              {BUDGET_TOGGLE_COPY.link}
            </EventlyText>
          </Pressable>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: HOME_HAIRLINE, true: HERO_ACCENT_COLOR }}
          thumbColor={colors.background}
          accessibilityLabel={BUDGET_TOGGLE_COPY.title}
          testID="budget-toggle"
        />
      </View>

      {/* Only once it is on: a range row under an off switch would be asking
          for something the customer has just said not to send. */}
      {enabled ? (
        <Pressable
          style={({ pressed }) => [
            s.budgetRow,
            s.budgetRowDivided,
            pressed && s.rowPressed,
          ]}
          onPress={onPressRange}
          accessibilityRole="button"
          accessibilityLabel={`Budget range, ${value || 'not set'}`}
          testID="budget-range"
        >
          <EventlyIcon name="wallet-outline" size={22} color={HOME_NAVY} />
          <View style={s.budgetText}>
            <EventlyText variant="caption" style={s.rowLabel}>
              Budget
            </EventlyText>
            <EventlyText
              style={[s.rowValue, !value && s.rowValueEmpty]}
              numberOfLines={1}
            >
              {value || BUDGET_TOGGLE_COPY.placeholder}
            </EventlyText>
          </View>
          <EventlyIcon name="chevron-down" size={20} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

export default BudgetToggleCard;
