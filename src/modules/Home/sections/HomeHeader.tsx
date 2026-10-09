import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { HERO_ACCENT_COLOR, HOME_NAVY } from '../constants';
import { homeHeaderStyles as s } from '../styles';

interface HomeHeaderProps {
  /** The area, big — "Kukatpally". '' while there is no place yet. */
  locationTitle: string;
  /** The rest of the place, small — "Hyderabad, Telangana". */
  locationSubtitle: string;
  /** True while the phone is still finding where it is. */
  locating?: boolean;
  unreadCount: number;
  /** True when the header is drawn over the hero photograph. */
  onPhoto?: boolean;
  /** Opens the location screen, to change or refresh the area. */
  onPressLocation: () => void;
  onPressNotifications: () => void;
  /** Opens the search screen, where the results and the filters live. */
  onPressSearch: () => void;
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
 * Where, on the left, the way delivery apps do it — the area big, the city
 * small, a chevron that says it changes. Events, organizers and prices on
 * Home all depend on it, so it earns the corner. Profile moved to the bottom
 * bar, where the account belongs.
 *
 * One row, not two. Search is an icon here rather than a field drawn to look
 * like an input: typing happens on the search screen, where the results and
 * the filters live.
 */
export function HomeHeader({
  locationTitle,
  locationSubtitle,
  locating = false,
  unreadCount,
  onPhoto = false,
  onPressLocation,
  onPressNotifications,
  onPressSearch,
}: HomeHeaderProps) {
  /* On the photo everything is white and each control gets its own tinted
     disc; on the canvas it is navy and unadorned. */
  const tint = onPhoto ? colors.onPrimary : HOME_NAVY;
  const iconButton = [s.iconButton, onPhoto && s.iconButtonOnPhoto];
  const title = locationTitle || (locating ? 'Locating…' : 'Set your location');
  return (
    <View style={s.container}>
      <View style={s.topRow}>
        <TouchableOpacity
          style={s.location}
          activeOpacity={0.75}
          onPress={onPressLocation}
          accessibilityRole="button"
          accessibilityLabel={
            locationTitle
              ? `Location: ${[locationTitle, locationSubtitle]
                  .filter(Boolean)
                  .join(', ')}. Change`
              : 'Set your location'
          }
          testID="home-location"
        >
          <View style={s.locationRow}>
            <EventlyIcon
              name="map-marker"
              size={18}
              color={onPhoto ? '#ffffff' : HERO_ACCENT_COLOR}
            />
            <EventlyText
              style={[s.locationTitle, onPhoto && s.onPhotoText]}
              numberOfLines={1}
            >
              {title}
            </EventlyText>
            <EventlyIcon name="chevron-down" size={20} color={tint} />
          </View>
          {locationSubtitle ? (
            <EventlyText
              style={[s.locationSub, onPhoto && s.onPhotoSub]}
              numberOfLines={1}
            >
              {locationSubtitle}
            </EventlyText>
          ) : null}
        </TouchableOpacity>

        <View style={s.actions}>
          <TouchableOpacity
            style={iconButton}
            onPress={onPressSearch}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <EventlyIcon
              name="magnify"
              size={22}
              color={onPhoto ? HERO_ACCENT_COLOR : tint}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={iconButton}
            onPress={onPressNotifications}
            accessibilityRole="button"
            accessibilityLabel={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : 'Notifications'
            }
          >
            <EventlyIcon
              name="bell-outline"
              size={22}
              color={onPhoto ? '#7c5cdb' : tint}
            />
            <Badge count={unreadCount} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default HomeHeader;
