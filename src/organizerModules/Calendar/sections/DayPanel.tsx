import { View } from 'react-native';
import {
  AppText,
  EventlyButton,
  EventlyIcon,
  FadeInUp,
} from '../../../Components';
import { CALENDAR_COPY as COPY } from '../constants';
import { DAY_LOOK, ORG_ACCENT, ORG_INK } from '../design';
import { dayStyles as s } from '../styles';
import type { DayBooking, SelectedDay } from '../types';
import { BookingCard } from './BookingCard';

/**
 * The open day. Booked: its bookings, each opening the event. Otherwise one
 * big message — free, blocked or gone — and, for today or later, the one
 * button that blocks or unblocks it.
 */
export function DayPanel({
  day,
  busy,
  onToggleBlocked,
  onOpenBooking,
}: {
  day: SelectedDay;
  busy: boolean;
  onToggleBlocked: () => void;
  onOpenBooking: (booking: DayBooking) => void;
}) {
  const booked = day.state === 'booked';
  const blocked = day.state === 'blocked';
  const sub = booked
    ? `${COPY.bookingsOn(day.bookings.length)}${
        day.isPast ? '' : ` · ${COPY.bookedHint}`
      }`
    : '';

  return (
    <View style={s.section}>
      <View style={s.head}>
        <View style={s.headText}>
          <AppText variant="h2" style={s.title} accessibilityRole="header">
            {day.title}
          </AppText>
          {sub ? (
            <AppText variant="caption" style={s.sub}>
              {sub}
            </AppText>
          ) : null}
        </View>
      </View>

      {booked ? (
        day.bookings.map((booking, i) => (
          <FadeInUp key={booking.id} delay={Math.min(i, 4) * 50}>
            <BookingCard item={booking} onOpen={() => onOpenBooking(booking)} />
          </FadeInUp>
        ))
      ) : (
        <View style={s.stateCard}>
          <View
            style={[
              s.stateIcon,
              blocked && s.stateIconBlocked,
              day.isPast && !blocked && s.stateIconPast,
            ]}
          >
            <EventlyIcon
              name={
                blocked
                  ? 'lock-outline'
                  : day.isPast
                  ? 'calendar-check-outline'
                  : 'emoticon-happy-outline'
              }
              size={28}
              color={
                blocked
                  ? DAY_LOOK.blockedInk
                  : day.isPast
                  ? ORG_INK.inkSoft
                  : ORG_ACCENT.jade
              }
            />
          </View>
          <AppText variant="h3" style={s.stateTitle}>
            {blocked
              ? COPY.blockedTitle
              : day.isPast
              ? COPY.pastTitle
              : COPY.freeTitle}
          </AppText>
          <AppText variant="body" style={s.stateBody}>
            {day.isPast
              ? blocked
                ? COPY.pastBlockedBody
                : COPY.pastBody
              : blocked
              ? COPY.blockedBody
              : COPY.freeBody}
          </AppText>
          {day.isPast ? null : (
            <EventlyButton
              title={blocked ? COPY.unblock : COPY.block}
              variant={blocked ? 'outline' : 'primary'}
              accentColor={ORG_ACCENT.saffron}
              disabled={busy}
              onPress={onToggleBlocked}
              style={s.action}
            />
          )}
        </View>
      )}
    </View>
  );
}

export default DayPanel;
