import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, AppText, GradientFill } from '../../../Components';
import { BOOKING_COPY as COPY } from '../constants';
import { jumpToStyles as s } from '../styles';
import type { JumpKey, JumpTile } from '../types';

interface JumpToGridProps {
  tiles: JumpTile[];
  onPress: (key: JumpKey) => void;
}

type Look = {
  wash: [string, string];
  mark: [string, string];
  sprig: string;
};

/* Each tile's own colour: a pale wash, a bold icon tile and arrow, and a
   faint sprig in the corner. */
const LOOK: Record<JumpKey, Look> = {
  payments: {
    wash: ['#fff4ee', '#ffe6dc'],
    mark: ['#ff9a6c', '#f0553c'],
    sprig: 'rgba(240,120,90,0.28)',
  },
  invitation: {
    wash: ['#f6f3ff', '#ebe5ff'],
    mark: ['#a48bff', '#5a35e0'],
    sprig: 'rgba(120,95,230,0.25)',
  },
  budget: {
    wash: ['#effaf4', '#dff3e8'],
    mark: ['#4fd09a', '#169a6a'],
    sprig: 'rgba(30,160,110,0.25)',
  },
  ideas: {
    wash: ['#fff2f7', '#ffe3ee'],
    mark: ['#ff7fb0', '#c9358a'],
    sprig: 'rgba(220,80,140,0.25)',
  },
};

/**
 * Four ways into the event happening soonest.
 *
 * Every tile leads to a screen that exists, and every subtitle is a figure the
 * backend actually holds — money still owed, guests the invitation reached and
 * how many opened it, posts on the board waiting for the customer. Where a
 * count cannot be had yet, the tile says what state the thing is in rather
 * than showing a zero, which reads as an answer.
 */
export function JumpToGrid({ tiles, onPress }: JumpToGridProps) {
  return (
    <View>
      <View style={s.headRow}>
        <View style={s.headLine} />
        <EventlyIcon name="star-four-points" size={13} color="#f0607e" />
        <AppText variant="overline" style={s.heading}>
          {COPY.jumpTo}
        </AppText>
        <View style={s.headLine} />
      </View>
      <View style={s.grid}>
        {tiles.map(tile => {
          const look = LOOK[tile.key];
          return (
            <TouchableOpacity
              key={tile.key}
              style={s.tile}
              activeOpacity={0.85}
              onPress={() => onPress(tile.key)}
              accessibilityRole="button"
              accessibilityLabel={`${tile.title}. ${tile.subtitle}.`}
            >
              <GradientFill colors={look.wash} direction="diagonal" />
              <View style={s.sprig} pointerEvents="none">
                <EventlyIcon name="leaf" size={30} color={look.sprig} />
              </View>
              <View style={s.tileIcon}>
                <GradientFill colors={look.mark} direction="diagonal" />
                <EventlyIcon name={tile.icon} size={22} color="#ffffff" />
              </View>
              <AppText variant="h3" style={s.tileTitle} numberOfLines={1}>
                {tile.title}
              </AppText>
              <View style={s.tileFoot}>
                <AppText
                  variant="caption"
                  style={s.tileSubtitle}
                  numberOfLines={1}
                >
                  {tile.subtitle}
                </AppText>
                <View style={s.tileGo}>
                  <GradientFill colors={look.mark} direction="diagonal" />
                  <EventlyIcon name="arrow-right" size={14} color="#ffffff" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default JumpToGrid;
