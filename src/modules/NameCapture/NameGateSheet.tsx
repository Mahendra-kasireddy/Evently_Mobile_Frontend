import { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, View } from 'react-native';
import { EventlyButton, EventlyIcon, EventlyText, EventlyTextInput } from '../../Components';
import { NAME_GATE_ACCENT, NAME_GATE_COPY, NAME_MAX_LENGTH } from './constants';
import { useNameCaptureContainer } from './container';
import { styles } from './styles';

interface NameGateSheetProps {
  /** Called after the name is successfully saved, so Home can refetch and show it in the greeting. */
  onNameSaved?: () => void;
}

/**
 * Mandatory, non-dismissible "what should we call you" prompt shown until the
 * real backend record has a name. No backdrop tap, no swipe, no skip button —
 * the only way out is a valid submit. The avatar circle live-previews the
 * first letter as the user types, so the sheet feels responsive rather than
 * like a static form.
 */
export function NameGateSheet({ onNameSaved }: NameGateSheetProps) {
  const { isVisible, name, setName, isValid, isSubmitting, errorMessage, submit } = useNameCaptureContainer(onNameSaved);
  const [isFocused, setIsFocused] = useState(false);

  const avatarScale = useRef(new Animated.Value(0.6)).current;
  const initialOpacity = useRef(new Animated.Value(0)).current;
  const hasInitial = name.trim().length > 0;

  useEffect(() => {
    if (!isVisible) return;
    avatarScale.setValue(0.6);
    Animated.spring(avatarScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();
  }, [isVisible, avatarScale]);

  useEffect(() => {
    Animated.timing(initialOpacity, { toValue: hasInitial ? 1 : 0, duration: 180, useNativeDriver: true }).start();
  }, [hasInitial, initialOpacity]);

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={() => {}} statusBarTranslucent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.avatarWrap}>
              <Animated.View style={[styles.avatarCircle, { transform: [{ scale: avatarScale }] }]}>
                <Animated.View style={[styles.avatarLayer, { opacity: initialOpacity }]}>
                  <EventlyText style={styles.avatarInitial}>{name.trim().charAt(0).toUpperCase()}</EventlyText>
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: initialOpacity.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                  }}
                >
                  <EventlyIcon name="account-outline" size={40} color="#ffffff" />
                </Animated.View>
              </Animated.View>
            </View>

            <EventlyText variant="h1" style={styles.heading}>
              {NAME_GATE_COPY.heading}
            </EventlyText>
            <EventlyText variant="body" style={styles.subtitle}>
              {NAME_GATE_COPY.subtitle}
            </EventlyText>

            <EventlyTextInput
              value={name}
              onChangeText={setName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={NAME_GATE_COPY.placeholder}
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              maxLength={NAME_MAX_LENGTH}
              onSubmitEditing={submit}
              style={[styles.input, isFocused && styles.inputFocused]}
            />

            {errorMessage ? (
              <EventlyText variant="caption" style={styles.errorText}>
                {errorMessage}
              </EventlyText>
            ) : null}

            <EventlyButton
              title={NAME_GATE_COPY.cta}
              onPress={submit}
              loading={isSubmitting}
              disabled={!isValid}
              accentColor={NAME_GATE_ACCENT}
              style={styles.button}
            />

            <EventlyText variant="caption" style={styles.reassurance}>
              {NAME_GATE_COPY.reassurance}
            </EventlyText>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default NameGateSheet;
