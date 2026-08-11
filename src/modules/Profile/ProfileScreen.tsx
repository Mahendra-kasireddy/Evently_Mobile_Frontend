import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { useProfileContainer } from './container';
import { ProfileHeader } from './sections/ProfileHeader';
import { ProfileInfoList } from './sections/ProfileInfoList';
import { ProfileMenuList, type ProfileMenuItem } from './sections/ProfileMenuList';
import { SignOutRow } from './sections/SignOutRow';
import { styles } from './styles';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, isLoading, isError, errorMessage, isLoggingOut, logout } = useProfileContainer();

  const menuItems: ProfileMenuItem[] = [
    { key: 'bookings', icon: 'calendar-check', label: 'My Bookings', onPress: () => navigation.navigate('Bookings') },
    { key: 'invitations', icon: 'email-fast-outline', label: 'My Invitation', onPress: () => navigation.navigate('Invitations') },
    { key: 'settings', icon: 'cog-outline', label: 'Settings', onPress: () => navigation.navigate('Settings') },
    {
      key: 'legal',
      icon: 'shield-check-outline',
      label: 'Legal & Support',
      onPress: () => navigation.navigate('LegalSupport'),
    },
  ];

  if (isLoading && !profile) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <EventlyText variant="body" style={styles.loadingText}>
          Loading your profile…
        </EventlyText>
      </SafeAreaView>
    );
  }

  if (isError && !profile) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <EventlyText variant="body" style={styles.errorText}>
          {errorMessage ?? 'Something went wrong.'}
        </EventlyText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {profile && (
          <>
            <ProfileHeader data={profile} />
            <ProfileInfoList data={profile} />
          </>
        )}

        <ProfileMenuList items={menuItems} />

        <SignOutRow onPress={logout} loading={isLoggingOut} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
