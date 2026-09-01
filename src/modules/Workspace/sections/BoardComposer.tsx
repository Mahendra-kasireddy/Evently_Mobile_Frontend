import { useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { EventlyIcon, EventlyImage, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  CUSTOMER_IDEA_TYPES,
  IDEAS_COPY,
  IDEA_IMAGE_MAX,
  IDEA_TEXT_MAX,
  IDEA_TYPE_META,
  initials,
} from '../constants';
import { boardStyles as s } from '../styles';
import type { DraftPost, IdeaImage, IdeaType, PickedImage } from '../types';

interface BoardComposerProps {
  /** The customer's own name, for the avatar monogram. */
  authorName: string;
  /** The organizer, named in the placeholder. */
  organizerName: string;
  isPosting: boolean;
  isUploading: boolean;
  postErrorMessage: string | null;
  onUpload: (file: PickedImage) => Promise<IdeaImage>;
  onPost: (draft: DraftPost) => void;
}

async function pickImage(): Promise<PickedImage | null> {
  const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 });
  if (result.didCancel || !result.assets?.length) return null;
  const asset = result.assets[0];
  if (!asset.uri) return null;
  return {
    uri: asset.uri,
    name: asset.fileName ?? `idea-${Date.now()}.jpg`,
    type: asset.type ?? 'image/jpeg',
  };
}

/**
 * Posting to the board.
 *
 * The four types on offer are the ones the API accepts from a customer —
 * offering "update" would be offering the organizer's status note, which the
 * server rewrites to an idea anyway. Choosing "surprise" marks the post
 * confidential, which is what keeps it out of anything shared onward, and the
 * composer says so rather than leaving that to be inferred.
 *
 * Photos upload as they are picked, so a post is only ever submitted with
 * attachments that already exist on the server.
 */
export function BoardComposer({
  authorName,
  organizerName,
  isPosting,
  isUploading,
  postErrorMessage,
  onUpload,
  onPost,
}: BoardComposerProps) {
  const [text, setText] = useState('');
  const [type, setType] = useState<IdeaType>('idea');
  const [images, setImages] = useState<IdeaImage[]>([]);
  const [localError, setLocalError] = useState('');

  const confidential = type === 'surprise';
  const canPost = text.trim().length > 0 && !isPosting && !isUploading;

  const addPhoto = async () => {
    setLocalError('');
    if (images.length >= IDEA_IMAGE_MAX) {
      setLocalError(IDEAS_COPY.photoLimit(IDEA_IMAGE_MAX));
      return;
    }
    let picked: PickedImage | null = null;
    try {
      picked = await pickImage();
    } catch {
      setLocalError(IDEAS_COPY.pickError);
      return;
    }
    if (!picked) return;
    try {
      const uploaded = await onUpload(picked);
      setImages((prev) => [...prev, uploaded]);
    } catch {
      setLocalError(IDEAS_COPY.photoError);
    }
  };

  const submit = () => {
    if (!canPost) return;
    onPost({ text: text.trim(), type, confidential, images });
    // Cleared optimistically: the screen refetches on success, and leaving the
    // draft in place after a successful post invites a duplicate.
    setText('');
    setImages([]);
    setLocalError('');
  };

  return (
    <View style={s.composer}>
      <View style={s.composerTop}>
        <View style={s.avatar}>
          <EventlyText variant="caption" style={s.avatarText}>
            {initials(authorName)}
          </EventlyText>
        </View>
        <TextInput
          style={s.input}
          value={text}
          onChangeText={setText}
          maxLength={IDEA_TEXT_MAX}
          multiline
          placeholder={
            confidential ? IDEAS_COPY.placeholderSurprise : IDEAS_COPY.placeholder(organizerName)
          }
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={IDEAS_COPY.placeholder(organizerName)}
        />
      </View>

      {images.length > 0 ? (
        <View style={s.thumbs}>
          {images.map((image) => (
            <View key={image.url} style={s.thumb}>
              <EventlyImage source={{ uri: image.url }} style={s.thumbImage} />
              <TouchableOpacity
                style={s.thumbRemove}
                onPress={() => setImages((prev) => prev.filter((i) => i.url !== image.url))}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${image.originalName || 'photo'}`}
              >
                <EventlyIcon name="close" size={12} color={colors.onPrimary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}

      <View style={s.typeRow}>
        {CUSTOMER_IDEA_TYPES.map((value) => {
          const meta = IDEA_TYPE_META[value];
          const on = type === value;
          return (
            <TouchableOpacity
              key={value}
              style={[s.typeChip, on && { backgroundColor: meta.bg }]}
              activeOpacity={0.8}
              onPress={() => setType(value)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={meta.label}
            >
              <EventlyIcon name={meta.icon} size={13} color={on ? meta.color : colors.textMuted} />
              <EventlyText variant="caption" style={[s.typeChipText, on && { color: meta.color }]}>
                {meta.label}
              </EventlyText>
            </TouchableOpacity>
          );
        })}
      </View>

      {confidential ? (
        <View style={s.secretNote}>
          <EventlyIcon name="lock-outline" size={13} color={colors.textMuted} />
          <EventlyText variant="caption" style={s.secretNoteText}>
            {IDEAS_COPY.confidentialNote(organizerName)}
          </EventlyText>
        </View>
      ) : null}

      <View style={s.composerFoot}>
        <TouchableOpacity
          style={s.photoButton}
          activeOpacity={0.7}
          disabled={isUploading}
          onPress={addPhoto}
          accessibilityRole="button"
          accessibilityLabel={IDEAS_COPY.photo}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={colors.textMuted} />
          ) : (
            <EventlyIcon name="camera-outline" size={18} color={colors.textMuted} />
          )}
          <EventlyText variant="caption" style={s.photoText}>
            {isUploading ? IDEAS_COPY.uploading : IDEAS_COPY.photo}
          </EventlyText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.postButton, !canPost && s.postButtonDisabled]}
          activeOpacity={0.85}
          disabled={!canPost}
          onPress={submit}
          accessibilityRole="button"
          accessibilityLabel={IDEAS_COPY.post}
        >
          {isPosting ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <EventlyIcon name="plus" size={16} color={colors.onPrimary} />
          )}
          <EventlyText variant="caption" style={s.postButtonText}>
            {isPosting ? IDEAS_COPY.posting : IDEAS_COPY.post}
          </EventlyText>
        </TouchableOpacity>
      </View>

      {/* Only near the cap: a counter on an empty box is noise. */}
      {text.length > IDEA_TEXT_MAX - 200 ? (
        <EventlyText variant="caption" style={s.counter}>
          {text.length} / {IDEA_TEXT_MAX}
        </EventlyText>
      ) : null}

      {localError || postErrorMessage ? (
        <EventlyText variant="caption" style={s.composerError}>
          {localError || postErrorMessage}
        </EventlyText>
      ) : null}
    </View>
  );
}

export default BoardComposer;
