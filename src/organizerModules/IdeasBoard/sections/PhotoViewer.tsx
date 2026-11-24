import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, EventlyIcon, EventlyImage } from '../../../Components';
import { IDEAS_COPY } from '../constants';
import type { PhotoViewerResult } from '../container';
import { WHITE } from '../design';
import { viewerStyles as s } from '../styles';

/** A post's photos, full screen — swipe between them, tap ✕ to close. */
export function PhotoViewer({ p }: { p: PhotoViewerResult }) {
  const { width } = useWindowDimensions();
  const pager = useRef<ScrollView>(null);
  const [current, setCurrent] = useState(p.index);
  const page: ViewStyle = { width };

  useEffect(() => {
    if (!p.visible) return;
    setCurrent(p.index);
    // Wait a frame so the pager has its width before jumping to the photo.
    const t = setTimeout(
      () => pager.current?.scrollTo({ x: p.index * width, animated: false }),
      0,
    );
    return () => clearTimeout(t);
  }, [p.visible, p.index, width]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / Math.max(1, width));
    if (i !== current) setCurrent(i);
  };

  return (
    <Modal
      visible={p.visible}
      animationType="fade"
      onRequestClose={p.close}
      statusBarTranslucent
    >
      <View style={s.root}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
          <View style={s.bar}>
            <AppText variant="bodySmall" style={s.count}>
              {p.photos.length > 1
                ? IDEAS_COPY.feed.photo(current + 1, p.photos.length)
                : ''}
            </AppText>
            <Pressable
              style={s.close}
              onPress={p.close}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={IDEAS_COPY.viewer.close}
            >
              <EventlyIcon name="close" size={22} color={WHITE} />
            </Pressable>
          </View>
          <ScrollView
            ref={pager}
            style={s.pager}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
          >
            {p.photos.map(photo => (
              <View key={photo.key} style={[s.page, page]}>
                <EventlyImage
                  source={{ uri: photo.uri }}
                  style={s.image}
                  resizeMode="contain"
                  accessibilityLabel={photo.label}
                />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default PhotoViewer;
