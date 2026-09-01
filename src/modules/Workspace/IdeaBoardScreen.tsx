import { useMemo, useState } from 'react';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { IDEAS_COPY, WORKSPACE_ACCENT, matchesBoardFilter } from './constants';
import { useApproveIdea, useIdeaBoard, usePostIdea, useUploadIdeaImage } from './hooks';
import { BoardComposer } from './sections/BoardComposer';
import { BoardEmpty, BoardFilters, BoardHero, IdeaCard, VisionCard } from './sections/BoardFeed';
import { boardStyles as s, styles } from './styles';
import type { BoardFilter, DraftPost } from './types';

type IdeaBoardRouteProp = RouteProp<RootStackParamList, 'IdeaBoard'>;

/**
 * The ideas & planning board for one booking: one thread between the customer
 * and the organizer delivering the event.
 *
 * The customer posts what they want, the organizer turns each post into a plan
 * and replies with its status, and where they need a decision the post carries
 * an approve action. The customer's sign-off is the only thing that clears
 * one, which is what the board's "awaiting you" count is derived from.
 *
 * Everything shown is the server's own state — the three figures in the banner
 * are its counts, not a re-derivation, so the banner cannot claim more
 * activity than the feed beneath it contains.
 */
export function IdeaBoardScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<IdeaBoardRouteProp>();
  const { bookingId, organizerName, authorName } = params;

  const { data, loading, error, refetch } = useIdeaBoard(bookingId);
  const post = usePostIdea();
  const approve = useApproveIdea();
  const upload = useUploadIdeaImage();

  const [filter, setFilter] = useState<BoardFilter>('all');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const organizer = organizerName || 'your organizer';
  const items = useMemo(() => data?.items ?? [], [data]);
  const visible = useMemo(() => items.filter((i) => matchesBoardFilter(i, filter)), [items, filter]);

  const header = <AppHeader title={IDEAS_COPY.title} compact onBackPress={() => navigation.goBack()} />;

  const submit = (draft: DraftPost) => {
    post
      .execute(bookingId, draft)
      .then(refetch)
      .catch(() => {
        // error surfaces through post.error, shown in the composer
      });
  };

  const onApprove = (ideaId: string) => {
    setApprovingId(ideaId);
    approve
      .execute(ideaId)
      .then(refetch)
      .catch(() => {
        // error surfaces through approve.error
      })
      .finally(() => setApprovingId(null));
  };

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <EventlyText variant="body" style={styles.loadingText}>
            {IDEAS_COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <EventlyText variant="body" style={styles.errorText}>
            {IDEAS_COPY.loadError}
          </EventlyText>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={WORKSPACE_ACCENT} />
            <EventlyText variant="caption" style={styles.retryText}>
              {IDEAS_COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {header}
      <KeyboardAvoidingView
        style={styles.scroll}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        >
          <BoardHero counts={data.counts} organizerName={organizer} />

          <BoardComposer
            // Passed down from the workspace, which already loaded it — the
            // composer shows the customer their own monogram rather than a
            // placeholder letter, at no extra request.
            authorName={authorName || 'You'}
            organizerName={organizer}
            isPosting={post.loading}
            isUploading={upload.loading}
            postErrorMessage={post.error?.message ?? null}
            onUpload={upload.execute}
            onPost={submit}
          />

          <BoardFilters value={filter} items={items} onChange={setFilter} />

          {visible.length === 0 ? (
            <BoardEmpty hasAnyPosts={items.length > 0} organizerName={organizer} />
          ) : (
            <View style={s.feed}>
              {visible.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  isApproving={approvingId === idea.id}
                  onApprove={() => onApprove(idea.id)}
                />
              ))}
            </View>
          )}

          <VisionCard vision={data.vision} organizerName={organizer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default IdeaBoardScreen;
