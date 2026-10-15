import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  EventlyButton,
  EventlyIcon,
  AppText,
  EventlyTextInput,
} from '../../../Components';
import {
  MAX_ORGANIZERS,
  PLAN_ACCENT,
  PLAN_GREEN,
  PLAN_NAVY,
  PLAN_TEXT_MUTED,
  SORT_OPTIONS,
} from '../constants';
import { filterModalStyles, organizersStyles } from '../styles';
import { colors } from '../../../theme';
import { ratingThreshold } from '../utils';
import type {
  PlanDraft,
  PlanFiltersDTO,
  PlanOrganizerDTO,
  RecommendationArgs,
  RecommendationSort,
} from '../types';

interface FindOrganizersProps {
  filters: PlanFiltersDTO;
  draft: PlanDraft;
  searchOrganizers: (args: RecommendationArgs) => Promise<PlanOrganizerDTO[]>;
  /** Everyone on the shortlist so far, in the order they were ticked. */
  selectedOrganizerIds: string[];
  onToggleOrganizer: (id: string) => void;
  /** False once the shortlist is full — the card then says so. */
  canAddOrganizer: boolean;
  /** Done choosing; moves to the review. Kept for callers; the sticky footer
      in PlanScreen now carries this action. */
  onReviewShortlist?: () => void;
}

/** "₹2,50,000+" from the estimate's floor; the server's range string otherwise. */
function formatStartingPrice(organizer: PlanOrganizerDTO): string {
  if (typeof organizer.estMin === 'number' && organizer.estMin > 0) {
    return `\u20b9${Math.round(organizer.estMin).toLocaleString('en-IN')}+`;
  }
  return organizer.estRange;
}

