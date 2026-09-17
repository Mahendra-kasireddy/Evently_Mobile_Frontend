import { useCallback, useState } from 'react';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyText } from '../../Components';
import type {
  MainTabParamList,
  RootStackParamList,
} from '../../navigation/types';
import type { CouponOffer, CurrentEventViewModel } from './types';
import { NameGateSheet } from '../NameCapture';
import {
  HERO_ACCENT_COLOR,
  OTHER_EVENTS_ON_HOME,
  SEARCH_PLACEHOLDER,
} from './constants';
import { useOpenWithOrganizer } from '../Chat';
import { useHomeContainer } from './container';
import { BookedEventCard } from './sections/BookedEventCard';
import { EventRow } from './sections/EventRow';
import { EventHero } from './sections/EventHero';
import { HomeHeader } from './sections/HomeHeader';
import { OccasionGrid } from './sections/OccasionGrid';
import { Offers } from './sections/Offers';
import { CouponSheet } from './sections/CouponSheet';
import { Packages } from './sections/Packages';
import { TopOrganizers } from './sections/TopOrganizers';
import { TrustStrip } from './sections/TrustStrip';
import { sectionStyles, styles } from './styles';

type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

/** Renders whatever sections the container provides. No fetching, no mapping here. */
export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  /* The coupon whose terms are open, or null. Local because it is a reading
     state, not something the feed needs to know about. */
  const [openCoupon, setOpenCoupon] = useState<CouponOffer | null>(null);
  const openThread = useOpenWithOrganizer();

  /**
   * Opens the thread with the organizer running this booking.
   *
   * The conversation is created on first contact server-side and the same one
   * comes back on every later tap, so this cannot make a second thread — and
   * navigation waits for the id rather than guessing one.
   */
  const messageOrganizer = useCallback(
    (organizerId: string, withName: string) => {
      if (openThread.loading) return;
      openThread
        .execute(organizerId)
        .then(conversation =>
          navigation.navigate('Conversation', {
            conversationId: conversation.id,
            withName,
          }),
        )
        .catch(() => {
          // The failure is already captured in openThread.error; a booked
          // customer tapping again is a better outcome than an alert.
        });
    },
    [navigation, openThread],
  );
  const {
    banner,
    bookedEvent,
    currentEvent,
    otherEvents,
    occasions,
    offers,
    packages,
    savedPackageIds,
    toggleSavedPackage,
    topOrganizers,
    header,
    isLoading,
    isError,
    errorMessage,
    refetch,
  } = useHomeContainer();

  /*
   * Home shows at most three of the other events. It is a display cap, not a
   * filter: the count on the link is the real total, and the Events tab holds
   * all of them.
   */
  const visibleOtherEvents = otherEvents.slice(0, OTHER_EVENTS_ON_HOME);
  const hiddenEventCount = otherEvents.length - visibleOtherEvents.length;

  const hasAnyContent = Boolean(
    bookedEvent ||
      currentEvent ||
      occasions ||
      offers ||
      packages ||
      topOrganizers,
  );

  const headerProps = {
    locationLabel: header.locationLabel,
    unreadCount: header.unreadCount,
    savedCount: header.savedCount,
    searchPlaceholder: SEARCH_PLACEHOLDER,
    onPressLocation: () => navigation.navigate('Location'),
    onPressSaved: () => navigation.navigate('SavedPackages'),
    onPressNotifications: () => navigation.navigate('Notification'),
    onPressSearch: () => navigation.navigate('Search'),
    onPressFilters: () => navigation.navigate('Search', { openFilters: true }),
  };

  /**
   * Where the hero's buttons go — decided by which record the event is, not by
   * how far along it is.
   *
   * It used to turn on the stage, and a submitted request with no quotes yet
   * matched no branch and fell through to the Plan wizard: a button reading
   * "See your request" opened a blank new plan. The request's own screen is
   * CompareQuotes, which loads one request and every quote on it — none is
   * still a number of quotes, and the brief is on it either way. So a request
   * opens there whether or not anyone has replied, and only a draft, which
   * genuinely has nothing else to open, goes back to the wizard.
   */
  const openEvent = (event: CurrentEventViewModel) => {
    if (event.source === 'booking') {
      return navigation.navigate('Workspace', {
        bookingId: event.refId,
        workspaceName: event.title,
      });
    }
    if (event.source === 'quote') {
      return navigation.navigate('CompareQuotes', {
        requestId: event.refId,
        title: event.title,
      });
    }
    return navigation.navigate('Plan');
  };

  const handlePressHeroCta = openEvent;

  /* "See all quotes & your brief" promises the same screen the button opens. */
  const handlePressHeroDetails = openEvent;

  /**
   * One event's hero.
   *
   * Written once and used for the leading event and for every other live one,
   * so a second event is presented with the same weight as the first rather
   * than as a footnote.
   */
  const renderHero = (event: CurrentEventViewModel) => (
    <EventHero
      key={`${event.source}:${event.refId}`}
      event={event}
      ctaLabel={event.ctaLabel}
      onPressCta={() => handlePressHeroCta(event)}
      onPressDetails={() => handlePressHeroDetails(event)}
      /* Tapping one reply opens the comparison rather than that quote
         alone — the decision is between them, not about one. */
      onPressQuote={
        event.source === 'quote'
          ? () =>
              navigation.navigate('CompareQuotes', {
                requestId: event.refId,
                title: event.title,
              })
          : undefined
      }
    />
  );

  if (isLoading && !hasAnyContent) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <HomeHeader {...headerProps} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={HERO_ACCENT_COLOR} />
          <EventlyText variant="body" style={styles.loadingText}>
            Loading your home…
          </EventlyText>
        </View>
        <NameGateSheet onNameSaved={refetch} />
      </SafeAreaView>
    );
  }

  if (isError && !hasAnyContent) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <HomeHeader {...headerProps} />
        <View style={styles.centered}>
          <EventlyText variant="body" style={styles.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
        </View>
        <NameGateSheet onNameSaved={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HomeHeader {...headerProps} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/*
          The booked card replaces the hero for the booking itself — the two are
          two renderings of one event, and stacking them would summarise it
          twice. Any OTHER live event follows below on its own hero: a customer
          with a confirmed booking in December and a brief still collecting
          quotes for September has two events, and Home showed only the first.
        */}
        {bookedEvent ? (
          <BookedEventCard
            data={bookedEvent}
            onPress={() =>
              navigation.navigate('Workspace', {
                bookingId: bookedEvent.id,
                workspaceName: bookedEvent.title,
              })
            }
            /* Offered only when there is an organizer to message. A booking
               with none — older rows — gets no button rather than one that
               fails on tap. */
            onMessageOrganizer={
              bookedEvent.organizerId
                ? () =>
                    messageOrganizer(
                      bookedEvent.organizerId,
                      bookedEvent.organizerName,
                    )
                : undefined
            }
          />
        ) : currentEvent ? (
          renderHero(currentEvent)
        ) : null}

        {/*
          Every other live event, one row each.

          These used to be full heroes, and ten events meant ten screens of
          navy card before anything else on Home. Only the leading event needs
          that weight; the rest need telling apart, which a row does. Three of
          them, then a link — Home stays the same length whether the customer
          has four events or forty, and the Events tab is already the full list.
        */}
        {visibleOtherEvents.length ? (
          <View style={sectionStyles.block}>
            <View style={sectionStyles.headRow}>
              <EventlyText variant="h2" style={sectionStyles.title}>
                Your other events
              </EventlyText>
              {hiddenEventCount > 0 ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Main', { screen: 'Events' })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`See all ${
                    otherEvents.length + 1
                  } events`}
                  testID="see-all-events"
                >
                  <EventlyText variant="subtitle" style={sectionStyles.action}>
                    See all {otherEvents.length + 1}
                  </EventlyText>
                </TouchableOpacity>
              ) : null}
            </View>

            {visibleOtherEvents.map(event => (
              <EventRow
                key={`${event.source}:${event.refId}`}
                event={event}
                onPress={() => openEvent(event)}
              />
            ))}
          </View>
        ) : null}

        {offers && (
          <View style={sectionStyles.block}>
            <Offers
              data={offers}
              /*
               * Opens the coupon's terms rather than "claiming" it. A coupon is
               * a code that does its work at checkout, and a tap that claimed
               * something would be promising a discount no booking has agreed
               * to yet.
               */
              onPressOffer={setOpenCoupon}
            />
          </View>
        )}

        {occasions && (
          <View style={sectionStyles.block}>
            <OccasionGrid
              data={occasions}
              onPressOccasion={occasionId =>
                navigation.navigate('Plan', { occasionId })
              }
            />
          </View>
        )}

        {packages && (
          <View style={sectionStyles.block}>
            <Packages
              data={packages}
              // A package's art key is its occasion id, so opening one lands
              // the planner on that occasion rather than a blank first step.
              onPressPackage={item =>
                navigation.navigate('Plan', { occasionId: item.art })
              }
              onPressSeeAll={() =>
                navigation.navigate('Search', { kind: 'packages' })
              }
              savedIds={savedPackageIds}
              onToggleSaved={toggleSavedPackage}
            />
          </View>
        )}

        {topOrganizers && (
          <View style={sectionStyles.block}>
            <TopOrganizers
              data={topOrganizers}
              // The full profile screen, not the old sheet: a sheet was the
              // right size for four facts and the wrong size for a portfolio,
              // a service list and a body of reviews.
              onPressOrganizer={organizerId =>
                navigation.navigate('Organizer', { organizerId })
              }
              onPressSeeAll={() =>
                navigation.navigate('Search', { kind: 'organizers' })
              }
              onPressChangeCity={() => navigation.navigate('Location')}
            />
          </View>
        )}

        {banner?.trust?.length ? <TrustStrip items={banner.trust} /> : null}
      </ScrollView>

      <NameGateSheet onNameSaved={refetch} />
      <CouponSheet coupon={openCoupon} onClose={() => setOpenCoupon(null)} />
    </SafeAreaView>
  );
}

export default HomeScreen;
