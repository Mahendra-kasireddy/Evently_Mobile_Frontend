import type { KeyboardTypeOptions } from 'react-native';
import { View } from 'react-native';
import { EventlyText, EventlyTextInput } from '../../../Components';
import { fieldStyles } from '../styles';

interface FieldTextProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  optional?: boolean;
  multiline?: boolean;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

/** The one labeled text-field row every onboarding step uses, so validation errors render consistently. */
export function FieldText({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  optional = false,
  multiline = false,
  maxLength,
  keyboardType,
  autoCapitalize,
}: FieldTextProps) {
  return (
    <View style={fieldStyles.group}>
      <EventlyText variant="subtitle" style={fieldStyles.label}>
        {label} {optional ? <EventlyText variant="caption" style={fieldStyles.optional}>(optional)</EventlyText> : null}
      </EventlyText>
      <EventlyTextInput
        style={[multiline ? fieldStyles.textarea : fieldStyles.input, error ? fieldStyles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'sentences'}
      />
      {error ? (
        <EventlyText variant="caption" style={fieldStyles.error}>
          {error}
        </EventlyText>
      ) : null}
    </View>
  );
}

export default FieldText;
