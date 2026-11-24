import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { ENQUIRIES_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { toolbarStyles as s } from '../styles';
import type { EnquiryFilter, FilterChip } from '../types';

/** Search, the stage chips with their counts, and the 24-hour tip. */
export function Toolbar({
  chips,
  filter,
  onFilter,
  query,
  onQuery,
  showNotice,
}: {
  chips: FilterChip[];
  filter: EnquiryFilter;
  onFilter: (filter: EnquiryFilter) => void;
  query: string;
  onQuery: (query: string) => void;
  showNotice: boolean;
}) {
  return (
    <View style={s.wrap}>
      <View style={s.search}>
        <EventlyIcon name="magnify" size={20} color={ORG_INK.inkFaint} />
        <TextInput
          style={s.input}
          value={query}
          onChangeText={onQuery}
          placeholder={COPY.searchPlaceholder}
          placeholderTextColor={ORG_INK.inkFaint}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel={COPY.searchPlaceholder}
        />
        {query ? (
          <Pressable
            onPress={() => onQuery('')}
            hitSlop={8}
            accessibilityLabel={COPY.clearSearch}
          >
            <EventlyIcon
              name="close-circle"
              size={18}
              color={ORG_INK.inkFaint}
            />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chips}
        accessibilityRole="tablist"
      >
        {chips.map(chip => {
          const on = chip.key === filter;
          return (
            <Pressable
              key={chip.key}
              style={[s.chip, on && s.chipOn]}
              onPress={() => onFilter(chip.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${chip.label}, ${chip.count}`}
            >
              <AppText
                variant="bodySmall"
                style={[s.chipText, on && s.chipTextOn]}
              >
                {chip.label}
              </AppText>
              <View style={[s.count, on && s.countOn]}>
                <AppText
                  variant="label"
                  style={[s.countText, on && s.countTextOn]}
                >
                  {chip.count}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {showNotice ? (
        <View style={s.notice}>
          <EventlyIcon
            name="lightning-bolt"
            size={16}
            color={ORG_ACCENT.saffron}
          />
          <AppText variant="caption" style={s.noticeText}>
            {COPY.slaNotice}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

export default Toolbar;
