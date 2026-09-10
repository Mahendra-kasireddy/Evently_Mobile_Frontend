import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { HERO_ACCENT_COLOR, HOME_NAVY } from '../constants';
import { homeHeaderStyles as s } from '../styles';

interface HomeHeaderProps {
  locationLabel: string;
  unreadCount: number;
  /** How many packages the account has kept — the heart's badge. */
  savedCount: number;
  searchPlaceholder: string;
  onPressLocation: () => void;
  onPressSaved: () => void;
  onPressNotifications: () => void;
  onPressSearch: () => void;
  onPressFilters: () => void;
}

/** A count worth showing, capped so a big number cannot stretch the dot. */
function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={s.badge}>
      <EventlyText variant="caption" style={s.badgeText}>
        {count > 9 ? '9+' : count}
      </EventlyText>
    </View>
  );
}

/**
 * The bar above everything: where the customer is, what is waiting for them,
 * and the way into search.
 *
 * The location is the account's own city rather than a reverse-geocoded
 * street — nothing here turns coordinates into a locality name, and naming one
 * would be a guess about where somebody is standing. Both badges are real
 * counts and disappear at zero.
 *
 * The search field is a button drawn to look like an input. Typing happens on
 * the search screen, where the results and the filters live; a field here that
 * focused in place would leave the customer typing into a home screen with
 * nowhere for the results to go.
 */
export function HomeHeader({
  locationLabel,
  unreadCount,
  savedCount,
  searchPlaceholder,
  onPressLocation,
  onPressSaved,
  onPressNotifications,
  onPressSearch,
  onPressFilters,
}: HomeHeaderProps) {
  return (
    <View style={s.container}>
      <View style={s.topRow}>
        <TouchableOpacity
          style={s.locationButton}
          onPress={onPressLocation}
          accessibilityRole="button"
          accessibilityLabel={`Location: ${locationLabel}. Change it.`}
        >
          <EventlyIcon name="map-marker" size={20} color={HERO_ACCENT_COLOR} />
          <EventlyText variant="subtitle" style={s.locationLabel} numberOfLines={1}>
            {locationLabel}
          </EventlyText>
          <EventlyIcon name="chevron-down" size={19} color={HOME_NAVY} />
        </TouchableOpacity>

        <View style={s.actions}>
          <TouchableOpacity
            style={s.iconButton}
            onPress={onPressSaved}
            accessibilityRole="button"
            accessibilityLabel={
              savedCount > 0 ? `Saved packages, ${savedCount} saved` : 'Saved packages'
            }
          >
            <EventlyIcon name="heart-outline" size={23} color={HOME_NAVY} />
            <Badge count={savedCount} />
          </TouchableOpacity>

          <TouchableOpacity
            style={s.iconButton}
            onPress={onPressNotifications}
            accessibilityRole="button"
            accessibilityLabel={
              unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
            }
          >
            <EventlyIcon name="bell-outline" size={23} color={HOME_NAVY} />
            <Badge count={unreadCount} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.searchRow}>
        <TouchableOpacity
          style={s.searchField}
          activeOpacity={0.8}
          onPress={onPressSearch}
          accessibilityRole="button"
          accessibilityLabel={searchPlaceholder}
        >
          <EventlyIcon name="magnify" size={21} color={colors.textMuted} />
          <EventlyText variant="body" style={s.searchPlaceholder} numberOfLines={1}>
            {searchPlaceholder}
          </EventlyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.filterButton}
          activeOpacity={0.85}
          onPress={onPressFilters}
          accessibilityRole="button"
          accessibilityLabel="Filters"
        >
          <EventlyIcon name="tune-variant" size={21} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeHeader;
