import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyText } from '../../Components';
import type { JoinRole, RootStackParamList } from '../../navigation/types';
import { JOIN_COPY, ROLE_CARDS } from './constants';
import { RoleCard } from './sections/RoleCard';
import { styles } from './styles';

type JoinNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Web's /join role picker (organizer vs sub-vendor business signup) — mobile only
 * surfaces the entry point + a "coming soon" placeholder for each role. Uses the
 * shared AppHeader for the back arrow, same as every other screen in the app. */
export function JoinScreen() {
  const navigation = useNavigation<JoinNavigationProp>();

  const handleSelectRole = (role: JoinRole) => {
    navigation.navigate('ComingSoon', { role });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={JOIN_COPY.title} />
      <ScrollView contentContainerStyle={styles.content}>
        <EventlyText variant="body" style={styles.subtitle}>
          {JOIN_COPY.subtitle}
        </EventlyText>

        {ROLE_CARDS.map((role) => (
          <RoleCard key={role.key} data={role} onPress={handleSelectRole} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default JoinScreen;
