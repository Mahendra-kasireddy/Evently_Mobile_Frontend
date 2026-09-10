import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyText } from '../../Components';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { NameGateSheet } from '../NameCapture';
import { CURRENT_EVENT_CTA, HERO_ACCENT_COLOR, SEARCH_PLACEHOLDER } from './constants';
import { useHomeContainer } from './container';
import { BookedEventCard } from './sections/BookedEventCard';
import { EventHero } from './sections/EventHero';
import { HomeHeader } from './sections/HomeHeader';
import { OccasionGrid } from './sections/OccasionGrid';
import { Offers } from './sections/Offers';
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
  const {
    banner,
    bookedEvent,
    currentEvent,
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

  const hasAnyContent = Boolean(
    bookedEvent || currentEvent || occasions || offers || packages || topOrganizers,
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
   * Where the hero's button goes, by the stage the event has reached.
   *
   * Each destination is a screen that exists and shows the thing the label
   * promises — comparing quotes opens the quotes, opening a workspace opens
   * the booking. A stage with nothing built behind it falls back to the plan
   * it came from rather than to a dead end.
   */
  const handlePressHeroCta = () => {
    if (!currentEvent) return;
    if (currentEvent.source === 'booking') {
      return navigation.navigate('Main', { screen: 'Events' });
    }
    if (currentEvent.stage === 'quotes_received' && currentEvent.quoteCount > 0) {
      return navigation.navigate('CompareQuotes', {
        requestId: currentEvent.refId,
        title: currentEvent.title,
      });
    }
    return navigation.navigate('Plan');
  };

  const handlePressHeroDetails = () =>
    currentEvent?.source === 'booking'
      ? navigation.navigate('Main', { screen: 'Events' })
      : navigation.navigate('Plan');

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
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {banner?.greeting ? (
          <EventlyText variant="body" style={sectionStyles.greeting} numberOfLines={1}>
            {banner.greeting}
          </EventlyText>
        ) : null}

        {/*
          Mutually exclusive, as on web: once there is a live booking, the rich
          card replaces the compact stage widget rather than sitting above a
          second summary of the same event.
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
          />
        ) : currentEvent ? (
          <EventHero
            event={currentEvent}
            ctaLabel={CURRENT_EVENT_CTA[currentEvent.stage]}
            onPressCta={handlePressHeroCta}
            onPressDetails={handlePressHeroDetails}
          />
        ) : null}

        {offers && (
          <View style={sectionStyles.block}>
            <Offers
              data={offers}
              // Terms live with the offer itself; there is nothing to redeem
              // yet, so this opens support rather than pretending otherwise.
              onPressOffer={() => navigation.navigate('LegalSupport')}
            />
          </View>
        )}

        {occasions && (
          <View style={sectionStyles.block}>
            <OccasionGrid
              data={occasions}
              onPressOccasion={(occasionId) => navigation.navigate('Plan', { occasionId })}
            />
          </View>
        )}

        {packages && (
          <View style={sectionStyles.block}>
            <Packages
              data={packages}
              // A package's art key is its occasion id, so opening one lands
              // the planner on that occasion rather than a blank first step.
              onPressPackage={(item) => navigation.navigate('Plan', { occasionId: item.art })}
              onPressSeeAll={() => navigation.navigate('Search', { kind: 'packages' })}
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
              onPressOrganizer={(organizerId) => navigation.navigate('Organizer', { organizerId })}
              onPressSeeAll={() => navigation.navigate('Search', { kind: 'organizers' })}
              onPressChangeCity={() => navigation.navigate('Location')}
            />
          </View>
        )}

        {banner?.trust?.length ? <TrustStrip items={banner.trust} /> : null}
      </ScrollView>

      <NameGateSheet onNameSaved={refetch} />
    </SafeAreaView>
  );
}

export default HomeScreen;
