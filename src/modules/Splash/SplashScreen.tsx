import { ActivityIndicator, View } from 'react-native';
import { EventlyText } from '../../Components';
import { SPLASH_ACCENT, SPLASH_TAGLINE } from './constants';
import { styles } from './styles';

/** Shown once at cold start while auth/onboarding state hydrates from disk. No data, no navigation. */
export function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.wordmarkRow}>
        <EventlyText style={styles.wordmarkAccent}>e</EventlyText>
        <EventlyText style={styles.wordmark}>vently</EventlyText>
      </View>
      <EventlyText variant="body" style={styles.tagline}>
        {SPLASH_TAGLINE}
      </EventlyText>
      <ActivityIndicator size="small" color={SPLASH_ACCENT} style={styles.loader} />
    </View>
  );
}

export default SplashScreen;
