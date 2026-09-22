import { useCallback, useState } from 'react';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyText } from '../../Components';
import type {
  MainTabParamList,
  RootStackParamList,
} from '../../navigation/types';
import type {
  BookedEventViewModel,
  CouponOffer,
  CurrentEventViewModel,
  HeroDraft,
} from './types';
import { NameGateSheet } from '../NameCapture';
import { HERO_ACCENT_COLOR, OTHER_EVENTS_ON_HOME } from './constants';
import { useOpenWithOrganizer } from '../Chat';
import { useHomeContainer } from './container';
import { useOpenEvent } from './useOpenEvent';
import { CalendarSheet, todayIso } from '../../Components';
import { GuestsSheet, RangeSheet } from '../Pickers';
import { usePlanScreenData } from '../Plan/hooks';
import { Banner } from './sections/Banner';
import { BookedEventCard } from './sections/BookedEventCard';
import { EventRow } from './sections/EventRow';
import { EventHero } from './sections/EventHero';
import { HomeHeroPhoto } from './sections/HomeHeroPhoto';
import { HomeHeader } from './sections/HomeHeader';
import { OccasionGrid } from './sections/OccasionGrid';
import { Offers } from './sections/Offers';
import { CouponSheet } from './sections/CouponSheet';
import { Packages } from './sections/Packages';
import { SectionHead } from './sections/SectionHead';
import { TopOrganizers } from './sections/TopOrganizers';
import { TrustStrip } from './sections/TrustStrip';
import {
  bookedEventStyles as bookedRowStyles,
  sectionStyles,
  styles,
} from './styles';

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
    bookedEvents,
    currentEvent,
    otherEvents,
    occasions,
    offers,
    packages,
    savedPackageIds,
    toggleSavedPackage,
    heroDraft,
    shareBudget,
    budget,
    toggleShareBudget,
    setHeroField,
    submitHeroDraft,
    isRequestingQuotes,
    quotesRequested,
    quotesErrorMessage,
    resetQuotesRequest,
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
  /*
   * Which sheet is up. Occasion and Where are screens rather than sheets —
   * both lists need a search field, and a sheet with the keyboard over it
   * leaves about four rows visible.
   */
  const [openSheet, setOpenSheet] = useState<
    'when' | 'guests' | 'budget' | null
  >(null);

  /* The Plan wizard's own bands, so a budget chosen here and one chosen there
     are the same set — organizers filter on these, and two client-side lists
     would drift. */
  const { data: planScreen } = usePlanScreenData();
  const budgetOptions = planScreen?.budgetOptions ?? [];

  const editField = (field: keyof HeroDraft) => {
    if (field === 'occasion') return navigation.navigate('OccasionPicker');
    if (field === 'where') return navigation.navigate('AreaPicker');
    return setOpenSheet(field);
  };

  const visibleOtherEvents = otherEvents.slice(0, OTHER_EVENTS_ON_HOME);

  const hasAnyContent = Boolean(
    bookedEvents.length > 0 ||
      currentEvent ||
      occasions ||
      offers ||
      packages ||
      topOrganizers,
  );

  const headerProps = {
    initials: header.initials,
    displayName: header.displayName,
    unreadCount: header.unreadCount,
    /* Profile is no longer a tab — this avatar is the way in, and it pushes,
       so the back arrow returns to the feed the customer left. */
    onPressProfile: () => navigation.navigate('Profile'),
    onPressNotifications: () => navigation.navigate('Notification'),
    /* The same place the search field used to open. Saved packages are still
       reachable from Profile, which is where the rest of the account's own
       lists live. */
    onPressSearch: () => navigation.navigate('Search'),
  };

  /**
   * Whether this event is still a brief the customer owns outright.
   *
   * A quote request, before anybody's quote was accepted. Everything else —
   * an accepted quote, a created booking, an event under way — has an
   * organizer on the other side of it, and editing the brief under them would
   * change what somebody has already been paid an advance to deliver.
   */
  const isBriefEditable = (event: CurrentEventViewModel) =>
    event.source === 'quote' &&
    (event.stage === 'submitted' || event.stage === 'quotes_received');

  const renderBooked = (booking: BookedEventViewModel, inRow = false) => (
    <BookedEventCard
      key={booking.id}
      data={booking}
      inRow={inRow}
      onPress={() =>
        navigation.navigate('Workspace', {
          bookingId: booking.id,
          workspaceName: booking.title,
        })
      }
      /* Offered only when there is an organizer to message. A booking with
         none — older rows — gets no button rather than one that fails on
         tap. */
      onMessageOrganizer={
        booking.organizerId
          ? () => messageOrganizer(booking.organizerId, booking.organizerName)
          : undefined
      }
    />
  );

  const openEvent = useOpenEvent();
  const handlePressHeroCta = openEvent;

  /**
   * Every way into a request that is not the main button: the "see all quotes
   * & your brief" link, and tapping one organizer's reply.
   *
   * These always open the list, even where the button would go straight to the
   * side-by-side. The button's job is to carry the customer to the next
   * decision; the link's job is the one it names — all of the quotes, and the
   * brief they answer. A link reading "see all quotes" that opens two of them
   * is a link that lied.
   */
  const openRequest = useCallback(
    (event: CurrentEventViewModel) => {
      if (event.source !== 'quote') return openEvent(event);
      return navigation.navigate('CompareQuotes', {
        requestId: event.refId,
        title: event.title,
      });
    },
    [navigation, openEvent],
  );

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
      onPressDetails={() => openRequest(event)}
      /* Tapping one reply opens the list rather than that quote alone — the
         decision is between them, not about one. */
      onPressQuote={
        event.source === 'quote' ? () => openRequest(event) : undefined
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
    /*
     * No top safe-area edge here, deliberately: the hero photograph runs under
     * the status bar, and insetting the screen would draw a canvas-coloured
     * strip above the picture. The inset is applied inside HomeHeroPhoto, as
     * padding on the controls rather than on the image.
     */
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <HomeHeroPhoto>
          <HomeHeader {...headerProps} onPhoto />
        </HomeHeroPhoto>

        {/*
          Everything below the photograph sits on one opaque sheet, lifted over
          the picture's bottom edge.

          One sheet rather than a lifted first card: the photo is the scroll
          view's own backdrop, so anything that is not covered lets it through
          — which is how it reappeared between the form and the booked card,
          hundreds of points below where it belongs. The sheet is what makes
          "the picture is at the top" true rather than nearly true.
        */}
        <View style={styles.sheet}>
          {/*
          "Tell us the basics" — the four fields a brief needs, and the button
          that sends it.

          Always shown, whatever else the customer has. It was gated on having
          no live event, which sounded reasonable and meant that anyone with a
          request in flight — most people who use the app twice — never saw it
          again. Planning a second event is the thing Home is for.
        */}
          {banner ? (
            <Banner
              heroDraft={heroDraft}
              onEditField={editField}
              onPickDate={iso => setHeroField('when', iso)}
              shareBudget={shareBudget}
              budget={budget}
              onToggleBudget={toggleShareBudget}
              onPressBudgetRange={() => setOpenSheet('budget')}
              onSubmit={submitHeroDraft}
              isSubmitting={isRequestingQuotes}
              quotesRequested={quotesRequested}
              quotesErrorMessage={quotesErrorMessage}
              onEditAgain={resetQuotesRequest}
            />
          ) : null}

          {/*
          The occasions, straight under the button that sends a brief.

          They are the same action the form is — start planning something —
          and they are the way in for a customer who would rather tap
          "Wedding" than fill four fields. Down at the bottom they arrived
          after the events, the coupons and the packages, which is well past
          the point where somebody who did not want the form had given up.
        */}
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

          {/*
          The booked card replaces the hero for the booking itself — the two are
          two renderings of one event, and stacking them would summarise it
          twice. Any OTHER live event follows below on its own hero: a customer
          with a confirmed booking in December and a brief still collecting
          quotes for September has two events, and Home showed only the first.
        */}
          {bookedEvents.length === 1 ? (
            renderBooked(bookedEvents[0])
          ) : bookedEvents.length > 1 ? (
            /*
             * Two bookings and up, side by side.
             *
             * Stacked, a second confirmed booking pushed everything else on Home
             * a full card down; demoted to a row it read like a draft. A swipe
             * keeps both of them the same size as each other and costs the page
             * the height of one.
             */
            <FlatList
              style={bookedRowStyles.row}
              contentContainerStyle={bookedRowStyles.rowContent}
              data={bookedEvents}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => renderBooked(item, true)}
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
            {/*
              "See all", always — the same head every other section on Home
              uses.

              It used to appear only once there were more events than the
              three shown, and count them: "See all 11". So a customer with
              exactly three had no link at all, and the one thing the section
              could not do was take them to the full list. It opens the
              events list now rather than the Events tab, which is the
              screen this section is a preview of.
            */}
            <SectionHead
              title="Your other events"
              actionLabel="See all"
              testID="see-all-events"
              onPressAction={() =>
                navigation.navigate('SeeAll', { kind: 'events' })
              }
            />

            {visibleOtherEvents.map(event => (
              <EventRow
                key={`${event.source}:${event.refId}`}
                event={event}
                onPress={() => openEvent(event)}
                /* Only a brief nobody has been hired off yet: past
                   acceptance there is a booking, and changing the terms is a
                   conversation with the organizer rather than a form. */
                onEdit={
                  isBriefEditable(event)
                    ? () =>
                        navigation.navigate('Plan', { requestId: event.refId })
                    : undefined
                }
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
                /* The row is a carousel, so most of the coupons are off screen. */
                onPressSeeAll={() =>
                  navigation.navigate('SeeAll', { kind: 'offers' })
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

          {/*
            The three promises, at the foot of the screen.

            Last, deliberately: they are what somebody reads after they have
            seen the organizers and before they decide whether to trust the
            platform with a deposit. Admin-editable copy from the feed — the
            strip disappears entirely when nothing is configured, rather than
            making promises the business has not written.
          */}
          {banner ? <TrustStrip items={banner.trust} /> : null}
        </View>
      </ScrollView>

      <CalendarSheet
        visible={openSheet === 'when'}
        value={heroDraft.when}
        minIso={todayIso()}
        title="When is it?"
        onSelect={iso => setHeroField('when', iso)}
        onClose={() => setOpenSheet(null)}
      />

      <RangeSheet
        visible={openSheet === 'budget'}
        title="Budget range"
        subtitle="Organizers quote to this."
        value={budget}
        options={budgetOptions}
        onSelect={value => setHeroField('budget', value)}
        onClose={() => setOpenSheet(null)}
      />

      <GuestsSheet
        visible={openSheet === 'guests'}
        value={heroDraft.guests}
        options={banner?.options.guests ?? []}
        onSelect={value => setHeroField('guests', value)}
        onClose={() => setOpenSheet(null)}
      />

      <NameGateSheet onNameSaved={refetch} />
      <CouponSheet coupon={openCoupon} onClose={() => setOpenCoupon(null)} />
    </View>
  );
}

export default HomeScreen;
