import { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { EventlyIcon, EventlyImage, EventlyText } from '../../../Components';
import { GALLERY_MAX, ORG_ACCENT, ORG_TEXT_MUTED } from '../constants';
import { fieldStyles, uploadStyles } from '../styles';
import type { FileRef, PickedFile } from '../types';

interface GalleryGridProps {
  label: string;
  files: FileRef[];
  uploading: boolean;
  onAdd: (file: PickedFile) => void;
  onRemove: (index: number) => void;
}

/** Portfolio gallery grid — matches the design's "up to 8 images + add tile" layout. */
export function GalleryGrid({ label, files, uploading, onAdd, onRemove }: GalleryGridProps) {
  const [error, setError] = useState<string | null>(null);
  const full = files.length >= GALLERY_MAX;

  const handleAdd = async () => {
    setError(null);
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 });
      if (result.didCancel || !result.assets?.length) return;
      const asset = result.assets[0];
      if (!asset.uri) return;
      onAdd({ uri: asset.uri, name: asset.fileName ?? `gallery-${Date.now()}.jpg`, type: asset.type ?? 'image/jpeg' });
    } catch {
      setError('Could not open your photo library.');
    }
  };

  return (
    <View>
      <EventlyText variant="subtitle" style={uploadStyles.tileLabelRow}>
        {label} ({files.length}/{GALLERY_MAX})
      </EventlyText>
      <View style={uploadStyles.galleryGrid}>
        {files.map((file, index) => (
          <View key={`${file.key}-${index}`} style={uploadStyles.galleryTile}>
            <EventlyImage source={{ uri: file.url }} style={uploadStyles.galleryImage} />
            <TouchableOpacity style={uploadStyles.removeBadge} onPress={() => onRemove(index)} accessibilityLabel="Remove image">
              <EventlyIcon name="close" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
        {!full ? (
          <TouchableOpacity style={uploadStyles.galleryAddTile} onPress={handleAdd} disabled={uploading} accessibilityLabel="Add portfolio image">
            {uploading ? <ActivityIndicator color={ORG_ACCENT} /> : <EventlyIcon name="plus" size={22} color={ORG_TEXT_MUTED} />}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <EventlyText variant="caption" style={fieldStyles.errorSmall}>{error}</EventlyText> : null}
    </View>
  );
}

export default GalleryGrid;
