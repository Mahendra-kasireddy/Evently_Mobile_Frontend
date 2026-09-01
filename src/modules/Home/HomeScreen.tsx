import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { NameGateSheet } from '../NameCapture';
import { useHomeContainer } from './container';
import { Banner } from './sections/Banner';
import { BookedEventCard } from './sections/BookedEventCard';
import { Categories } from './sections/Categories';
import { CurrentEventCard } from './sections/CurrentEventCard';
import { Packages } from './sections/Packages';
import { HomeHeader } from './sections/HomeHeader';
import { HowItWorks } from './sections/HowItWorks';
import { PlanSmarter } from './sections/PlanSmarter';
import { OrganizerProfileSheet } from './sections/OrganizerProfileSheet';
import { TopOrganizers } from './sections/TopOrganizers';
import { styles } from './styles';

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
    categories,
    packages,
    topOrganizers,
    howItWorks,
    tools,
    header,
    isLoading,
    isError,
    errorMessage,
    refetch,
    heroDraft,
    setHeroField,
    submitHeroDraft,
    isRequestingQuotes,
    quotesRequested,
    quotesErrorMessage,
    resetQuotesRequest,
    organizerRequestedIds,
    organizerRequestingId,
    organizerRequestError,
    requestQuoteFrom,
    openOrganizerProfile,
    closeOrganizerProfile,
    organizerProfileId,
    organizerProfile,
    isLoadingOrganizerProfile,
    organizerProfileError,
  } = useHomeContainer();

  const hasAnyContent = Boolean(
    banner ||
      bookedEvent ||
      currentEvent ||
      categories ||
      packages ||
      topOrganizers ||
      howItWorks ||
      tools,
  );

  const handlePressLocation = () => navigation.navigate('Location');
  const handlePressNotifications = () => navigation.navigate('Notification');
  const handlePressOccasion = (occasionId: string) => navigation.navigate('Plan', { occasionId });
  const handlePressPlanGeneric = () => navigation.navigate('Plan');

  // Where the hero card's rows lead depends on which real record the event
  // resolved from. A booking has its own screen; a quote request does not yet,
  // so it opens the plan it was raised from — which is what the card's button
  // says it will do.
  const handlePressCurrentEvent = () => {
    if (currentEvent?.source === 'booking') {
      navigation.navigate('Bookings');
      return;
    }
    navigation.navigate('Plan');
  };

  const headerProps = {
    locationLabel: header.locationLabel,
    unreadCount: header.unreadCount,
    onPressLocation: handlePressLocation,
    onPressNotifications: handlePressNotifications,
  };

  if (isLoading && !hasAnyContent) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <HomeHeader {...headerProps} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
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
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {banner && (
          <Banner
            data={banner}
            currentEvent={currentEvent}
            // Only the very first load; a pull-to-refresh keeps whatever is on
            // screen rather than flashing placeholders over it.
            isFeedLoading={isLoading && !hasAnyContent}
            feedErrorMessage={isError ? (errorMessage ?? 'Something went wrong.') : null}
            onRetryFeed={refetch}
            onPressCurrentEvent={handlePressCurrentEvent}
            heroDraft={heroDraft}
            onChangeField={setHeroField}
            onSubmit={submitHeroDraft}
            isSubmitting={isRequestingQuotes}
            quotesRequested={quotesRequested}
            quotesErrorMessage={quotesErrorMessage}
            onEditAgain={resetQuotesRequest}
          />
        )}
        {/*
          Mutually exclusive, as on web: once there is a live booking, the rich
          card replaces the compact stage widget rather than sitting above a
          second summary of the same event.
        */}
        {bookedEvent ? (
          <BookedEventCard
            data={bookedEvent}
            // Straight into this booking's workspace. The name is passed
            // through so the header is right during the first load rather
            // than reading "Your event workspace" for a moment.
            onPress={() =>
              navigation.navigate('Workspace', {
                bookingId: bookedEvent.id,
                workspaceName: bookedEvent.title,
              })
            }
          />
        ) : (
          currentEvent && <CurrentEventCard data={currentEvent} />
        )}
        {categories && <Categories data={categories} onPressOccasion={handlePressOccasion} />}
        {howItWorks && <HowItWorks data={howItWorks} />}
        {topOrganizers && (
          <TopOrganizers
            data={topOrganizers}
            onPressProfile={openOrganizerProfile}
            onPressQuote={requestQuoteFrom}
            requestedIds={organizerRequestedIds}
            requestingId={organizerRequestingId}
            requestErrorMessage={organizerRequestError}
            onPressChangeCity={handlePressLocation}
          />
        )}
        {packages && (
          <Packages
            data={packages}
            // A package's art key is its occasion id, so "Explore package"
            // opens the planner already set to that occasion rather than to a
            // blank first step.
            onPressPackage={(item) => navigation.navigate('Plan', { occasionId: item.art })}
            onPressBuildYourOwn={handlePressPlanGeneric}
          />
        )}
        {tools && <PlanSmarter data={tools} />}
      </ScrollView>
      <OrganizerProfileSheet
        organizerId={organizerProfileId}
        profile={organizerProfile}
        isLoading={isLoadingOrganizerProfile}
        errorMessage={organizerProfileError}
        onClose={closeOrganizerProfile}
      />
      <NameGateSheet onNameSaved={refetch} />
    </SafeAreaView>
  );
}

export default HomeScreen;
