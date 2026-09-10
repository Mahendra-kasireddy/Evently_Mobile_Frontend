import { TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { PROFILE_COPY as COPY } from '../constants';
import { identityStyles as s } from '../styles';
import type { ProfileViewModel } from '../types';

interface ProfileIdentityProps {
  profile: ProfileViewModel;
  /** Opens Settings, which is where these details are actually changed. */
  onEdit: () => void;
}

/**
 * Who is signed in.
 *
 * The name is a prompt rather than a stand-in when the account has none — an
 * account with nothing filled in should ask for a name, not display one it
 * invented. The number below it is masked in the middle; see maskPhone.
 */
export function ProfileIdentity({ profile, onEdit }: ProfileIdentityProps) {
  const named = !!profile.displayName;

  return (
    <View style={s.row}>
      <View style={s.avatar}>
        <EventlyText variant="subtitle" style={s.avatarText}>
          {profile.initials}
        </EventlyText>
      </View>

      <View style={s.text}>
        <EventlyText variant="h1" style={[s.name, !named && s.namePrompt]} numberOfLines={1}>
          {named ? profile.displayName : COPY.noName}
        </EventlyText>
        {profile.maskedPhone ? (
          <EventlyText variant="body" style={s.phone} numberOfLines={1}>
            {profile.maskedPhone}
          </EventlyText>
        ) : null}
      </View>

      <TouchableOpacity
        style={s.edit}
        activeOpacity={0.8}
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel="Edit your details"
      >
        <EventlyText variant="body" style={s.editText}>
          {COPY.edit}
        </EventlyText>
      </TouchableOpacity>
    </View>
  );
}

export default ProfileIdentity;
