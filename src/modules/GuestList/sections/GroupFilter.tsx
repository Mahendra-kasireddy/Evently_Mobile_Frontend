import { ScrollView, TouchableOpacity } from 'react-native';
import { EventlyText } from '../../../Components';
import { filterStyles as s } from '../styles';
import type { GroupFilterOption, GuestGroup } from '../types';

interface GroupFilterProps {
  options: GroupFilterOption[];
  /** Null is "Everyone". */
  active: GuestGroup | null;
  onChange: (group: GuestGroup | null) => void;
}

/**
 * Everyone, Family, Friends, Work.
 *
 * Every chip is always offered, including an empty one: a row whose chips
 * appeared and vanished as guests were filed would move under the host's
 * thumb, and "Work (0)" is a useful answer to "who have I invited from work".
 */
export function GroupFilter({ options, active, onChange }: GroupFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={s.scroll}
      contentContainerStyle={s.row}
    >
      {options.map((option) => {
        const on = option.key === active;
        return (
          <TouchableOpacity
            key={option.key ?? 'everyone'}
            style={[s.chip, on && s.chipOn]}
            activeOpacity={0.85}
            onPress={() => onChange(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${option.label}, ${option.count}`}
          >
            <EventlyText variant="label" style={on ? s.chipTextOn : s.chipText}>
              {option.label}
            </EventlyText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default GroupFilter;
