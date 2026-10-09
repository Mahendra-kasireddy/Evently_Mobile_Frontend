import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { BookingScreen } from '../modules/Booking';
import { ChatScreen } from '../modules/Chat';
import { HomeScreen } from '../modules/Home';
import { PlanScreen } from '../modules/Plan';
import { ProfileScreen } from '../modules/Profile';
import { PublicEventsScreen } from '../modules/PublicEvents';
import { EventlyTabBar } from './EventlyTabBar';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

/* Defined once, outside render, so the navigator does not see a new bar
   component — and remount it — every time it renders. */
const renderTabBar = (props: BottomTabBarProps) => <EventlyTabBar {...props} />;

/**
 * The customer app's tabs. Business accounts never see these: the root stack
 * renders BusinessHome (the web dashboard) in their place.
 */
export function MainTabNavigator() {
  return (
    <Tab.Navigator
      /* The app's own bar: a floating card, each tab in its own gradient.
         See EventlyTabBar. */
      tabBar={renderTabBar}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="BookingsTab" component={BookingScreen} />
      {/* Plan is not on the bar — it is "New plan" in the + menu — but stays
          a tab screen, so everything that opens it by name still does. */}
      <Tab.Screen name="Plan" component={PlanScreen} />
      {/* Public events — shows, workshops and nights out with tickets. The
          customer's own bookings, and the tickets bought here, are on the
          Bookings screen, reached from the menu. */}
      <Tab.Screen name="Events" component={PublicEventsScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
      {/* Chat is off the bar — the + menu's "Chat" and every organizer's
          "Message" lead to it — but stays a tab screen so they still can. */}
      <Tab.Screen name="Chat" component={ChatScreen} />
      {/* Profile is not a tab. It is one destination reached from one place —
          the avatar at the top of Home — and a tab for it spent a fifth of the
          bar on a screen nobody navigates between. It lives on the root stack
          now, where it pushes and pops like the screens it leads to. */}
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
