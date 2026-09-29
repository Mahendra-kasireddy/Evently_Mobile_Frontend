import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyImage, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { absoluteFileUrl } from '../../../services/urls';
import { INVITATION_COPY as COPY, MEMORY_CAPTION_MAX } from '../constants';
import { memoriesStyles as s } from '../styles';
import { artworkStyles, sheetStyles } from '../styles';
import type { MemoryDTO } from '../types';
import type { PickedMedia } from '../memories.hooks';

/**
 * The three ways to add a memory.
 *
 * Each one hands off to the platform's own camera or library — there is no
 * recorder or editor here, because the phone already has both and they are
 * better than anything worth building for this.
 */
export function AddMemorySheet({
  visible,
  onClose,
  onTakePhoto,
  onPickMedia,
  onRecordReel,
}: {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onPickMedia: () => void;
  onRecordReel: () => void;
}) {
  const options: Array<[string, string, string, () => void]> = [
    ['camera-outline', COPY.memoryTakePhoto, COPY.memoryTakePhotoNote, onTakePhoto],
    ['image-multiple-outline', COPY.memoryPick, COPY.memoryPickNote, onPickMedia],
    ['video-outline', COPY.memoryRecord, COPY.memoryRecordNote, onRecordReel],
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={sheetStyles.backdrop} onPress={onClose}>
        <Pressable style={sheetStyles.container} onPress={(e) => e.stopPropagation()}>
          <EventlyText variant="h2" style={s.sheetTitle}>
            {COPY.memoryAddTitle}
          </EventlyText>
          <EventlyText variant="caption" style={s.sheetLead}>
            {COPY.memoryAddLead}
          </EventlyText>

          {options.map(([icon, name, note, onPress]) => (
            <TouchableOpacity
              key={name}
              style={s.option}
              activeOpacity={0.9}
              onPress={onPress}
              accessibilityRole="button"
              testID={`memory-option-${icon}`}
            >
              <View style={s.optionMark}>
                <EventlyIcon name={icon} size={19} color={colors.primary} />
              </View>
              <View style={s.optionText}>
                <EventlyText variant="subtitle" style={s.optionName}>
                  {name}
                </EventlyText>
                <EventlyText variant="caption" style={s.optionNote}>
                  {note}
                </EventlyText>
              </View>
              <EventlyIcon name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * Confirming one before it goes.
 *
 * Preview, which celebration, an optional line — then upload. Nothing is sent
 * until the person says so, and the celebration they pick is authoritative:
 * the server only falls back to the clock when nobody chose.
 */
export function ConfirmMemorySheet({
  picked,
  subEvents,
  busy,
  progress,
  error,
  onRetake,
  onCancel,
  onSend,
}: {
  picked: PickedMedia | null;
  subEvents: Array<{ id: string; name: string }>;
  busy: boolean;
  progress: number;
  error: string;
  onRetake: () => void;
  onCancel: () => void;
  onSend: (subEventId: string, caption: string) => void;
}) {
  const [subEventId, setSubEventId] = useState('');
  const [caption, setCaption] = useState('');

  /* A fresh pick is a fresh answer: the last upload's celebration and caption
     should not be sitting in the form for the next photograph. */
  useEffect(() => {
    if (picked) {
      setSubEventId('');
      setCaption('');
    }
  }, [picked]);

  const over = caption.length > MEMORY_CAPTION_MAX;

  return (
    <Modal
      visible={Boolean(picked)}
      transparent
      animationType="slide"
      onRequestClose={busy ? () => undefined : onCancel}
    >
      <View style={sheetStyles.backdrop}>
        <View style={sheetStyles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <EventlyText variant="h2" style={s.sheetTitle}>
              {COPY.memoryConfirmTitle}
            </EventlyText>
            <EventlyText variant="caption" style={s.sheetLead}>
              {COPY.memoryConfirmLead}
            </EventlyText>

            {picked ? (
              picked.isClip ? (
                /* A still frame is not available without a decoder, so the clip
                   is represented rather than previewed — honest, and it is the
                   file the person just recorded. */
                <View style={[s.preview, s.play]}>
                  <EventlyIcon name="video-outline" size={38} color="rgba(255,255,255,0.9)" />
                  <EventlyText variant="caption" style={s.lengthText}>
                    {picked.reel ? COPY.memoryReel : COPY.memoryVideos}
                    {picked.durationSec ? ` · ${picked.durationSec}s` : ''}
                  </EventlyText>
                </View>
              ) : (
                <EventlyImage
                  source={{ uri: picked.uri }}
                  style={s.preview}
                  resizeMode="cover"
                />
              )
            ) : null}

            <EventlyText variant="caption" style={s.fieldLabel}>
              {COPY.memoryWhichEvent}
            </EventlyText>
            <View style={s.eventRow}>
              {[{ id: '', name: COPY.memoryTheCelebration }, ...subEvents].map((e) => {
                const on = subEventId === e.id;
                return (
                  <TouchableOpacity
                    key={e.id || 'own'}
                    style={[s.tab, on && s.tabOn]}
                    activeOpacity={0.9}
                    onPress={() => setSubEventId(e.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                  >
                    <EventlyText variant="caption" style={[s.tabText, on && s.tabTextOn]}>
                      {e.name}
                    </EventlyText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <EventlyText variant="caption" style={s.fieldLabel}>
              {COPY.memoryCaption}
            </EventlyText>
            <TextInput
              style={s.captionInput}
              value={caption}
              onChangeText={setCaption}
              placeholder={COPY.memoryCaptionHint}
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={MEMORY_CAPTION_MAX + 20}
              editable={!busy}
            />
            <EventlyText variant="caption" style={[s.counter, over && s.counterOver]}>
              {caption.length} / {MEMORY_CAPTION_MAX}
            </EventlyText>

            {busy ? (
              <>
                <View style={s.progressTrack}>
                  <View
                    style={[s.progressFill, { width: `${Math.round(progress * 100)}%` }]}
                  />
                </View>
                <EventlyText variant="caption" style={s.sayText}>
                  {COPY.memoryAdding}
                </EventlyText>
              </>
            ) : null}

            {error ? (
              <View style={[s.say, s.sayWarn]}>
                <EventlyText variant="caption" style={[s.sayText, s.sayTextWarn]}>
                  {error}
                </EventlyText>
              </View>
            ) : null}

            <View style={s.sheetActions}>
              <TouchableOpacity
                style={s.sheetGhost}
                activeOpacity={0.9}
                onPress={busy ? onCancel : onRetake}
                testID="memory-retake"
              >
                <EventlyText variant="subtitle" style={s.sheetGhostText}>
                  {busy ? COPY.memoryCancel : COPY.memoryRetake}
                </EventlyText>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.sheetPrimary}
                activeOpacity={0.9}
                disabled={busy || over}
                onPress={() => onSend(subEventId, caption.trim())}
                testID="memory-send"
              >
                <EventlyText variant="subtitle" style={s.sheetPrimaryText}>
                  {busy ? COPY.memoryAdding : COPY.memoryShare}
                </EventlyText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/**
 * One memory, full screen, with the two beside it.
 *
 * Photographs open the display rendition rather than the original: a
 * 12-megapixel file is not what a phone screen needs to show one picture, and
 * the original is reserved for a download the customer has permitted.
 */
export function MemoryViewer({
  items,
  index,
  canDownload,
  onIndex,
  onClose,
  onDownload,
}: {
  items: MemoryDTO[];
  index: number;
  canDownload: boolean;
  onIndex: (next: number) => void;
  onClose: () => void;
  onDownload: (item: MemoryDTO) => void;
}) {
  const item = index >= 0 ? items[index] : undefined;

  return (
    <Modal visible={Boolean(item)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={artworkStyles.viewer}>
        <TouchableOpacity
          style={artworkStyles.viewerClose}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={COPY.memoryClose}
        >
          <EventlyIcon name="close" size={22} color="#fff" />
        </TouchableOpacity>

        {item ? (
          <>
            <EventlyImage
              source={{
                uri: absoluteFileUrl(item.kind === 'photo' ? item.displayUrl : item.thumbnailUrl),
              }}
              style={artworkStyles.viewerMedia}
              resizeMode="contain"
            />

            <View style={s.viewerBar}>
              <TouchableOpacity
                style={s.viewerPill}
                disabled={index <= 0}
                onPress={() => onIndex(index - 1)}
                accessibilityRole="button"
                accessibilityLabel={COPY.memoryPrevious}
                testID="memory-prev"
              >
                <EventlyIcon name="chevron-left" size={18} color="#fff" />
              </TouchableOpacity>

              <EventlyText variant="caption" style={s.viewerCaption} numberOfLines={2}>
                {item.caption || COPY.memoryPosition(index + 1, items.length)}
              </EventlyText>

              <TouchableOpacity
                style={s.viewerPill}
                disabled={index >= items.length - 1}
                onPress={() => onIndex(index + 1)}
                accessibilityRole="button"
                accessibilityLabel={COPY.memoryNext}
                testID="memory-next"
              >
                <EventlyIcon name="chevron-right" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={s.viewerBar}>
              {/* The count, read from the server. Liking is a guest's action and
                  the host is not a guest, so this is shown and not offered. */}
              <View style={s.viewerPill}>
                <EventlyIcon name="heart-outline" size={15} color="#fff" />
                <EventlyText variant="caption" style={s.viewerPillText}>
                  {item.likes}
                </EventlyText>
              </View>
              {canDownload ? (
                <TouchableOpacity
                  style={s.viewerPill}
                  onPress={() => onDownload(item)}
                  accessibilityRole="button"
                  testID="memory-download"
                >
                  <EventlyIcon name="download-outline" size={15} color="#fff" />
                  <EventlyText variant="caption" style={s.viewerPillText}>
                    {COPY.memorySave}
                  </EventlyText>
                </TouchableOpacity>
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    </Modal>
  );
}
