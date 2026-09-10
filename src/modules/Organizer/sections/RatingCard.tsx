import { TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { ORGANIZER_COPY as COPY } from '../constants';
import { ratingCardStyles as s } from '../styles';
import { Stars } from './Stars';

interface RatingCardProps {
  rating: number;
  reviews: number;
  events: number;
  onPressReviews: () => void;
}

/**
 * The score, summarised.
 *
 * An organizer nobody has reviewed gets a sentence rather than a zero and an
 * empty row of stars — "0.0" beside five grey stars reads as a bad rating
 * instead of as no rating, which is a materially different thing to tell
 * somebody deciding who to trust with a wedding.
 */
export function RatingCard({ rating, reviews, events, onPressReviews }: RatingCardProps) {
  const hasReviews = reviews > 0;

  return (
    <View style={s.card}>
      <View style={s.head}>
        <EventlyText variant="h2" style={s.title}>
          {COPY.rating}
        </EventlyText>
        {hasReviews ? (
          <TouchableOpacity
            onPress={onPressReviews}
            accessibilityRole="button"
            accessibilityLabel={`Read all ${COPY.reviewsSuffix(reviews)}`}
          >
            <EventlyText variant="body" style={s.reviewsLink}>
              {COPY.reviewsSuffix(reviews)}
            </EventlyText>
          </TouchableOpacity>
        ) : null}
      </View>

      {hasReviews ? (
        <View style={s.body}>
          <EventlyText variant="h1" style={s.score}>
            {rating.toFixed(1)}
          </EventlyText>
          <View>
            <Stars rating={rating} size={18} style={s.stars} />
            {/* Dropped for an organizer who has run none, rather than "0 events". */}
            {events > 0 ? (
              <EventlyText variant="body" style={s.completed}>
                {COPY.eventsCompleted(events)}
              </EventlyText>
            ) : null}
          </View>
        </View>
      ) : (
        <EventlyText variant="body" style={s.emptyBody}>
          {COPY.noReviewsBody}
        </EventlyText>
      )}
    </View>
  );
}

export default RatingCard;
