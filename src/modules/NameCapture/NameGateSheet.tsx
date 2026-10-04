import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  EventlyButton,
  EventlyIcon,
  EventlyText,
  EventlyTextInput,
  KeyboardAvoider,
} from '../../Components';
import { NAME_GATE_ACCENT, NAME_GATE_COPY, NAME_MAX_LENGTH } from './constants';
import { useNameCaptureContainer } from './container';
import { styles } from './styles';

interface NameGateSheetProps {
  /** Called after the name is successfully saved, so Home can refetch and show it in the greeting. */
  onNameSaved?: () => void;
}

/**
 * Mandatory "what's your name" page, shown until the real backend record has a
 * name. A full page rather than a sheet over Home, and with no back or skip:
 * the only way on is a valid name. The avatar previews the first letter as
 * the person types, so the page answers them rather than sitting still.
 */
export function NameGateSheet({ onNameSaved }: NameGateSheetProps) {
  const {
    isVisible,
    name,
    setName,
    isValid,
    isSubmitting,
    errorMessage,
    submit,
  } = useNameCaptureContainer(onNameSaved);
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);

  const avatarScale = useRef(new Animated.Value(0.85)).current;
  const initialOpacity = useRef(new Animated.Value(0)).current;
  const hasInitial = name.trim().length > 0;

  useEffect(() => {
    if (!isVisible) return;
    avatarScale.setValue(0.85);
    Animated.spring(avatarScale, {
      toValue: 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [isVisible, avatarScale]);

  useEffect(() => {
    Animated.timing(initialOpacity, {
      toValue: hasInitial ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [hasInitial, initialOpacity]);

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
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* The serif heading uses the platform Text: the app's text
                component always swaps in a Poppins face. */}
            <Text style={styles.heading} accessibilityRole="header">
              {NAME_GATE_COPY.heading}
            </Text>
            <EventlyText variant="body" style={styles.subtitle}>
              {NAME_GATE_COPY.subtitle}
            </EventlyText>

            <View style={styles.avatarWrap}>
              <Animated.View
                style={[
                  styles.avatarCircle,
                  { transform: [{ scale: avatarScale }] },
                ]}
              >
                <Animated.View
                  style={[styles.avatarLayer, { opacity: initialOpacity }]}
                >
                  <Text style={styles.avatarInitial}>
                    {name.trim().charAt(0).toUpperCase()}
                  </Text>
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: initialOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                  }}
                >
                  <EventlyIcon name="account" size={64} color="#f2b8a0" />
                </Animated.View>
              </Animated.View>
            </View>

            <EventlyTextInput
              value={name}
              onChangeText={setName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={NAME_GATE_COPY.placeholder}
              autoFocus
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="done"
              maxLength={NAME_MAX_LENGTH}
              onSubmitEditing={submit}
              style={[styles.input, isFocused && styles.inputFocused]}
              accessibilityLabel="Your name"
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
          </ScrollView>
        </KeyboardAvoider>
      </View>
    </Modal>
  );
}

export default NameGateSheet;
