import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookingScreen } from '../modules/Booking';
import { ComingSoonScreen } from '../modules/ComingSoon';
import { InvitationScreen } from '../modules/Invitation';
import { JoinScreen } from '../modules/Join';
import { LegalSupportScreen } from '../modules/LegalSupport';
import { LocationScreen } from '../modules/Location';
import { LoginScreen } from '../modules/Login';
import { NotificationScreen } from '../modules/Notification';
import { OnboardingScreen } from '../modules/Onboarding';
import { SettingsScreen } from '../modules/Settings';
import { SplashScreen } from '../modules/Splash';
import { selectAuthToken, selectIsAuthHydrated } from '../store/authSlice';
import { selectHasSeenOnboarding, selectIsOnboardingHydrated } from '../store/onboardingSlice';
import { useAppSelector } from '../store/hooks';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const token = useAppSelector(selectAuthToken);
  const isAuthHydrated = useAppSelector(selectIsAuthHydrated);
  const hasSeenOnboarding = useAppSelector(selectHasSeenOnboarding);
  const isOnboardingHydrated = useAppSelector(selectIsOnboardingHydrated);

  if (!isAuthHydrated || !isOnboardingHydrated) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Bookings" component={BookingScreen} />
          <Stack.Screen name="Invitations" component={InvitationScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="LegalSupport" component={LegalSupportScreen} />
        </>
      ) : (
        <>
          {hasSeenOnboarding ? null : <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Join" component={JoinScreen} />
          <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
