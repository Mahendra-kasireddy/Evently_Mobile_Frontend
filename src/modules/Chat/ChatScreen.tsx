import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, AppText } from '../../Components';
import { colors } from '../../theme';
import type {
  MainTabParamList,
  RootStackParamList,
} from '../../navigation/types';
import { CHAT_ACCENT, CHAT_COPY as COPY, CHAT_NAVY_DEEP } from './constants';
import { useInboxContainer } from './container';
import { ConversationRow } from './sections/ConversationRow';
import { styles as s } from './styles';
import { useScrollTopOnBlur } from '../../hooks/useScrollTopOnBlur';

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
  /* Leaving the tab puts it back at the top for next time. */
  const scrollRef = useScrollTopOnBlur();
  const navigation = useNavigation<ChatNavigationProp>();
  const { items, isLoading, isError, errorMessage, refetch } =
    useInboxContainer();

  /* Back to where the customer came from — another tab, or Home. */
  const goBack = () =>
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home');

  const header = (
    <View style={[s.header, s.headerRow]}>
      <TouchableOpacity
        style={s.back}
        activeOpacity={0.6}
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        testID="chat-back"
      >
        <EventlyIcon name="chevron-left" size={26} color={CHAT_NAVY_DEEP} />
      </TouchableOpacity>
      <AppText variant="h1" style={s.title}>
        {COPY.title}
      </AppText>
    </View>
  );

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <ActivityIndicator size="large" color={CHAT_ACCENT} />
          <AppText variant="body" style={s.loadingText}>
            {COPY.loading}
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && items.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <AppText variant="h2" style={s.emptyTitle}>
            {COPY.errorTitle}
          </AppText>
          <AppText variant="body" style={s.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </AppText>
          <TouchableOpacity
            style={s.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={CHAT_ACCENT} />
            <AppText variant="caption" style={s.retryText}>
              {COPY.retry}
            </AppText>
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
          <AppText variant="h2" style={s.emptyTitle}>
            {COPY.emptyTitle}
          </AppText>
          <AppText variant="body" style={s.emptyBody}>
            {COPY.emptyBody}
          </AppText>
          <TouchableOpacity
            style={s.emptyCta}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('Search', { kind: 'organizers' })
            }
            accessibilityRole="button"
            accessibilityLabel={COPY.emptyCta}
          >
            <AppText variant="body" weight="medium" style={s.emptyCtaText}>
              {COPY.emptyCta}
            </AppText>
            <EventlyIcon
              name="chevron-right"
              size={18}
              color={colors.onPrimary}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {header}
      <FlatList
        ref={scrollRef as never}
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
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
