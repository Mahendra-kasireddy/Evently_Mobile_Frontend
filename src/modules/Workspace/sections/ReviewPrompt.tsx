import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { WORKSPACE_ACCENT } from '../constants';
import { summaryRowStyles as s, sectionStyles } from '../styles';

interface ReviewPromptProps {
  organizerName: string | null;
  onPress: () => void;
}

/**
 * The ask, once the event is over.
 *
 * Shown only for a delivered booking this customer has not already reviewed —
 * the server decides both, and the screen never asks twice. Without this the
 * review collection would stay empty and every rating in the app would remain
 * a number nobody could account for.
 */
export function ReviewPrompt({ organizerName, onPress }: ReviewPromptProps) {
  const organizer = organizerName ?? 'your organizer';

  return (
    <View style={sectionStyles.section}>
      <EventlyText variant="h2" style={sectionStyles.title}>
        How did it go?
      </EventlyText>
      <View style={sectionStyles.card}>
        <View style={s.row}>
          <View style={s.iconChip}>
            <EventlyIcon name="star-outline" size={22} color={WORKSPACE_ACCENT} />
          </View>
          <View style={s.text}>
            <EventlyText variant="body" style={s.title}>
              {`Review ${organizer}`}
            </EventlyText>
            <EventlyText variant="caption" style={s.body}>
              Your event is done. A few words help the next customer choose.
            </EventlyText>
          </View>
          <TouchableOpacity
            style={s.cta}
            activeOpacity={0.85}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Review ${organizer}`}
          >
            <EventlyText variant="caption" style={s.ctaText}>
              Review
            </EventlyText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ReviewPrompt;
