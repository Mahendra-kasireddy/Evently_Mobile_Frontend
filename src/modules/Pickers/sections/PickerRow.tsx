import { Pressable, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { brand } from '../../../theme';
import { styles as s } from '../styles';

interface PickerRowProps {
  label: string;
  /** 'history' for a recent, 'city'/'occasion' for a listed option. */
  icon: string;
  selected?: boolean;
  onPress: () => void;
  /** Present only on a recent — a listed city is not something to forget. */
  onForget?: () => void;
  testID?: string;
}

export function PickerRow({
  label,
  icon,
  selected = false,
  onPress,
  onForget,
  testID,
}: PickerRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [s.row, pressed && s.rowPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      testID={testID}
    >
      <EventlyIcon name={icon} size={20} color={brand.textMuted} />
      <EventlyText
        style={[s.rowLabel, selected && s.rowLabelSelected]}
        numberOfLines={1}
      >
        {label}
      </EventlyText>

      {selected ? (
        <EventlyIcon name="check" size={18} color={brand.accent} />
      ) : null}

      {onForget ? (
        <View>
          <Pressable
            style={s.forgetButton}
            onPress={onForget}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${label} from recent searches`}
            hitSlop={8}
          >
            <EventlyIcon name="close" size={16} color={brand.textMuted} />
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
}

export default PickerRow;
