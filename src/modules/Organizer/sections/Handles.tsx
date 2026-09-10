import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { ORGANIZER_COPY as COPY } from '../constants';
import { chipStyles as s, styles } from '../styles';

interface HandlesProps {
  /** The services this organizer has actually priced. */
  items: string[];
}

/**
 * What this organizer takes on.
 *
 * Read from the services they priced, named the way the plan wizard names
 * them — so a customer comparing an organizer against their own brief sees
 * the same words on both screens. A service they have not priced is not
 * listed, because pricing it is the only evidence they offer it.
 */
export function Handles({ items }: HandlesProps) {
  if (items.length === 0) return null;

  return (
    <View>
      <EventlyText variant="h2" style={styles.sectionTitle}>
        {COPY.handles}
      </EventlyText>
      <View style={s.wrap}>
        {items.map((item) => (
          <View key={item} style={s.chip}>
            <EventlyText variant="body" style={s.chipText}>
              {item}
            </EventlyText>
          </View>
        ))}
      </View>
    </View>
  );
}

export default Handles;
