import { useState } from 'react';
import { ActivityIndicator, Image, View, type ImageProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../theme';
import { EventlyIcon } from './EventlyIcon';
import { eventlyImageStyles } from './styles';

interface EventlyImageProps extends Omit<ImageProps, 'source' | 'style'> {
  source: ImageProps['source'] | null | undefined;
  style?: StyleProp<ViewStyle>;
  fallbackIconName?: string;
}

/**
 * The one Image component every screen should use: shows a placeholder icon
 * when there's no source or it fails to load, and a spinner while loading.
 */
export function EventlyImage({ source, style, fallbackIconName = 'image-off-outline', ...rest }: EventlyImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!source || hasError) {
    return (
      <View style={[eventlyImageStyles.fallback, style]}>
        <EventlyIcon name={fallbackIconName} size={24} color={colors.textMuted} />
      </View>
    );
  }

  return (
    <View style={[eventlyImageStyles.wrapper, style]}>
      <Image
        source={source}
        style={eventlyImageStyles.image}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        {...rest}
      />
      {isLoading && (
        <View style={eventlyImageStyles.loadingOverlay}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </View>
  );
}

export default EventlyImage;
