import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { BUDGET_CEILINGS, SEARCH_COPY as COPY } from '../constants';
import { filterSheetStyles as s } from '../styles';
import type { SearchFilters } from '../types';

interface FilterSheetProps {
  visible: boolean;
  filters: SearchFilters;
  occasions: Array<{ id: string; label: string }>;
  cities: string[];
  onSelect: (key: keyof SearchFilters, value: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function ChipGroup({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: Array<{ key: string; label: string }>;
  selected: string;
  onSelect: (value: string) => void;
}) {
  // A group with nothing to choose from is not shown at all — an empty
  // "City" heading reads as a list that failed to load.
  if (options.length === 0) return null;

  return (
    <View style={s.group}>
      <EventlyText variant="caption" style={s.groupTitle}>
        {title}
      </EventlyText>
      <View style={s.chips}>
        {options.map((option) => {
          const on = selected === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[s.chip, on && s.chipOn]}
              activeOpacity={0.8}
              onPress={() => onSelect(option.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${title}: ${option.label}`}
            >
              <EventlyText variant="caption" style={[s.chipText, on && s.chipTextOn]}>
                {option.label}
              </EventlyText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/**
 * The filters, as a sheet.
 *
 * Every option comes from the same lists the plan wizard offers, so a customer
 * cannot filter by an occasion or a city the platform does not actually serve.
 * Tapping the selected chip again clears it — a filter with no way out is a
 * trap, particularly on a screen where the result of getting it wrong is an
 * empty page.
 */
export function FilterSheet({
  visible,
  filters,
  occasions,
  cities,
  onSelect,
  onClear,
  onClose,
}: FilterSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable style={s.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={s.grabber} />
          <View style={s.head}>
            <EventlyText variant="h2" style={s.title}>
              {COPY.filters}
            </EventlyText>
            <TouchableOpacity onPress={onClear} accessibilityRole="button">
              <EventlyText variant="body" style={s.clear}>
                {COPY.clear}
              </EventlyText>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <ChipGroup
              title={COPY.occasion}
              options={occasions.map((o) => ({ key: o.id, label: o.label }))}
              selected={filters.occasion}
              onSelect={(value) => onSelect('occasion', value)}
            />
            <ChipGroup
              title={COPY.city}
              options={cities.map((city) => ({ key: city, label: city }))}
              selected={filters.city}
              onSelect={(value) => onSelect('city', value)}
            />
            <ChipGroup
              title={COPY.budget}
              options={BUDGET_CEILINGS.map((b) => ({ key: b.key, label: b.label }))}
              selected={filters.maxBudget}
              onSelect={(value) => onSelect('maxBudget', value)}
            />

            <TouchableOpacity
              style={s.apply}
              activeOpacity={0.85}
              onPress={onClose}
              accessibilityRole="button"
            >
              <EventlyText variant="subtitle" style={s.applyText}>
                {COPY.apply}
              </EventlyText>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default FilterSheet;
