import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { BOOKING_COPY as COPY } from '../constants';
import { styles } from '../styles';

/**
 * The screen's own title, in place of a header bar.
 *
 * No back arrow: this screen is a tab, and a tab is somewhere you go, not
 * somewhere you are sent and have to escape.
 */
export function EventsHeader() {
  return (
    <View style={styles.headerRow}>
      <EventlyText variant="h1" style={styles.screenTitle}>
        {COPY.title}
      </EventlyText>
    </View>
  );
}

export default EventsHeader;
