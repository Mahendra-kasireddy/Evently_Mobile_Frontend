import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { colors } from '../theme';
import { eventlyTextInputStyles } from './styles';

type EventlyTextInputProps = TextInputProps;

/** The one text input component every screen should use, so inputs stay consistent app-wide. */
export const EventlyTextInput = forwardRef<TextInput, EventlyTextInputProps>(function EventlyTextInputInner(
  { style, ...rest },
  ref,
) {
  return <TextInput ref={ref} style={[eventlyTextInputStyles.base, style]} placeholderTextColor={colors.textMuted} {...rest} />;
});

export default EventlyTextInput;
