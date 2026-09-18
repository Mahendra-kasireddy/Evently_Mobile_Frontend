import { TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { ORGANIZER_COPY as COPY } from '../constants';
import { ratingStyles as s, styles } from '../styles';
import { Stars } from './Stars';
import type { RatingBar } from '../types';

interface RatingPanelProps {
  rating: number;
  reviews: number;
  bars: RatingBar[];
  onPressReviews: () => void;
}

/**
 * The score, and how it is distributed.
 *
 * An organizer nobody has reviewed gets a sentence rather than a zero and an
 * empty row of stars — "0.0" beside five grey stars reads as a bad rating
 * instead of as no rating, which is a materially different thing to tell
 * somebody deciding who to trust with a wedding.
 *
 * The bars are scaled to the largest one rather than to the total: when 103
 * of 126 reviews are five stars, scaling by total would leave the other four
 * as invisible hairlines, and "one person gave this two stars" is exactly
 * what somebody reading a rating is looking for.
 */
export function RatingPanel({ rating, reviews, bars, onPressReviews }: RatingPanelProps) {
  const hasReviews = reviews > 0;

  return (
    <View>
      {/*
        No "Rating" heading. The 4.8 is its own heading, and a label above it
        only pushes the histogram — the part that is actually worth reading —
        further down the screen.
      */}
      <View style={[s.card, styles.ratingSpacing]}>
        {hasReviews ? (
          <>
            <View style={s.left}>
              <EventlyText style={s.score}>{rating.toFixed(1)}</EventlyText>
              <Stars rating={rating} size={15} style={s.stars} />
              <TouchableOpacity
                onPress={onPressReviews}
                accessibilityRole="button"
                accessibilityLabel={`Read all ${COPY.reviewsSuffix(reviews)}`}
              >
                <EventlyText variant="label" style={s.reviews}>
                  {COPY.reviewsSuffix(reviews)}
                </EventlyText>
              </TouchableOpacity>
            </View>

            <View style={s.bars}>
              {bars.map((bar) => (
                <View
                  key={bar.stars}
                  style={s.barRow}
                  accessibilityLabel={`${bar.stars} stars, ${bar.count}`}
                >
                  <EventlyText variant="small" style={s.barStars}>
                    {bar.stars}
                  </EventlyText>
                  <View style={s.track}>
                    <View style={[s.fill, { width: `${bar.percent}%` }]} />
                  </View>
                  <EventlyText variant="small" style={s.barCount}>
                    {bar.count}
                  </EventlyText>
                </View>
              ))}
            </View>
          </>
        ) : (
          <EventlyText variant="body" style={s.emptyBody}>
            {COPY.noReviewsBody}
          </EventlyText>
        )}
      </View>
    </View>
  );
}

export default RatingPanel;
