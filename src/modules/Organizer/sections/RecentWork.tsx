import { View } from 'react-native';
import { EventlyImage, EventlyText } from '../../../Components';
import { ORGANIZER_COPY as COPY } from '../constants';
import { styles, workStyles as s } from '../styles';

interface RecentWorkProps {
  /** The organizer's uploaded portfolio photos. */
  photos: string[];
}

/**
 * The organizer's own portfolio.
 *
 * These are their real uploads, read from the profile's gallery. There is no
 * caption strip under each tile because nothing records what occasion or
 * locality a photo is from — labelling them would be this app inventing a
 * claim about somebody else's work.
 *
 * The section disappears entirely for an organizer who has uploaded nothing,
 * rather than showing a grid of empty frames that reads as a broken screen.
 */
export function RecentWork({ photos }: RecentWorkProps) {
  if (photos.length === 0) return null;

  return (
    <View>
      <EventlyText variant="h2" style={styles.sectionTitle}>
        {COPY.recentWork}
      </EventlyText>
      <View style={s.grid}>
        {photos.map((url) => (
          <View key={url} style={s.tile}>
            <EventlyImage source={{ uri: url }} style={s.photo} resizeMode="cover" />
          </View>
        ))}
      </View>
    </View>
  );
}

export default RecentWork;
