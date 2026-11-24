import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { AppText } from '../../../Components';
import { ORG_INK } from '../design';
import { fieldStyles as s } from '../styles';

/** A labelled input with an optional ₹ / % affix, hint and error. */
export function Field({
  label,
  value,
  onChangeText,
  prefix,
  suffix,
  hint,
  error,
  multiline = false,
  containerStyle,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
  error?: string;
  multiline?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'multiline' | 'style'>) {
  return (
    <View style={[s.field, containerStyle]}>
      <AppText variant="label" style={s.label}>
        {label}
      </AppText>
      <View style={[s.box, multiline && s.boxMulti, error ? s.boxError : null]}>
        {prefix ? (
          <AppText variant="body" style={s.affix}>
            {prefix}
          </AppText>
        ) : null}
        <TextInput
          {...rest}
          style={[s.input, multiline && s.inputMulti]}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholderTextColor={ORG_INK.inkFaint}
          accessibilityLabel={label}
        />
        {suffix ? (
          <AppText variant="body" style={s.affix}>
            {suffix}
          </AppText>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" style={s.error}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" style={s.hint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

export default Field;
