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
import { Categories } from './sections/Categories';
import { CurrentEventCard } from './sections/CurrentEventCard';
import { FeaturedEvents } from './sections/FeaturedEvents';
import { HomeHeader } from './sections/HomeHeader';
import { HowItWorks } from './sections/HowItWorks';
import { PlanSmarter } from './sections/PlanSmarter';
import { RecommendedEvents } from './sections/RecommendedEvents';
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
    currentEvent,
    categories,
    featuredEvents,
    recommendedEvents,
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
  } = useHomeContainer();

  const hasAnyContent = Boolean(
    banner || currentEvent || categories || featuredEvents || recommendedEvents || howItWorks || tools,
  );

  const handlePressLocation = () => navigation.navigate('Location');
  const handlePressNotifications = () => navigation.navigate('Notification');
  const handlePressOccasion = (occasionId: string) => navigation.navigate('Plan', { occasionId });
  const handlePressPlanGeneric = () => navigation.navigate('Plan');

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
            heroDraft={heroDraft}
            onChangeField={setHeroField}
            onSubmit={submitHeroDraft}
            isSubmitting={isRequestingQuotes}
            quotesRequested={quotesRequested}
            quotesErrorMessage={quotesErrorMessage}
            onEditAgain={resetQuotesRequest}
          />
        )}
        {currentEvent && <CurrentEventCard data={currentEvent} />}
        {categories && <Categories data={categories} onPressOccasion={handlePressOccasion} />}
        {howItWorks && <HowItWorks data={howItWorks} />}
        {recommendedEvents && <RecommendedEvents data={recommendedEvents} />}
        {featuredEvents && (
          <FeaturedEvents
            data={featuredEvents}
            onPressPackage={handlePressPlanGeneric}
            onPressBuildYourOwn={handlePressPlanGeneric}
          />
        )}
        {tools && <PlanSmarter data={tools} />}
      </ScrollView>
      <NameGateSheet onNameSaved={refetch} />
    </SafeAreaView>
  );
}

export default HomeScreen;
