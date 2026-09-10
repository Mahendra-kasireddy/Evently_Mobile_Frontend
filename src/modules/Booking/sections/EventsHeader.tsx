import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { BOOKING_COPY as COPY } from '../constants';
import { styles } from '../styles';

interface EventsHeaderProps {
  /**
   * True only when the screen was pushed onto the stack. As the Events tab
   * there is nothing behind it, so it carries no back arrow.
   */
  showBack: boolean;
  onBack: () => void;
}

/** The screen's own title, in place of a header bar. */
export function EventsHeader({ showBack, onBack }: EventsHeaderProps) {
  return (
    <View style={styles.headerRow}>
      {showBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <EventlyIcon name="chevron-left" size={26} color={colors.text} />
        </TouchableOpacity>
      ) : null}
      <EventlyText variant="h1" style={styles.screenTitle}>
        {COPY.title}
      </EventlyText>
    </View>
  );
}

export default EventsHeader;
