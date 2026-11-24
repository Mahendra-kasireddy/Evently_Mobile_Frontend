import { TextInput, View, type TextInputProps } from 'react-native';
import { AppText } from '../../../Components';
import { COUPONS_COPY as COPY } from '../constants';
import { ORG_INK } from '../design';
import { formStyles as s } from '../styles';

/** A labelled text field with an optional counter, hint and error. */
export function FormField({
  label,
  value,
  onChangeText,
  max,
  hint,
  error,
  multiline = false,
  code = false,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  max?: number;
  hint?: string;
  error?: string;
  multiline?: boolean;
  /** The coupon code: big, bold and spaced like the ticket it becomes. */
  code?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'multiline'>) {
  return (
    <View style={s.field}>
      <View style={s.labelRow}>
        <AppText variant="bodySmall" style={s.label}>
          {label}
        </AppText>
        {max ? (
          <AppText variant="label" style={s.counter}>
            {COPY.count(value.length, max)}
          </AppText>
        ) : null}
      </View>
      <TextInput
        {...rest}
        style={[
          s.input,
          code && s.inputCode,
          multiline && s.inputMulti,
          error ? s.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        maxLength={max}
        placeholderTextColor={ORG_INK.inkFaint}
        accessibilityLabel={label}
      />
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

export default FormField;
