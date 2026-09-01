import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { PROFILE_ACCENT, PROFILE_COPY as COPY } from './constants';
import { useProfileContainer } from './container';
import { ProfileHeader } from './sections/ProfileHeader';
import { ProfileInfoList } from './sections/ProfileInfoList';
import { ProfileMenuList, type ProfileMenuItem } from './sections/ProfileMenuList';
import { SignOutRow } from './sections/SignOutRow';
import { ViewSwitch } from './sections/ViewSwitch';
import { styles } from './styles';

/**
 * The customer's account.
 *
 * Destinations are grouped by what they are for — the customer's events, and
 * the account itself — rather than listed as one undifferentiated column, and
 * the role switch is kept out of that list because it changes what the app is
 * rather than navigating within it.
 */
export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    profile,
    isLoading,
    isError,
    errorMessage,
    isLoggingOut,
    logout,
    refetch,
    canUseOrganizerView,
    isOrganizerView,
    toggleView,
  } = useProfileContainer();

  const eventItems: ProfileMenuItem[] = [
    {
      key: 'bookings',
      icon: 'calendar-check-outline',
      label: COPY.bookings,
      hint: COPY.bookingsHint,
      onPress: () => navigation.navigate('Bookings'),
    },
    {
      key: 'invitations',
      icon: 'email-heart-outline',
      label: COPY.invitations,
      hint: COPY.invitationsHint,
      onPress: () => navigation.navigate('Invitations'),
    },
  ];

  const accountItems: ProfileMenuItem[] = [
    {
      key: 'settings',
      icon: 'cog-outline',
      label: COPY.settings,
      hint: COPY.settingsHint,
      onPress: () => navigation.navigate('Settings'),
    },
    {
      key: 'legal',
      icon: 'shield-check-outline',
      label: COPY.legal,
      hint: COPY.legalHint,
      onPress: () => navigation.navigate('LegalSupport'),
    },
  ];

  if (isLoading && !profile) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary} />
        <EventlyText variant="body" style={styles.loadingText}>
          {COPY.loading}
        </EventlyText>
      </SafeAreaView>
    );
  }

  if (isError && !profile) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <EventlyText variant="h2" style={styles.errorTitle}>
          {COPY.errorTitle}
        </EventlyText>
        <EventlyText variant="body" style={styles.errorText}>
          {errorMessage ?? 'Something went wrong.'}
        </EventlyText>
        <TouchableOpacity style={styles.retryButton} activeOpacity={0.8} onPress={refetch} accessibilityRole="button">
          <EventlyIcon name="refresh" size={16} color={PROFILE_ACCENT} />
          <EventlyText variant="caption" style={styles.retryText}>
            {COPY.retry}
          </EventlyText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={COPY.title} showBackButton={false} compact />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {profile ? (
          <>
            <ProfileHeader data={profile} />
            <ProfileInfoList data={profile} />
          </>
        ) : null}

        {/* Only for accounts that actually hold the organizer role. */}
        {canUseOrganizerView ? (
          <ViewSwitch isOrganizerView={isOrganizerView} onPress={toggleView} />
        ) : null}

        <ProfileMenuList title={COPY.sectionEvents} items={eventItems} />
        <ProfileMenuList title={COPY.sectionAccount} items={accountItems} />

        <SignOutRow onPress={logout} loading={isLoggingOut} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileScreen;
