import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import {
  SETTINGS_ACCENT,
  SETTINGS_COPY as COPY,
  SETTINGS_FIELDS,
  SETTINGS_GREEN,
} from './constants';
import { useSettingsContainer } from './container';
import { styles } from './styles';

/**
 * Settings.
 *
 * This screen used to hold four toggles — email, push, offers, and "show
 * profile to organizers" — that lived in local state and were forgotten the
 * moment it unmounted. There is no preferences endpoint on either platform, so
 * none of them did anything, and the privacy one implied a control the app
 * does not have. They are gone until something backs them.
 *
 * What remains is what a customer can genuinely change: the details the app
 * uses, saved through PATCH /user/updateProfile.
 */
export function SettingsScreen() {
  const {
    user,
    draft,
    setField,
    isLoading,
    isError,
    errorMessage,
    refetch,
    isSaving,
    saveErrorMessage,
    justSaved,
    canSave,
    save,
  } = useSettingsContainer();

  const header = <AppHeader title={COPY.title} compact />;

  if (isLoading && !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <EventlyText variant="body" style={styles.loadingText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <EventlyText variant="h2" style={styles.errorTitle}>
            {COPY.errorTitle}
          </EventlyText>
          <EventlyText variant="body" style={styles.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
          <TouchableOpacity style={styles.retryButton} activeOpacity={0.8} onPress={refetch} accessibilityRole="button">
            <EventlyIcon name="refresh" size={16} color={SETTINGS_ACCENT} />
            <EventlyText variant="caption" style={styles.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) return null;

  const emailInvalid = saveErrorMessage === 'invalid-email';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {header}
      <KeyboardAvoidingView style={styles.scroll} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        >
          <EventlyText variant="caption" style={styles.sectionTitle}>
            {COPY.detailsSection}
          </EventlyText>

          <View style={styles.card}>
            {SETTINGS_FIELDS.map((field, index) => (
              <View key={field.key} style={[styles.field, index === 0 && styles.fieldFirst]}>
                <EventlyText variant="body" style={styles.label}>
                  {field.label}
                </EventlyText>
                {field.hint ? (
                  <EventlyText variant="caption" style={styles.hint}>
                    {field.hint}
                  </EventlyText>
                ) : null}
                <TextInput
                  style={[styles.input, field.key === 'email' && emailInvalid && styles.inputInvalid]}
                  value={draft[field.key]}
                  onChangeText={(value) => setField(field.key, value)}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textMuted}
                  keyboardType={field.keyboard}
                  autoCapitalize={field.autoCapitalize}
                  accessibilityLabel={field.label}
                />
              </View>
            ))}

            {/* Identity, not a preference: changing it means verifying a new
                number, which this screen deliberately does not pretend to do. */}
            <View style={styles.phoneRow}>
              <View style={styles.phoneIcon}>
                <EventlyIcon name="phone-outline" size={18} color={SETTINGS_ACCENT} />
              </View>
              <View style={styles.phoneText}>
                <EventlyText variant="caption" style={styles.hint}>
                  {COPY.phoneLabel}
                </EventlyText>
                <EventlyText variant="body" style={styles.phoneValue}>
                  {user.phone}
                </EventlyText>
              </View>
              {user.phone ? (
                <View style={styles.verified}>
                  <EventlyIcon
                    name={user.phoneVerified ? 'check-decagram' : 'alert-circle-outline'}
                    size={15}
                    color={user.phoneVerified ? SETTINGS_GREEN : colors.textMuted}
                  />
                  <EventlyText
                    variant="caption"
                    style={[
                      styles.verifiedText,
                      { color: user.phoneVerified ? SETTINGS_GREEN : colors.textMuted },
                    ]}
                  >
                    {user.phoneVerified ? COPY.verified : COPY.unverified}
                  </EventlyText>
                </View>
              ) : null}
            </View>
            <EventlyText variant="caption" style={styles.phoneNote}>
              {COPY.phoneNote}
            </EventlyText>
          </View>

          <TouchableOpacity
            style={[styles.save, !canSave && styles.saveDisabled]}
            activeOpacity={0.85}
            disabled={!canSave}
            onPress={save}
            accessibilityRole="button"
            accessibilityLabel={COPY.save}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <EventlyText variant="subtitle" style={styles.saveText}>
                {COPY.save}
              </EventlyText>
            )}
          </TouchableOpacity>

          {saveErrorMessage ? (
            <EventlyText variant="caption" style={styles.saveError}>
              {emailInvalid ? COPY.invalidEmail : saveErrorMessage}
            </EventlyText>
          ) : null}

          {justSaved ? (
            <View style={styles.savedRow}>
              <EventlyIcon name="check-circle" size={16} color={SETTINGS_GREEN} />
              <EventlyText variant="caption" style={styles.savedText}>
                {COPY.saved}
              </EventlyText>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default SettingsScreen;
