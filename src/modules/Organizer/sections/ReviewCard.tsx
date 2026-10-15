import { View } from 'react-native';
import { AppText } from '../../../Components';
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
          <AppText variant="h3" style={s.avatarText}>
            {review.authorInitials}
          </AppText>
        </View>

        <View style={s.headText}>
          <AppText variant="h3" style={s.name} numberOfLines={1}>
            {review.authorName}
          </AppText>
          {/* Dropped when the booking carried neither occasion nor date. */}
          {review.contextLabel ? (
            // Two lines: "Naming ceremony · June 2026" beside a star row has
            // little width left, and an ellipsised date tells the reader less
            // than a second line costs them.
            <AppText variant="bodySmall" style={s.context} numberOfLines={2}>
              {review.contextLabel}
            </AppText>
          ) : null}
        </View>

        <Stars rating={review.rating} size={15} style={s.stars} />
      </View>

      {review.comment ? (
        <AppText variant="bodyLarge" style={s.comment}>
          {review.comment}
        </AppText>
      ) : null}

      {review.tags.length > 0 ? (
        <View style={s.tags}>
          {review.tags.map(tag => (
            <View key={tag} style={s.tag}>
              <AppText variant="label" style={s.tagText}>
                {tag}
              </AppText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default ReviewCard;
