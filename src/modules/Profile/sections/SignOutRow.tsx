import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { PROFILE_COPY as COPY } from '../constants';
import { signOutRowStyles as s } from '../styles';

interface SignOutRowProps {
  onPress: () => void;
  loading: boolean;
}

/** Set apart from the menu: it ends the session rather than going somewhere. */
export function SignOutRow({ onPress, loading }: SignOutRowProps) {
  return (
    <TouchableOpacity
      style={s.button}
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={COPY.signOut}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.danger} />
      ) : (
        <EventlyIcon name="logout" size={18} color={colors.danger} />
      )}
      <EventlyText variant="subtitle" style={s.label}>
        {loading ? COPY.signingOut : COPY.signOut}
      </EventlyText>
    </TouchableOpacity>
  );
}

export default SignOutRow;
