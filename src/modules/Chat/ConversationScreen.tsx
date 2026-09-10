import { useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { CHAT_ACCENT, CHAT_COPY as COPY } from './constants';
import { useConversationSummary, useThreadContainer } from './container';
import { SuggestionBar } from './sections/SuggestionBar';
import { ThreadHeader } from './sections/ThreadHeader';
import { threadStyles as s } from './styles';

type ConversationRouteProp = RouteProp<RootStackParamList, 'Conversation'>;
type ConversationNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * One conversation.
 *
 * Messages are grouped under a day heading rather than each carrying a full
 * date, and the sender is decided by the role the server stamped on the
 * message — so the thread renders correctly for whichever side opens it
 * without either client needing to know who the other party is.
 *
 * The app polls rather than streams. Rather than a standing line saying so
 * over every open thread, the thread pulls to refresh and the empty state says
 * it in words — a chat that looks live but is not is worse than one that says
 * what it does, but saying it twice a day is nagging.
 */
export function ConversationScreen() {
  const navigation = useNavigation<ConversationNavigationProp>();
  const { params } = useRoute<ConversationRouteProp>();
  const container = useThreadContainer(params.conversationId);
  const summary = useConversationSummary(params.conversationId);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const canSend = container.draft.trim().length > 0 && !container.isSending;
  const name = summary?.withName || params.withName || COPY.title;

  const pickSuggestion = (text: string) => {
    container.useSuggestion(text);
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ThreadHeader
        summary={summary}
        fallbackName={params.withName ?? COPY.title}
        onBack={() => navigation.goBack()}
        /* The wizard is what actually produces a quote — the profile CTA goes
           the same way, so both routes land on one flow rather than two. */
        onQuote={
          summary?.organizerId
            ? () =>
                navigation.navigate('Main', {
                  screen: 'Plan',
                  params: { organizerId: summary.organizerId },
                })
            : undefined
        }
      />

      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {container.isLoading && container.groups.length === 0 ? (
          <View style={s.container}>
            <ActivityIndicator size="large" color={CHAT_ACCENT} style={s.spinner} />
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={s.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={container.isLoading} onRefresh={container.refetch} />
            }
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            {container.groups.length === 0 ? (
              <>
                <EventlyText variant="body" style={s.emptyText}>
                  {COPY.threadEmpty}
                </EventlyText>
                <EventlyText variant="caption" style={s.note}>
                  {COPY.freshnessNote}
                </EventlyText>
              </>
            ) : null}

            {container.groups.map((group) => (
              <View key={group.key}>
                {/* Only once a thread spans more than one day — see
                    `showDayLabels`. */}
                {container.showDays ? (
                  <EventlyText variant="caption" style={s.dayLabel}>
                    {group.dayLabel}
                  </EventlyText>
                ) : null}
                {group.items.map((message) => {
                  const mine = message.sender === 'customer';
                  return (
                    <View key={message.id} style={[s.bubble, mine ? s.mine : s.theirs]}>
                      <EventlyText variant="body" style={mine ? s.mineText : s.theirsText}>
                        {message.text}
                      </EventlyText>
                      <EventlyText
                        variant="caption"
                        style={[s.time, mine ? s.mineTime : s.theirsTime]}
                      >
                        {message.timeLabel}
                      </EventlyText>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        )}

        {container.sendError ? (
          <EventlyText variant="caption" style={s.sendError}>
            {COPY.sendFailed}
          </EventlyText>
        ) : null}

        <View style={s.foot}>
          <SuggestionBar suggestions={container.suggestions} onPick={pickSuggestion} />

          <View style={s.composer}>
            <TextInput
              ref={inputRef}
              style={s.input}
              value={container.draft}
              onChangeText={container.setDraft}
              placeholder={`Message ${name}…`}
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={2000}
              accessibilityLabel={COPY.placeholder}
            />
            <TouchableOpacity
              style={[s.send, !canSend && s.sendDisabled]}
              activeOpacity={0.85}
              disabled={!canSend}
              onPress={container.send}
              accessibilityRole="button"
              accessibilityLabel={COPY.send}
            >
              <EventlyIcon name="arrow-right" size={22} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ConversationScreen;
