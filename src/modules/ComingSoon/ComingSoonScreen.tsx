import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyButton, EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import {
  COMING_SOON_ACCENT,
  COMING_SOON_ACCENT_WARM,
  COMING_SOON_ROLE_DESCRIPTION,
  COMING_SOON_ROLE_ICON,
  COMING_SOON_ROLE_LABEL,
} from './constants';
import { styles } from './styles';

type ComingSoonNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ComingSoonRouteProp = RouteProp<RootStackParamList, 'ComingSoon'>;

/** Placeholder shown after picking the sub-vendor role on the Join screen — the
 * real sub-vendor onboarding wizard is web-only for now (organizer onboarding
 * has its own native wizard, see modules/OrganizerOnboarding). A single "Back to log in"
 * button is the only way out — no separate header back arrow, to avoid two
 * different-but-similar-looking ways back on the same screen. */
export function ComingSoonScreen() {
  const navigation = useNavigation<ComingSoonNavigationProp>();
  const { params } = useRoute<ComingSoonRouteProp>();
  const { role } = params;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <EventlyIcon name={COMING_SOON_ROLE_ICON[role]} size={40} color={COMING_SOON_ACCENT_WARM} />
        </View>

        <EventlyText variant="subtitle" style={styles.roleLabel}>
          {COMING_SOON_ROLE_LABEL[role]}
        </EventlyText>
        <EventlyText variant="h1" style={styles.heading}>
          Coming soon
        </EventlyText>
        <EventlyText variant="body" style={styles.description}>
          {COMING_SOON_ROLE_DESCRIPTION[role]}
        </EventlyText>

        <EventlyButton
          title="Back to log in"
          onPress={() => navigation.navigate('Login')}
          accentColor={COMING_SOON_ACCENT}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

export default ComingSoonScreen;
