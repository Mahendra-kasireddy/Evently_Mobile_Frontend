import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { BOOKING_COPY as COPY, JUMP_TONE_COLOR } from '../constants';
import { jumpToStyles as s } from '../styles';
import type { JumpKey, JumpTile } from '../types';

interface JumpToGridProps {
  tiles: JumpTile[];
  onPress: (key: JumpKey) => void;
}

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
      <EventlyText variant="subtitle" style={s.heading}>
        {COPY.jumpTo}
      </EventlyText>
      <View style={s.grid}>
        {tiles.map((tile) => {
          const tone = JUMP_TONE_COLOR[tile.tone];
          return (
            <TouchableOpacity
              key={tile.key}
              style={s.tile}
              activeOpacity={0.85}
              onPress={() => onPress(tile.key)}
              accessibilityRole="button"
              accessibilityLabel={`${tile.title}. ${tile.subtitle}.`}
            >
              <View style={[s.tileIcon, { backgroundColor: tone.bg }]}>
                <EventlyIcon name={tile.icon} size={18} color={tone.fg} />
              </View>
              <EventlyText variant="body" style={s.tileTitle} numberOfLines={1}>
                {tile.title}
              </EventlyText>
              <EventlyText variant="caption" style={s.tileSubtitle} numberOfLines={2}>
                {tile.subtitle}
              </EventlyText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default JumpToGrid;
