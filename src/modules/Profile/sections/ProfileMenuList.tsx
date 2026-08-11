import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { profileMenuListStyles } from '../styles';

export interface ProfileMenuItem {
  key: string;
  icon: string;
  label: string;
  onPress: () => void;
}

interface ProfileMenuListProps {
  items: ProfileMenuItem[];
}

export function ProfileMenuList({ items }: ProfileMenuListProps) {
  return (
    <View style={profileMenuListStyles.card}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.key}
          style={[profileMenuListStyles.row, index > 0 && profileMenuListStyles.rowDivider]}
          onPress={item.onPress}
        >
          <View style={profileMenuListStyles.iconBadge}>
            <EventlyIcon name={item.icon} size={18} color={colors.primary} />
          </View>
          <EventlyText variant="body" style={profileMenuListStyles.label}>
            {item.label}
          </EventlyText>
          <EventlyIcon name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default ProfileMenuList;
