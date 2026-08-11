import { View } from 'react-native';
import { EventlyButton, EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { locationDetailsStyles } from '../styles';
import { formatCoordinates } from '../utils';
import type { LocationCoordinates } from '../types';

interface LocationDetailsProps {
  coordinates: LocationCoordinates;
  onRefresh: () => void;
}

export function LocationDetails({ coordinates, onRefresh }: LocationDetailsProps) {
  return (
    <View style={locationDetailsStyles.card}>
      <View style={locationDetailsStyles.iconBadge}>
        <EventlyIcon name="crosshairs-gps" size={32} color={colors.primary} />
      </View>
      <EventlyText variant="h2" style={locationDetailsStyles.title}>
        Current location
      </EventlyText>
      <EventlyText variant="body" style={locationDetailsStyles.coordinates}>
        {formatCoordinates(coordinates.latitude, coordinates.longitude)}
      </EventlyText>

      <EventlyButton title="Refresh" onPress={onRefresh} variant="outline" style={locationDetailsStyles.refreshButton} />
    </View>
  );
}

export default LocationDetails;
