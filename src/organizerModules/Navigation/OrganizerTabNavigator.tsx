import type { ComponentType } from 'react';
import { StatusBar } from 'react-native';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOME_PAPER } from '../../modules/Home/design';
import { EarningsScreen } from '../Earnings';
import { EnquiriesScreen } from '../Enquiries';
import { EventsScreen } from '../Events';
import { HomeScreen } from '../Home';
import { ProfileScreen } from '../Profile';
import type { OrganizerTabParamList } from '../../navigation/types';
import {
  ORGANIZER_ROUTES,
  ORGANIZER_TABS,
  type OrganizerRouteKey,
} from './constants';
import { EmbeddedWebPage } from './sections/EmbeddedWebPage';
import { OrganizerTabBar } from './sections/OrganizerTabBar';
import { OrganizerTopBar } from './sections/OrganizerTopBar';
import { shellStyles as s } from './styles';

const Tab = createBottomTabNavigator<OrganizerTabParamList>();

const renderTabBar = (props: BottomTabBarProps) => (
  <OrganizerTabBar {...props} />
);

/** A tab whose native screen is not built yet: the native top bar over its web page. */
function webTab(key: OrganizerRouteKey) {
  const route = ORGANIZER_ROUTES[key];
  function WebTab() {
    return (
      <SafeAreaView style={s.screen} edges={['top']}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={HOME_PAPER.canvas}
        />
        <OrganizerTopBar title={route.title} />
        <EmbeddedWebPage path={route.path} mode="tab" />
      </SafeAreaView>
    );
  }
  WebTab.displayName = `OrganizerWebTab(${key})`;
  return WebTab;
}

/**
 * The tabs already rebuilt natively. A tab missing here shows its web page.
 * Moving a tab to native is one line in this map.
 */
const NATIVE_TABS: Partial<Record<keyof OrganizerTabParamList, ComponentType>> =
  {
    OrgHome: HomeScreen,
    OrgEnquiries: EnquiriesScreen,
    OrgEvents: EventsScreen,
    OrgEarnings: EarningsScreen,
    OrgProfile: ProfileScreen,
  };

/* Built once, outside render: a new component per render would remount the tab. */
const TAB_SCREENS = ORGANIZER_TABS.map(tab => ({
  name: tab.name,
  component: NATIVE_TABS[tab.name] ?? webTab(tab.route),
}));

/**
 * The native organizer app: five tabs on the customer app's bar and canvas.
 * Each tab is a native screen once built; until then it shows that page of the
 * web dashboard in place (see ORGANIZER_ROUTES).
 */
export function OrganizerTabNavigator() {
  return (
    <Tab.Navigator tabBar={renderTabBar} screenOptions={{ headerShown: false }}>
      {TAB_SCREENS.map(screen => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Tab.Navigator>
  );
}

export default OrganizerTabNavigator;
