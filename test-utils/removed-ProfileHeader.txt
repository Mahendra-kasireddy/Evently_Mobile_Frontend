import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { PROFILE_COPY as COPY } from '../constants';
import { profileHeaderStyles as s } from '../styles';
import type { ProfileViewModel } from '../types';

/**
 * Who is signed in.
 *
 * An account with no name shows a prompt rather than a stand-in — the old
 * fallback printed the literal word "there", borrowed from a greeting, as if
 * it were the person's name.
 */
export function ProfileHeader({ data }: { data: ProfileViewModel }) {
  const named = data.displayName.length > 0;

  return (
    <View style={s.card}>
      <View style={s.avatar}>
        <EventlyText variant="h1" style={s.avatarText}>
          {data.initials}
        </EventlyText>
      </View>

      <EventlyText variant="h2" style={[s.name, !named && s.namePrompt]} numberOfLines={2}>
        {named ? data.displayName : COPY.noName}
      </EventlyText>

      {data.roles.length > 0 ? (
        <View style={s.roles}>
          {data.roles.map((role) => (
            <View key={role} style={s.roleChip}>
              <EventlyText variant="caption" style={s.roleChipText}>
                {role}
              </EventlyText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default ProfileHeader;
