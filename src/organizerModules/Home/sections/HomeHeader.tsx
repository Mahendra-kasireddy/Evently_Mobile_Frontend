import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, EventlyIcon } from '../../../Components';
import { useEnsureLocation } from '../../../hooks/useEnsureLocation';
import { homeHeaderStyles as l } from '../../../modules/Home/styles';
import type { RootStackParamList } from '../../../navigation/types';
import {
  selectLocationPlace,
  selectLocationStatus,
} from '../../../store/locationSlice';
import { useAppSelector } from '../../../store/hooks';
import { NotificationBell } from '../../Navigation/sections/NotificationBell';
import { HOME_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { headerStyles as s } from '../styles';

/**
 * Home's header: where the organizer is — the area big, the city under it,
 * a chevron that says it changes — and the bell. The customer Home's header,
 * on the same location the whole app shares.
 */
export function HomeHeader() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Shared with the customer side and the Location screen: read at most once
  // per session, refreshed when the app comes back.
  useEnsureLocation();
  const place = useAppSelector(selectLocationPlace);
  const status = useAppSelector(selectLocationStatus);

  const title =
    place?.locality ??
    place?.label ??
    (status === 'loading' ? COPY.locating : COPY.setLocation);
  const subtitle = place?.locality ? place?.region ?? '' : '';

  return (
    <View style={s.wrap}>
      <TouchableOpacity
        style={l.location}
        activeOpacity={0.75}
        onPress={() => navigation.navigate('Location')}
        accessibilityRole="button"
        accessibilityLabel={
          place
            ? `Location: ${[title, subtitle]
                .filter(Boolean)
                .join(', ')}. Change`
            : COPY.setLocation
        }
      >
        <View style={l.locationRow}>
          <View style={l.pin}>
            <EventlyIcon
              name="map-marker"
              size={14}
              color={ORG_ACCENT.saffron}
            />
          </View>
          <AppText variant="h3" style={l.locationTitle} numberOfLines={1}>
            {title}
          </AppText>
          <EventlyIcon name="chevron-down" size={18} color={ORG_INK.ink} />
        </View>
        {subtitle ? (
          <AppText variant="caption" style={l.locationSub} numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </TouchableOpacity>
      <NotificationBell />
    </View>
  );
}

export default HomeHeader;
