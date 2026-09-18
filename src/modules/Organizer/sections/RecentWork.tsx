import { ScrollView, View } from 'react-native';
import { EventlyImage, EventlyText } from '../../../Components';
import { ORGANIZER_COPY as COPY } from '../constants';
import { styles, WORK_TILE_HEIGHT, WORK_TILE_WIDTH, workStyles as s } from '../styles';
import { CoverArt } from './CoverArt';
import type { WorkTile } from '../types';

interface RecentWorkProps {
  tiles: WorkTile[];
  /** True when these are drawn gradients rather than the organizer's uploads. */
  isPlaceholder: boolean;
  /** "89 events run" — dropped for an organizer who has run none. */
  events: number;
}

/**
 * The organizer's own portfolio, side by side.
 *
 * A strip rather than a grid: ten uploads should cost one swipe, not half a
 * screen of scrolling before the services and reviews a customer came for.
 *
 * There is no caption under a tile. Nothing records what occasion or locality
 * a photo is from, and captioning them "Wedding · Jubilee Hills" would be
 * this app inventing a claim about somebody else's work. When the organizer
 * has uploaded nothing the strip runs as three abstract gradients with a line
 * saying exactly that, rather than vanishing mid-profile.
 */
export function RecentWork({ tiles, isPlaceholder, events }: RecentWorkProps) {
  if (tiles.length === 0) return null;

  return (
    <View>
      <View style={styles.sectionHead}>
        <EventlyText variant="sectionTitle" style={styles.sectionTitle}>
          {COPY.recentWork}
        </EventlyText>
        {events > 0 ? (
          <EventlyText variant="small" style={styles.sectionMeta}>
            {COPY.eventsRun(events)}
          </EventlyText>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.strip}
      >
        {tiles.map((tile) => (
          <View key={tile.key} style={s.tile}>
            {tile.photo ? (
              <EventlyImage source={{ uri: tile.photo }} style={s.photo} resizeMode="cover" />
            ) : (
              <CoverArt
                width={WORK_TILE_WIDTH}
                height={WORK_TILE_HEIGHT}
                from={tile.gradient[0]}
                to={tile.gradient[1]}
                plain
                style={s.art}
              />
            )}
          </View>
        ))}
      </ScrollView>

      {isPlaceholder ? (
        <EventlyText variant="small" style={styles.note}>
          {COPY.workPlaceholderNote}
        </EventlyText>
      ) : null}
    </View>
  );
}

export default RecentWork;
