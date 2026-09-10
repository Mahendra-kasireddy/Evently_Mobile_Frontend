import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { reviewCardStyles as s } from '../styles';
import { Stars } from './Stars';
import type { ReviewDTO } from '../types';

interface ReviewCardProps {
  review: ReviewDTO;
  /** A stable colour for the monogram, from the review's own id. */
  avatarColor: string;
}

/**
 * One review.
 *
 * The name is a first name and an initial, as the server sends it — the person
 * who wrote this did not agree to have their full name on the internet beside
 * an opinion about a business, and the server is where that decision is
 * enforced rather than here.
 */
export function ReviewCard({ review, avatarColor }: ReviewCardProps) {
  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={[s.avatar, { backgroundColor: avatarColor }]}>
          <EventlyText variant="subtitle" style={s.avatarText}>
            {review.authorInitials}
          </EventlyText>
        </View>

        <View style={s.headText}>
          <EventlyText variant="subtitle" style={s.name} numberOfLines={1}>
            {review.authorName}
          </EventlyText>
          {/* Dropped when the booking carried neither occasion nor date. */}
          {review.contextLabel ? (
            // Two lines: "Naming ceremony · June 2026" beside a star row has
            // little width left, and an ellipsised date tells the reader less
            // than a second line costs them.
            <EventlyText variant="caption" style={s.context} numberOfLines={2}>
              {review.contextLabel}
            </EventlyText>
          ) : null}
        </View>

        <Stars rating={review.rating} size={15} style={s.stars} />
      </View>

      {review.comment ? (
        <EventlyText variant="body" style={s.comment}>
          {review.comment}
        </EventlyText>
      ) : null}

      {review.tags.length > 0 ? (
        <View style={s.tags}>
          {review.tags.map((tag) => (
            <View key={tag} style={s.tag}>
              <EventlyText variant="caption" style={s.tagText}>
                {tag}
              </EventlyText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default ReviewCard;
