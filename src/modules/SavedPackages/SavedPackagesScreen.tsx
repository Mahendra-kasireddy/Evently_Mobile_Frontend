import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { SAVED_ACCENT, SAVED_COPY as COPY } from './constants';
import { useSavedPackagesContainer } from './container';
import { SavedPackageCard } from './sections/SavedPackageCard';
import { styles } from './styles';
import type { SavedPackageDTO } from './types';

type SavedNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * What the customer kept for later.
 *
 * The list is the live packages, populated from the ids on the account rather
 * than from a snapshot taken when each was saved — so a package whose price
 * band changed shows the current one, and one that was retired quietly leaves
 * the list instead of sitting here as a card that opens nothing.
 */
export function SavedPackagesScreen() {
  const navigation = useNavigation<SavedNavigationProp>();
  const { items, isLoading, isError, errorMessage, actionError, remove, refetch } =
    useSavedPackagesContainer();

  const openPlanner = (item: SavedPackageDTO) =>
    navigation.navigate('Main', { screen: 'Plan', params: { occasionId: item.art } });

  const header = <AppHeader title={COPY.title} compact />;

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={SAVED_ACCENT} />
          <EventlyText variant="body" style={styles.loadingText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <EventlyText variant="h2" style={styles.emptyTitle}>
            {COPY.errorTitle}
          </EventlyText>
          <EventlyText variant="body" style={styles.errorText}>
            {errorMessage ?? 'Something went wrong.'}
          </EventlyText>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={SAVED_ACCENT} />
            <EventlyText variant="caption" style={styles.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <View style={styles.centered}>
          <View style={styles.centeredIcon}>
            <EventlyIcon name="heart-outline" size={28} color={SAVED_ACCENT} />
          </View>
          <EventlyText variant="h2" style={styles.emptyTitle}>
            {COPY.emptyTitle}
          </EventlyText>
          <EventlyText variant="body" style={styles.emptyBody}>
            {COPY.emptyBody}
          </EventlyText>
          <TouchableOpacity
            style={styles.emptyCta}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            accessibilityRole="button"
            accessibilityLabel={COPY.emptyCta}
          >
            <EventlyText variant="subtitle" style={styles.emptyCtaText}>
              {COPY.emptyCta}
            </EventlyText>
            <EventlyIcon name="chevron-right" size={18} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {header}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListHeaderComponent={
          /* Shown only when a removal came back — the card is already returned. */
          actionError ? (
            <EventlyText variant="caption" style={styles.actionError}>
              {COPY.removeFailed}
            </EventlyText>
          ) : null
        }
        renderItem={({ item }) => (
          <SavedPackageCard
            item={item}
            onPress={() => openPlanner(item)}
            onRemove={() => remove(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

export default SavedPackagesScreen;
