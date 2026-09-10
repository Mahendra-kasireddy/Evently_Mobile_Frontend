import { TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { BOOKING_TAB_LABEL } from '../constants';
import { eventTabsStyles as s } from '../styles';
import type { BookingTab } from '../types';

interface EventTabsProps {
  value: BookingTab;
  onChange: (tab: BookingTab) => void;
  counts: Record<BookingTab, number>;
}

const TABS: BookingTab[] = ['active', 'past'];

/**
 * Active / Past.
 *
 * Both pills are always offered, even when one side is empty: a customer whose
 * only event has finished still needs to be told that is where it went, and a
 * tab row that appears and disappears with the data is harder to trust than
 * one that is simply there. The count is spoken rather than printed — it is
 * useful to a screen reader deciding whether to move, and clutter on a chip.
 */
export function EventTabs({ value, onChange, counts }: EventTabsProps) {
  return (
    <View style={s.row} accessibilityRole="tablist">
      {TABS.map((tab) => {
        const on = value === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[s.tab, on && s.tabOn]}
            activeOpacity={0.8}
            onPress={() => onChange(tab)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${BOOKING_TAB_LABEL[tab]}, ${counts[tab]}`}
          >
            <EventlyText variant="caption" style={[s.tabText, on && s.tabTextOn]}>
              {BOOKING_TAB_LABEL[tab]}
            </EventlyText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default EventTabs;
