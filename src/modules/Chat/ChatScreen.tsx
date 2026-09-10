import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { CHAT_ACCENT, CHAT_COPY as COPY } from './constants';
import { useInboxContainer } from './container';
import { ConversationRow } from './sections/ConversationRow';
import { styles as s } from './styles';

type ChatNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Chat'>,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * Every conversation this account is part of.
 *
 * Re-read on focus rather than only on mount: the tab navigator keeps this
 * screen alive, so an inbox that fetched once would still show yesterday's
 * unread counts a week later.
 */
export function ChatScreen() {
  const navigation = useNavigation<ChatNavigationProp>();
  const { items, isLoading, isError, errorMessage, refetch } = useInboxContainer();

  const header = (
    <View style={s.header}>
      <EventlyText variant="h1" style={s.title}>
        {COPY.title}
      </EventlyText>
    </View>
  );

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <ActivityIndicator size="large" color={CHAT_ACCENT} />
          <EventlyText variant="body" style={s.loadingText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && items.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <EventlyText variant="h2" style={s.emptyTitle}>
            {COPY.errorTitle}
          </EventlyText>
          <EventlyText variant="body" style={s.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
          <TouchableOpacity
            style={s.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={CHAT_ACCENT} />
            <EventlyText variant="caption" style={s.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <View style={s.centeredIcon}>
            <EventlyIcon name="chat-outline" size={28} color={CHAT_ACCENT} />
          </View>
          <EventlyText variant="h2" style={s.emptyTitle}>
            {COPY.emptyTitle}
          </EventlyText>
          <EventlyText variant="body" style={s.emptyBody}>
            {COPY.emptyBody}
          </EventlyText>
          <TouchableOpacity
            style={s.emptyCta}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Search', { kind: 'organizers' })}
            accessibilityRole="button"
            accessibilityLabel={COPY.emptyCta}
          >
            <EventlyText variant="subtitle" style={s.emptyCtaText}>
              {COPY.emptyCta}
            </EventlyText>
            <EventlyIcon name="chevron-right" size={18} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {header}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        renderItem={({ item }) => (
          <ConversationRow
            item={item}
            onPress={() =>
              navigation.navigate('Conversation', {
                conversationId: item.id,
                withName: item.withName,
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

export default ChatScreen;
