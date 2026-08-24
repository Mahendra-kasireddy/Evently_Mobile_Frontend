import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EventlyIcon } from '../Components';
import { ChatScreen } from '../modules/Chat';
import { HomeScreen } from '../modules/Home';
import { OrganizerHomeScreen } from '../modules/OrganizerHome';
import { PlanScreen } from '../modules/Plan';
import { ProfileScreen } from '../modules/Profile';
import { selectAuthRoles } from '../store/authSlice';
import { useAppSelector } from '../store/hooks';
import { colors } from '../theme';
import type { MainTabParamList } from './types';

const TAB_ICON_NAME: Record<keyof MainTabParamList, string> = {
  Home: 'home',
  Plan: 'clipboard-text',
  Chat: 'chat',
  Profile: 'account-circle',
};

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  routeName: keyof MainTabParamList;
  color: string;
  size: number;
}

function TabIcon({ routeName, color, size }: TabIconProps) {
  return <EventlyIcon name={TAB_ICON_NAME[routeName]} color={color} size={size} />;
}

export function MainTabNavigator() {
  const roles = useAppSelector(selectAuthRoles);
  const isOrganizer = roles.includes('organizer');

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => <TabIcon routeName={route.name} color={color} size={size} />,
      })}
    >
      {/* Organizers get their business dashboard here instead of the customer
          home feed — Plan/Chat/Profile stay shared for now. */}
      <Tab.Screen name="Home" component={isOrganizer ? OrganizerHomeScreen : HomeScreen} />
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
