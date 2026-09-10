import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { Packages } from '../Home/sections/Packages';
import { TopOrganizers } from '../Home/sections/TopOrganizers';
import { mapPackages, mapTopOrganizers } from '../Home/utils';
import type { HomeFeedDTO } from '../Home/types';
import { SEARCH_ACCENT, SEARCH_COPY as COPY } from './constants';
import { useSearchContainer } from './container';
import { FilterSheet } from './sections/FilterSheet';
import { styles as s } from './styles';
import type { SearchKind } from './types';

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SearchRouteProp = RouteProp<RootStackParamList, 'Search'>;

const TABS: Array<{ key: SearchKind; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'packages', label: COPY.packages },
  { key: 'organizers', label: COPY.organizers },
];

/**
 * Packages and organizers matching what the customer typed.
 *
 * The results reuse Home's own cards rather than defining leaner ones: a
 * package found by searching is the same package, and a second card would be a
 * second place for its price, rating and save state to drift. They are fed
 * through the same mappers by wrapping the response in the shape those
 * mappers read — cheaper than duplicating them, and it means a change to how a
 * price is printed lands in both places at once.
 */
export function SearchScreen() {
  const navigation = useNavigation<SearchNavigationProp>();
  const { params } = useRoute<SearchRouteProp>();
  const container = useSearchContainer(params?.kind ?? 'all');
  const [filtersOpen, setFiltersOpen] = useState(params?.openFilters === true);

  const { results, isIdle, isLoading, errorMessage } = container;

  // The mappers read a home payload; only these fields are consulted, and
  // giving them the search response keeps one set of card-building rules.
  const asFeed = { packages: results.packages, topOrganizers: results.organizers } as HomeFeedDTO;
  const packages = mapPackages(asFeed);
  const organizers = mapTopOrganizers(asFeed);

  const bar = (
    <View style={s.bar}>
      <TouchableOpacity
        style={s.back}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <EventlyIcon name="chevron-left" size={26} color={colors.text} />
      </TouchableOpacity>

      <View style={s.field}>
        <EventlyIcon name="magnify" size={20} color={colors.textMuted} />
        <TextInput
          style={s.input}
          value={container.query}
          onChangeText={container.setQuery}
          onSubmitEditing={container.runSearch}
          placeholder={COPY.placeholder}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoFocus={!params?.openFilters}
          accessibilityLabel={COPY.placeholder}
        />
      </View>

      <TouchableOpacity
        style={s.filterButton}
        activeOpacity={0.85}
        onPress={() => setFiltersOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={
          container.activeFilterCount > 0
            ? `${COPY.filters}, ${container.activeFilterCount} set`
            : COPY.filters
        }
      >
        <EventlyIcon name="tune-variant" size={20} color={colors.onPrimary} />
        {container.activeFilterCount > 0 ? (
          <View style={s.filterBadge}>
            <EventlyText variant="caption" style={s.filterBadgeText}>
              {container.activeFilterCount}
            </EventlyText>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );

  const tabs = (
    <View style={s.tabs} accessibilityRole="tablist">
      {TABS.map((tab) => {
        const on = container.kind === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[s.tab, on && s.tabOn]}
            activeOpacity={0.8}
            onPress={() => container.setKind(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
          >
            <EventlyText variant="caption" style={[s.tabText, on && s.tabTextOn]}>
              {tab.label}
            </EventlyText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const body = () => {
    if (isLoading) {
      return (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={SEARCH_ACCENT} />
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={s.centered}>
          <EventlyText variant="h2" style={s.emptyTitle}>
            {COPY.errorTitle}
          </EventlyText>
          <EventlyText variant="body" style={s.errorText}>
            {errorMessage}
          </EventlyText>
          <TouchableOpacity
            style={s.retryButton}
            activeOpacity={0.8}
            onPress={container.runSearch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={SEARCH_ACCENT} />
            <EventlyText variant="caption" style={s.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      );
    }

    // Before the first search there is nothing to say about results, so the
    // screen says what it can be asked instead of showing an empty state.
    if (isIdle) {
      return (
        <View style={s.centered}>
          <View style={s.centeredIcon}>
            <EventlyIcon name="magnify" size={28} color={SEARCH_ACCENT} />
          </View>
          <EventlyText variant="h2" style={s.emptyTitle}>
            {COPY.idleTitle}
          </EventlyText>
          <EventlyText variant="body" style={s.emptyBody}>
            {COPY.idleBody}
          </EventlyText>
        </View>
      );
    }

    if (results.total === 0) {
      return (
        <View style={s.centered}>
          <EventlyText variant="h2" style={s.emptyTitle}>
            {COPY.emptyTitle}
          </EventlyText>
          <EventlyText variant="body" style={s.emptyBody}>
            {COPY.emptyBody}
          </EventlyText>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        <EventlyText variant="caption" style={s.countLine}>
          {COPY.resultCount(results.total)}
        </EventlyText>

        {packages ? (
          <Packages
            data={packages}
            onPressPackage={(item) =>
              navigation.navigate('Main', { screen: 'Plan', params: { occasionId: item.art } })
            }
            onPressSeeAll={() => container.setKind('packages')}
            savedIds={[]}
            onToggleSaved={() => {}}
          />
        ) : null}

        {organizers ? (
          <TopOrganizers
            data={organizers}
            onPressOrganizer={(organizerId) => navigation.navigate('Organizer', { organizerId })}
            onPressSeeAll={() => container.setKind('organizers')}
            onPressChangeCity={() => navigation.navigate('Location')}
          />
        ) : null}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {bar}
      {tabs}
      {body()}
      <FilterSheet
        visible={filtersOpen}
        filters={container.filters}
        occasions={container.occasions}
        cities={container.cities}
        onSelect={container.setFilter}
        onClear={container.clearFilters}
        onClose={() => {
          setFiltersOpen(false);
          container.runSearch();
        }}
      />
    </SafeAreaView>
  );
}

export default SearchScreen;
