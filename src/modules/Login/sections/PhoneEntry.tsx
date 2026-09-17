import { useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  EventlyIcon,
  EventlyText,
  EventlyTextInput,
} from '../../../Components';
import { brand } from '../../../theme';
import { MOBILE_LENGTH, PHONE_COPY } from '../constants';
import { fieldStyles } from '../styles';
import { formatMobile, sanitizeDigits } from '../utils';
import { DialCodeSheet } from './DialCodeSheet';

interface PhoneEntryProps {
  phone: string;
  dialCode: string;
  onChangePhone: (value: string) => void;
  onChangeDialCode: (code: string) => void;
}

/**
 * The number field — a real input, so tapping it brings up the phone keypad
 * the person already knows, with their own paste and autofill.
 *
 * What is stored is bare digits and what is shown is grouped 5 + 5, so the
 * value is formatted on the way out and stripped on the way back in. Stripping
 * is what makes backspace work across the space: deleting it leaves ten digits
 * minus one, which re-formats without it.
 */
export function PhoneEntry({
  phone,
  dialCode,
  onChangePhone,
  onChangeDialCode,
}: PhoneEntryProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <>
      <View
        style={[fieldStyles.phoneRow, focused && fieldStyles.phoneRowFocused]}
        testID="phone-field"
      >
        <Pressable
          style={fieldStyles.dialButton}
          onPress={() => setSheetOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`Country code ${dialCode}. Change`}
          testID="dial-code-button"
        >
          <EventlyText style={fieldStyles.dialCode}>{dialCode}</EventlyText>
          <EventlyIcon name="chevron-down" size={16} color={brand.navy} />
        </Pressable>

        <View style={fieldStyles.divider} />

        <EventlyTextInput
          style={fieldStyles.input}
          value={formatMobile(phone)}
          onChangeText={value =>
            onChangePhone(sanitizeDigits(value, MOBILE_LENGTH))
          }
          placeholder={PHONE_COPY.placeholder}
          placeholderTextColor={brand.textPlaceholder}
          keyboardType="number-pad"
          returnKeyType="done"
          // One more than the ten digits, for the space the grouping adds.
          maxLength={MOBILE_LENGTH + 1}
          autoComplete="tel"
          textContentType="telephoneNumber"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={PHONE_COPY.a11yField}
          testID="phone-input"
        />
      </View>

      <DialCodeSheet
        visible={sheetOpen}
        selected={dialCode}
        onSelect={code => {
          onChangeDialCode(code);
          setSheetOpen(false);
        }}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}

export default PhoneEntry;
