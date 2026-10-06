import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import {
  EventlyButton,
  EventlyIcon,
  EventlyText,
  EventlyTextInput,
  KeyboardAvoider,
} from '../../../Components';
import { REG_ACCENT, REG_GREEN_DARK, REGISTER_COPY, SIGNUP_COPY as COPY } from '../constants';
import { screenStyles, signupStyles as s } from '../styles';
import type { OnboardingConfigDTO, OrganizerSignupDetails } from '../types';

interface SignupDetailsSectionProps {
  config: OnboardingConfigDTO | null;
  configLoading: boolean;
  configError: boolean;
  onRetryConfig: () => void;
  submitting: boolean;
  error: string | null;
  onSubmit: (details: OrganizerSignupDetails) => void;
}

const EMPTY: OrganizerSignupDetails = {
  firstName: '',
  lastName: '',
  businessName: '',
  primaryCategory: '',
  city: '',
};

/**
 * The whole organizer sign-up: five details, one screen.
 *
 * This is deliberately all that stands before the dashboard. Documents,
 * services, portfolio and bank details are a checklist the organizer works
 * through from there, at their own pace — asking for a PAN card before
 * someone has seen what they are signing up for is where sign-ups are lost.
 */
export function SignupDetailsSection({
  config,
  configLoading,
  configError,
  onRetryConfig,
  submitting,
  error,
  onSubmit,
}: SignupDetailsSectionProps) {
  const [details, setDetails] = useState<OrganizerSignupDetails>(EMPTY);
  const [showRequired, setShowRequired] = useState(false);
  const set = (key: keyof OrganizerSignupDetails) => (value: string) => {
    setDetails(prev => ({ ...prev, [key]: value }));
    setShowRequired(false);
  };

  const trimmed: OrganizerSignupDetails = {
    firstName: details.firstName.trim(),
    lastName: details.lastName.trim(),
    businessName: details.businessName.trim(),
    primaryCategory: details.primaryCategory,
    city: details.city,
  };
  const isComplete =
    trimmed.firstName.length > 0 &&
    trimmed.lastName.length > 0 &&
    trimmed.businessName.length >= 2 &&
    trimmed.primaryCategory !== '' &&
    trimmed.city !== '';

  const submit = () => {
    if (!isComplete) {
      setShowRequired(true);
      return;
    }
    onSubmit(trimmed);
  };

  if (configLoading && !config) {
    return (
      <View style={screenStyles.centerFill}>
        <ActivityIndicator color={REG_ACCENT} />
      </View>
    );
  }

  if (configError && !config) {
    return (
      <View style={screenStyles.centerFill}>
        <EventlyText variant="body" style={screenStyles.centerText}>
          {REGISTER_COPY.configFailed}
        </EventlyText>
        <EventlyButton title={REGISTER_COPY.retry} onPress={onRetryConfig} accentColor={REG_ACCENT} />
      </View>
    );
  }

  return (
    <KeyboardAvoider style={s.flex}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <EventlyText variant="h1" style={s.title}>
          {COPY.title}
        </EventlyText>
        <EventlyText variant="body" style={s.subtitle}>
          {COPY.subtitle}
        </EventlyText>

        <View style={s.row}>
          <View style={[s.field, s.half]}>
            <EventlyText variant="subtitle" style={s.label}>
              {COPY.firstName}
            </EventlyText>
            <EventlyTextInput
              style={s.input}
              value={details.firstName}
              onChangeText={set('firstName')}
              autoCapitalize="words"
              textContentType="givenName"
              maxLength={60}
            />
          </View>
          <View style={[s.field, s.half]}>
            <EventlyText variant="subtitle" style={s.label}>
              {COPY.lastName}
            </EventlyText>
            <EventlyTextInput
              style={s.input}
              value={details.lastName}
              onChangeText={set('lastName')}
              autoCapitalize="words"
              textContentType="familyName"
              maxLength={60}
            />
          </View>
        </View>

        <View style={s.field}>
          <EventlyText variant="subtitle" style={s.label}>
            {COPY.businessName}
          </EventlyText>
          <EventlyTextInput
            style={s.input}
            value={details.businessName}
            onChangeText={set('businessName')}
            placeholder={COPY.businessPlaceholder}
            autoCapitalize="words"
            textContentType="organizationName"
            maxLength={120}
          />
        </View>

        <ChipGroup
          label={COPY.category}
          options={(config?.categories ?? []).map(c => ({ key: c.key, label: c.label }))}
          value={details.primaryCategory}
          onChange={set('primaryCategory')}
        />

        <ChipGroup
          label={COPY.city}
          options={(config?.cities ?? []).map(c => ({ key: c, label: c }))}
          value={details.city}
          onChange={set('city')}
        />

        <View style={s.note}>
          <EventlyIcon name="clock-outline" size={16} color={REG_GREEN_DARK} />
          <EventlyText variant="caption" style={s.noteText}>
            {COPY.laterNote}
          </EventlyText>
        </View>

        {showRequired || error ? (
          <EventlyText variant="body" style={s.error}>
            {showRequired ? COPY.required : error}
          </EventlyText>
        ) : null}

        <EventlyButton
          title={COPY.cta}
          onPress={submit}
          loading={submitting}
          accentColor={REG_ACCENT}
          style={s.button}
        />
      </ScrollView>
    </KeyboardAvoider>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ key: string; label: string }>;
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <View style={s.field}>
      <EventlyText variant="subtitle" style={s.label}>
        {label}
      </EventlyText>
      <View style={s.chips} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map(option => {
          const on = option.key === value;
          return (
            <Pressable
              key={option.key}
              style={[s.chip, on && s.chipOn]}
              onPress={() => onChange(option.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
            >
              <EventlyText variant="caption" style={[s.chipText, on && s.chipTextOn]}>
                {option.label}
              </EventlyText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default SignupDetailsSection;
