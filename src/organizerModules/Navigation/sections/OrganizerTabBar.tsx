import { View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabButton } from '../../../navigation/EventlyTabBar';
import { ORGANIZER_TABS } from '../constants';
import { tabBarStyles as s } from '../styles';

/**
 * The organizer's bottom bar: the customer bar's floating card and glass-drop
 * tabs (the same TabButton), five tabs and no + — an organizer's actions live
 * on their screens.
 */
export function OrganizerTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={s.bar}>
        {state.routes.map((route, index) => {
          const tab = ORGANIZER_TABS.find(t => t.name === route.name);
          if (!tab) return null;
          const focused = state.index === index;
          return (
            <TabButton
              key={route.key}
              routeName={route.name}
              label={tab.look.label}
              look={tab.look}
              focused={focused}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
            />
          );
        })}
      </View>
    </View>
  );
}

export default OrganizerTabBar;
