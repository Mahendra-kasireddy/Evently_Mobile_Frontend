import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { ChatScreen } from '../modules/Chat';
import { HomeScreen } from '../modules/Home';
import { OrganizerHomeScreen } from '../modules/OrganizerHome';
import { PlanScreen } from '../modules/Plan';
import { PublicEventsScreen } from '../modules/PublicEvents';
import { selectIsOrganizerView } from '../store/authSlice';
import { useAppSelector } from '../store/hooks';
import { EventlyTabBar } from './EventlyTabBar';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

/* Defined once, outside render, so the navigator does not see a new bar
   component — and remount it — every time it renders. */
const renderTabBar = (props: BottomTabBarProps) => <EventlyTabBar {...props} />;

export function MainTabNavigator() {
  /*
   * The chosen view, not the role list. An account that holds both roles —
   * anyone who registered as an organizer keeps the customer role too — used to be
   * forced into the organizer dashboard on every login.
   */
  const isOrganizer = useAppSelector(selectIsOrganizerView);
  return (
    <Tab.Navigator
      /* The app's own bar: a floating card, each tab in its own gradient.
         See EventlyTabBar. */
      tabBar={renderTabBar}
      screenOptions={{ headerShown: false }}
    >
      {/* The organizer dashboard replaces the customer feed only while the
          organizer view is active — switched from Profile. Plan/Chat stay
          shared for now. */}
      <Tab.Screen
        name="Home"
        component={isOrganizer ? OrganizerHomeScreen : HomeScreen}
      />
      <Tab.Screen name="Plan" component={PlanScreen} />
      {/* Public events — shows, workshops and nights out with tickets. The
          customer's own bookings, and the tickets bought here, are on the
          Bookings screen, reached from the menu. */}
      <Tab.Screen name="Events" component={PublicEventsScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      {/* Profile is not a tab. It is one destination reached from one place —
          the avatar at the top of Home — and a tab for it spent a fifth of the
          bar on a screen nobody navigates between. It lives on the root stack
          now, where it pushes and pops like the screens it leads to. */}
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
