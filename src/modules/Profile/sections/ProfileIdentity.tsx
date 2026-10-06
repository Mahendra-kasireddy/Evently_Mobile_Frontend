import { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, GradientFill } from '../../../Components';
import { PROFILE_COPY as COPY, PROFILE_HEADER_GRADIENT } from '../constants';
import { identityStyles as s } from '../styles';
import type { ProfileViewModel } from '../types';

interface ProfileIdentityProps {
  profile: ProfileViewModel;
  /** Opens Settings, which is where these details are actually changed. */
  onEdit: () => void;
}

/**
 * Who is signed in, on a gradient card.
 *
 * The name is a prompt rather than a stand-in when the account has none — an
 * account with nothing filled in should ask for a name, not display one it
 * invented. The number below it is masked in the middle; see maskPhone.
 */
export function ProfileIdentity({ profile, onEdit }: ProfileIdentityProps) {
  const named = !!profile.displayName;
  // A photo that fails to load falls back to the monogram, not a blank disc.
  const [photoFailed, setPhotoFailed] = useState(false);
  useEffect(() => setPhotoFailed(false), [profile.photoUrl]);
  const showPhoto = profile.photoUrl !== '' && !photoFailed;

  return (
    <View style={s.card}>
      <GradientFill colors={PROFILE_HEADER_GRADIENT} direction="diagonal" />
      {/* Two soft discs for depth — decoration, not content. */}
      <View style={[s.blob, s.blobOne]} pointerEvents="none" />
      <View style={[s.blob, s.blobTwo]} pointerEvents="none" />

      <View style={s.row}>
        <View style={s.avatarRing}>
          <View style={s.avatar}>
            {showPhoto ? (
              <Image
                source={{ uri: profile.photoUrl }}
                style={s.avatarImage}
                onError={() => setPhotoFailed(true)}
                accessibilityLabel={named ? `${profile.displayName}'s photo` : 'Your photo'}
              />
            ) : (
              <EventlyText variant="subtitle" style={s.avatarText}>
                {profile.initials}
              </EventlyText>
            )}
          </View>
        </View>

        <View style={s.text}>
          <EventlyText
            variant="h2"
            style={[s.name, !named && s.namePrompt]}
            numberOfLines={1}
          >
            {named ? profile.displayName : COPY.noName}
          </EventlyText>
          {profile.maskedPhone ? (
            <View style={s.phoneRow}>
              <EventlyIcon name="phone-outline" size={13} color="rgba(255,255,255,0.85)" />
              <EventlyText variant="caption" style={s.phone} numberOfLines={1}>
                {profile.maskedPhone}
              </EventlyText>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          style={s.edit}
          activeOpacity={0.8}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Edit your details"
        >
          <EventlyIcon name="pencil-outline" size={13} color="#ffffff" />
          <EventlyText variant="caption" style={s.editText}>
            {COPY.edit}
          </EventlyText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProfileIdentity;
