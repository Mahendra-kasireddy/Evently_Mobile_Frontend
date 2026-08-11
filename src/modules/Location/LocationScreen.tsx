import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyText } from '../../Components';
import { colors } from '../../theme';
import { useLocationContainer } from './container';
import { LocationDetails } from './sections/LocationDetails';
import { LocationErrorState } from './sections/LocationErrorState';
import { styles } from './styles';

export function LocationScreen() {
  const { status, coordinates, errorCode, retry, openSettings } = useLocationContainer();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Location" />

      {status === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <EventlyText variant="body" style={styles.loadingText}>
            Getting your location…
          </EventlyText>
        </View>
      )}

      {status === 'success' && coordinates && <LocationDetails coordinates={coordinates} onRefresh={retry} />}

      {status === 'error' && <LocationErrorState errorCode={errorCode} onRetry={retry} onOpenSettings={openSettings} />}
    </SafeAreaView>
  );
}

export default LocationScreen;
