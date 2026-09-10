import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { ORG_ACCENT, REVIEWS_COPY as COPY } from './constants';
import { useReviewsContainer } from './container';
import { ReviewCard } from './sections/ReviewCard';
import { ReviewSummaryCard } from './sections/ReviewSummaryCard';
import { reviewsStyles as s, summaryCardStyles } from './styles';

type ReviewsRouteProp = RouteProp<RootStackParamList, 'OrganizerReviews'>;
type ReviewsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** A stable colour per review, so a monogram does not change between renders. */
const AVATAR_COLORS = ['#e8633a', '#1a2e5a', '#1d9e75', '#6d5bd0', '#c9542c'];
function colorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

/**
 * Everything people have said about one organizer.
 *
 * The tag chips carry their real counts and appear only for tags somebody
 * actually picked — a chip reading "Great decor 0" would be worse than no
 * chip, and a fixed list of chips would imply feedback nobody gave.
 */
export function ReviewsScreen() {
  const navigation = useNavigation<ReviewsNavigationProp>();
  const { params } = useRoute<ReviewsRouteProp>();
  const { summary, bars, items, hasMore, isLoading, isLoadingMore, isError, errorMessage, loadMore, refetch } =
    useReviewsContainer(params.organizerId);

  const header = <AppHeader title={COPY.title} compact onBackPress={() => navigation.goBack()} />;

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <ActivityIndicator size="large" color={ORG_ACCENT} />
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
            <EventlyIcon name="refresh" size={16} color={ORG_ACCENT} />
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
            <EventlyIcon name="star-outline" size={28} color={ORG_ACCENT} />
          </View>
          <EventlyText variant="h2" style={s.emptyTitle}>
            {COPY.emptyTitle}
          </EventlyText>
          <EventlyText variant="body" style={s.emptyBody}>
            {COPY.emptyBody}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {header}
      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        <ReviewSummaryCard summary={summary} bars={bars} />

        {/* Only the tags people actually picked, with the counts they earned. */}
        {summary.tags.length > 0 ? (
          <View style={summaryCardStyles.tagRow}>
            {summary.tags.map((tag) => (
              <View
                key={tag.key}
                style={summaryCardStyles.tag}
                accessibilityLabel={`${tag.label}, mentioned ${tag.count} times`}
              >
                <EventlyText variant="body" style={summaryCardStyles.tagLabel}>
                  {tag.label}
                </EventlyText>
                <EventlyText variant="body" style={summaryCardStyles.tagCount}>
                  {tag.count}
                </EventlyText>
              </View>
            ))}
          </View>
        ) : null}

        {items.map((review) => (
          <ReviewCard key={review.id} review={review} avatarColor={colorFor(review.id)} />
        ))}

        {hasMore ? (
          <TouchableOpacity
            style={s.more}
            activeOpacity={0.8}
            onPress={loadMore}
            disabled={isLoadingMore}
            accessibilityRole="button"
          >
            <EventlyText variant="body" style={s.moreText}>
              {isLoadingMore ? COPY.loading : COPY.loadMore}
            </EventlyText>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ReviewsScreen;
