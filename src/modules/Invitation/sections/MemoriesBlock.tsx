import { ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyImage, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { absoluteFileUrl } from '../../../services/urls';
import {
  INVITATION_COPY as COPY,
  INV_BLUSH_PETAL,
  INV_GOLD,
} from '../constants';
import { memoriesStyles as s } from '../styles';
import { CornerBloom } from '../../../Components';
import type { MemoryDTO, MemoryGalleryDTO } from '../types';

/** `95` → `1:35`. */
function clock(seconds: number): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/** What a state means to the person who added it. '' when it is simply there. */
function noteFor(item: MemoryDTO): string {
  if (item.moderationStatus === 'awaiting') return COPY.memoryPending;
  if (item.moderationStatus === 'rejected') return COPY.memoryRejected;
  if (item.status === 'hidden') return COPY.memoryHidden;
  if (item.visibility === 'uploader') return COPY.memoryOnlyYou;
  return '';
}

/**
 * What the customer sees before the gallery exists.
 *
 * The alternative was what shipped first: nothing at all, with no way to tell
 * an invitation that has no gallery from a screen that failed to load one. The
 * setting is the customer's and this is the customer's app, so the honest
 * answer to "where is it" is the switch itself.
 */
export function MemoriesOffCard({
  busy,
  onEnable,
}: {
  busy: boolean;
  onEnable: () => void;
}) {
  return (
    <View style={s.block} testID="memories-off">
      <View style={s.bloom} pointerEvents="none">
        <CornerBloom size={96} petal={INV_BLUSH_PETAL} stem={INV_GOLD} />
      </View>
      <EventlyText variant="subtitle" style={s.heading}>
        {COPY.memoriesTitle}
      </EventlyText>
      <EventlyText variant="caption" style={s.lead}>
        {COPY.memoriesOffLead}
      </EventlyText>
      <TouchableOpacity
        style={s.add}
        activeOpacity={0.9}
        onPress={onEnable}
        disabled={busy}
        accessibilityRole="button"
        testID="memories-enable"
      >
        <EventlyIcon name="image-multiple-outline" size={18} color={colors.onPrimary} />
        <EventlyText variant="subtitle" style={s.addText}>
          {busy ? COPY.memoryLoading : COPY.memoriesTurnOn}
        </EventlyText>
      </TouchableOpacity>
      <EventlyText variant="caption" style={s.lead}>
        {COPY.memoriesOffNote}
      </EventlyText>
    </View>
  );
}

interface MemoriesBlockProps {
  gallery: MemoryGalleryDTO | null;
  items: MemoryDTO[];
  kind: string;
  subEvent: string;
  paging: boolean;
  canUpload: boolean;
  /** One line about the last upload, already worded for a person. */
  say: string;
  sayWarn: boolean;
  onFilter: (kind: string, subEvent: string) => void;
  onMore: () => void;
  onOpen: (index: number) => void;
  onAdd: () => void;
}

/**
 * Shared Memories, on the invitation screen.
 *
 * Two filters over one grid. Nothing here decides what may be seen — the page
 * it is handed was chosen on the server — so the tabs ask for a different page
 * rather than filtering a list that arrived larger than it should have.
 *
 * Grids get thumbnails and never originals: a wedding gallery is thousands of
 * 12-megapixel files, and a phone drawing tiles from those is a phone that
 * stops scrolling.
 */
export function MemoriesBlock({
  gallery,
  items,
  kind,
  subEvent,
  paging,
  canUpload,
  say,
  sayWarn,
  onFilter,
  onMore,
  onOpen,
  onAdd,
}: MemoriesBlockProps) {
  const counts = gallery?.counts ?? { all: 0, photo: 0, video: 0, reel: 0 };
  const tabs: Array<[string, string, number]> = [
    ['all', COPY.memoryAll, counts.all],
    ['photo', COPY.memoryPhotos, counts.photo],
    ['video', COPY.memoryVideos, counts.video],
    ['reel', COPY.memoryReels, counts.reel],
  ];

  return (
    <View style={s.block} testID="memories-block">
      <View style={s.bloom} pointerEvents="none">
        <CornerBloom size={96} petal={INV_BLUSH_PETAL} stem={INV_GOLD} />
      </View>

      <View style={s.head}>
        <EventlyText variant="subtitle" style={s.heading}>
          {COPY.memoriesTitle}
        </EventlyText>
        <EventlyText variant="caption" style={s.tally}>
          {COPY.memoryTally(counts.all)}
        </EventlyText>
      </View>
      <EventlyText variant="caption" style={s.lead}>
        {COPY.memoriesLead}
      </EventlyText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.tabs}
        contentContainerStyle={s.tabsRow}
      >
        {tabs.map(([id, label, n]) => {
          const on = kind === id;
          return (
            <TouchableOpacity
              key={id}
              style={[s.tab, on && s.tabOn]}
              activeOpacity={0.9}
              onPress={() => onFilter(id, subEvent)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              testID={`memory-tab-${id}`}
            >
              <EventlyText variant="caption" style={[s.tabText, on && s.tabTextOn]}>
                {label} {n}
              </EventlyText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* The celebrations come from the invitation, never a fixed list. */}
      {gallery && gallery.subEvents.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filters}
          contentContainerStyle={s.tabsRow}
        >
          {[{ id: 'all', name: COPY.memoryAllEvents }, ...gallery.subEvents].map((e) => {
            const on = subEvent === e.id;
            return (
              <TouchableOpacity
                key={e.id}
                style={[s.filter, on && s.filterOn]}
                activeOpacity={0.9}
                onPress={() => onFilter(kind, e.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
              >
                <EventlyText variant="caption" style={[s.filterText, on && s.filterTextOn]}>
                  {e.name}
                </EventlyText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}

      {items.length === 0 ? (
        <EventlyText variant="body" style={s.empty}>
          {canUpload ? COPY.memoryEmptyCanAdd : COPY.memoryEmpty}
        </EventlyText>
      ) : (
        <View style={s.grid}>
          {items.map((item, index) => {
            const note = noteFor(item);
            return (
              <TouchableOpacity
                key={item.id}
                style={s.cell}
                activeOpacity={0.9}
                onPress={() => onOpen(index)}
                accessibilityRole="button"
                accessibilityLabel={COPY.memoryOpen(index + 1, items.length)}
                testID={`memory-cell-${index}`}
              >
                <EventlyImage
                  /* Made absolute: the local storage driver returns a
                     root-relative path, which a browser resolves against the
                     page and React Native cannot resolve at all. */
                  source={{ uri: absoluteFileUrl(item.thumbnailUrl) }}
                  style={s.cellImage}
                  resizeMode="cover"
                />
                {item.kind !== 'photo' ? (
                  <>
                    <View style={s.play} pointerEvents="none">
                      <EventlyIcon name="play-circle" size={34} color="rgba(255,255,255,0.92)" />
                    </View>
                    {item.kind === 'reel' ? (
                      <View style={s.reelMark}>
                        <EventlyText variant="caption" style={s.reelText}>
                          {COPY.memoryReel}
                        </EventlyText>
                      </View>
                    ) : null}
                    {item.durationSec > 0 ? (
                      <View style={s.length}>
                        <EventlyText variant="caption" style={s.lengthText}>
                          {clock(item.durationSec)}
                        </EventlyText>
                      </View>
                    ) : null}
                  </>
                ) : null}
                {note ? (
                  <View style={s.cellNote}>
                    <EventlyText variant="caption" style={s.cellNoteText}>
                      {note}
                    </EventlyText>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {gallery?.nextCursor ? (
        <TouchableOpacity
          style={s.more}
          activeOpacity={0.9}
          onPress={onMore}
          disabled={paging}
          testID="memory-more"
        >
          <EventlyText variant="subtitle" style={s.moreText}>
            {paging ? COPY.memoryLoading : COPY.memoryMore}
          </EventlyText>
        </TouchableOpacity>
      ) : null}

      {/* Drawn only while the server says uploads are open — the window and the
          permission are both its answers, arriving together as `canUpload`. */}
      {canUpload ? (
        <TouchableOpacity
          style={s.add}
          activeOpacity={0.9}
          onPress={onAdd}
          accessibilityRole="button"
          testID="memory-add"
        >
          <EventlyIcon name="camera-plus-outline" size={18} color={colors.onPrimary} />
          <EventlyText variant="subtitle" style={s.addText}>
            {COPY.memoryAdd}
          </EventlyText>
        </TouchableOpacity>
      ) : null}

      {say ? (
        <View style={[s.say, sayWarn && s.sayWarn]}>
          <EventlyText variant="caption" style={[s.sayText, sayWarn && s.sayTextWarn]}>
            {say}
          </EventlyText>
        </View>
      ) : null}
    </View>
  );
}

export default MemoriesBlock;
