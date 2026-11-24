import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import {
  ArtworkViewer,
  InvitationArtwork,
  artworkOf as guestArtworkOf,
} from '../../../modules/Invitation/sections/InvitationArtwork';
import { INVITATION_COPY as COPY } from '../constants';
import type { ArtworkEditor } from '../editors';
import { ORG_ACCENT } from '../design';
import { artworkStyles as s, styles as base } from '../styles';
import type { OrganizerInvitationDTO } from '../types';
import { lengthLabel, toGuestInvitation } from '../utils';
import { SecondaryButton } from './Buttons';

/**
 * The finished invitation: what is uploaded, shown the way the customer sees
 * it, and Upload image / Upload video / Remove. Each change saves at once.
 */
export function ArtworkStep({
  invitation,
  a,
}: {
  invitation: OrganizerInvitationDTO;
  a: ArtworkEditor;
}) {
  const [viewing, setViewing] = useState(false);
  const artwork = useMemo(
    () => guestArtworkOf(toGuestInvitation(invitation)),
    [invitation],
  );
  const busy = a.busy !== null;

  const confirmRemove = () =>
    Alert.alert(COPY.artworkRemoveTitle, COPY.artworkRemoveBody, [
      { text: COPY.cancel, style: 'cancel' },
      { text: COPY.artworkRemove, style: 'destructive', onPress: a.remove },
    ]);

  return (
    <View style={base.stack}>
      {artwork ? (
        <View>
          <InvitationArtwork
            artwork={artwork}
            onView={() => setViewing(true)}
          />
          {artwork.kind === 'video' && lengthLabel(artwork.seconds) ? (
            <AppText variant="caption" style={s.meta}>
              {COPY.videoLength(lengthLabel(artwork.seconds))}
            </AppText>
          ) : null}
        </View>
      ) : (
        <Pressable
          style={s.empty}
          onPress={a.uploadImage}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel={COPY.artworkImage}
        >
          {a.busy === 'image' || a.busy === 'video' ? (
            <ActivityIndicator color={ORG_ACCENT.saffron} />
          ) : (
            <EventlyIcon
              name="cloud-upload-outline"
              size={30}
              color={ORG_ACCENT.saffron}
            />
          )}
          <AppText variant="h3" style={s.emptyTitle}>
            {busy ? COPY.uploading : COPY.artworkEmptyTitle}
          </AppText>
          <AppText variant="caption" style={s.emptyBody}>
            {COPY.artworkEmptyBody}
          </AppText>
        </Pressable>
      )}

      <View style={s.actions}>
        <SecondaryButton
          title={
            artwork?.kind === 'image'
              ? COPY.artworkReplaceImage
              : COPY.artworkImage
          }
          icon="image-outline"
          onPress={a.uploadImage}
          loading={a.busy === 'image'}
          disabled={busy}
        />
        <SecondaryButton
          title={
            artwork?.kind === 'video'
              ? COPY.artworkReplaceVideo
              : COPY.artworkVideo
          }
          icon="video-outline"
          onPress={a.uploadVideo}
          loading={a.busy === 'video'}
          disabled={busy}
        />
        {artwork ? (
          <SecondaryButton
            title={COPY.artworkRemove}
            icon="trash-can-outline"
            onPress={confirmRemove}
            loading={a.busy === 'remove'}
            disabled={busy}
            danger
          />
        ) : null}
      </View>

      {a.error ? (
        <View style={base.errorBox} accessibilityLiveRegion="polite">
          <AppText variant="caption" style={base.errorText}>
            {a.error}
          </AppText>
        </View>
      ) : a.message ? (
        <View style={base.okBox} accessibilityLiveRegion="polite">
          <AppText variant="caption" style={base.okText}>
            {a.message}
          </AppText>
        </View>
      ) : null}

      <AppText variant="caption" style={base.note}>
        {`${COPY.imageNote} ${COPY.videoMax(a.maxSeconds)}`}
      </AppText>

      <ArtworkViewer
        visible={viewing}
        artwork={artwork}
        onClose={() => setViewing(false)}
      />
    </View>
  );
}

export default ArtworkStep;
