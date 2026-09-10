import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { useOpenWithOrganizer } from '../Chat';
import { ORGANIZER_COPY as COPY, ORG_ACCENT } from './constants';
import { useOrganizerContainer } from './container';
import { Handles } from './sections/Handles';
import { ProfileHero } from './sections/ProfileHero';
import { QuoteFooter } from './sections/QuoteFooter';
import { RatingCard } from './sections/RatingCard';
import { RecentWork } from './sections/RecentWork';
import { styles } from './styles';

type OrganizerRouteProp = RouteProp<RootStackParamList, 'Organizer'>;
type OrganizerNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * One organizer, in full.
 *
 * Replaces the bottom sheet the list used to open. A sheet was the right size
 * for four facts; it is the wrong size for a portfolio, a service list and a
 * body of reviews — and it gave the customer nowhere to act from without
 * dismissing what they were reading.
 *
 * Every section removes itself when the organizer has not supplied it, so an
 * incomplete profile reads as short rather than as a column of blanks.
 */
export function OrganizerScreen() {
  const navigation = useNavigation<OrganizerNavigationProp>();
  const { params } = useRoute<OrganizerRouteProp>();
  const { organizer, summary, isLoading, isError, errorMessage, refetch } = useOrganizerContainer(
    params.organizerId,
  );

  /*
   * "Request a quote" opens the plan wizard with this organizer already
   * chosen, rather than firing a request from here.
   *
   * An organizer cannot price an event they know nothing about: the request
   * DTO needs the occasion at minimum, and the wizard is where the customer
   * gives it. Sending a blank brief straight from this button would put a
   * request nobody can answer into an organizer's inbox, and tell the
   * customer it had been "sent".
   */
  const requestQuote = useCallback(() => {
    if (!organizer) return;
    navigation.navigate('Main', {
      screen: 'Plan',
      params: { organizerId: organizer.id },
    });
  }, [navigation, organizer]);

  const openThread = useOpenWithOrganizer();

  /**
   * Opens the thread with this organizer.
   *
   * The conversation is created on first contact server-side and returned the
   * same way on every later tap, so this never makes a second thread — and
   * navigation waits for the id rather than guessing one.
   */
  const messageOrganizer = useCallback(() => {
    if (!organizer || openThread.loading) return;
    openThread
      .execute(organizer.id)
      .then((conversation) =>
        navigation.navigate('Conversation', {
          conversationId: conversation.id,
          withName: organizer.name,
        }),
      )
      // Nothing opened, so nothing is claimed: the button simply stays live.
      .catch(() => {});
  }, [navigation, openThread, organizer]);

  const openReviews = () =>
    organizer &&
    navigation.navigate('OrganizerReviews', {
      organizerId: organizer.id,
      name: organizer.name,
    });

  if (isLoading && !organizer) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={ORG_ACCENT} />
          <EventlyText variant="body" style={styles.loadingText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (!organizer) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <EventlyText variant="h2" style={styles.errorTitle}>
            {COPY.errorTitle}
          </EventlyText>
          {isError ? (
            <EventlyText variant="body" style={styles.errorText}>
              {errorMessage ?? 'Something went wrong.'}
            </EventlyText>
          ) : null}
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={ORG_ACCENT} />
            <EventlyText variant="caption" style={styles.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileHero
          organizer={organizer}
          showAllReviews={summary.total > 0}
          onBack={() => navigation.goBack()}
          onPressAllReviews={openReviews}
        />
        <RecentWork photos={organizer.gallery} />
        <Handles items={organizer.handles} />
        <RatingCard
          rating={summary.total > 0 ? summary.average : organizer.rating}
          reviews={summary.total}
          events={organizer.events}
          onPressReviews={openReviews}
        />
      </ScrollView>

      <QuoteFooter
        typicalLabel={organizer.typicalLabel}
        hasRequested={false}
        isRequesting={false}
        errorMessage={null}
        onPress={requestQuote}
        onPressMessage={messageOrganizer}
        isOpeningMessage={openThread.loading}
      />
    </SafeAreaView>
  );
}

export default OrganizerScreen;
