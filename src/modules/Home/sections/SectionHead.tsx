import { TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { sectionStyles as s } from '../styles';

interface SectionHeadProps {
  title: string;
  /** The section's colour — used for its "See all" link. */
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
 * Shared so every section on this screen sets its heading identically — the
 * alternative is six near-copies that drift a point apart from each other.
 * The action is a plain label when nothing is passed to press: "3 live" is a
 * fact about the section, not a control, and making it tappable would promise
 * a screen that does not exist.
 */
export function SectionHead({
  title,
  tone,
  subtitle,
  actionLabel,
  onPressAction,
  testID,
}: SectionHeadProps) {
  return (
    <View>
      <View style={s.headRow}>
        {/* The title on its own — no icon badge. The section's colour lives
            on in its "See all". */}
        <View style={s.headLeft}>
          <EventlyText variant="h2" style={s.title} numberOfLines={1}>
            {title}
          </EventlyText>
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
              {/* Plain text, in the section's own colour — the deeper end of
                  its gradient, so it reads on the light page. */}
              <EventlyText
                variant="button"
                style={[s.action, tone ? { color: tone[1] } : null]}
              >
                {actionLabel}
              </EventlyText>
            </TouchableOpacity>
          ) : (
            <EventlyText variant="button" style={s.action}>
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
