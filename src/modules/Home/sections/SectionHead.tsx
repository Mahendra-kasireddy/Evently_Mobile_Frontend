import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, GradientFill } from '../../../Components';
import { SECTION_TONE_GRADIENT, SECTION_TONE_ICON } from '../constants';
import { sectionStyles as s } from '../styles';

interface SectionHeadProps {
  title: string;
  /**
   * The section's colour.
   *
   * Drawn as a small gradient badge with the section's own icon before the
   * title. Home stacks five or six headings in one scroll, and a colour and a
   * picture apiece is what lets somebody find the section they came for
   * without reading every title on the way down.
   */
  tone?: readonly [string, string];
  /** The badge's glyph. Defaults to the icon for the section `tone` names. */
  icon?: string;
  subtitle?: string;
  /** The right-hand link — "See all", "3 live". Omitted when there is none. */
  actionLabel?: string;
  onPressAction?: () => void;
  /** On the action, so a section's link can be found without its label. */
  testID?: string;
}

/** The icon of whichever section owns this colour pair. */
function iconForTone(tone: readonly [string, string]): string {
  const key = (
    Object.keys(SECTION_TONE_GRADIENT) as Array<
      keyof typeof SECTION_TONE_GRADIENT
    >
  ).find(k => SECTION_TONE_GRADIENT[k] === tone);
  return key ? SECTION_TONE_ICON[key] : 'star-four-points';
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
  icon,
  subtitle,
  actionLabel,
  onPressAction,
  testID,
}: SectionHeadProps) {
  return (
    <View>
      <View style={s.headRow}>
        {/* Badge and title as one group on the left, so the title sits right
            beside its icon whether or not there is a "See all" on the right. */}
        <View style={s.headLeft}>
          {tone ? (
            <View style={s.toneBadge}>
              <GradientFill colors={tone} direction="diagonal" />
              <EventlyIcon
                name={icon ?? iconForTone(tone)}
                size={15}
                color="#ffffff"
              />
            </View>
          ) : null}
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
