import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import { CONTACT_COPY as COPY, LEGAL_GREEN } from './constants';
import { useContactContainer } from './container';
import { contactStyles as s } from './styles';
import type { ContactDraft } from './types';

interface FieldProps {
  label: string;
  value: string;
  error?: string | undefined;
  first?: boolean;
  multiline?: boolean;
  placeholder?: string;
  keyboard?: 'default' | 'email-address' | 'phone-pad';
  onChange: (value: string) => void;
}

function Field({ label, value, error, first, multiline, placeholder, keyboard, onChange }: FieldProps) {
  return (
    <>
      <EventlyText variant="body" style={[s.label, first && s.labelFirst]}>
        {label}
      </EventlyText>
      <TextInput
        style={[s.input, multiline && s.inputMultiline, !!error && s.inputInvalid]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboard ?? 'default'}
        autoCapitalize={keyboard === 'email-address' ? 'none' : 'sentences'}
        accessibilityLabel={label}
      />
      {error ? (
        <EventlyText variant="caption" style={s.fieldError}>
          {error}
        </EventlyText>
      ) : null}
    </>
  );
}

/**
 * Contact us.
 *
 * This replaces a `mailto:` link. A message sent that way lands in whatever
 * mail app the phone happens to have and nowhere the team can track — while
 * the backend has a real contact module, with subjects, prefill and a stored
 * request the admin console works from. This uses it.
 */
export function ContactScreen() {
  const { draft, setField, subjects, errors, isSending, sendErrorMessage, isSent, send, reset } =
    useContactContainer();

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <AppHeader title={COPY.title} compact />
      <KeyboardAvoidingView style={s.scroll} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          {isSent ? (
            <View style={s.sent}>
              <View style={s.sentIcon}>
                <EventlyIcon name="check-circle" size={30} color={LEGAL_GREEN} />
              </View>
              <EventlyText variant="h2" style={s.sentTitle}>
                {COPY.sentTitle}
              </EventlyText>
              <EventlyText variant="body" style={s.sentBody}>
                {COPY.sentBody}
              </EventlyText>
              <TouchableOpacity
                style={s.sentAgain}
                activeOpacity={0.8}
                onPress={reset}
                accessibilityRole="button"
              >
                <EventlyIcon name="pencil-outline" size={15} color={LEGAL_GREEN} />
                <EventlyText variant="caption" style={s.sentAgainText}>
                  {COPY.sentAgain}
                </EventlyText>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <EventlyText variant="body" style={s.intro}>
                {COPY.intro}
              </EventlyText>

              {/* Name, email and phone arrive already filled from the account. */}
              <Field
                first
                label={COPY.name}
                value={draft.name}
                error={errors.name}
                onChange={(v) => setField('name', v)}
              />
              <Field
                label={COPY.email}
                value={draft.email}
                error={errors.email}
                keyboard="email-address"
                onChange={(v) => setField('email', v)}
              />
              <Field
                label={COPY.phone}
                value={draft.phone}
                error={errors.phone}
                keyboard="phone-pad"
                onChange={(v) => setField('phone', v)}
              />

              <EventlyText variant="body" style={s.label}>
                {COPY.subject}
              </EventlyText>
              <View style={s.subjects}>
                {subjects.map((subject) => {
                  const on = draft.subject === subject.value;
                  return (
                    <TouchableOpacity
                      key={subject.value}
                      style={[s.subject, on && s.subjectOn]}
                      activeOpacity={0.8}
                      onPress={() => setField('subject', subject.value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      accessibilityLabel={subject.label}
                    >
                      <EventlyText variant="caption" style={on ? s.subjectTextOn : s.subjectText}>
                        {subject.label}
                      </EventlyText>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.subject ? (
                <EventlyText variant="caption" style={s.fieldError}>
                  {errors.subject}
                </EventlyText>
              ) : null}

              <Field
                label={COPY.message}
                value={draft.message}
                error={errors.message}
                multiline
                placeholder={COPY.messagePlaceholder}
                onChange={(v) => setField('message', v as ContactDraft['message'])}
              />

              <TouchableOpacity
                style={[s.send, isSending && s.sendDisabled]}
                activeOpacity={0.85}
                disabled={isSending}
                onPress={send}
                accessibilityRole="button"
                accessibilityLabel={COPY.send}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color={colors.onPrimary} />
                ) : (
                  <EventlyIcon name="send" size={18} color={colors.onPrimary} />
                )}
                <EventlyText variant="subtitle" style={s.sendText}>
                  {isSending ? COPY.sending : COPY.send}
                </EventlyText>
              </TouchableOpacity>

              {sendErrorMessage ? (
                <EventlyText variant="caption" style={s.sendError}>
                  {sendErrorMessage}
                </EventlyText>
              ) : null}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ContactScreen;
