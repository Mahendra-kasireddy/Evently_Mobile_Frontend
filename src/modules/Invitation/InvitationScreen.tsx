import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import { styles } from './styles';

/**
 * No invitation feature exists in the backend yet (matches the web app,
 * which also ships this as a static placeholder). Ready to wire up once
 * a real invitation flow exists.
 */
export function InvitationScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="My Invitation" />
      <View style={styles.centered}>
        <EventlyIcon name="email-fast-outline" size={56} color={colors.textMuted} />
        <EventlyText variant="h2" style={styles.title}>
          No invitation yet
        </EventlyText>
        <EventlyText variant="body" style={styles.subtitle}>
          Once you book an organizer, you can create a beautiful invitation here.
        </EventlyText>
      </View>
    </SafeAreaView>
  );
}

export default InvitationScreen;
