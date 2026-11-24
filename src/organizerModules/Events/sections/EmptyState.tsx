import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { EVENTS_COPY as COPY } from '../constants';
import { ORG_ACCENT } from '../design';
import { emptyStyles as s, styles as base } from '../styles';
import type { EventsView } from '../types';

/** An empty list, and — for Upcoming — the way to get the first booking. */
export function EmptyState({
  view,
  onSeeEnquiries,
}: {
  view: EventsView;
  onSeeEnquiries: () => void;
}) {
  const copy = view === 'upcoming' ? COPY.emptyUpcoming : COPY.emptyPast;
  return (
    <View style={s.wrap}>
      <View style={s.icon}>
        <EventlyIcon
          name={view === 'upcoming' ? 'party-popper' : 'history'}
          size={26}
          color={ORG_ACCENT.saffron}
        />
      </View>
      <AppText variant="h3" style={base.title}>
        {copy.title}
      </AppText>
      <AppText variant="body" style={base.muted}>
        {copy.body}
      </AppText>
      {view === 'upcoming' ? (
        <Pressable
          onPress={onSeeEnquiries}
          hitSlop={8}
          accessibilityRole="button"
        >
          <AppText variant="bodySmall" style={s.link}>
            {COPY.emptyUpcoming.action}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

export default EmptyState;
