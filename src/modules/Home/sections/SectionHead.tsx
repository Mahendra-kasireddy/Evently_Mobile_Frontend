import { TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { sectionStyles as s } from '../styles';

interface SectionHeadProps {
  title: string;
  subtitle?: string;
  /** The right-hand link — "See all", "3 live". Omitted when there is none. */
  actionLabel?: string;
  onPressAction?: () => void;
}

/**
 * A section's title and its one optional action.
 *
 * Shared so every section on this screen sets its heading identically — the
 * alternative is six near-copies that drift a point apart from each other.
 * The action is a plain label when nothing is passed to press: "3 live" is a
 * fact about the section, not a control, and making it tappable would promise
 * a screen that does not exist.
 */
export function SectionHead({ title, subtitle, actionLabel, onPressAction }: SectionHeadProps) {
  return (
    <View>
      <View style={s.headRow}>
        <EventlyText variant="h2" style={s.title} numberOfLines={1}>
          {title}
        </EventlyText>
        {actionLabel ? (
          onPressAction ? (
            <TouchableOpacity
              onPress={onPressAction}
              accessibilityRole="button"
              accessibilityLabel={`${actionLabel}: ${title}`}
            >
              <EventlyText variant="body" style={s.action}>
                {actionLabel}
              </EventlyText>
            </TouchableOpacity>
          ) : (
            <EventlyText variant="body" style={s.action}>
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
