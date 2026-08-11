import { View } from 'react-native';
import { EventlyButton, EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { locationErrorStyles } from '../styles';
import { getStatusCopy } from '../utils';
import type { LocationErrorCode } from '../types';

interface LocationErrorStateProps {
  errorCode: LocationErrorCode | null;
  onRetry: () => void;
  onOpenSettings: () => void;
}

export function LocationErrorState({ errorCode, onRetry, onOpenSettings }: LocationErrorStateProps) {
  const copy = getStatusCopy(errorCode);
  const handlePress = copy.action === 'openSettings' ? onOpenSettings : onRetry;

  return (
    <View style={locationErrorStyles.container}>
      <EventlyIcon name="map-marker-off-outline" size={48} color={colors.textMuted} />
      <EventlyText variant="h2" style={locationErrorStyles.title}>
        {copy.title}
      </EventlyText>
      <EventlyText variant="body" style={locationErrorStyles.message}>
        {copy.message}
      </EventlyText>

      <EventlyButton title={copy.actionLabel} onPress={handlePress} style={locationErrorStyles.actionButton} />
    </View>
  );
}

export default LocationErrorState;
