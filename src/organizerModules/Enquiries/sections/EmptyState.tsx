import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { ENQUIRIES_COPY as COPY } from '../constants';
import { ORG_ACCENT } from '../design';
import { emptyStyles as s, styles as base } from '../styles';
import type { EnquiryFilter } from '../types';

/** What an empty list means, for the chip the organizer is on — or the search. */
export function EmptyState({
  filter,
  query,
  onClearSearch,
}: {
  filter: EnquiryFilter;
  query: string;
  onClearSearch: () => void;
}) {
  const searching = query.trim().length > 0;
  const copy = COPY.empty[filter];
  return (
    <View style={s.wrap}>
      <View style={s.icon}>
        <EventlyIcon
          name={
            searching
              ? 'magnify-close'
              : filter === 'new'
              ? 'check-all'
              : 'inbox-outline'
          }
          size={26}
          color={ORG_ACCENT.saffron}
        />
      </View>
      <AppText variant="h3" style={base.title}>
        {searching ? COPY.noMatch(query.trim()) : copy.title}
      </AppText>
      {searching ? (
        <Pressable
          onPress={onClearSearch}
          hitSlop={8}
          accessibilityRole="button"
        >
          <AppText variant="bodySmall" style={s.link}>
            {COPY.clearSearch}
          </AppText>
        </Pressable>
      ) : (
        <AppText variant="body" style={base.muted}>
          {copy.body}
        </AppText>
      )}
    </View>
  );
}

export default EmptyState;
