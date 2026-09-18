import { StyleSheet, View } from 'react-native';
import { EventlyIcon } from '../../../Components';
import { ORG_STAR, ORG_TRACK } from '../constants';
import { filledStars } from '../utils';

const s = StyleSheet.create({ row: { flexDirection: 'row' } });

interface StarsProps {
  rating: number;
  size?: number;
  style?: object;
}

/**
 * A row of five stars, filled to the rounded score.
 *
 * Shared so no screen draws its own. The web card fills all five
 * unconditionally, which made a brand-new organizer read as a five-star
 * business beside the text "0 (0)" — here a rating of 0 fills none.
 */
export function Stars({ rating, size = 16, style }: StarsProps) {
  const filled = filledStars(rating);
  return (
    <View style={[s.row, style]}>
      {[1, 2, 3, 4, 5].map((n) => (
        <EventlyIcon key={n} name="star" size={size} color={n <= filled ? ORG_STAR : ORG_TRACK} />
      ))}
    </View>
  );
}

export default Stars;
