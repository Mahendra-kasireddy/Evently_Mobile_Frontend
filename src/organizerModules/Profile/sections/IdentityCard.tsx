import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { PROFILE_COPY as COPY } from '../constants';
import { IDENTITY_GRADIENT } from '../design';
import { identityStyles as s } from '../styles';
import type { IdentityModel } from '../types';

/**
 * Who the organizer is to customers, on the customer Profile's gradient card:
 * photo (tap to change), name, category and city, tier and whether the
 * profile is live, and three numbers customers judge by.
 */
export function IdentityCard({
  identity,
  uploading,
  onChangePhoto,
  onEdit,
}: {
  identity: IdentityModel;
  uploading: boolean;
  onChangePhoto: () => void;
  onEdit: () => void;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [identity.photoUrl]);
  const showPhoto = identity.photoUrl !== '' && !failed;

  return (
    <View style={s.card}>
      <GradientFill colors={IDENTITY_GRADIENT} direction="diagonal" />
      <View style={[s.blob, s.blobOne]} pointerEvents="none" />
      <View style={[s.blob, s.blobTwo]} pointerEvents="none" />

      <View style={s.row}>
        <Pressable
          onPress={onChangePhoto}
          disabled={uploading}
          accessibilityRole="button"
          accessibilityLabel={COPY.changePhoto}
        >
          <View style={s.avatarRing}>
            <View style={s.avatar}>
              {uploading ? (
                <ActivityIndicator />
              ) : showPhoto ? (
                <Image
                  source={{ uri: identity.photoUrl }}
                  style={s.avatarImage}
                  onError={() => setFailed(true)}
                />
              ) : (
                <AppText variant="h2" style={s.avatarText}>
                  {identity.initials}
                </AppText>
              )}
            </View>
            <View style={s.camera}>
              <EventlyIcon name="camera" size={13} color="#ffffff" />
            </View>
          </View>
        </Pressable>

        <View style={s.text}>
          <AppText variant="h2" style={s.name} numberOfLines={1}>
            {identity.name}
          </AppText>
          {identity.subtitle ? (
            <AppText variant="caption" style={s.subtitle} numberOfLines={1}>
              {identity.subtitle}
            </AppText>
          ) : null}
          <View style={s.badges}>
            <View style={s.badge}>
              <View style={[s.dot, identity.isLive ? s.dotLive : s.dotOff]} />
              <AppText variant="label" style={s.badgeText}>
                {identity.isLive ? COPY.live : COPY.notLive}
              </AppText>
            </View>
            <View style={s.badge}>
              <EventlyIcon name="medal-outline" size={12} color="#ffffff" />
              <AppText variant="label" style={s.badgeText}>
                {identity.tier}
              </AppText>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={s.edit}
          activeOpacity={0.8}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={COPY.editTitle}
        >
          <EventlyIcon name="pencil-outline" size={13} color="#ffffff" />
          <AppText variant="label" style={s.editText}>
            {COPY.edit}
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={s.stats}>
        <Stat value={identity.rating} label={COPY.rating} />
        <View style={s.statDivider} />
        <Stat value={String(identity.reviews)} label={COPY.reviews} />
        <View style={s.statDivider} />
        <Stat value={String(identity.events)} label={COPY.events} />
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={s.stat} accessible accessibilityLabel={`${label}: ${value}`}>
      <AppText variant="h3" style={s.statValue}>
        {value}
      </AppText>
      <AppText variant="label" style={s.statLabel}>
        {label}
      </AppText>
    </View>
  );
}

export default IdentityCard;
