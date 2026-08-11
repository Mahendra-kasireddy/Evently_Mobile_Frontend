import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { profileInfoListStyles } from '../styles';
import type { ProfileViewModel } from '../types';

interface ProfileInfoRow {
  icon: string;
  label: string;
  value: string;
}

interface ProfileInfoListProps {
  data: ProfileViewModel;
}

export function ProfileInfoList({ data }: ProfileInfoListProps) {
  const rows: ProfileInfoRow[] = [
    { icon: 'phone-outline', label: 'Phone', value: data.phone },
    { icon: 'map-marker-outline', label: 'City', value: data.city },
    { icon: 'calendar-outline', label: 'Member since', value: data.memberSince },
  ];

  return (
    <View style={profileInfoListStyles.card}>
      {rows.map((row, index) => (
        <View key={row.label} style={[profileInfoListStyles.row, index > 0 && profileInfoListStyles.rowDivider]}>
          <View style={profileInfoListStyles.iconBadge}>
            <EventlyIcon name={row.icon} size={18} color={colors.primary} />
          </View>
          <EventlyText variant="body" style={profileInfoListStyles.label}>
            {row.label}
          </EventlyText>
          <EventlyText variant="body" style={profileInfoListStyles.value} numberOfLines={1}>
            {row.value}
          </EventlyText>
        </View>
      ))}
    </View>
  );
}

export default ProfileInfoList;
