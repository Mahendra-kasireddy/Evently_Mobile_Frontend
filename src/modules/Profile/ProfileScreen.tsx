import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { PROFILE_ACCENT, PROFILE_COPY as COPY } from './constants';
import { useProfileContainer } from './container';
import { ProfileGroup } from './sections/ProfileGroup';
import { ProfileIdentity } from './sections/ProfileIdentity';
import { styles } from './styles';
import type { ProfileAction } from './types';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * The account, and everything reached from it.
 *
 * Three groups — what the customer's events need, what the account itself
 * holds, and everything else — each row leading to a screen that exists. The
 * two pills carry real counts: how many packages have been saved, and how many
 * invitations are sitting with the customer for approval. A count of zero
 * shows no pill, because a badge reading "0" is noise.
 */
export function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { profile, groups, badges, isLoading, isError, errorMessage, isLoggingOut, logout, refetch } =
    useProfileContainer();

  const openSettings = () => navigation.navigate('Settings');

  const go = (action: ProfileAction) => {
    switch (action) {
      case 'bookings':
        return navigation.navigate('Main', { screen: 'Events' });
      case 'savedPackages':
        return navigation.navigate('SavedPackages');
      case 'invitations':
        return navigation.navigate('Invitations');
      case 'payments':
        return navigation.navigate('Payments');
      case 'location':
        return navigation.navigate('Location');
      case 'notifications':
        return navigation.navigate('Notification');
      case 'settings':
        return openSettings();
      case 'listBusiness':
        // Straight into the organizer wizard: the /join role picker is only
        // registered for signed-out visitors, and this caller is signed in.
        return navigation.navigate('OrganizerOnboarding');
      case 'help':
        return navigation.navigate('LegalSupport');
      case 'signOut':
        // Guarded: a second tap while the first is in flight would fire two
        // logout requests and two session clears.
        if (!isLoggingOut) logout();
        return;
    }
  };

  const badgeFor = (action: ProfileAction): string => {
    if (action === 'savedPackages' && badges.savedPackages > 0) {
      return COPY.savedBadge(badges.savedPackages);
    }
    if (action === 'invitations' && badges.invitationsToApprove > 0) {
      return COPY.approveBadge(badges.invitationsToApprove);
    }
    if (action === 'signOut' && isLoggingOut) return COPY.signingOut;
    return '';
  };

  if (isLoading && !profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PROFILE_ACCENT} />
          <EventlyText variant="body" style={styles.loadingText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && !profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <EventlyText variant="h2" style={styles.errorTitle}>
            {COPY.errorTitle}
          </EventlyText>
          <EventlyText variant="body" style={styles.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={PROFILE_ACCENT} />
            <EventlyText variant="caption" style={styles.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) return <SafeAreaView style={styles.container} edges={['top']} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileIdentity profile={profile} onEdit={openSettings} />
        {groups.map((group) => (
          <ProfileGroup key={group.key} group={group} badgeFor={badgeFor} onPress={go} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
