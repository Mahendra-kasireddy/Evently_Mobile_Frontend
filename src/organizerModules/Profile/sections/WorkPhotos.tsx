import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { GALLERY_MAX, PROFILE_COPY as COPY } from '../constants';
import { ORG_ACCENT } from '../design';
import { workStyles as s } from '../styles';
import type { PortfolioImage } from '../types';

/**
 * The photos of the organizer's work, as customers see them first. Adding one
 * opens the camera or library and saves straight away; the × asks before it
 * removes.
 */
export function WorkPhotos({
  images,
  full,
  uploading,
  onAdd,
  onRemove,
}: {
  images: PortfolioImage[];
  full: boolean;
  uploading: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  const confirmRemove = (index: number) =>
    Alert.alert(COPY.removePhotoTitle, COPY.removePhotoBody, [
      { text: COPY.cancel, style: 'cancel' },
      {
        text: COPY.remove,
        style: 'destructive',
        onPress: () => onRemove(index),
      },
    ]);

  return (
    <View style={s.wrap}>
      <View style={s.head}>
        <AppText variant="h3" style={s.title}>
          {COPY.workTitle}
        </AppText>
        <AppText variant="caption" style={s.hint}>
          {COPY.workHint(images.length, GALLERY_MAX)}
        </AppText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.strip}
      >
        {full ? null : (
          <Pressable
            style={s.add}
            onPress={onAdd}
            disabled={uploading}
            accessibilityRole="button"
            accessibilityLabel={COPY.workAdd}
          >
            {uploading ? (
              <ActivityIndicator color={ORG_ACCENT.saffron} />
            ) : (
              <>
                <EventlyIcon
                  name="image-plus"
                  size={24}
                  color={ORG_ACCENT.saffron}
                />
                <AppText variant="label" style={s.addText}>
                  {COPY.workAdd}
                </AppText>
              </>
            )}
          </Pressable>
        )}
        {images.map((image, index) => (
          <View key={image.key} style={s.tile}>
            <Image source={{ uri: image.uri }} style={s.image} />
            <Pressable
              style={s.remove}
              onPress={() => confirmRemove(index)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={`${COPY.remove} photo ${index + 1}`}
            >
              <EventlyIcon name="close" size={14} color="#ffffff" />
            </Pressable>
          </View>
        ))}
      </ScrollView>
      {images.length === 0 ? (
        <View style={s.empty}>
          <AppText variant="caption" style={s.emptyText}>
            {COPY.workEmpty}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

export default WorkPhotos;
