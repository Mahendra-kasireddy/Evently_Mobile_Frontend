import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { MemoriesBlock } from '../../../modules/Invitation/sections/MemoriesBlock';
import { MemoryViewer } from '../../../modules/Invitation/sections/MemorySheets';
import { INVITATION_COPY as COPY } from '../constants';
import type { MemoriesPanel } from '../editors';
import { ORG_ACCENT, ORG_INK } from '../design';
import { styles as base, memoriesStyles as s } from '../styles';

/**
 * Shared memories, the organizer's narrow view: the same gallery the customer
 * sees (tabs, grid, full-screen viewer), plus adding their own. No download,
 * no moderation — those are the customer's.
 */
export function MemoriesStep({ m }: { m: MemoriesPanel }) {
  const chooseAdd = () =>
    Alert.alert(COPY.memAddTitle, undefined, [
      { text: COPY.memAddLibrary, onPress: () => m.add('library') },
      { text: COPY.memAddCamera, onPress: () => m.add('photo') },
      { text: COPY.memAddReel, onPress: () => m.add('reel') },
      { text: COPY.cancel, style: 'cancel' },
    ]);

  if (m.off) {
    return (
      <View style={s.off}>
        <EventlyIcon name="lock-outline" size={26} color={ORG_INK.inkSoft} />
        <AppText variant="h3" style={s.offTitle}>
          {COPY.memOff}
        </AppText>
        <AppText variant="bodySmall" style={s.offBody}>
          {m.off}
        </AppText>
        <AppText variant="caption" style={s.offBody}>
          {COPY.memOffBody}
        </AppText>
      </View>
    );
  }

  if (!m.gallery && m.loading) {
    return (
      <View style={s.loading}>
        <ActivityIndicator color={ORG_ACCENT.saffron} />
      </View>
    );
  }

  if (!m.gallery && m.error) {
    return (
      <View style={base.errorBox}>
        <AppText variant="caption" style={base.errorText}>
          {m.error}
        </AppText>
        <Pressable onPress={m.reload} hitSlop={8} accessibilityRole="button">
          <AppText variant="caption" style={base.retry}>
            {COPY.retry}
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={base.stack}>
      {m.adding ? (
        <View style={s.adding}>
          <ActivityIndicator size="small" color={ORG_ACCENT.saffron} />
          <AppText variant="caption" style={s.addingText}>
            {COPY.uploading}
          </AppText>
        </View>
      ) : null}
      <MemoriesBlock
        gallery={m.gallery}
        items={m.items}
        kind={m.kind}
        subEvent={m.subEvent}
        paging={m.paging}
        canUpload={!m.adding}
        say={m.say}
        sayWarn={m.sayWarn}
        onFilter={m.changeFilter}
        onMore={m.loadMore}
        onOpen={m.setViewing}
        onAdd={chooseAdd}
      />
      {m.error ? (
        <AppText variant="caption" style={base.errorText}>
          {m.error}
        </AppText>
      ) : null}
      <AppText variant="caption" style={base.note}>
        {COPY.memOwnerNote}
      </AppText>
      <MemoryViewer
        items={m.items}
        index={m.viewing}
        canDownload={false}
        onIndex={m.setViewing}
        onClose={() => m.setViewing(-1)}
        onDownload={() => undefined}
      />
    </View>
  );
}

export default MemoriesStep;
