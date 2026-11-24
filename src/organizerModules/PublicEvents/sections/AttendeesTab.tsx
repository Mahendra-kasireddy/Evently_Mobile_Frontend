import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { AppText, EventlyIcon, ThinkingOrbs } from '../../../Components';
import type { AttendeesResult } from '../container';
import { ATTENDEE_FILTERS, PUBLIC_EVENTS_COPY } from '../constants';
import { ORG_INK, ORG_ORB_COLORS, WHITE } from '../design';
import { attendeeStyles as s, styles as screen } from '../styles';
import type { AttendeeRowModel } from '../types';
import { EmptyState } from './EmptyState';
import { FilterChips } from './FilterChips';
import { LoadMore } from './LoadMore';
import { StatusChip } from './StatusChip';

const COPY = PUBLIC_EVENTS_COPY.attendees;

const FILTER_OPTIONS = ATTENDEE_FILTERS.map(key => ({
  key,
  label: COPY.filters[key],
}));

function AttendeeRow({
  row,
  first,
  checkInOpen,
  checking,
  onCheckIn,
}: {
  row: AttendeeRowModel;
  first: boolean;
  checkInOpen: boolean;
  checking: boolean;
  onCheckIn: () => void;
}) {
  return (
    <View style={[s.row, !first && s.divider]}>
      <View style={s.avatar}>
        <AppText variant="bodySmall" style={s.initials}>
          {row.initials}
        </AppText>
      </View>
      <View style={s.body}>
        <AppText variant="body" style={s.name} numberOfLines={1}>
          {row.name}
        </AppText>
        <AppText variant="caption" style={s.meta} numberOfLines={1}>
          {row.ticketType}
        </AppText>
        <AppText variant="caption" style={s.code} selectable>
          {row.code}
        </AppText>
        {row.checkedInAt ? (
          <AppText variant="caption" style={s.meta}>
            {row.checkedInAt}
          </AppText>
        ) : null}
      </View>
      <View style={s.side}>
        <StatusChip status={row.state} />
        {row.canCheckIn && checkInOpen ? (
          <Pressable
            style={s.checkIn}
            onPress={onCheckIn}
            disabled={checking}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.checkIn}: ${row.name}`}
          >
            {checking ? (
              <ActivityIndicator size="small" color={WHITE} />
            ) : (
              <AppText variant="label" style={s.checkInText}>
                {COPY.checkIn}
              </AppText>
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/** Who is coming: search, a filter, and one row per seat. */
export function AttendeesTab({
  a,
  checkInOpen,
}: {
  a: AttendeesResult;
  checkInOpen: boolean;
}) {
  return (
    <View style={screen.section}>
      <View style={s.search}>
        <EventlyIcon name="magnify" size={20} color={ORG_INK.inkSoft} />
        <TextInput
          style={s.searchInput}
          value={a.query}
          onChangeText={a.setQuery}
          placeholder={COPY.searchPh}
          placeholderTextColor={ORG_INK.inkFaint}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          accessibilityLabel={COPY.searchPh}
        />
        {a.query ? (
          <Pressable
            onPress={() => a.setQuery('')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={PUBLIC_EVENTS_COPY.close}
          >
            <EventlyIcon
              name="close-circle"
              size={18}
              color={ORG_INK.inkFaint}
            />
          </Pressable>
        ) : null}
      </View>
      <FilterChips
        options={FILTER_OPTIONS}
        value={a.filter}
        onChange={a.setFilter}
        scroll={false}
      />

      {a.isLoading ? (
        <View style={s.loading}>
          <ThinkingOrbs size={40} colors={ORG_ORB_COLORS} />
        </View>
      ) : a.errorMessage ? (
        <AppText variant="body" style={screen.muted}>
          {a.errorMessage}
        </AppText>
      ) : a.rows.length === 0 ? (
        a.filter === 'all' && !a.query ? (
          <EmptyState
            icon="account-group-outline"
            title={COPY.emptyTitle}
            body={COPY.emptyBody}
          />
        ) : (
          <AppText variant="body" style={screen.muted}>
            {COPY.emptyFiltered}
          </AppText>
        )
      ) : (
        <>
          <AppText variant="caption" style={screen.countLine}>
            {COPY.count(a.rows.length, a.total)}
          </AppText>
          <View style={s.list}>
            {a.rows.map((row, i) => (
              <AttendeeRow
                key={row.id}
                row={row}
                first={i === 0}
                checkInOpen={checkInOpen}
                checking={!!a.checking[row.id]}
                onCheckIn={() => a.checkInRow(row.id)}
              />
            ))}
          </View>
          {a.hasMore ? (
            <LoadMore loading={a.isLoadingMore} onPress={a.loadMore} />
          ) : null}
        </>
      )}
    </View>
  );
}

export default AttendeesTab;
