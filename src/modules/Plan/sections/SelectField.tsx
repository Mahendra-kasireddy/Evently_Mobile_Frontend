import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { PLAN_ACCENT, PLAN_TEXT_MUTED } from '../constants';
import { eventDetailsStyles } from '../styles';

interface SelectFieldProps {
  /** The field's name, shown inside the control above its value. */
  caption: string;
  icon: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  focused?: boolean;
  /** Renders lighter and dashed, so an optional field reads as optional. */
  optional?: boolean;
  /** Hidden when the field is one of a pair, where the row is already tight. */
  showChevron?: boolean;
}

/**
 * A tappable field that opens a picker — the mobile-native equivalent of a web
 * dropdown: the field's name, its value, and a trailing chevron.
 *
 * The leading icon turns accent once the field has an answer. It is the
 * cheapest possible progress indicator: with five fields on screen at once, a
 * glance down the column says what is left without reading a word.
 */
export function SelectField({
  caption,
  icon,
  value,
  placeholder,
  onPress,
  focused = false,
  optional = false,
  showChevron = true,
}: SelectFieldProps) {
  const filled = Boolean(value);

  return (
    <TouchableOpacity
      style={[
        eventDetailsStyles.control,
        optional && !filled && eventDetailsStyles.controlOptional,
        focused && eventDetailsStyles.controlRowFocused,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${caption}. ${value || placeholder}`}
    >
      <EventlyText
        variant="caption"
        style={eventDetailsStyles.caption}
        numberOfLines={1}
      >
        {caption}
      </EventlyText>

      <View style={eventDetailsStyles.controlValueRow}>
        <EventlyIcon
          name={icon}
          size={14}
          color={filled ? PLAN_ACCENT : PLAN_TEXT_MUTED}
        />
        <EventlyText
          variant="body"
          style={
            filled
              ? eventDetailsStyles.dateValue
              : eventDetailsStyles.dateValuePlaceholder
          }
          numberOfLines={1}
        >
          {value || placeholder}
        </EventlyText>
        {showChevron ? (
          <EventlyIcon name="chevron-down" size={15} color={PLAN_TEXT_MUTED} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default SelectField;
