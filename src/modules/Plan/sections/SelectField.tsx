import { TouchableOpacity } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { PLAN_TEXT_MUTED } from '../constants';
import { eventDetailsStyles } from '../styles';

interface SelectFieldProps {
  icon: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  focused?: boolean;
}

/** A tappable field that opens a picker — the mobile-native equivalent of a
 * web dropdown/chip row: one compact row with a trailing chevron. */
export function SelectField({ icon, value, placeholder, onPress, focused = false }: SelectFieldProps) {
  return (
    <TouchableOpacity
      style={[eventDetailsStyles.controlRow, focused && eventDetailsStyles.controlRowFocused]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={placeholder}
    >
      <EventlyIcon name={icon} size={16} color={PLAN_TEXT_MUTED} />
      <EventlyText variant="body" style={value ? eventDetailsStyles.dateValue : eventDetailsStyles.dateValuePlaceholder} numberOfLines={1}>
        {value || placeholder}
      </EventlyText>
      <EventlyIcon name="chevron-down" size={18} color={PLAN_TEXT_MUTED} />
    </TouchableOpacity>
  );
}

export default SelectField;
