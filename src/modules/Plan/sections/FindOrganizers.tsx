import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyButton, EventlyIcon, EventlyText } from '../../../Components';
import { PLAN_ACCENT, PLAN_GREEN, PLAN_NAVY, PLAN_TEXT_MUTED, SORT_OPTIONS, TIER_COLOR } from '../constants';
import { filterModalStyles, organizersStyles } from '../styles';
import { colors } from '../../../theme';
import { ratingThreshold } from '../utils';
import type { PlanDraft, PlanFiltersDTO, PlanOrganizerDTO, RecommendationArgs, RecommendationSort } from '../types';

interface FindOrganizersProps {
  filters: PlanFiltersDTO;
  draft: PlanDraft;
  searchOrganizers: (args: RecommendationArgs) => Promise<PlanOrganizerDTO[]>;
  selectedOrganizerId: string;
  onSelectOrganizer: (id: string) => void;
}

function OrganizerCard({
  organizer,
  isSelected,
  onSelect,
}: {
  organizer: PlanOrganizerDTO;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const unavailable = organizer.available === false;

  return (
    <View style={[organizersStyles.card, unavailable && organizersStyles.cardMuted]}>
      <View style={organizersStyles.topRow}>
        <View style={[organizersStyles.avatar, { backgroundColor: organizer.avatarColor }]}>
          <EventlyText variant="subtitle" style={organizersStyles.avatarText}>
            {organizer.initials}
          </EventlyText>
        </View>
        <View style={organizersStyles.idCol}>
          <View style={organizersStyles.nameRow}>
            <EventlyText variant="subtitle" style={organizersStyles.name}>
              {organizer.name}
            </EventlyText>
            {organizer.concierge ? (
              <View style={organizersStyles.conciergePill}>
                <EventlyIcon name="shield-star-outline" size={11} color={colors.onPrimary} />
                <EventlyText variant="caption" style={organizersStyles.conciergeText}>
                  Evently Managed
                </EventlyText>
              </View>
            ) : (
              <View style={[organizersStyles.tierBadge, { backgroundColor: TIER_COLOR[organizer.tier] }]}>
                <EventlyIcon name="medal-outline" size={11} color={colors.onPrimary} />
                <EventlyText variant="caption" style={organizersStyles.tierBadgeText}>
                  {organizer.tier}
                </EventlyText>
              </View>
            )}
            {typeof organizer.score === 'number' && !organizer.concierge ? (
              <View style={organizersStyles.scorePill}>
                <EventlyIcon name="lightning-bolt" size={11} color={PLAN_ACCENT} />
                <EventlyText variant="caption" style={organizersStyles.scoreText}>
                  {organizer.score}% match
                </EventlyText>
              </View>
            ) : null}
          </View>
          <View style={organizersStyles.ratingRow}>
            <EventlyIcon name="star" size={13} color={colors.accent} />
            <EventlyText variant="subtitle" style={organizersStyles.ratingText}>
              {organizer.rating}
            </EventlyText>
            <EventlyText variant="caption" style={organizersStyles.reviewsText}>
              ({organizer.reviews})
            </EventlyText>
          </View>
          <EventlyText variant="caption" style={organizersStyles.metaText}>
            {organizer.events} events · {organizer.location}
          </EventlyText>
        </View>
      </View>

      {organizer.tags.length > 0 ? (
        <View style={organizersStyles.tagRow}>
          {organizer.tags.map((tag) => (
            <View key={tag} style={organizersStyles.tag}>
              <EventlyText variant="caption" style={organizersStyles.tagText}>
                {tag}
              </EventlyText>
            </View>
          ))}
        </View>
      ) : null}

      {organizer.reasons && organizer.reasons.length > 0 ? (
        <View style={organizersStyles.reasons}>
          {organizer.reasons.slice(0, 5).map((reason) => (
            <View key={reason} style={organizersStyles.reasonRow}>
              <EventlyIcon name="check-bold" size={12} color={PLAN_GREEN} />
              <EventlyText variant="caption" style={organizersStyles.reasonText}>
                {reason}
              </EventlyText>
            </View>
          ))}
        </View>
      ) : (
        <View style={organizersStyles.matchRow}>
          <EventlyIcon name="check-bold" size={13} color={PLAN_GREEN} />
          <EventlyText variant="caption" style={organizersStyles.matchText}>
            Matches {organizer.matches} of {organizer.total}
          </EventlyText>
        </View>
      )}

      <View style={organizersStyles.estRow}>
        {unavailable ? (
          <View style={organizersStyles.unavailRow}>
            <EventlyIcon name="calendar-remove-outline" size={13} color={colors.danger} />
            <EventlyText variant="caption" style={organizersStyles.unavailText}>
              Booked on your date
            </EventlyText>
          </View>
        ) : (
          <View>
            <EventlyText variant="caption" style={organizersStyles.estLabel}>
              EST. RANGE
            </EventlyText>
            <EventlyText variant="subtitle" style={organizersStyles.estValue}>
              {organizer.estRange}
            </EventlyText>
          </View>
        )}
      </View>

      <View style={organizersStyles.actionsRow}>
        <EventlyButton
          title={isSelected ? 'Selected · Review' : 'Select & review'}
          onPress={onSelect}
          disabled={unavailable}
          variant={isSelected ? 'primary' : 'outline'}
          style={organizersStyles.selectButton}
          accentColor={PLAN_ACCENT}
        />
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={filterModalStyles.overlay} onPress={onClose}>
        <Pressable style={filterModalStyles.card} onPress={() => undefined}>
          <View style={filterModalStyles.headRow}>
            <EventlyText variant="h2" style={filterModalStyles.title}>
              Filters
            </EventlyText>
            <TouchableOpacity style={filterModalStyles.closeButton} onPress={onClose} accessibilityLabel="Close filters">
              <EventlyIcon name="close" size={18} color={PLAN_NAVY} />
            </TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            <EventlyText variant="caption" style={filterModalStyles.groupLabel}>
              BADGE TIER
            </EventlyText>
            {filters.tiers.map((tier) => {
              const on = tiers.includes(tier);
              return (
                <TouchableOpacity key={tier} style={filterModalStyles.checkRow} onPress={() => onToggleTier(tier)}>
                  <View style={[filterModalStyles.checkbox, on && filterModalStyles.checkboxOn]}>
                    {on ? <EventlyIcon name="check" size={12} color={colors.onPrimary} /> : null}
                  </View>
                  <EventlyText variant="body" style={filterModalStyles.checkLabel}>
                    {tier}
                  </EventlyText>
                </TouchableOpacity>
              );
            })}

            <EventlyText variant="caption" style={filterModalStyles.groupLabel}>
              MINIMUM RATING
            </EventlyText>
            <View style={filterModalStyles.pillRow}>
              {filters.ratings.map((r) => {
                const on = r === rating;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[filterModalStyles.pill, on && filterModalStyles.pillOn]}
                    onPress={() => onSelectRating(on ? '' : r)}
                  >
                    <EventlyText variant="body" style={on ? filterModalStyles.pillTextOn : filterModalStyles.pillText}>
                      {r}
                    </EventlyText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <EventlyText variant="caption" style={filterModalStyles.groupLabel}>
              CATEGORIES
            </EventlyText>
            {filters.categories.map((category) => {
              const on = categoryFilters.includes(category);
              return (
                <TouchableOpacity key={category} style={filterModalStyles.checkRow} onPress={() => onToggleCategory(category)}>
                  <View style={[filterModalStyles.checkbox, on && filterModalStyles.checkboxOn]}>
                    {on ? <EventlyIcon name="check" size={12} color={colors.onPrimary} /> : null}
                  </View>
                  <EventlyText variant="body" style={filterModalStyles.checkLabel}>
                    {category}
                  </EventlyText>
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
            <EventlyButton title="Done" onPress={onClose} style={filterModalStyles.applyButton} accentColor={PLAN_ACCENT} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function FindOrganizers({ filters, draft, searchOrganizers, selectedOrganizerId, onSelectOrganizer }: FindOrganizersProps) {
  const [tiers, setTiers] = useState<string[]>([]);
  const [rating, setRating] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<RecommendationSort>('best');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

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
      requireCategories: categoryFilters.length ? categoryFilters.map((c) => c.toLowerCase()) : undefined,
    };
    searchOrganizers(args)
      .then((result) => {
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

  const toggleTier = (tier: string) => setTiers((prev) => (prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]));
  const toggleCategoryFilter = (category: string) =>
    setCategoryFilters((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));

  const activeFilterCount = tiers.length + (rating ? 1 : 0) + categoryFilters.length;

  return (
    <View style={organizersStyles.section}>
      <View style={organizersStyles.toolsRow}>
        <EventlyText variant="h2" style={organizersStyles.resultCount}>
          {isLoading ? 'Finding organizers…' : `${organizers.length} organizers match your event`}
        </EventlyText>
        <TouchableOpacity
          style={[organizersStyles.filterButton, activeFilterCount > 0 && organizersStyles.filterButtonActive]}
          onPress={() => setFilterModalVisible(true)}
        >
          <EventlyIcon name="tune-variant" size={14} color={activeFilterCount > 0 ? colors.onPrimary : PLAN_NAVY} />
          <EventlyText variant="caption" style={activeFilterCount > 0 ? organizersStyles.filterButtonTextActive : organizersStyles.filterButtonText}>
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </EventlyText>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={organizersStyles.sortRow}>
        {SORT_OPTIONS.map((option) => {
          const on = option.value === sort;
          return (
            <TouchableOpacity
              key={option.value}
              style={[organizersStyles.sortChip, on && organizersStyles.sortChipActive]}
              onPress={() => setSort(option.value)}
            >
              <EventlyText variant="caption" style={on ? organizersStyles.sortChipTextActive : organizersStyles.sortChipText}>
                {option.label}
              </EventlyText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {!isLoading && organizers.length === 0 ? (
        <View style={organizersStyles.emptyState}>
          <EventlyIcon name="magnify-close" size={40} color={PLAN_TEXT_MUTED} />
          <EventlyText variant="subtitle" style={organizersStyles.emptyTitle}>
            No organizers match your event yet
          </EventlyText>
          <EventlyText variant="body" style={organizersStyles.emptyMessage}>
            We couldn&rsquo;t find organizers for these services in your city. Try broadening your categories or checking back
            soon.
          </EventlyText>
          <EventlyButton
            title="Clear filters"
            onPress={clearFilters}
            variant="outline"
            style={organizersStyles.emptyButton}
            accentColor={PLAN_ACCENT}
          />
        </View>
      ) : (
        <View style={organizersStyles.list}>
          {organizers.map((organizer) => (
            <OrganizerCard
              key={organizer.id}
              organizer={organizer}
              isSelected={organizer.id === selectedOrganizerId}
              onSelect={() => onSelectOrganizer(organizer.id)}
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
