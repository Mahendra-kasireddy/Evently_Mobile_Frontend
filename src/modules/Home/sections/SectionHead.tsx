import { Text, TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { sectionStyles as s } from '../styles';

interface SectionHeadProps {
  title: string;
  /** No longer drawn: Home's headings share one palette now. Accepted so callers need not change. */
  tone?: readonly [string, string];
  /** No longer drawn: headings carry no icon badge. Accepted so callers need not change. */
  icon?: string;
  subtitle?: string;
  /** The right-hand link — "See all", "3 live". Omitted when there is none. */
  actionLabel?: string;
  onPressAction?: () => void;
  /** On the action, so a section's link can be found without its label. */
  testID?: string;
}

/**
 * A section's title and its one optional action.
 *
 * Editorial: the title in the serif, so Home
 * reads as chapters rather than as a stack of identical rows. Shared so every
 * section sets its heading identically. The action is a plain label when
 * nothing is passed to press: "3 live" is a fact about the section, not a
 * control, and making it tappable would promise a screen that does not exist.
 */
export function SectionHead({
  title,
  subtitle,
  actionLabel,
  onPressAction,
  testID,
}: SectionHeadProps) {
  return (
    <View>
      <View style={s.headRow}>
        <View style={s.headLeft}>
          <Text style={s.title} numberOfLines={1} accessibilityRole="header">
            {title}
          </Text>
        </View>
        {actionLabel ? (
          onPressAction ? (
            <TouchableOpacity
              onPress={onPressAction}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`${actionLabel}: ${title}`}
              testID={testID}
            >
              <EventlyText style={s.action}>{actionLabel}</EventlyText>
            </TouchableOpacity>
          ) : (
            <EventlyText style={[s.action, s.actionStatic]}>
              {actionLabel}
            </EventlyText>
          )
        ) : null}
      </View>
      {subtitle ? (
        <EventlyText variant="body" style={s.subtitle}>
          {subtitle}
        </EventlyText>
      ) : null}
    </View>
  );
}

export default SectionHead;
