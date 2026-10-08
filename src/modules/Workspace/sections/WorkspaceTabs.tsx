import { useEffect, useRef } from 'react';
import { ScrollView, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import { EventlyIcon, EventlyText, GradientFill, PressableScale } from '../../../Components';
import { WORKSPACE_ACTION_GRADIENT } from '../constants';
import { heroStyles as s } from '../premium.styles';
import type { WorkspaceTab, WorkspaceTabItem } from '../types';

interface WorkspaceTabsProps {
  tabs: WorkspaceTabItem[];
  tab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  /** Suffix for test ids, so the pinned copy and the in-page copy differ. */
  idSuffix?: string;
}

/**
 * The workspace's destinations, as pills — the chosen one lit in the action
 * gradient.
 *
 * The row scrolls sideways (three pills with their marks come to more than a
 * phone is wide), and it scrolls itself so the chosen pill is always fully in
 * view: tapping "Guest invitations" used to leave half of it off the right
 * edge, as if it had not been selected at all.
 */
export function WorkspaceTabs({ tabs, tab, onSelectTab, idSuffix = '' }: WorkspaceTabsProps) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const layouts = useRef<Record<string, { x: number; width: number }>>({});

  const reveal = (key: WorkspaceTab, animated: boolean) => {
    const box = layouts.current[key];
    if (!box) return;
    // Centre the chosen pill where the row allows; the ScrollView clamps the ends.
    const x = Math.max(0, box.x + box.width / 2 - width / 2);
    scrollRef.current?.scrollTo({ x, animated });
  };

  useEffect(() => {
    reveal(tab, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, width]);

  const onTabLayout = (key: WorkspaceTab) => (e: LayoutChangeEvent) => {
    layouts.current[key] = { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width };
    if (key === tab) reveal(key, false);
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.tabsRow}
    >
      {tabs.map(item => {
        const active = item.key === tab;
        return (
          <PressableScale
            key={item.key}
            onLayout={onTabLayout(item.key)}
            style={[s.tab, active && s.tabActive]}
            onPress={() => onSelectTab(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            testID={`workspace-tab-${item.key}${idSuffix}`}
          >
            {active ? <GradientFill colors={WORKSPACE_ACTION_GRADIENT} direction="across" /> : null}
            <EventlyIcon name={item.icon} size={16} color={active ? '#ffffff' : '#6b6488'} />
            <EventlyText variant="body" style={[s.tabLabel, active && s.tabLabelActive]} numberOfLines={1}>
              {item.label}
            </EventlyText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

export default WorkspaceTabs;
