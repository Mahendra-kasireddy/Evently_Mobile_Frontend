import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyIcon,
  GradientFill,
  KeyboardAvoider,
} from '../../Components';
import { colors } from '../../theme';
import {
  EDIT_PROFILE_COPY as EDIT,
  SETTINGS_ACCENT,
  SETTINGS_COPY as COPY,
  SETTINGS_FIELDS,
  SETTINGS_GREEN,
} from './constants';
import { useEditProfileContainer } from './container';
import { initialsOf } from './utils';
import { styles } from './styles';

const AVATAR_GRADIENT: [string, string] = ['#ff8a5c', '#7c5cdb'];

/**
 * Edit profile — the customer's own details, and their photo.
 *
 * The photo saves the moment it is chosen; the text fields save together with
 * the button. Phone is shown but not editable: it is the account's identity.
 */
export function EditProfileScreen() {
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
    photoUrl,
    photoBusy,
    photoError,
    changePhoto,
  } = useEditProfileContainer();
  // A photo that fails to load falls back to the initials, not a blank disc.
  const [failedUrl, setFailedUrl] = useState('');

  const header = <AppHeader title={EDIT.title} compact />;

  if (isLoading && !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText variant="body" style={styles.loadingText}>
            {COPY.loading}
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <AppText variant="h2" style={styles.errorTitle}>
            {COPY.errorTitle}
          </AppText>
          <AppText variant="body" style={styles.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </AppText>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={SETTINGS_ACCENT} />
            <AppText variant="caption" style={styles.retryText}>
              {COPY.retry}
            </AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) return null;

  const emailInvalid = saveErrorMessage === 'invalid-email';
  const showPhoto = !!photoUrl && failedUrl !== photoUrl;

  const askForPhoto = () =>
    Alert.alert(EDIT.photoSheetTitle, undefined, [
      { text: EDIT.takePhoto, onPress: () => changePhoto('camera') },
      { text: EDIT.chooseFromLibrary, onPress: () => changePhoto('library') },
      { text: EDIT.cancel, style: 'cancel' },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {header}
      <KeyboardAvoider style={styles.scroll}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        >
          {/* The photo, front and centre, with one clear way to change it. */}
          <View style={styles.photoSection}>
            <TouchableOpacity
              style={styles.avatarRing}
              activeOpacity={0.85}
              onPress={askForPhoto}
              disabled={photoBusy}
              accessibilityRole="button"
              accessibilityLabel={showPhoto ? EDIT.changePhoto : EDIT.addPhoto}
              testID="edit-profile-photo"
            >
              <View style={styles.avatar}>
                {showPhoto ? (
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.avatarImage}
                    onError={() => setFailedUrl(photoUrl)}
                  />
                ) : (
                  <>
                    <GradientFill
                      colors={AVATAR_GRADIENT}
                      direction="diagonal"
                    />
                    <AppText style={styles.avatarInitials}>
                      {initialsOf(user.name)}
                    </AppText>
                  </>
                )}
                {photoBusy ? (
                  <View style={styles.avatarBusy}>
                    <ActivityIndicator color="#ffffff" />
                  </View>
                ) : null}
              </View>
              <View style={styles.cameraBadge}>
                <EventlyIcon name="camera" size={16} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={askForPhoto}
              disabled={photoBusy}
              hitSlop={8}
              accessibilityRole="button"
            >
              <AppText style={styles.photoAction}>
                {photoBusy
                  ? EDIT.uploading
                  : showPhoto
                  ? EDIT.changePhoto
                  : EDIT.addPhoto}
              </AppText>
            </TouchableOpacity>
            <AppText variant="caption" style={styles.photoHint}>
              {EDIT.photoHint}
            </AppText>
            {photoError ? (
              <AppText variant="caption" style={styles.saveError}>
                {photoError}
              </AppText>
            ) : null}
          </View>

          <AppText variant="overline" style={styles.sectionTitle}>
            {COPY.detailsSection}
          </AppText>

          <View style={styles.card}>
            {SETTINGS_FIELDS.map((field, index) => (
              <View
                key={field.key}
                style={[styles.field, index === 0 && styles.fieldFirst]}
              >
                <AppText variant="body" style={styles.label}>
                  {field.label}
                </AppText>
                {field.hint ? (
                  <AppText variant="caption" style={styles.hint}>
                    {field.hint}
                  </AppText>
                ) : null}
                <TextInput
                  style={[
                    styles.input,
                    field.key === 'email' &&
                      emailInvalid &&
                      styles.inputInvalid,
                  ]}
                  value={draft[field.key]}
                  onChangeText={value => setField(field.key, value)}
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
                <EventlyIcon
                  name="phone-outline"
                  size={18}
                  color={SETTINGS_ACCENT}
                />
              </View>
              <View style={styles.phoneText}>
                <AppText variant="caption" style={styles.hint}>
                  {COPY.phoneLabel}
                </AppText>
                <AppText variant="body" style={styles.phoneValue}>
                  {user.phone}
                </AppText>
              </View>
              {user.phone ? (
                <View style={styles.verified}>
                  <EventlyIcon
                    name={
                      user.phoneVerified
                        ? 'check-decagram'
                        : 'alert-circle-outline'
                    }
                    size={15}
                    color={
                      user.phoneVerified ? SETTINGS_GREEN : colors.textMuted
                    }
                  />
                  <AppText
                    variant="label"
                    style={[
                      styles.verifiedText,
                      {
                        color: user.phoneVerified
                          ? SETTINGS_GREEN
                          : colors.textMuted,
                      },
                    ]}
                  >
                    {user.phoneVerified ? COPY.verified : COPY.unverified}
                  </AppText>
                </View>
              ) : null}
            </View>
            <AppText variant="caption" style={styles.phoneNote}>
              {COPY.phoneNote}
            </AppText>
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
              <AppText variant="h3" style={styles.saveText}>
                {COPY.save}
              </AppText>
            )}
          </TouchableOpacity>

          {saveErrorMessage ? (
            <AppText variant="caption" style={styles.saveError}>
              {emailInvalid ? COPY.invalidEmail : saveErrorMessage}
            </AppText>
          ) : null}

          {justSaved ? (
            <View style={styles.savedRow}>
              <EventlyIcon
                name="check-circle"
                size={16}
                color={SETTINGS_GREEN}
              />
              <AppText variant="caption" style={styles.savedText}>
                {COPY.saved}
              </AppText>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoider>
    </SafeAreaView>
  );
}

export default EditProfileScreen;
