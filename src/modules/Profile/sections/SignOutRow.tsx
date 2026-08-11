import { TouchableOpacity } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { signOutRowStyles } from '../styles';

interface SignOutRowProps {
  onPress: () => void;
  loading: boolean;
}

export function SignOutRow({ onPress, loading }: SignOutRowProps) {
  return (
    <TouchableOpacity
      style={signOutRowStyles.row}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel="Log out"
    >
      <EventlyIcon name="logout" size={20} color={colors.danger} />
      <EventlyText variant="body" style={signOutRowStyles.text}>
        {loading ? 'Logging out…' : 'Log out'}
      </EventlyText>
    </TouchableOpacity>
  );
}

export default SignOutRow;
