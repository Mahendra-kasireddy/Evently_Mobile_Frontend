import { TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { CATEGORY_GRADIENT, CATEGORY_ICON_NAME } from '../constants';
import { occasionGridStyles as s } from '../styles';
import type { OccasionTile, OccasionsViewModel } from '../types';
import { SectionHead } from './SectionHead';

interface OccasionGridProps {
  data: OccasionsViewModel;
  onPressOccasion: (occasionId: string) => void;
}

/** The gradient layer, filling the tile behind its content. */
const FILL = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const;

function Tile({ tile, onPress }: { tile: OccasionTile; onPress: () => void }) {
  const [start, end] = CATEGORY_GRADIENT[tile.art];
  /*
   * SVG ids are global to the document, so a shared id would make every tile
   * on the screen paint whichever gradient rendered last. Scoped per occasion.
   */
  const gradientId = `occasionTile-${tile.id}`;

  return (
    <TouchableOpacity
      style={s.tile}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={tile.note ? `${tile.label}. ${tile.note}.` : tile.label}
    >
      <View style={FILL}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={gradientId} x1="12%" y1="0%" x2="88%" y2="100%">
              <Stop offset="0" stopColor={start} />
              <Stop offset="1" stopColor={end} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={100} height={100} fill={`url(#${gradientId})`} />
        </Svg>
      </View>

      <View style={s.tileBody}>
        <View style={s.iconChip}>
          <EventlyIcon name={CATEGORY_ICON_NAME[tile.icon]} size={21} color={colors.onPrimary} />
        </View>
        <View>
          <EventlyText variant="h2" style={s.label} numberOfLines={1}>
            {tile.label}
          </EventlyText>
          {/* No line at all when no organizer serving this occasion has
              published a price and it is not the most-planned one. */}
          {tile.note ? (
            <EventlyText variant="caption" style={s.note} numberOfLines={1}>
              {tile.note}
            </EventlyText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * "Plan something new" — every occasion the platform serves.
 *
 * The line under each label is earned: "Most planned" goes to whichever
 * occasion has the most real submissions, and the price is the lowest an
 * organizer serving it has actually published. An occasion with neither shows
 * its name alone.
 */
export function OccasionGrid({ data, onPressOccasion }: OccasionGridProps) {
  return (
    <View>
      <SectionHead title={data.title} subtitle={data.subtitle} />
      <View style={s.grid}>
        {data.items.map((tile) => (
          <Tile key={tile.id} tile={tile} onPress={() => onPressOccasion(tile.id)} />
        ))}
      </View>
    </View>
  );
}

export default OccasionGrid;
