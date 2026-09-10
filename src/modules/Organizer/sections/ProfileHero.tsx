import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { ORGANIZER_COPY as COPY } from '../constants';
import { heroStyles as s } from '../styles';
import type { OrganizerViewModel } from '../types';

interface ProfileHeroProps {
  organizer: OrganizerViewModel;
  /** Hidden when this organizer has no reviews to show. */
  showAllReviews: boolean;
  onBack: () => void;
  onPressAllReviews: () => void;
}

/**
 * Who this organizer is, and the three figures worth leading with.
 *
 * Every stat tile is dropped when the organizer has not earned it: a new
 * business shows one or two rather than a row of zeros, which reads as
 * failing rather than as new. Same for the headline — no base price, no line.
 */
export function ProfileHero({
  organizer,
  showAllReviews,
  onBack,
  onPressAllReviews,
}: ProfileHeroProps) {
  return (
    <View style={s.hero}>
      <View style={s.topRow}>
        <TouchableOpacity
          style={s.back}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <EventlyIcon name="chevron-left" size={24} color={colors.onPrimary} />
        </TouchableOpacity>

        {/* Offered only when there is something to read. */}
        {showAllReviews ? (
          <TouchableOpacity
            style={s.allReviews}
            activeOpacity={0.8}
            onPress={onPressAllReviews}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.allReviews} for ${organizer.name}`}
          >
            <EventlyText variant="body" style={s.allReviewsText}>
              {COPY.allReviews}
            </EventlyText>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={s.identity}>
        <View style={[s.avatar, { backgroundColor: organizer.avatarColor }]}>
          <EventlyText variant="h1" style={s.avatarText}>
            {organizer.initials}
          </EventlyText>
        </View>

        <View style={s.identityText}>
          <EventlyText variant="h1" style={s.name} numberOfLines={2}>
            {organizer.name}
          </EventlyText>

          <View style={s.metaRow}>
            <View style={s.tierChip}>
              <EventlyIcon name="medal-outline" size={13} color={colors.onPrimary} />
              <EventlyText variant="caption" style={s.tierText}>
                {organizer.tier}
              </EventlyText>
            </View>
            {organizer.placeLabel ? (
              <EventlyText variant="body" style={s.place} numberOfLines={1}>
                {organizer.placeLabel}
              </EventlyText>
            ) : null}
          </View>
        </View>
      </View>

      {organizer.headlineLabel ? (
        <EventlyText variant="body" style={s.headline}>
          {organizer.headlineLabel}
        </EventlyText>
      ) : null}

      {organizer.stats.length > 0 ? (
        <View style={s.stats}>
          {organizer.stats.map((stat) => (
            <View
              key={stat.key}
              style={[s.stat, organizer.stats.length === 1 && s.statAlone]}
            >
              <EventlyText variant="h1" style={s.statValue}>
                {stat.value}
              </EventlyText>
              <EventlyText variant="caption" style={s.statLabel} numberOfLines={1}>
                {stat.label}
              </EventlyText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default ProfileHero;
