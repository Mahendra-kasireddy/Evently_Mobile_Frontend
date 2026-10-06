import { TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { chipStyles, fieldStyles } from '../styles';
import type { Option } from '../types';

interface ChipToggleGroupProps {
  label: string;
  options: Option[];
  selected: string[];
  onToggle: (key: string) => void;
  optional?: boolean;
}

/** Multi-select chip row — the mobile-native equivalent of web's checkbox-pill groups (languages, occasions, working days...). */
export function ChipToggleGroup({ label, options, selected, onToggle, optional = false }: ChipToggleGroupProps) {
  return (
    <View style={fieldStyles.group}>
      <EventlyText variant="subtitle" style={fieldStyles.label}>
        {label} {optional ? <EventlyText variant="caption" style={fieldStyles.optional}>(optional)</EventlyText> : null}
      </EventlyText>
      <View style={chipStyles.wrap}>
        {options.map((option) => {
          const active = selected.includes(option.key);
          return (
            <TouchableOpacity
              key={option.key}
              style={[chipStyles.chip, active && chipStyles.chipActive]}
              onPress={() => onToggle(option.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <EventlyText variant="body" style={active ? chipStyles.chipTextActive : chipStyles.chipText}>
                {option.label}
              </EventlyText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default ChipToggleGroup;
