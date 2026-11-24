import { Pressable, ScrollView, View } from 'react-native';
import { AppText } from '../../../Components';
import { PUBLIC_EVENTS_COPY as COPY, WORKSPACE_TABS } from '../constants';
import { tabStyles as s } from '../styles';
import type { WorkspaceTab } from '../types';

/** Overview · Tickets · Attendees · Check-in · Details · Memories & live. */
export function WorkspaceTabs({
  tab,
  onTab,
}: {
  tab: WorkspaceTab;
  onTab: (tab: WorkspaceTab) => void;
}) {
  return (
    <View style={s.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.row}
        accessibilityRole="tablist"
      >
        {WORKSPACE_TABS.map(t => {
          const on = t === tab;
          return (
            <Pressable
              key={t}
              style={[s.tab, on && s.tabOn]}
              onPress={() => onTab(t)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={COPY.tabs[t]}
            >
              <AppText variant="bodySmall" style={[s.text, on && s.textOn]}>
                {COPY.tabs[t]}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default WorkspaceTabs;
