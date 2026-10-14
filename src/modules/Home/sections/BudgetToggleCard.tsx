import { Alert, Pressable, Switch, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { BUDGET_TOGGLE_COPY } from '../constants';
import { HOME_ACCENT, HOME_INK, HOME_PAPER } from '../design';
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
 * so this is a switch rather than a fifth required question.
 *
 * A section of the brief composer rather than a card of its own: one surface,
 * divided by hairlines, so the brief reads as one object.
 */
export function BudgetToggleCard({
  enabled,
  value,
  onToggle,
  onPressRange,
}: BudgetToggleCardProps) {
  return (
    <View style={s.budgetCard}>
      <View style={s.budgetRow}>
        <View style={s.budgetIcon}>
          <EventlyIcon
            name="currency-inr"
            size={16}
            color={HOME_ACCENT.saffron}
          />
        </View>
        <View style={s.budgetText}>
          <EventlyText style={s.budgetTitle}>
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
            hitSlop={8}
          >
            <EventlyText style={s.budgetLink}>
              {BUDGET_TOGGLE_COPY.link}
            </EventlyText>
          </Pressable>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{
            false: HOME_PAPER.hairline,
            true: HOME_ACCENT.marigold,
          }}
          thumbColor="#ffffff"
          ios_backgroundColor={HOME_PAPER.hairline}
          accessibilityLabel={BUDGET_TOGGLE_COPY.title}
          testID="budget-toggle"
        />
      </View>

      {/* Only once it is on: a range row under an off switch would be asking
          for something the customer has just said not to send. */}
      {enabled ? (
        <Pressable
          style={({ pressed }) => [s.rangeRow, pressed && s.rangeRowPressed]}
          onPress={onPressRange}
          accessibilityRole="button"
          accessibilityLabel={`Budget range, ${value || 'not set'}`}
          testID="budget-range"
        >
          <EventlyIcon
            name="wallet-outline"
            size={18}
            color={HOME_INK.inkSoft}
          />
          <View style={s.budgetText}>
            <EventlyText style={s.tileLabel}>Budget</EventlyText>
            <EventlyText
              style={[s.tileValue, !value && s.tileValueEmpty]}
              numberOfLines={1}
            >
              {value || BUDGET_TOGGLE_COPY.placeholder}
            </EventlyText>
          </View>
          <EventlyIcon
            name="chevron-down"
            size={20}
            color={HOME_INK.inkFaint}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

export default BudgetToggleCard;
