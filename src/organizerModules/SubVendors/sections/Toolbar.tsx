import { Pressable, ScrollView, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { SUBVENDORS_COPY as COPY } from '../constants';
import { ORG_ACCENT } from '../design';
import { toolbarStyles as s } from '../styles';
import type { CategoryFilter, FilterChip } from '../types';

/** The last action's outcome, the team size, and the category chips. */
export function Toolbar({
  teamSize,
  chips,
  filter,
  onFilter,
  notice,
  onDismissNotice,
}: {
  teamSize: number;
  chips: FilterChip[];
  filter: CategoryFilter;
  onFilter: (filter: CategoryFilter) => void;
  notice: string | null;
  onDismissNotice: () => void;
}) {
  return (
    <View style={s.wrap}>
      {notice ? (
        <View style={s.notice} accessibilityLiveRegion="polite">
          <EventlyIcon
            name="check-circle-outline"
            size={16}
            color={ORG_ACCENT.saffron}
          />
          <AppText variant="caption" style={s.noticeText}>
            {notice}
          </AppText>
          <Pressable
            onPress={onDismissNotice}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={COPY.dismiss}
          >
            <EventlyIcon name="close" size={16} color="#8a5410" />
          </Pressable>
        </View>
      ) : null}

      {teamSize > 0 ? (
        <AppText variant="bodySmall" style={s.summary}>
          {COPY.teamCount(teamSize)}
        </AppText>
      ) : null}

      {chips.length > 2 ? (
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
      ) : null}
    </View>
  );
}

export default Toolbar;
