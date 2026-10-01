import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../../Components';
import { SORT_OPTIONS, type SortKey } from '../constants';
import { PE_ACCENT, PE_NAVY } from '../styles';
import { PE_MUTED, filterUi as s, ui } from '../ui.styles';

export interface EventFilters {
  /** '' is every city. */
  city: string;
  sort: SortKey;
}

export const NO_EVENT_FILTERS: EventFilters = { city: '', sort: 'soon' };

/** Above this many cities the list gets a search box of its own. */
const CITY_SEARCH_FROM = 8;

interface FilterSheetProps {
  visible: boolean;
  value: EventFilters;
  /** The city from the customer's shared location, '' if unknown. */
  currentCity: string;
  /** Every city events are listed in. */
  cities: string[];
  onApply: (next: EventFilters) => void;
  onClose: () => void;
}

/**
 * Location and order, chosen together and applied together.
 *
 * Edits stay in the sheet until "Apply", so trying a city does not reload the
 * list behind the sheet on every tap — and closing it changes nothing.
 */
export function FilterSheet({
  visible,
  value,
  currentCity,
  cities,
  onApply,
  onClose,
}: FilterSheetProps) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<EventFilters>(value);
  const [cityQuery, setCityQuery] = useState('');

  // Each opening starts from what is applied now.
  useEffect(() => {
    if (visible) {
      setDraft(value);
      setCityQuery('');
    }
  }, [visible, value]);

  const shownCities = useMemo(() => {
    const all = Array.from(
      new Set([...cities].map(c => c.trim()).filter(Boolean)),
    ).filter(c => c.toLowerCase() !== currentCity.toLowerCase());
    const q = cityQuery.trim().toLowerCase();
    return q ? all.filter(c => c.toLowerCase().includes(q)) : all;
  }, [cities, currentCity, cityQuery]);

  const cityChip = (label: string, cityValue: string, icon?: string) => {
    const on = draft.city.toLowerCase() === cityValue.toLowerCase();
    return (
      <TouchableOpacity
        key={`city-${cityValue || 'all'}`}
        style={[s.chip, on && s.chipOn]}
        onPress={() => setDraft(d => ({ ...d, city: cityValue }))}
        accessibilityRole="radio"
        accessibilityState={{ selected: on }}
      >
        {icon ? (
          <EventlyIcon
            name={icon}
            size={15}
            color={on ? '#ffffff' : PE_ACCENT}
          />
        ) : null}
        <EventlyText variant="caption" style={[s.chipText, on && s.chipTextOn]}>
          {label}
        </EventlyText>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={ui.sheetOverlay} onPress={onClose}>
        <Pressable
          style={[
            ui.sheet,
            s.sheet,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
          onPress={() => undefined}
        >
          <View style={ui.sheetHandle} />
          <View style={s.head}>
            <EventlyText variant="subtitle" style={s.title}>
              Filters
            </EventlyText>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
            >
              <EventlyIcon name="close" size={22} color={PE_NAVY} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <EventlyText variant="caption" style={s.label}>
              LOCATION
            </EventlyText>
            {cities.length > CITY_SEARCH_FROM ? (
              <View style={s.citySearch}>
                <EventlyIcon name="magnify" size={16} color={PE_MUTED} />
                <TextInput
                  style={s.citySearchInput}
                  value={cityQuery}
                  onChangeText={setCityQuery}
                  placeholder="Search city"
                  placeholderTextColor={PE_MUTED}
                  accessibilityLabel="Search city"
                />
              </View>
            ) : null}
            <View style={s.chips}>
              {cityChip('All cities', '', 'earth')}
              {currentCity
                ? cityChip(currentCity, currentCity, 'crosshairs-gps')
                : null}
              {shownCities.map(c => cityChip(c, c))}
            </View>
            {!currentCity ? (
              <EventlyText variant="caption" style={s.hint}>
                Share your location to see your city here first.
              </EventlyText>
            ) : null}

            <EventlyText variant="caption" style={[s.label, s.labelGap]}>
              SORT BY
            </EventlyText>
            <View style={s.chips}>
              {SORT_OPTIONS.map(option => {
                const on = draft.sort === option.key;
                return (
                  <TouchableOpacity
                    key={option.key}
                    style={[s.chip, on && s.chipOn]}
                    onPress={() => setDraft(d => ({ ...d, sort: option.key }))}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                  >
                    <EventlyText
                      variant="caption"
                      style={[s.chipText, on && s.chipTextOn]}
                    >
                      {option.label}
                    </EventlyText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={s.actions}>
            <TouchableOpacity
              style={[ui.outline, s.action]}
              onPress={() => setDraft(NO_EVENT_FILTERS)}
              accessibilityRole="button"
            >
              <EventlyText variant="body" style={ui.outlineText}>
                Reset
              </EventlyText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[ui.primary, s.action]}
              onPress={() => {
                onApply(draft);
                onClose();
              }}
              accessibilityRole="button"
            >
              <EventlyText variant="body" style={ui.primaryText}>
                Apply
              </EventlyText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** How many filters differ from the defaults — the badge on the button. */
export function activeFilterCount(f: EventFilters): number {
  return (f.city ? 1 : 0) + (f.sort !== NO_EVENT_FILTERS.sort ? 1 : 0);
}
