import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, AppText } from '../../../Components';
import {
  ORG_ACCENT,
  ORG_NAVY,
  ORG_STAR,
  ORGANIZER_COPY as COPY,
} from '../constants';
import { previewStyles as s } from '../styles';
import type { ReviewDTO } from '../types';

interface ReviewPreviewProps {
  review: ReviewDTO;
  /** Hidden when this is the only review there is. */
  showAll: boolean;
  onPressAll: () => void;
}

/**
 * The most recent review, inline.
 *
 * One, not a list: the profile's job is to give a customer a reason to open
 * the reviews page, and a page of reviews inside a profile is where people
 * stop scrolling before they reach the services. The name is a first name and
 * an initial as the server sends it — the person who wrote this did not agree
 * to have their full name on the internet beside an opinion about a business.
 */
export function ReviewPreview({
  review,
  showAll,
  onPressAll,
}: ReviewPreviewProps) {
  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={[s.avatar, { backgroundColor: ORG_NAVY }]}>
          <AppText variant="h3" style={s.avatarText}>
            {review.authorInitials}
          </AppText>
        </View>

        <View style={s.headText}>
          <AppText variant="h3" style={s.name} numberOfLines={1}>
            {review.authorName}
          </AppText>
          {review.contextLabel ? (
            <AppText variant="bodySmall" style={s.context} numberOfLines={1}>
              {review.contextLabel}
            </AppText>
          ) : null}
        </View>

        <View style={s.scoreRow}>
          <EventlyIcon name="star" size={13} color={ORG_STAR} />
          <AppText variant="display" style={s.score}>
            {review.rating.toFixed(1)}
          </AppText>
        </View>
      </View>

      {review.comment ? (
        <AppText variant="bodyLarge" style={s.comment} numberOfLines={3}>
          {review.comment}
        </AppText>
      ) : null}

      {showAll ? (
        <TouchableOpacity
          style={s.all}
          onPress={onPressAll}
          accessibilityRole="button"
          accessibilityLabel={COPY.allReviews}
        >
          <AppText variant="label" style={s.allText}>
            {COPY.allReviews}
          </AppText>
          <EventlyIcon name="chevron-right" size={16} color={ORG_ACCENT} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default ReviewPreview;
