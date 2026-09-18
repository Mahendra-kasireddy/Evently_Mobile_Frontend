import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { ORG_CHECK, ORGANIZER_COPY as COPY } from '../constants';
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
 * listed, because pricing it is the only evidence they offer it; that is also
 * why every chip carries a tick rather than some being greyed out.
 */
export function Handles({ items }: HandlesProps) {
  if (items.length === 0) return null;

  return (
    <View>
      <View style={styles.sectionHead}>
        <EventlyText variant="sectionTitle" style={styles.sectionTitle}>
          {COPY.handles}
        </EventlyText>
      </View>
      <View style={s.wrap}>
        {items.map((item) => (
          <View key={item} style={s.chip}>
            <EventlyIcon name="check" size={14} color={ORG_CHECK} />
            <EventlyText variant="label" style={s.chipText}>
              {item}
            </EventlyText>
          </View>
        ))}
      </View>
    </View>
  );
}

export default Handles;
