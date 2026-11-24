import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import {
  EventlyButton,
  EventlyIcon,
  AppText,
  EventlyTextInput,
  KeyboardAvoider,
} from '../../../Components';
import {
  FREELANCER_BUSINESS_TYPE,
  REG_ACCENT,
  REG_GREEN_DARK,
  REGISTER_COPY,
  SIGNUP_COPY as COPY,
} from '../constants';
import { authGateStyles, screenStyles, signupStyles as s } from '../styles';
import type {
  OnboardingConfigDTO,
  OrganizerSignupDetails,
  WorkStyle,
} from '../types';

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
  const [workStyle, setWorkStyle] = useState<WorkStyle | null>(null);
  const [showRequired, setShowRequired] = useState(false);
  const isFreelancer = workStyle === 'freelancer';
  const set = (key: keyof OrganizerSignupDetails) => (value: string) => {
    setDetails(prev => ({ ...prev, [key]: value }));
    setShowRequired(false);
  };

  const firstName = details.firstName.trim();
  const lastName = details.lastName.trim();
  const businessName = details.businessName.trim();
  // A freelancer needs no business: with no brand name, they trade under
  // their own. Tagged 'individual' only where the admin offers that type.
  const offersIndividual = (config?.businessTypes ?? []).some(
    t => t.key === FREELANCER_BUSINESS_TYPE,
  );
  const trimmed: OrganizerSignupDetails = {
    firstName,
    lastName,
    businessName:
      isFreelancer && businessName.length < 2
        ? `${firstName} ${lastName}`
        : businessName,
    primaryCategory: details.primaryCategory,
    city: details.city,
    ...(isFreelancer && offersIndividual
      ? { businessType: FREELANCER_BUSINESS_TYPE }
      : null),
  };
  const isComplete =
    workStyle !== null &&
    firstName.length > 0 &&
    lastName.length > 0 &&
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
        <AppText variant="body" style={screenStyles.centerText}>
          {REGISTER_COPY.configFailed}
        </AppText>
        <EventlyButton
          title={REGISTER_COPY.retry}
          onPress={onRetryConfig}
          accentColor={REG_ACCENT}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoider style={s.flex}>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={authGateStyles.stepChip}>
          <AppText variant="label" style={authGateStyles.stepText}>
            {COPY.step}
          </AppText>
        </View>
        <AppText variant="h1" style={s.title}>
          {COPY.title}
        </AppText>
        <AppText variant="body" style={s.subtitle}>
          {COPY.subtitle}
        </AppText>

        <View style={s.field}>
          <AppText variant="body" weight="medium" style={s.label}>
            {COPY.workStyle}
          </AppText>
          <View
            style={s.row}
            accessibilityRole="radiogroup"
            accessibilityLabel={COPY.workStyle}
          >
            {COPY.workStyles.map(option => {
              const on = option.key === workStyle;
              return (
                <Pressable
                  key={option.key}
                  style={[s.styleTile, on && s.styleTileOn]}
                  onPress={() => {
                    setWorkStyle(option.key);
                    setShowRequired(false);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                >
                  <View style={[s.styleIcon, on && s.styleIconOn]}>
                    <EventlyIcon
                      name={option.icon}
                      size={20}
                      color={on ? '#ffffff' : REG_ACCENT}
                    />
                  </View>
                  <AppText
                    variant="body"
                    style={[s.styleTitle, on && s.styleTitleOn]}
                  >
                    {option.title}
                  </AppText>
                  <AppText variant="caption" style={s.styleBody}>
                    {option.body}
                  </AppText>
                  {on ? (
                    <View style={s.styleCheck}>
                      <EventlyIcon
                        name="check-circle"
                        size={18}
                        color={REG_ACCENT}
                      />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={s.row}>
          <View style={[s.field, s.half]}>
            <AppText variant="body" weight="medium" style={s.label}>
              {COPY.firstName}
            </AppText>
            <EventlyTextInput
              style={s.input}
              value={details.firstName}
              onChangeText={set('firstName')}
              placeholder={COPY.firstNamePlaceholder}
              autoCapitalize="words"
              textContentType="givenName"
              maxLength={60}
            />
          </View>
          <View style={[s.field, s.half]}>
            <AppText variant="body" weight="medium" style={s.label}>
              {COPY.lastName}
            </AppText>
            <EventlyTextInput
              style={s.input}
              value={details.lastName}
              onChangeText={set('lastName')}
              placeholder={COPY.lastNamePlaceholder}
              autoCapitalize="words"
              textContentType="familyName"
              maxLength={60}
            />
          </View>
        </View>

        {/* Shown once they've said how they work: a business names
            itself; a freelancer may add a brand, or go by their own name. */}
        {workStyle ? (
          <View style={s.field}>
            <AppText variant="body" weight="medium" style={s.label}>
              {isFreelancer ? COPY.brandName : COPY.businessName}
            </AppText>
            <EventlyTextInput
              style={s.input}
              value={details.businessName}
              onChangeText={set('businessName')}
              placeholder={
                isFreelancer ? COPY.brandPlaceholder : COPY.businessPlaceholder
              }
              autoCapitalize="words"
              textContentType="organizationName"
              maxLength={120}
            />
            {isFreelancer ? (
              <AppText variant="caption" style={s.hint}>
                {COPY.brandHint}
              </AppText>
            ) : null}
          </View>
        ) : null}

        <ChipGroup
          label={COPY.category}
          options={(config?.categories ?? []).map(c => ({
            key: c.key,
            label: c.label,
          }))}
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
          <AppText variant="caption" style={s.noteText}>
            {COPY.laterNote}
          </AppText>
        </View>

        {showRequired || error ? (
          <AppText variant="body" style={s.error}>
            {showRequired ? COPY.required : error}
          </AppText>
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
      <AppText variant="body" weight="medium" style={s.label}>
        {label}
      </AppText>
      <View
        style={s.chips}
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
      >
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
              <AppText
                variant="caption"
                style={[s.chipText, on && s.chipTextOn]}
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default SignupDetailsSection;
