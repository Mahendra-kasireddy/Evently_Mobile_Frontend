import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, AppText } from '../../../Components';
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
      {TABS.map(tab => {
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
            {on ? (
              <View style={s.spark} pointerEvents="none">
                <EventlyIcon name="star-four-points" size={8} color="#ffd38a" />
              </View>
            ) : null}
            <AppText variant="body" style={[s.tabText, on && s.tabTextOn]}>
              {BOOKING_TAB_LABEL[tab]}
            </AppText>
          </TouchableOpacity>
        );
      })}
      {/* A light sprig at the row's end, as on the rest of the screen. */}
      <View style={s.sprig} pointerEvents="none">
        <EventlyIcon name="leaf" size={22} color="rgba(240,150,110,0.35)" />
      </View>
    </View>
  );
}

export default EventTabs;
