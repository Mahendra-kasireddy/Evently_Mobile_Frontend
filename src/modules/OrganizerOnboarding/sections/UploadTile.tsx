import { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { EventlyIcon, EventlyImage, EventlyText } from '../../../Components';
import { ORG_ACCENT, ORG_TEXT_MUTED } from '../constants';
import { fieldStyles, uploadStyles } from '../styles';
import type { FileRef, PickedFile } from '../types';

interface UploadTileProps {
  label: string;
  hint?: string;
  file: FileRef | null;
  uploading: boolean;
  onPick: (file: PickedFile) => void;
  onRemove: () => void;
  optional?: boolean;
  /** Circular avatar style (profile photo) instead of the default rectangular tile. */
  variant?: 'tile' | 'avatar';
}

async function pickImage(): Promise<PickedFile | null> {
  const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 });
  if (result.didCancel || !result.assets?.length) return null;
  const asset = result.assets[0];
  if (!asset.uri) return null;
  return {
    uri: asset.uri,
    name: asset.fileName ?? `upload-${Date.now()}.jpg`,
    type: asset.type ?? 'image/jpeg',
  };
}

/** The one upload tile every onboarding step uses for a single file/photo field — opens the photo library and hands the picked file to the caller's uploader. */
export function UploadTile({ label, hint, file, uploading, onPick, onRemove, optional = false, variant = 'tile' }: UploadTileProps) {
  const [pickError, setPickError] = useState<string | null>(null);

  const handlePress = async () => {
    setPickError(null);
    try {
      const picked = await pickImage();
      if (picked) onPick(picked);
    } catch {
      setPickError('Could not open your photo library.');
    }
  };

  if (variant === 'avatar') {
    return (
      <View style={uploadStyles.avatarWrap}>
        <TouchableOpacity onPress={handlePress} disabled={uploading} accessibilityRole="button" accessibilityLabel={label}>
          <View style={uploadStyles.avatarCircle}>
            {uploading ? (
              <ActivityIndicator color={ORG_ACCENT} style={uploadStyles.avatarSpinner} />
            ) : file ? (
              <EventlyImage source={{ uri: file.url }} style={uploadStyles.avatarImage} />
            ) : (
              <EventlyIcon name="camera-plus-outline" size={28} color={ORG_TEXT_MUTED} />
            )}
          </View>
        </TouchableOpacity>
        <EventlyText variant="subtitle">{label}</EventlyText>
        {pickError ? <EventlyText variant="caption" style={fieldStyles.error}>{pickError}</EventlyText> : null}
      </View>
    );
  }

  return (
    <View>
      <EventlyText variant="subtitle" style={uploadStyles.tileLabelRow}>
        {label} {optional ? <EventlyText variant="caption" style={fieldStyles.optional}>(optional)</EventlyText> : null}
      </EventlyText>
      <TouchableOpacity
        style={[uploadStyles.tile, file && uploadStyles.tileFilled]}
        onPress={handlePress}
        disabled={uploading}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {uploading ? (
          <ActivityIndicator color={ORG_ACCENT} />
        ) : file ? (
          <>
            <EventlyImage source={{ uri: file.url }} style={uploadStyles.tileImage} />
            <TouchableOpacity style={uploadStyles.removeBadge} onPress={onRemove} accessibilityLabel={`Remove ${label}`}>
              <EventlyIcon name="close" size={14} color="#fff" />
            </TouchableOpacity>
            {file.originalName ? (
              <View style={uploadStyles.fileBadge}>
                <EventlyText variant="caption" style={uploadStyles.fileBadgeText} numberOfLines={1}>
                  {file.originalName}
                </EventlyText>
              </View>
            ) : null}
          </>
        ) : (
          <>
            <EventlyIcon name="cloud-upload-outline" size={26} color={ORG_TEXT_MUTED} />
            <EventlyText variant="caption" style={uploadStyles.tileHint}>
              {hint ?? 'Tap to upload a photo'}
            </EventlyText>
          </>
        )}
      </TouchableOpacity>
      {pickError ? <EventlyText variant="caption" style={fieldStyles.errorSmall}>{pickError}</EventlyText> : null}
    </View>
  );
}

export default UploadTile;
