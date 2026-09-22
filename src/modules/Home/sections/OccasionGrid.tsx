import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyText, OccasionArt } from '../../../Components';
import { OCCASIONS_PER_PAGE, OCCASION_TILE_ART, occasionGridStyles as s } from '../styles';
import type { OccasionTile, OccasionsViewModel } from '../types';
import { SectionHead } from './SectionHead';

interface OccasionGridProps {
  data: OccasionsViewModel;
  onPressOccasion: (occasionId: string) => void;
}

/**
 * One occasion: an illustrated tile, and its name under it.
 *
 * The organizer's own photograph when there is one, and the app's per-occasion
 * drawing when there is not — never a blank square. At this size the drawing
 * does the work a monochrome pictogram cannot: telling "ceremony" from
 * "reception" at a glance is the whole job of the tile.
 */
function Tile({ tile, onPress }: { tile: OccasionTile; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={s.tile}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={tile.note ? `${tile.label}. ${tile.note}.` : tile.label}
    >
      <View style={s.tileArt}>
        {tile.photoUrl ? (
          <Image source={{ uri: tile.photoUrl }} style={s.tilePhoto} resizeMode="cover" />
        ) : (
          <OccasionArt art={tile.art} width={OCCASION_TILE_ART} height={OCCASION_TILE_ART} />
        )}
      </View>
      {/*
        Two lines, not one. "Housewarming" and "Naming ceremony" do not fit a
        quarter of a phone on one line, and ellipsising them to "Naming…"
        leaves the customer guessing at half the grid.
      */}
      <EventlyText variant="small" style={s.tileLabel} numberOfLines={2}>
        {tile.label}
      </EventlyText>
    </TouchableOpacity>
  );
}

/**
 * "Plan something new" — every occasion the platform serves, at once.
 *
 * Two rows, always — four across, and the rest scroll sideways.
 *
 * Height is the thing being protected. Eleven occasions as a wrapping grid is
 * three rows, and every row this section grows is a row the sections under it
 * lose; as half-width cards, which is what this used to be, it was six. Two
 * rows is enough to read the shape of the list, and anything past the eighth
 * is one swipe away rather than a taller screen for everybody.
 *
 * Laid out as pages of eight rather than as columns of two. A column-major
 * fill keeps neighbours together when you swipe, but it also means six
 * occasions draw as three columns — three across the top, not four — and the
 * first row of a category list is the row people actually read. Each page is
 * a full-width four-by-two grid filled the way it is read: across, then down.
 *
 * With eight or fewer there is one page and nothing scrolls, so the common
 * case is a plain static grid and the scroller only appears when there is
 * genuinely something off-screen.
 *
 * The earned line each tile used to carry — "Most planned", or the lowest
 * price an organizer actually published — has no room at this size and is
 * kept for the screen reader rather than invented somewhere else.
 */
export function OccasionGrid({ data, onPressOccasion }: OccasionGridProps) {
  if (data.items.length === 0) return null;

  const pages: OccasionTile[][] = [];
  for (let i = 0; i < data.items.length; i += OCCASIONS_PER_PAGE) {
    pages.push(data.items.slice(i, i + OCCASIONS_PER_PAGE));
  }

  return (
    <View>
      {/* No strapline: the tiles are the instruction. */}
      <SectionHead title={data.title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        /* A page at a time, so a swipe never leaves half a column showing. */
        pagingEnabled={pages.length > 1}
        scrollEnabled={pages.length > 1}
      >
        {pages.map((page) => (
          <View key={page[0].id} style={s.page}>
            {page.map((tile) => (
              <Tile key={tile.id} tile={tile} onPress={() => onPressOccasion(tile.id)} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default OccasionGrid;
