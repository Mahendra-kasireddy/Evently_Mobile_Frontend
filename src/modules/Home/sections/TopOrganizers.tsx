import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { HOME_GREEN, TIER_COLOR } from '../constants';
import { organizerRowStyles as s } from '../styles';
import { SectionHead } from './SectionHead';
import type { OrganizerItem, TopOrganizersViewModel } from '../types';

interface TopOrganizersProps {
  data: TopOrganizersViewModel;
  onPressOrganizer: (organizerId: string) => void;
  onPressSeeAll: () => void;
  /** Offered when the list had to widen past the customer's city. */
  onPressChangeCity: () => void;
}

function OrganizerRow({
  item,
  onPress,
}: {
  item: OrganizerItem;
  onPress: () => void;
}) {
  const spoken = [
    item.name,
    item.reviews > 0
      ? `${item.rating.toFixed(1)} from ${item.reviews} reviews`
      : 'No reviews yet',
    item.tier,
    item.bookedLabel,
    item.fromLabel ? `from ${item.fromLabel}` : '',
    item.repliesLabel,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${spoken}. View profile.`}
    >
      <View style={[s.avatar, { backgroundColor: item.avatarColor }]}>
        <EventlyText variant="subtitle" style={s.avatarText}>
          {item.initials}
        </EventlyText>
      </View>

      <View style={s.text}>
        <View style={s.metaRow}>
          {/* A score with no reviews behind it is not a rating — the old card
              drew five filled stars for an organizer nobody had reviewed. */}
          {item.reviews > 0 ? (
            <>
              <EventlyIcon name="star" size={13} color="#e8a33a" />
              <EventlyText variant="caption" style={s.rating}>
                {item.rating.toFixed(1)}
              </EventlyText>
              <EventlyText variant="caption" style={s.reviews}>
                {`(${item.reviews})`}
              </EventlyText>
            </>
          ) : (
            <EventlyText variant="caption" style={s.reviews}>
              No reviews yet
            </EventlyText>
          )}
          <EventlyText variant="caption" style={s.dot}>
            ·
          </EventlyText>
          <EventlyText
            variant="caption"
            style={[s.tier, { color: TIER_COLOR[item.tier] }]}
          >
            {item.tier}
          </EventlyText>
        </View>

        {/* Their own name, as they wrote it. It used to be set in capitals,
            which is a shout rather than a name. */}
        <EventlyText variant="body" style={s.name} numberOfLines={2}>
          {item.name}
        </EventlyText>

        <View style={s.factRow}>
          {/* What they have done lately, or how fast they answer — whichever
              they have. Both drop rather than reading "0 booked". */}
          {item.bookedLabel || item.repliesLabel ? (
            <>
              <EventlyIcon
                name={item.bookedLabel ? 'calendar-check' : 'clock-outline'}
                size={14}
                color={item.bookedLabel ? colors.textMuted : HOME_GREEN}
              />
              <EventlyText
                variant="caption"
                style={item.bookedLabel ? s.booked : s.replies}
                numberOfLines={1}
              >
                {item.bookedLabel || item.repliesLabel}
              </EventlyText>
            </>
          ) : null}

          {/* Dropped when the organizer has published no figure — "From ₹0"
              is worse than saying nothing. */}
          {item.fromLabel ? (
            <View style={s.right}>
              <EventlyText variant="caption" style={s.fromLabel}>
                From
              </EventlyText>
              <EventlyText variant="subtitle" style={s.fromValue}>
                {item.fromLabel}
              </EventlyText>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Organizers the customer can actually reach.
 *
 * The heading tells the truth about how the list was built: when nothing local
 * matched, the server widens the search and says so, and this section then
 * offers to change the city rather than calling organizers in another state
 * "near you".
 */
export function TopOrganizers({
  data,
  onPressOrganizer,
  onPressSeeAll,
  onPressChangeCity,
}: TopOrganizersProps) {
  return (
    <View>
      <SectionHead
        title={data.title}
        actionLabel="See all"
        onPressAction={onPressSeeAll}
      />

      {data.scopeNote ? (
        <TouchableOpacity
          onPress={onPressChangeCity}
          accessibilityRole="button"
        >
          <EventlyText variant="caption" style={s.emptyText}>
            {data.scopeNote}
          </EventlyText>
        </TouchableOpacity>
      ) : null}

      {/* A heading with nothing under it reads as a section that failed to
          load. When there is genuinely nobody, say so and offer the one thing
          that can change it. */}
      {data.items.length === 0 ? (
        <TouchableOpacity
          onPress={onPressChangeCity}
          accessibilityRole="button"
        >
          <EventlyText variant="body" style={s.emptyText}>
            {data.city
              ? `No organizers listed for ${data.city} yet. Change your city to look further afield.`
              : 'Set your city and we will show the organizers who serve it.'}
          </EventlyText>
        </TouchableOpacity>
      ) : (
        data.items.map(item => (
          <OrganizerRow
            key={item.id}
            item={item}
            onPress={() => onPressOrganizer(item.id)}
          />
        ))
      )}
    </View>
  );
}

export default TopOrganizers;
