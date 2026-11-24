import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, KeyboardAvoider } from '../../../Components';
import { INVITATION_COPY as COPY, SECTION_META } from '../constants';
import type { InvitationEditorResult } from '../container';
import type { EditorBase } from '../editors';
import { ORG_ACCENT } from '../design';
import { styles as s } from '../styles';
import type { OrganizerInvitationDTO, SectionId } from '../types';
import { ArtworkStep } from './ArtworkStep';
import { ActionButton } from './Buttons';
import { CountdownStep } from './CountdownStep';
import { DatesStep } from './DatesStep';
import { DetailsStep } from './DetailsStep';
import { MemoriesStep } from './MemoriesStep';
import { StoryStep } from './StoryStep';

/** The editor that saves through the footer, if this section has one. */
function saverFor(
  c: InvitationEditorResult,
  id: SectionId,
): (EditorBase & { blocked?: boolean }) | null {
  switch (id) {
    case 'details':
      return c.details;
    case 'story':
      return { ...c.story, blocked: c.story.uploading };
    case 'dates':
      return c.dates;
    case 'countdown':
      return c.countdown;
    default:
      return null;
  }
}

/**
 * One section, focused: a line on what it is for, its fields, and Save pinned
 * at the bottom (artwork and memories save as they go, so they have none).
 */
export function StepView({
  c,
  id,
  invitation,
}: {
  c: InvitationEditorResult;
  id: SectionId;
  invitation: OrganizerInvitationDTO;
}) {
  const saver = saverFor(c, id);
  const body =
    id === 'artwork' ? (
      <ArtworkStep invitation={invitation} a={c.artwork} />
    ) : id === 'details' ? (
      <DetailsStep d={c.details} />
    ) : id === 'story' ? (
      <StoryStep st={c.story} />
    ) : id === 'dates' ? (
      <DatesStep dt={c.dates} />
    ) : id === 'countdown' ? (
      <CountdownStep cd={c.countdown} />
    ) : (
      <MemoriesStep m={c.memories} />
    );

  return (
    <KeyboardAvoider style={s.container}>
      <ScrollView
        contentContainerStyle={s.stepContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          id === 'memories' ? (
            <RefreshControl
              refreshing={c.memories.loading && !!c.memories.gallery}
              onRefresh={c.memories.reload}
              tintColor={ORG_ACCENT.saffron}
              colors={[ORG_ACCENT.saffron]}
            />
          ) : undefined
        }
      >
        <AppText variant="bodySmall" style={s.blurb}>
          {SECTION_META[id].blurb}
        </AppText>
        {body}
      </ScrollView>
      {saver ? (
        <SafeAreaView edges={['bottom']} style={s.footer}>
          {saver.error ? (
            <View accessibilityLiveRegion="polite">
              <AppText variant="caption" style={s.footerError}>
                {saver.error}
              </AppText>
            </View>
          ) : null}
          <ActionButton
            title={saver.saving ? COPY.saving : COPY.save}
            onPress={saver.save}
            loading={saver.saving}
            disabled={!saver.dirty || !!saver.blocked}
          />
        </SafeAreaView>
      ) : null}
    </KeyboardAvoider>
  );
}

export default StepView;
