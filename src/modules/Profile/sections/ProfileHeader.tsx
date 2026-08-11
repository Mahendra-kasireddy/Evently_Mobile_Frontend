import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { profileHeaderStyles } from '../styles';
import type { ProfileViewModel } from '../types';

interface ProfileHeaderProps {
  data: ProfileViewModel;
}

export function ProfileHeader({ data }: ProfileHeaderProps) {
  return (
    <View style={profileHeaderStyles.container}>
      <View style={profileHeaderStyles.avatar}>
        <EventlyText variant="h1" style={profileHeaderStyles.avatarText}>
          {data.initials}
        </EventlyText>
      </View>
      <EventlyText variant="h2" style={profileHeaderStyles.name}>
        {data.displayName}
      </EventlyText>
      <View style={profileHeaderStyles.roleBadge}>
        <EventlyText variant="caption" style={profileHeaderStyles.roleBadgeText}>
          {data.role}
        </EventlyText>
      </View>
    </View>
  );
}

export default ProfileHeader;