function OrganizerCard({
  organizer,
  isSelected,
  canAdd,
  isFavourite,
  onToggle,
  onToggleFavourite,
}: {
  organizer: PlanOrganizerDTO;
  isSelected: boolean;
  canAdd: boolean;
  isFavourite: boolean;
  onToggle: () => void;
  onToggleFavourite: () => void;
}) {
  const unavailable = organizer.available === false;
  // A full shortlist disables the ones not on it, never the ones that are —
  // otherwise the customer cannot undo the tick that filled it.
  const blocked = unavailable || (!isSelected && !canAdd);

  return (
    <View
      style={[
        organizersStyles.card,
        isSelected && organizersStyles.cardSelected,
        unavailable && organizersStyles.cardMuted,
      ]}
    >
      {organizer.imageUrl ? (
        <Image
          source={{ uri: organizer.imageUrl }}
          style={organizersStyles.photo}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            organizersStyles.photo,
            organizersStyles.photoFallback,
            { backgroundColor: organizer.avatarColor },
          ]}
        >
          <AppText variant="h2" style={organizersStyles.photoInitials}>
            {organizer.initials}
          </AppText>
        </View>
      )}

      <View style={organizersStyles.body}>
        {organizer.concierge ? (
          <View style={organizersStyles.conciergePill}>
            <EventlyIcon
              name="shield-star-outline"
              size={10}
              color={colors.onPrimary}
            />
            <AppText variant="label" style={organizersStyles.conciergeText}>
              Evently Managed
            </AppText>
          </View>
        ) : organizer.verified ? (
          <View style={organizersStyles.verifiedPill}>
            <EventlyIcon name="shield-check" size={10} color={PLAN_GREEN} />
            <AppText variant="label" style={organizersStyles.verifiedText}>
              Verified
            </AppText>
          </View>
        ) : null}

        <AppText
          variant="body"
          weight="medium"
          style={organizersStyles.name}
          numberOfLines={1}
        >
          {organizer.name}
        </AppText>

        <View style={organizersStyles.ratingRow}>
          <EventlyIcon name="star" size={13} color={colors.accent} />
          <AppText variant="caption" style={organizersStyles.ratingText}>
            {organizer.rating}
          </AppText>
          <AppText variant="caption" style={organizersStyles.reviewsText}>
            ({organizer.reviews})
          </AppText>
        </View>

        <View style={organizersStyles.locationRow}>
          <EventlyIcon
            name="map-marker-outline"
            size={12}
            color={PLAN_TEXT_MUTED}
          />
          <AppText
            variant="caption"
            style={organizersStyles.metaText}
            numberOfLines={1}
          >
            {organizer.location}
          </AppText>
        </View>

        {organizer.tags.length > 0 ? (
          <View style={organizersStyles.tagRow}>
            {organizer.tags.slice(0, 3).map(tag => (
              <View key={tag} style={organizersStyles.tag}>
                <AppText
                  variant="label"
                  style={organizersStyles.tagText}
                  numberOfLines={1}
                >
                  {tag}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={organizersStyles.side}>
        <TouchableOpacity
          onPress={onToggleFavourite}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            isFavourite
              ? `Remove ${organizer.name} from favourites`
              : `Save ${organizer.name}`
          }
        >
          <EventlyIcon
            name={isFavourite ? 'heart' : 'heart-outline'}
            size={20}
            color={PLAN_ACCENT}
          />
        </TouchableOpacity>

        {unavailable ? (
          <AppText variant="caption" style={organizersStyles.unavailText}>
            Booked on{'\n'}your date
          </AppText>
        ) : (
          <AppText
            variant="bodySmall"
            style={organizersStyles.price}
            numberOfLines={1}
          >
            {formatStartingPrice(organizer)}
          </AppText>
        )}

        <TouchableOpacity
          style={[
            organizersStyles.quoteButton,
            isSelected && organizersStyles.quoteButtonOn,
            blocked && organizersStyles.quoteButtonBlocked,
          ]}
          onPress={onToggle}
          disabled={blocked}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected, disabled: blocked }}
          accessibilityLabel={`Request quote from ${organizer.name}`}
        >
          {isSelected ? (
            <EventlyIcon name="check" size={12} color={colors.onPrimary} />
          ) : null}
          <AppText
            variant="caption"
            style={
              isSelected
                ? organizersStyles.quoteButtonTextOn
                : organizersStyles.quoteButtonText
            }
          >
            {isSelected ? 'Added' : 'Request Quote'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FilterModal({
  visible,
  onClose,
  filters,
  tiers,
  onToggleTier,
  rating,
  onSelectRating,
  categoryFilters,
  onToggleCategory,
  onClear,
}: {
  visible: boolean;
  onClose: () => void;
  filters: PlanFiltersDTO;
  tiers: string[];
  onToggleTier: (tier: string) => void;
  rating: string;
  onSelectRating: (rating: string) => void;
  categoryFilters: string[];
  onToggleCategory: (category: string) => void;
  onClear: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={filterModalStyles.overlay} onPress={onClose}>
        <Pressable style={filterModalStyles.card} onPress={() => undefined}>
          <View style={filterModalStyles.headRow}>
            <AppText variant="h2" style={filterModalStyles.title}>
              Filters
            </AppText>
            <TouchableOpacity
              style={filterModalStyles.closeButton}
              onPress={onClose}
              accessibilityLabel="Close filters"
            >
              <EventlyIcon name="close" size={18} color={PLAN_NAVY} />
            </TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            <AppText variant="caption" style={filterModalStyles.groupLabel}>
              BADGE TIER
            </AppText>
            {filters.tiers.map(tier => {
              const on = tiers.includes(tier);
              return (
                <TouchableOpacity
                  key={tier}
                  style={filterModalStyles.checkRow}
                  onPress={() => onToggleTier(tier)}
                >
                  <View
                    style={[
                      filterModalStyles.checkbox,
                      on && filterModalStyles.checkboxOn,
                    ]}
                  >
                    {on ? (
                      <EventlyIcon
                        name="check"
                        size={12}
                        color={colors.onPrimary}
                      />
                    ) : null}
                  </View>
                  <AppText variant="body" style={filterModalStyles.checkLabel}>
                    {tier}
                  </AppText>
                </TouchableOpacity>
              );
            })}

            <AppText variant="caption" style={filterModalStyles.groupLabel}>
              MINIMUM RATING
            </AppText>
            <View style={filterModalStyles.pillRow}>
              {filters.ratings.map(r => {
                const on = r === rating;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[
                      filterModalStyles.pill,
                      on && filterModalStyles.pillOn,
                    ]}
                    onPress={() => onSelectRating(on ? '' : r)}
                  >
                    <AppText
                      variant="body"
                      style={
                        on
                          ? filterModalStyles.pillTextOn
                          : filterModalStyles.pillText
                      }
                    >
                      {r}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <AppText variant="caption" style={filterModalStyles.groupLabel}>
              CATEGORIES
            </AppText>
            {filters.categories.map(category => {
              const on = categoryFilters.includes(category);
              return (
                <TouchableOpacity
                  key={category}
                  style={filterModalStyles.checkRow}
                  onPress={() => onToggleCategory(category)}
                >
                  <View
                    style={[
                      filterModalStyles.checkbox,
                      on && filterModalStyles.checkboxOn,
                    ]}
                  >
                    {on ? (
                      <EventlyIcon
                        name="check"
                        size={12}
                        color={colors.onPrimary}
                      />
                    ) : null}
                  </View>
                  <AppText variant="body" style={filterModalStyles.checkLabel}>
                    {category}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={filterModalStyles.footerRow}>
            <EventlyButton
              title="Clear filters"
              onPress={onClear}
              variant="outline"
              style={filterModalStyles.clearButton}
              accentColor={PLAN_ACCENT}
            />
            <EventlyButton
              title="Done"
              onPress={onClose}
              style={filterModalStyles.applyButton}
              accentColor={PLAN_ACCENT}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function FindOrganizers({
  filters,
  draft,
  searchOrganizers,
  selectedOrganizerIds,
  onToggleOrganizer,
  canAddOrganizer,
}: FindOrganizersProps) {
  const [tiers, setTiers] = useState<string[]>([]);
  const [rating, setRating] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<RecommendationSort>('best');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  // Session-only for now: there is no saved-organizers API yet.
  const [favourites, setFavourites] = useState<string[]>([]);
  const toggleFavourite = (id: string) =>
    setFavourites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id],
    );

  const [organizers, setOrganizers] = useState<PlanOrganizerDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    const args: RecommendationArgs = {
      categories: draft.categories,
      occasion: draft.occasionId,
      guests: draft.guests || undefined,
      city: draft.city || undefined,
      area: draft.area || undefined,
      budget: draft.budget || undefined,
      eventDate: draft.eventDate || undefined,
      sort,
      minRating: rating ? ratingThreshold(rating) : undefined,
      tiers: tiers.length ? tiers : undefined,
      requireCategories: categoryFilters.length
        ? categoryFilters.map(c => c.toLowerCase())
        : undefined,
    };
    searchOrganizers(args)
      .then(result => {
        if (requestIdRef.current === requestId) {
          setOrganizers(result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (requestIdRef.current === requestId) {
          setOrganizers([]);
          setIsLoading(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tiers,
    rating,
    categoryFilters,
    sort,
    draft.categories,
    draft.occasionId,
    draft.guests,
    draft.city,
    draft.area,
    draft.budget,
    draft.eventDate,
  ]);

  const clearFilters = () => {
    setTiers([]);
    setRating('');
    setCategoryFilters([]);
    setSort('best');
  };

  const toggleTier = (tier: string) =>
    setTiers(prev =>
      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier],
    );
  const toggleCategoryFilter = (category: string) =>
    setCategoryFilters(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category],
    );

  const activeFilterCount =
    tiers.length + (rating ? 1 : 0) + categoryFilters.length;
  const selectedCount = selectedOrganizerIds.length;

  const query = search.trim().toLowerCase();
  const visibleOrganizers = query
    ? organizers.filter(o =>
        [o.name, o.location, ...o.tags].some(field =>
          field.toLowerCase().includes(query),
        ),
      )
    : organizers;

  return (
    <View style={organizersStyles.section}>
      <View style={organizersStyles.searchBar}>
        <EventlyIcon name="magnify" size={20} color={PLAN_TEXT_MUTED} />
        <EventlyTextInput
          style={organizersStyles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search organizers, services or location"
          placeholderTextColor={PLAN_TEXT_MUTED}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={organizersStyles.filterIcon}
          onPress={() => setFilterModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={
            activeFilterCount > 0
              ? `Filters, ${activeFilterCount} on`
              : 'Filters'
          }
        >
          <EventlyIcon
            name="tune-variant"
            size={20}
            color={activeFilterCount > 0 ? PLAN_ACCENT : PLAN_NAVY}
          />
          {activeFilterCount > 0 ? (
            <View style={organizersStyles.filterDot} />
          ) : null}
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={organizersStyles.sortRow}
        contentContainerStyle={organizersStyles.sortRowContent}
      >
        {SORT_OPTIONS.map(option => {
          const on = option.value === sort;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                organizersStyles.sortChip,
                on && organizersStyles.sortChipActive,
              ]}
              onPress={() => setSort(option.value)}
            >
              {on ? (
                <EventlyIcon
                  name="star-outline"
                  size={13}
                  color={colors.onPrimary}
                />
              ) : null}
              <AppText
                variant="caption"
                style={
                  on
                    ? organizersStyles.sortChipTextActive
                    : organizersStyles.sortChipText
                }
              >
                {option.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Says up front that one brief can go to several organizers — each
          quotes separately, so the customer can compare. */}
      <View style={organizersStyles.multiHint}>
        <EventlyIcon
          name="account-multiple-plus-outline"
          size={16}
          color={PLAN_ACCENT}
        />
        <AppText variant="caption" style={organizersStyles.multiHintText}>
          {selectedCount > 0
            ? `${selectedCount} of ${MAX_ORGANIZERS} selected \u00b7 ${
                canAddOrganizer
                  ? 'add more to compare quotes'
                  : 'that is the most one request can go to'
              }`
            : `Request quotes from up to ${MAX_ORGANIZERS} organizers at once and compare.`}
        </AppText>
      </View>

      {isLoading ? (
        <View style={organizersStyles.loading}>
          <ActivityIndicator color={PLAN_ACCENT} />
          <AppText variant="caption" style={organizersStyles.metaText}>
            Finding organizers…
          </AppText>
        </View>
      ) : visibleOrganizers.length === 0 ? (
        <View style={organizersStyles.emptyState}>
          <EventlyIcon name="magnify-close" size={40} color={PLAN_TEXT_MUTED} />
          <AppText variant="h2" style={organizersStyles.emptyTitle}>
            {query
              ? `No organizers match \u201c${search.trim()}\u201d`
              : 'No organizers match your event yet'}
          </AppText>
          <AppText variant="body" style={organizersStyles.emptyMessage}>
            {query
              ? 'Try a different name, service or location.'
              : 'We couldn\u2019t find organizers for these services in your city. Try broadening your categories or checking back soon.'}
          </AppText>
          <EventlyButton
            title={query ? 'Clear search' : 'Clear filters'}
            onPress={query ? () => setSearch('') : clearFilters}
            variant="outline"
            style={organizersStyles.emptyButton}
            accentColor={PLAN_ACCENT}
          />
        </View>
      ) : (
        <View style={organizersStyles.list}>
          {visibleOrganizers.map(organizer => (
            <OrganizerCard
              key={organizer.id}
              organizer={organizer}
              isSelected={selectedOrganizerIds.includes(organizer.id)}
              canAdd={canAddOrganizer}
              isFavourite={favourites.includes(organizer.id)}
              onToggle={() => onToggleOrganizer(organizer.id)}
              onToggleFavourite={() => toggleFavourite(organizer.id)}
            />
          ))}
        </View>
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        tiers={tiers}
        onToggleTier={toggleTier}
        rating={rating}
        onSelectRating={setRating}
        categoryFilters={categoryFilters}
        onToggleCategory={toggleCategoryFilter}
        onClear={clearFilters}
      />
    </View>
  );
}

export default FindOrganizers;
