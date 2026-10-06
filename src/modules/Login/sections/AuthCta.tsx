import { ActivityIndicator, Pressable, View } from 'react-native';
import { EventlyIcon, EventlyText, GradientFill } from '../../../Components';
import { AUTH_CTA_GRADIENT, ctaStyles } from '../styles';

interface AuthCtaProps {
  /** Shown while the field is incomplete — it names what is missing, e.g. "Enter 10 digits". */
  idleLabel: string;
  readyLabel: string;
  ready: boolean;
  loading: boolean;
  onPress: () => void;
  testID?: string;
}

/**
 * One button, two states, and the inert state still says something useful.
 *
 * A warm gradient pill with an arrow. Not yet actionable, it keeps its shape
 * and colour at a lighter strength, and its label is the instruction ("Enter
 * 10 digits") — a greyed-out button says only "no".
 */
export function AuthCta({
  idleLabel,
  readyLabel,
  ready,
  loading,
  onPress,
  testID,
}: AuthCtaProps) {
  const disabled = !ready || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        ctaStyles.button,
        !ready && ctaStyles.buttonIdle,
        pressed && ready && ctaStyles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={ready ? readyLabel : idleLabel}
      accessibilityState={{ disabled, busy: loading }}
      testID={testID}
    >
      <GradientFill colors={AUTH_CTA_GRADIENT} direction="across" />
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <>
          <EventlyText style={ctaStyles.label}>{ready ? readyLabel : idleLabel}</EventlyText>
          <View style={ctaStyles.arrow}>
            <EventlyIcon name="arrow-right" size={20} color="#ffffff" />
          </View>
        </>
      )}
    </Pressable>
  );
}

export default AuthCta;
