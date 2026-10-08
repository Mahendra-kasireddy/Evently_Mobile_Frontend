import { Animated, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText, PressableScale } from '../../../Components';
import { pinnedStyles as s } from '../premium.styles';
import type { WorkspaceTab, WorkspaceTabItem } from '../types';
import { WorkspaceTabs } from './WorkspaceTabs';

interface PinnedHeaderProps {
  /** 0 hidden, 1 shown — driven by how far the page has scrolled. */
  opacity: Animated.AnimatedInterpolation<number>;
  /** Whether it takes touches; false while it is faded out. */
  active: boolean;
  title: string;
  onBack: () => void;
  tabs: WorkspaceTabItem[];
  tab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
}

/**
 * The header and tabs, pinned to the top once the poster has scrolled away.
 *
 * Scrolling a long Details tab used to take the way back, the event's name
 * and the tabs off the screen with it; reaching another tab meant scrolling
 * all the way up first. This keeps all three in reach: it fades in as the
 * in-page tabs reach the top, and out again on the way back up.
 */
export function PinnedHeader({ opacity, active, title, onBack, tabs, tab, onSelectTab }: PinnedHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <Animated.View
      style={[s.bar, { paddingTop: insets.top + 4, opacity }]}
      pointerEvents={active ? 'auto' : 'none'}
    >
      <View style={s.row}>
        <PressableScale style={s.back} onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back">
          <EventlyIcon name="chevron-left" size={24} color="#1a1f3d" />
        </PressableScale>
        <EventlyText variant="subtitle" style={s.title} numberOfLines={1}>
          {title}
        </EventlyText>
      </View>
      <View style={s.tabs}>
        <WorkspaceTabs tabs={tabs} tab={tab} onSelectTab={onSelectTab} idSuffix="-pinned" />
      </View>
    </Animated.View>
  );
}

export default PinnedHeader;
