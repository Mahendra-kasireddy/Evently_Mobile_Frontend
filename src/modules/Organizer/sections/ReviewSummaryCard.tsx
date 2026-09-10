import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { ORGANIZER_COPY as COPY } from '../constants';
import { summaryCardStyles as s } from '../styles';
import type { RatingBar, ReviewSummaryDTO } from '../types';

interface ReviewSummaryCardProps {
  summary: ReviewSummaryDTO;
  bars: RatingBar[];
}

/**
 * The score and how it is distributed.
 *
 * The bars are scaled to the largest one rather than to the total: when 98 of
 * 126 reviews are five stars, scaling by total would leave the other four bars
 * as invisible hairlines, and "one person gave this two stars" is exactly the
 * sort of thing somebody scrolling a review page is looking for.
 */
export function ReviewSummaryCard({ summary, bars }: ReviewSummaryCardProps) {
  return (
    <View style={s.card}>
      <View style={s.left}>
        <EventlyText variant="h1" style={s.score}>
          {summary.average.toFixed(1)}
        </EventlyText>
        <EventlyText variant="caption" style={s.total}>
          {COPY.reviewsSuffix(summary.total)}
        </EventlyText>
      </View>

      <View style={s.bars}>
        {bars.map((bar) => (
          <View
            key={bar.stars}
            style={s.barRow}
            accessibilityLabel={`${bar.stars} stars, ${bar.count}`}
          >
            <EventlyText variant="caption" style={s.barStars}>
              {bar.stars}
            </EventlyText>
            <View style={s.track}>
              <View style={[s.fill, { width: `${bar.percent}%` }]} />
            </View>
            <EventlyText variant="caption" style={s.barCount}>
              {bar.count}
            </EventlyText>
          </View>
        ))}
      </View>
    </View>
  );
}

export default ReviewSummaryCard;
