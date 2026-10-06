import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  EventlyIcon,
  EventlyText,
  EventlyTextInput,
  GradientFill,
  KeyboardAvoider,
} from '../../Components';
import {
  NAME_GATE_ACCENT,
  NAME_GATE_COPY as COPY,
  NAME_GATE_CTA_GRADIENT,
  NAME_GATE_TEXT_MUTED,
  NAME_MAX_LENGTH,
} from './constants';
import { useNameCaptureContainer } from './container';
import { styles } from './styles';

interface NameGateSheetProps {
  /** Called after the name and photo are saved, so Home can refetch and show them. */
  onNameSaved?: () => void;
}

/**
 * The mandatory first-sign-in page: a profile photo and a name, both required.
 *
 * A full page rather than a sheet over Home, with no back or skip: the only
 * way on is a photo and a valid name. The photo sits up top inside a "Hi!"
 * greeting, so the page answers the person as soon as they add themselves.
 * Tapping it offers the camera or the library; it uploads straight away.
 */
export function NameGateSheet({ onNameSaved }: NameGateSheetProps) {
  const {
    isVisible,
    name,
    setName,
    photoPreview,
    isUploadingPhoto,
    choosePhoto,
    isValid,
    hasPhoto,
    isSubmitting,
    errorMessage,
    submit,
  } = useNameCaptureContainer(onNameSaved);
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);

  const openPhotoChoices = () => {
    if (isUploadingPhoto) return;
    Alert.alert(COPY.photoSheetTitle, undefined, [
      { text: COPY.takePhoto, onPress: () => choosePhoto('camera') },
      { text: COPY.chooseFromLibrary, onPress: () => choosePhoto('library') },
      { text: COPY.cancel, style: 'cancel' },
    ]);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => {}}
      statusBarTranslucent
    >
      <StatusBar barStyle="dark-content" />
      <View style={[styles.page, { paddingTop: insets.top }]}>
        <KeyboardAvoider style={styles.flex}>
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* The photo, inside a greeting. */}
            <View style={styles.hero}>
              <View style={styles.halo} />
              <Pressable
                onPress={openPhotoChoices}
                style={styles.avatarPress}
                accessibilityRole="button"
                accessibilityLabel={hasPhoto ? COPY.changePhoto : COPY.addPhoto}
                accessibilityHint="Opens the camera or your photo library"
                testID="name-gate-photo"
              >
                <View style={styles.avatarCircle}>
                  {photoPreview ? (
                    <Image source={{ uri: photoPreview }} style={styles.avatarImage} />
                  ) : (
                    <EventlyIcon name="account" size={76} color="#f2b8a0" />
                  )}
                  {isUploadingPhoto ? (
                    <View style={styles.avatarBusy}>
                      <ActivityIndicator color="#ffffff" />
                    </View>
                  ) : null}
                </View>
                <View style={styles.cameraBadge}>
                  <EventlyIcon name="camera" size={16} color="#ffffff" />
                </View>
              </Pressable>

              <View style={styles.bubble} pointerEvents="none">
                <Text style={styles.bubbleText}>{COPY.greeting} 👋</Text>
              </View>
            </View>

            <Pressable onPress={openPhotoChoices} hitSlop={8} style={styles.photoLink}>
              <EventlyText variant="caption" style={styles.photoLinkText}>
                {isUploadingPhoto ? COPY.uploading : hasPhoto ? COPY.changePhoto : COPY.addPhoto}
              </EventlyText>
            </Pressable>

            {/* The serif heading uses the platform Text: the app's text
                component always swaps in a Poppins face. */}
            <Text style={styles.heading} accessibilityRole="header">
              {COPY.heading}
            </Text>
            <EventlyText variant="body" style={styles.subtitle}>
              {COPY.subtitle}
            </EventlyText>

            <View style={[styles.inputRow, isFocused && styles.inputRowFocused]}>
              <EventlyIcon
                name="account-outline"
                size={22}
                color={isFocused ? NAME_GATE_ACCENT : NAME_GATE_TEXT_MUTED}
              />
              <EventlyTextInput
                value={name}
                onChangeText={setName}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={COPY.placeholder}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                returnKeyType="done"
                maxLength={NAME_MAX_LENGTH}
                onSubmitEditing={submit}
                style={styles.input}
                accessibilityLabel="Your name"
                testID="name-gate-input"
              />
            </View>

            {errorMessage ? (
              <EventlyText variant="caption" style={styles.errorText}>
                {errorMessage}
              </EventlyText>
            ) : null}

            {/* Pressable even when incomplete, so a tap says what is missing
                rather than doing nothing; lighter until both are in. */}
            <Pressable
              onPress={submit}
              disabled={isSubmitting || isUploadingPhoto}
              style={({ pressed }) => [
                styles.cta,
                !isValid && styles.ctaIdle,
                pressed && isValid && styles.ctaPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={COPY.cta}
              accessibilityState={{ disabled: !isValid, busy: isSubmitting }}
              testID="name-gate-continue"
            >
              <GradientFill colors={NAME_GATE_CTA_GRADIENT} direction="across" />
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <EventlyText style={styles.ctaLabel}>{COPY.cta}</EventlyText>
                  <View style={styles.ctaArrow}>
                    <EventlyIcon name="arrow-right" size={20} color="#ffffff" />
                  </View>
                </>
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoider>
      </View>
    </Modal>
  );
}

export default NameGateSheet;
