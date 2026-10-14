import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { HOME_ACCENT, HOME_INK } from '../design';
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
 * Home all depend on it, so it earns the corner.
 *
 * On the photograph the controls are frosted glass discs with white glyphs;
 * on the canvas (loading and error states) they are plain ink.
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
  const tint = onPhoto ? '#ffffff' : HOME_INK.ink;
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
            <View style={[s.pin, onPhoto && s.pinOnPhoto]}>
              <EventlyIcon
                name="map-marker"
                size={14}
                color={onPhoto ? HOME_ACCENT.marigold : HOME_ACCENT.saffron}
              />
            </View>
            <EventlyText
              style={[s.locationTitle, onPhoto && s.onPhotoText]}
              numberOfLines={1}
            >
              {title}
            </EventlyText>
            <EventlyIcon name="chevron-down" size={18} color={tint} />
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
            hitSlop={4}
          >
            <EventlyIcon name="magnify" size={21} color={tint} />
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
            hitSlop={4}
          >
            <EventlyIcon name="bell-outline" size={21} color={tint} />
            <Badge count={unreadCount} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default HomeHeader;
