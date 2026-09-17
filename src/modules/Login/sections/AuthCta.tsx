import { ActivityIndicator, Pressable } from 'react-native';
import { EventlyText } from '../../../Components';
import { brand } from '../../../theme';
import { ctaStyles } from '../styles';

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
 * It is deliberately not `EventlyButton`: that component's disabled state is a
 * 50% fade of the accent, which on this screen sat directly above a keypad and
 * read as "tap me". Here the inert state is a filled neutral chip whose label
 * is the instruction.
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
      {loading ? (
        <ActivityIndicator color={brand.onAccent} />
      ) : (
        <EventlyText style={[ctaStyles.label, !ready && ctaStyles.labelIdle]}>
          {ready ? readyLabel : idleLabel}
        </EventlyText>
      )}
    </Pressable>
  );
}

export default AuthCta;
