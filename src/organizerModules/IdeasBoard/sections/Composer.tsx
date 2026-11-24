import { ActivityIndicator, TextInput, View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  EventlyImage,
  PressableScale,
} from '../../../Components';
import { boardStyles as b } from '../../../modules/Workspace/styles';
import { colors } from '../../../theme';
import {
  IDEAS_COPY,
  POST_TYPES,
  POST_TYPE_LABEL,
  TEXT_MAX,
} from '../constants';
import type { ComposerResult } from '../container';
import { IDEA_TYPE_META } from '../design';
import { typeInk, typeTint } from '../styles';

const COPY = IDEAS_COPY.composer;

/**
 * The board's one main action: post an update or ask the customer something,
 * with reference photos from the camera or library. Photos upload as they are
 * picked, so a post only ever carries files already on the server.
 */
export function Composer({ c }: { c: ComposerResult }) {
  const meta = IDEA_TYPE_META[c.type];
  return (
    <View style={b.composer}>
      <View style={b.composerTop}>
        <View style={[b.avatar, b.avatarSquare]}>
          <EventlyIcon name={meta.icon} size={18} color={colors.onPrimary} />
        </View>
        <TextInput
          style={b.input}
          value={c.text}
          onChangeText={c.setText}
          maxLength={TEXT_MAX}
          multiline
          editable={!c.posting}
          placeholder={COPY.placeholder[c.type]}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={COPY.placeholder[c.type]}
        />
      </View>

      {c.photos.length > 0 ? (
        <View style={b.thumbs}>
          {c.photos.map((photo, i) => (
            <View key={photo.key} style={b.thumb}>
              <EventlyImage source={{ uri: photo.uri }} style={b.thumbImage} />
              <PressableScale
                style={b.thumbRemove}
                onPress={() => c.removeImage(i)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`${COPY.removePhoto} ${i + 1}`}
              >
                <EventlyIcon name="close" size={12} color={colors.onPrimary} />
              </PressableScale>
            </View>
          ))}
        </View>
      ) : null}

      <View style={b.typeRow}>
        {POST_TYPES.map(value => {
          const on = c.type === value;
          const m = IDEA_TYPE_META[value];
          return (
            <PressableScale
              key={value}
              style={[b.typeChip, on && typeTint[value]]}
              onPress={() => c.setType(value)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={POST_TYPE_LABEL[value]}
            >
              <EventlyIcon
                name={m.icon}
                size={13}
                color={on ? m.color : colors.textMuted}
              />
              <AppText
                variant="label"
                style={[b.typeChipText, on && typeInk[value]]}
              >
                {POST_TYPE_LABEL[value]}
              </AppText>
            </PressableScale>
          );
        })}
      </View>

      <View style={b.composerFoot}>
        <PressableScale
          style={b.photoButton}
          disabled={c.uploading || c.posting}
          onPress={c.addPhotos}
          accessibilityRole="button"
          accessibilityLabel={COPY.photo}
          accessibilityState={{ busy: c.uploading }}
        >
          {c.uploading ? (
            <ActivityIndicator size="small" color={colors.textMuted} />
          ) : (
            <EventlyIcon
              name="camera-outline"
              size={18}
              color={colors.textMuted}
            />
          )}
          <AppText variant="caption" style={b.photoText}>
            {c.uploading ? COPY.uploading : COPY.photo}
          </AppText>
        </PressableScale>

        <PressableScale
          style={[b.postButton, !c.canPost && b.postButtonDisabled]}
          disabled={!c.canPost}
          onPress={c.submit}
          accessibilityRole="button"
          accessibilityLabel={COPY.post[c.type]}
          accessibilityState={{ disabled: !c.canPost, busy: c.posting }}
        >
          {c.posting ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <EventlyIcon name="send" size={15} color={colors.onPrimary} />
          )}
          <AppText variant="caption" style={b.postButtonText}>
            {c.posting ? COPY.posting : COPY.post[c.type]}
          </AppText>
        </PressableScale>
      </View>

      {c.text.length > TEXT_MAX - 200 ? (
        <AppText variant="caption" style={b.counter}>
          {`${c.text.length} / ${TEXT_MAX}`}
        </AppText>
      ) : null}

      {c.error ? (
        <AppText
          variant="caption"
          style={b.composerError}
          accessibilityLiveRegion="polite"
        >
          {c.error}
        </AppText>
      ) : null}
    </View>
  );
}

export default Composer;
