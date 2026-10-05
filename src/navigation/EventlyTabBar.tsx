import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText, GradientFill } from '../Components';

/** Each tab's look: its gradient, and its icon filled and outlined. */
const TAB_LOOK: Record<
  string,
  {
    gradient: [string, string];
    ink: string;
    on: string;
    off: string;
    label: string;
  }
> = {
  Home: {
    gradient: ['#ff8a5c', '#e8433a'],
    ink: '#e2552f',
    on: 'home-variant',
    off: 'home-variant-outline',
    label: 'Home',
  },
  Plan: {
    gradient: ['#a084ff', '#5a35e0'],
    ink: '#6d4df2',
    on: 'clipboard-text',
    off: 'clipboard-text-outline',
    label: 'Plan',
  },
  Events: {
    gradient: ['#3cc9a1', '#0e8a68'],
    ink: '#0f8a68',
    on: 'ticket-confirmation',
    off: 'ticket-confirmation-outline',
    label: 'Events',
  },
  Chat: {
    gradient: ['#5b9bff', '#2554b8'],
    ink: '#2b5aa8',
    on: 'chat-processing',
    off: 'chat-processing-outline',
    label: 'Chat',
  },
};

const FALLBACK = TAB_LOOK.Home;
const MUTED = '#8a93a3';

function TabButton({
  routeName,
  label,
  focused,
  onPress,
  onLongPress,
}: {
  routeName: string;
  label: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const look = TAB_LOOK[routeName] ?? FALLBACK;
  /* The gradient pill springs in on the tab that becomes current. */
  const grow = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(grow, {
      toValue: focused ? 1 : 0,
      friction: 7,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [focused, grow]);

  return (
    <Pressable
      style={s.tab}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      testID={`tab-${routeName}`}
    >
      <View style={s.iconSlot}>
        <Animated.View
          style={[
            s.pill,
            {
              opacity: grow,
              transform: [
                {
                  scale: grow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <GradientFill colors={look.gradient} direction="diagonal" />
        </Animated.View>
        <EventlyIcon
          name={focused ? look.on : look.off}
          size={22}
          color={focused ? '#ffffff' : MUTED}
        />
      </View>
      <EventlyText
        variant="caption"
        style={[s.label, focused && s.labelOn, focused && { color: look.ink }]}
        numberOfLines={1}
      >
        {label}
      </EventlyText>
    </Pressable>
  );
}

/**
 * The app's bottom bar: a floating white card, each tab with its own colour.
 *
 * The current tab's icon sits on its gradient pill, white and filled; the rest
 * are muted outlines, so where you are is the one bright thing on the bar.
 * Presses follow React Navigation's own contract — emit `tabPress`, respect a
 * prevented default — so screens that listen for a re-tap still hear it.
 */
export function EventlyTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={s.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const options = descriptors[route.key]?.options ?? {};
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : TAB_LOOK[route.name]?.label ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          const onLongPress = () =>
            navigation.emit({ type: 'tabLongPress', target: route.key });

          return (
            <TabButton
              key={route.key}
              routeName={route.name}
              label={label}
              focused={focused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  /* The strip under the card matches the app's canvas, so the card floats. */
  wrap: { backgroundColor: '#faf8f7', paddingHorizontal: 14, paddingTop: 6 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 66,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#1a2e5a',
        shadowOpacity: 0.1,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 10 },
    }),
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  iconSlot: {
    width: 52,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  label: { color: MUTED, fontSize: 11, lineHeight: 14, fontWeight: '500' },
  labelOn: { fontWeight: '700' },
});

export default EventlyTabBar;
