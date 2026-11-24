import { ScrollView, View } from 'react-native';
import { AppText, EventlyIcon, PressableScale } from '../../../Components';
import { HOME_COPY as COPY } from '../constants';
import { ORG_INK } from '../design';
import { styles as base, weekStyles as s } from '../styles';
import type { UpcomingEvent } from '../types';
import { SectionTitle } from './SectionTitle';

/** The week ahead as date cards, side by side; each opens that event. */
export function NextSevenDays({
  events,
  onOpenEvent,
  onOpenCalendar,
}: {
  events: UpcomingEvent[];
  onOpenEvent: (event: UpcomingEvent) => void;
  onOpenCalendar: () => void;
}) {
  return (
    <View>
      <View style={base.sectionPad}>
        <SectionTitle
          title={COPY.weekTitle}
          action={COPY.weekCalendar}
          onPressAction={onOpenCalendar}
        />
      </View>
      {events.length === 0 ? (
        <View style={s.empty}>
          <EventlyIcon
            name="calendar-blank-outline"
            size={26}
            color={ORG_INK.inkFaint}
          />
          <AppText variant="body" style={s.emptyTitle}>
            {COPY.weekEmpty}
          </AppText>
          <AppText variant="caption" style={base.muted}>
            {COPY.weekEmptyHint}
          </AppText>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.list}
        >
          {events.map(event => (
            <PressableScale
              key={event.id}
              style={s.card}
              onPress={() => onOpenEvent(event)}
              accessibilityRole="button"
              accessibilityLabel={`${event.title}, ${event.when}`}
            >
              <View style={s.date}>
                <AppText variant="h2" style={s.day}>
                  {event.day}
                </AppText>
                <AppText variant="label" style={s.month}>
                  {event.month}
                </AppText>
              </View>
              <View style={s.body}>
                <AppText variant="label" style={s.when}>
                  {event.when}
                </AppText>
                <AppText variant="body" style={s.title} numberOfLines={1}>
                  {event.title}
                </AppText>
                {event.customerName ? (
                  <AppText
                    variant="caption"
                    style={s.customer}
                    numberOfLines={1}
                  >
                    {event.customerName}
                  </AppText>
                ) : null}
              </View>
            </PressableScale>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default NextSevenDays;
