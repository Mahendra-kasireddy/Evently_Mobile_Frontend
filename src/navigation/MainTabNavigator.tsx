import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon } from '../Components';
import { BookingScreen } from '../modules/Booking';
import { BOOKING_ACCENT } from '../modules/Booking/constants';
import { ChatScreen } from '../modules/Chat';
import { HomeScreen } from '../modules/Home';
import { OrganizerHomeScreen } from '../modules/OrganizerHome';
import { PlanScreen } from '../modules/Plan';
import { selectIsOrganizerView } from '../store/authSlice';
import { useAppSelector } from '../store/hooks';
import { colors } from '../theme';
import type { MainTabParamList } from './types';

const TAB_ICON_NAME: Record<keyof MainTabParamList, string> = {
  Home: 'home',
  Plan: 'clipboard-text',
  Events: 'calendar-month',
  Chat: 'chat',
};

/** The bar's own height, before the home-indicator inset is added to it. */
const TAB_BAR_HEIGHT = 62;

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  routeName: keyof MainTabParamList;
  color: string;
  size: number;
}

function TabIcon({ routeName, color, size }: TabIconProps) {
  return (
    <EventlyIcon name={TAB_ICON_NAME[routeName]} color={color} size={size} />
  );
}

export function MainTabNavigator() {
  /*
   * The chosen view, not the role list. An account that holds both roles —
   * anyone who registered as an organizer keeps the customer role too — used to be
   * forced into the organizer dashboard on every login.
   */
  const isOrganizer = useAppSelector(selectIsOrganizerView);
  /*
   * A taller bar than the platform default, and the home-indicator inset on
   * top of it rather than inside it: setting an explicit height turns off the
   * navigator's own inset handling, so the labels would sit under the
   * indicator on a notched phone.
   */
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        /*
         * Coral, not the theme's indigo. Every customer surface in this app is
         * built on the web palette's accent, and a tab bar that lit up in a
         * colour appearing nowhere else on the screen read as a different app.
         */
        tabBarActiveTintColor: BOOKING_ACCENT,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        },
        tabBarLabelStyle: { fontSize: 11.5, marginTop: 2 },
        tabBarIconStyle: { marginTop: 2 },
        tabBarIcon: ({ color, size }) => (
          <TabIcon routeName={route.name} color={color} size={size} />
        ),
      })}
    >
      {/* The organizer dashboard replaces the customer feed only while the
          organizer view is active — switched from Profile. Plan/Chat stay
          shared for now. */}
      <Tab.Screen
        name="Home"
        component={isOrganizer ? OrganizerHomeScreen : HomeScreen}
      />
      <Tab.Screen name="Plan" component={PlanScreen} />
      {/* The customer's events, alongside Plan and Chat — shared for now, in
          the same way those are, rather than hidden behind the view switch. */}
      <Tab.Screen name="Events" component={BookingScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      {/* Profile is not a tab. It is one destination reached from one place —
          the avatar at the top of Home — and a tab for it spent a fifth of the
          bar on a screen nobody navigates between. It lives on the root stack
          now, where it pushes and pops like the screens it leads to. */}
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
