import { View } from 'react-native';
import { EventlyButton, EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { locationDetailsStyles } from '../styles';
import { formatCoordinates } from '../utils';
import type { Place } from '../../../services/geocoding';
import type { LocationCoordinates } from '../types';

interface LocationDetailsProps {
  coordinates: LocationCoordinates;
  place: Place | null;
  /** A read is running behind this card, which is still showing the last one. */
  isRefreshing: boolean;
  onRefresh: () => void;
}

/**
 * Where the customer is, named if it can be named.
 *
 * The coordinates stay on screen once a place name arrives rather than being
 * replaced by it. They are what the app actually read and the only part that
 * is certainly right — the name is one geocoder's opinion of which city those
 * numbers fall in, and a customer who is somewhere the geocoder gets wrong
 * needs to be able to see that the position itself is correct.
 */
export function LocationDetails({
  coordinates,
  place,
  isRefreshing,
  onRefresh,
}: LocationDetailsProps) {
  return (
    <View style={locationDetailsStyles.card}>
      <View style={locationDetailsStyles.iconBadge}>
        <EventlyIcon name="crosshairs-gps" size={32} color={colors.primary} />
      </View>
      <EventlyText variant="h2" style={locationDetailsStyles.title}>
        {place?.label ?? 'Current location'}
      </EventlyText>
      <EventlyText variant="body" style={locationDetailsStyles.coordinates}>
        {formatCoordinates(coordinates.latitude, coordinates.longitude)}
      </EventlyText>

      <EventlyButton
        title={isRefreshing ? 'Updating…' : 'Refresh'}
        onPress={onRefresh}
        disabled={isRefreshing}
        variant="outline"
        style={locationDetailsStyles.refreshButton}
      />
    </View>
  );
}

export default LocationDetails;
