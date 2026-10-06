import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SeeAllScreen } from '../modules/Home';
import { AreaPickerScreen, OccasionPickerScreen } from '../modules/Pickers';
import { ConversationScreen } from '../modules/Chat';
import { GuestListScreen } from '../modules/GuestList';
import {
  CompareQuotesScreen,
  LineByLineScreen,
} from '../modules/CompareQuotes';
import { PaymentScreen, PaymentSuccessScreen } from '../modules/Payment';
import { InvitationScreen } from '../modules/Invitation';
import { JoinScreen } from '../modules/Join';
import { ContactScreen, LegalSupportScreen } from '../modules/LegalSupport';
import { LocationScreen } from '../modules/Location';
import { LoginScreen } from '../modules/Login';
import { NotificationScreen } from '../modules/Notification';
import { OrganizerScreen, ReviewsScreen } from '../modules/Organizer';
import { PaymentsScreen } from '../modules/Payments';
import { OnboardingScreen } from '../modules/Onboarding';
import { ProfileScreen } from '../modules/Profile';
import { SavedPackagesScreen } from '../modules/SavedPackages';
import { SearchScreen } from '../modules/Search';
import { SettingsScreen } from '../modules/Settings';
import { SplashScreen } from '../modules/Splash';
import { BookingScreen } from '../modules/Booking';
import { BusinessHomeScreen } from '../modules/BusinessHome';
import { BusinessRegisterScreen } from '../modules/BusinessRegister';
import { UseChoiceScreen } from '../modules/UseChoice';
import { IdeaBoardScreen, WorkspaceScreen } from '../modules/Workspace';
import {
  DigitalTicketScreen,
  EventBookingSuccessScreen,
  EventCheckoutScreen,
  EventMemoriesScreen,
  EventTicketSelectionScreen,
  MyTicketsScreen,
  PublicEventDetailScreen,
  PublicEventLiveScreen,
} from '../modules/PublicEvents';
import {
  selectAuthToken,
  selectIsAuthHydrated,
  selectIsBusinessView,
} from '../store/authSlice';
import {
  selectHasSeenOnboarding,
  selectIsOnboardingHydrated,
} from '../store/onboardingSlice';
import { useAppSelector } from '../store/hooks';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const token = useAppSelector(selectAuthToken);
  const isAuthHydrated = useAppSelector(selectIsAuthHydrated);
  const hasSeenOnboarding = useAppSelector(selectHasSeenOnboarding);
  const isOnboardingHydrated = useAppSelector(selectIsOnboardingHydrated);
  const isBusinessView = useAppSelector(selectIsBusinessView);

  if (!isAuthHydrated || !isOnboardingHydrated) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token && isBusinessView ? (
        /*
         * An organizer or sub-vendor account: the web dashboard and nothing of
         * the customer app. Switching to the customer side (from inside the
         * dashboard) swaps this branch out for the one below.
         */
        <>
          <Stack.Screen name="BusinessHome" component={BusinessHomeScreen} />
          {/* Present in every branch so a registration in progress survives
              the branch swap when its role becomes the active view. */}
          <Stack.Screen name="BusinessRegister" component={BusinessRegisterScreen} />
        </>
      ) : token ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Bookings" component={BookingScreen} />
          <Stack.Screen name="Workspace" component={WorkspaceScreen} />
          <Stack.Screen
            name="PublicEventDetail"
            component={PublicEventDetailScreen}
          />
          <Stack.Screen
            name="EventTicketSelection"
            component={EventTicketSelectionScreen}
          />
          <Stack.Screen name="EventCheckout" component={EventCheckoutScreen} />
          <Stack.Screen
            name="EventBookingSuccess"
            component={EventBookingSuccessScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="EventMemories" component={EventMemoriesScreen} />
          <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
          <Stack.Screen name="DigitalTicket" component={DigitalTicketScreen} />
          <Stack.Screen
            name="PublicEventLive"
            component={PublicEventLiveScreen}
          />
          <Stack.Screen name="IdeaBoard" component={IdeaBoardScreen} />
          <Stack.Screen name="Invitations" component={InvitationScreen} />
          <Stack.Screen name="GuestList" component={GuestListScreen} />
          <Stack.Screen name="SeeAll" component={SeeAllScreen} />
          <Stack.Screen
            name="OccasionPicker"
            component={OccasionPickerScreen}
          />
          <Stack.Screen name="AreaPicker" component={AreaPickerScreen} />
          <Stack.Screen name="SavedPackages" component={SavedPackagesScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="CompareQuotes" component={CompareQuotesScreen} />
          <Stack.Screen name="LineByLine" component={LineByLineScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          {/* No gesture back: behind it is a payment form for a quotation that
              has already been booked. See PaymentSuccessScreen. */}
          <Stack.Screen
            name="PaymentSuccess"
            component={PaymentSuccessScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="Organizer" component={OrganizerScreen} />
          <Stack.Screen name="OrganizerReviews" component={ReviewsScreen} />
          <Stack.Screen name="Conversation" component={ConversationScreen} />
          <Stack.Screen name="Payments" component={PaymentsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="LegalSupport" component={LegalSupportScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          {/* "List your business" from Profile: the same role picker a
              signed-out visitor gets, then registration on this account. */}
          <Stack.Screen name="Join" component={JoinScreen} />
          {/* Also present in the other branches — see BusinessRegisterScreen. */}
          <Stack.Screen name="BusinessRegister" component={BusinessRegisterScreen} />
        </>
      ) : (
        <>
          {hasSeenOnboarding ? null : (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          )}
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* After Login in the list, so a returning signed-out customer still
              opens on sign-in; first run reaches it from Onboarding. */}
          <Stack.Screen name="UseChoice" component={UseChoiceScreen} />
          <Stack.Screen name="Join" component={JoinScreen} />
          {/* Business registration is OTP-first and starts signed out; the same
              screen name is registered in the signed-in branches too, so React
              Navigation keeps this route's state when the in-flow OTP verify
              flips `token` and swaps which branch renders. */}
          <Stack.Screen name="BusinessRegister" component={BusinessRegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
