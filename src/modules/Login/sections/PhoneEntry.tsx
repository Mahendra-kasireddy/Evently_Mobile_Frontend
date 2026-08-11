import { useState } from 'react';
import { View } from 'react-native';
import { EventlyButton, EventlyText, EventlyTextInput } from '../../../Components';
import { DIAL_CODE, LOGIN_ACCENT, LOGIN_FORM_COPY } from '../constants';
import { formCardStyles, phoneEntryStyles } from '../styles';

interface PhoneEntryProps {
  phone: string;
  onChangePhone: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function PhoneEntry({ phone, onChangePhone, onSubmit, isSubmitting }: PhoneEntryProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <EventlyText variant="h2" style={formCardStyles.title}>
        {LOGIN_FORM_COPY.title}
      </EventlyText>
      <EventlyText variant="body" style={formCardStyles.subtitle}>
        {LOGIN_FORM_COPY.subtitle}
      </EventlyText>

      <View style={phoneEntryStyles.container}>
        <EventlyText variant="subtitle" style={phoneEntryStyles.label}>
          {LOGIN_FORM_COPY.mobileLabel}
        </EventlyText>
        <View style={[phoneEntryStyles.controlRow, focused && phoneEntryStyles.controlRowFocused]}>
          <EventlyText variant="subtitle" style={phoneEntryStyles.dialCode}>
            {DIAL_CODE}
          </EventlyText>
          <EventlyTextInput
            style={phoneEntryStyles.input}
            placeholder={LOGIN_FORM_COPY.placeholder}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={onChangePhone}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus
          />
        </View>
        <EventlyButton
          title={LOGIN_FORM_COPY.sendCta}
          onPress={onSubmit}
          loading={isSubmitting}
          accentColor={LOGIN_ACCENT}
          style={phoneEntryStyles.button}
        />
      </View>
    </View>
  );
}

export default PhoneEntry;
