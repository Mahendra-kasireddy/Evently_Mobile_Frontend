import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';

interface EventlyIconProps {
  name: string;
  size?: number;
  color?: string;
}

/** The one icon component every screen should use, so the icon set stays consistent and swappable in one place. */
export function EventlyIcon({ name, size = 24, color = colors.text }: EventlyIconProps) {
  return <Icon name={name} size={size} color={color} />;
}

export default EventlyIcon;
