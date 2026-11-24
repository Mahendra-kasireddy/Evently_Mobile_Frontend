import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, EventlyIcon } from '../../../Components';
import { CountdownBlock } from '../../../modules/Invitation/sections/CountdownBlock';
import {
  ArtworkViewer,
  InvitationArtwork,
  artworkOf,
  type Artwork,
} from '../../../modules/Invitation/sections/InvitationArtwork';
import { SaveTheDate } from '../../../modules/Invitation/sections/SaveTheDate';
import { StoryBlock } from '../../../modules/Invitation/sections/StoryBlock';
import { INVITATION_COPY as COPY } from '../constants';
import { ORG_INK, ORG_PAPER } from '../design';
import { previewStyles as s } from '../styles';
import type { OrganizerInvitationDTO } from '../types';
import { toGuestInvitation } from '../utils';

/**
 * The invitation the way guests get it, drawn with the customer app's own
 * invitation sections: the design, the countdown, Save the date and the story.
 */
export function GuestPreview({
  visible,
  invitation,
  onClose,
}: {
  visible: boolean;
  invitation: OrganizerInvitationDTO;
  onClose: () => void;
}) {
  const guest = useMemo(() => toGuestInvitation(invitation), [invitation]);
  const artwork = artworkOf(guest);
  const [viewing, setViewing] = useState<Artwork | null>(null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
        <View style={s.bar}>
          <AppText variant="h3" style={s.title}>
            {COPY.previewTitle}
          </AppText>
          <Pressable
            style={s.close}
            onPress={onClose}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={COPY.close}
          >
            <EventlyIcon name="close" size={22} color={ORG_INK.ink} />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.note}>
            <EventlyIcon name="eye-outline" size={16} color={ORG_INK.inkSoft} />
            <AppText variant="caption" style={s.noteText}>
              {COPY.previewNote}
            </AppText>
          </View>

          {artwork ? (
            <InvitationArtwork
              artwork={artwork}
              onView={() => setViewing(artwork)}
            />
          ) : (
            <View style={s.empty}>
              <EventlyIcon
                name="image-off-outline"
                size={28}
                color={ORG_INK.inkFaint}
              />
              <AppText variant="bodySmall" style={s.emptyText}>
                {COPY.previewNothing}
              </AppText>
            </View>
          )}

          <CountdownBlock countdown={guest.countdown ?? null} />

          <SaveTheDate
            subEvents={guest.subEvents}
            palette={guest.cardPalette}
            defaultMinutes={guest.defaultSubEventMinutes ?? 180}
            invitationName={guest.bookingTitle || guest.occasion}
          />

          <StoryBlock
            cards={guest.storyCards ?? []}
            title={guest.details.storyTitle ?? ''}
            onOpen={imageUrl =>
              setViewing({ kind: 'image', url: imageUrl, seconds: 0 })
            }
          />
        </ScrollView>
      </SafeAreaView>

      <ArtworkViewer
        visible={viewing !== null}
        artwork={viewing}
        onClose={() => setViewing(null)}
      />
    </Modal>
  );
}

export default GuestPreview;
