import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Modal,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { absoluteFileUrl } from '../../services/urls';
import { normalizeError } from '../../services/errors';
import type { RootStackParamList } from '../../navigation/types';
import { useEventMemories } from './hooks';
import { uploadMemory } from './services';
import { PE_PURPLE, memoriesUi as s, ui } from './ui.styles';
import type { EventMemory, EventMemoryKind } from './types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EventMemories'>;
type Route = RouteProp<RootStackParamList, 'EventMemories'>;

const TABS: Array<{ key: EventMemoryKind | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'photo', label: 'Photos' },
  { key: 'video', label: 'Videos' },
];

/**
 * 9 — The event's shared gallery.
 *
 * Who may look and who may add is the server's call, made again on every
 * request; this screen only shows "Add Memory" when the server says you may.
 * Your own uploads that the organizer has not approved yet are shown to you,
 * marked, so they do not look lost.
 */
export function EventMemoriesScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<EventMemoryKind | 'all'>('all');
  const { data, loading, error, refetch } = useEventMemories(
    params.eventId,
    tab === 'all' ? undefined : tab,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<EventMemory | null>(null);

  const memories = data?.items ?? [];

  const addMemory = async () => {
    setUploadError(null);
    try {
      const result = await launchImageLibrary({
        mediaType: 'mixed',
        selectionLimit: 1,
        maxWidth: 2560,
        maxHeight: 2560,
        quality: 0.9,
      });
      if (result.didCancel) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        setUploadError(result.errorMessage ?? 'That file could not be opened.');
        return;
      }
      setUploading(true);
      await uploadMemory(params.eventId, {
        uri: asset.uri,
        fileName: asset.fileName ?? `memory-${Date.now()}`,
        mimeType: asset.type ?? 'image/jpeg',
      });
      refetch();
    } catch (cause) {
      setUploadError(normalizeError(cause).message);
    } finally {
      setUploading(false);
    }
  };

  const open = (memory: EventMemory) => {
    if (memory.kind === 'video') {
      Linking.openURL(absoluteFileUrl(memory.url)).catch(() => undefined);
    } else {
      setViewing(memory);
    }
  };

  const renderItem = ({ item }: { item: EventMemory }) => (
    <TouchableOpacity
      style={[s.tile, item.kind === 'video' && s.videoTile]}
      activeOpacity={0.85}
      onPress={() => open(item)}
      accessibilityRole="button"
      accessibilityLabel={item.kind === 'video' ? 'Play video' : 'Open photo'}
    >
      {item.kind === 'photo' ? (
        <Image
          source={{ uri: absoluteFileUrl(item.url) }}
          style={s.tileImage}
          resizeMode="cover"
        />
      ) : null}
      {item.kind === 'video' ? (
        <View style={s.play}>
          <EventlyIcon name="play" size={20} color="#ffffff" />
        </View>
      ) : null}
      {item.status === 'pending' ? (
        <View style={s.pending}>
          <EventlyText variant="caption" style={s.pendingText}>
            Awaiting approval
          </EventlyText>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <AppHeader title="Event Memories" onBackPress={navigation.goBack} />

      <View style={s.tabs}>
        {TABS.map(t => {
          const on = tab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[s.tab, on && s.tabOn]}
              onPress={() => setTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
            >
              <EventlyText
                variant="caption"
                style={[s.tabText, on && s.tabTextOn]}
              >
                {t.label}
              </EventlyText>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={memories}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={s.gridRow}
        renderItem={renderItem}
        contentContainerStyle={s.grid}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && memories.length > 0}
            onRefresh={refetch}
          />
        }
        ListEmptyComponent={
          <View style={ui.centre}>
            {loading ? (
              <ActivityIndicator color={PE_PURPLE} />
            ) : (
              <EventlyText variant="body" style={[ui.muted, ui.centerText]}>
                {error
                  ? error.message
                  : data?.canUpload
                  ? 'No memories yet. Be the first to add one.'
                  : 'No memories have been shared yet.'}
              </EventlyText>
            )}
          </View>
        }
      />

      {data?.canUpload ? (
        <View style={[ui.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {uploadError ? (
            <EventlyText variant="caption" style={ui.error}>
              {uploadError}
            </EventlyText>
          ) : null}
          <TouchableOpacity
            style={[s.add, uploading && ui.primaryOff]}
            disabled={uploading}
            onPress={() => {
              addMemory().catch(() => undefined);
            }}
            accessibilityRole="button"
            testID="add-memory"
          >
            {uploading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <EventlyIcon
                  name="camera-plus-outline"
                  size={18}
                  color="#ffffff"
                />
                <EventlyText variant="body" style={ui.primaryText}>
                  Add Memory
                </EventlyText>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      <Modal
        visible={viewing !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setViewing(null)}
      >
        <View style={s.viewer}>
          {viewing ? (
            <Image
              source={{ uri: absoluteFileUrl(viewing.url) }}
              style={s.viewerImage}
              resizeMode="contain"
            />
          ) : null}
          <TouchableOpacity
            style={[s.viewerClose, { top: insets.top + 12 }]}
            onPress={() => setViewing(null)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close photo"
          >
            <EventlyIcon name="close" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default EventMemoriesScreen;
