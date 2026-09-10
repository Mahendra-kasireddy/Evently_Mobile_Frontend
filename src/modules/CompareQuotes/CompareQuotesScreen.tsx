import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { COMPARE_ACCENT, COMPARE_COPY as COPY } from './constants';
import { useCompareContainer } from './container';
import { QuoteCardView } from './sections/QuoteCardView';
import { styles as s } from './styles';

type CompareRouteProp = RouteProp<RootStackParamList, 'CompareQuotes'>;

/**
 * Every quote on one request, side by side.
 *
 * Cheapest first, because that is the question the screen exists to answer —
 * but the cheapest is marked, not recommended: the line items are there so the
 * customer can see what the difference buys, and a "best value" badge would be
 * this app making a judgement it has no basis for.
 *
 * Withdrawn and declined quotes are not shown at all. A price nobody is
 * offering any more is not a comparison, it is an anchor.
 */
export function CompareQuotesScreen() {
  const { params } = useRoute<CompareRouteProp>();
  const { model, isLoading, isError, errorMessage, acceptingId, acceptError, accept, refetch } =
    useCompareContainer(params.requestId, params.title ?? COPY.title);

  const header = <AppHeader title={COPY.title} compact />;

  if (isLoading && !model) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <ActivityIndicator size="large" color={COMPARE_ACCENT} />
          <EventlyText variant="body" style={s.loadingText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && !model) {
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
            <EventlyIcon name="refresh" size={16} color={COMPARE_ACCENT} />
            <EventlyText variant="caption" style={s.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!model || model.quotes.length === 0) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <View style={s.centeredIcon}>
            <EventlyIcon name="file-document-outline" size={28} color={COMPARE_ACCENT} />
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

      <View style={s.brief}>
        <EventlyText variant="h2" style={s.briefTitle} numberOfLines={1}>
          {model.title}
        </EventlyText>
        {model.factsLine ? (
          <EventlyText variant="caption" style={s.briefFacts} numberOfLines={2}>
            {model.factsLine}
          </EventlyText>
        ) : null}
        {/* Only when there are two different prices to sit between. */}
        {model.spreadLabel ? (
          <EventlyText variant="caption" style={s.spread}>
            {model.spreadLabel}
          </EventlyText>
        ) : null}
        {model.isDecided ? (
          <EventlyText variant="caption" style={s.decidedNote}>
            {COPY.decidedNote}
          </EventlyText>
        ) : null}
      </View>

      {acceptError ? (
        <EventlyText variant="caption" style={s.acceptError}>
          {COPY.acceptFailed}
        </EventlyText>
      ) : null}

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {model.quotes.map((quote) => (
          <QuoteCardView
            key={quote.id}
            quote={quote}
            decided={model.isDecided}
            isAccepting={acceptingId === quote.id}
            onAccept={() => accept(quote.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default CompareQuotesScreen;
