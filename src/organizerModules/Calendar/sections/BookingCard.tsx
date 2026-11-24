import { View } from 'react-native';
import { AppText, EventlyIcon, PressableScale } from '../../../Components';
import { CALENDAR_COPY as COPY } from '../constants';
import { ORG_INK } from '../design';
import { bookingStyles as s, statusToneStyles } from '../styles';
import type { DayBooking } from '../types';

/** One booking on the open day: who, where, how much — opens the event. */
export function BookingCard({
  item,
  onOpen,
}: {
  item: DayBooking;
  onOpen: () => void;
}) {
  const tone = statusToneStyles[item.status.tone];
  const meta = [item.customerName, item.location].filter(Boolean).join(' · ');

  return (
    <PressableScale
      style={s.card}
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.status.label}. ${COPY.open}`}
    >
      <View style={s.head}>
        <View style={s.date}>
          <AppText variant="h2" style={s.day}>
            {item.day}
          </AppText>
          <AppText variant="label" style={s.month}>
            {item.month}
          </AppText>
        </View>
        <View style={s.body}>
          <AppText variant="h3" style={s.title} numberOfLines={2}>
            {item.title}
          </AppText>
          {meta ? (
            <AppText variant="caption" style={s.meta} numberOfLines={2}>
              {meta}
            </AppText>
          ) : null}
          <View style={[s.chip, tone.box]}>
            <AppText variant="label" style={[s.chipText, tone.text]}>
              {item.status.label}
            </AppText>
          </View>
        </View>
      </View>
      <View style={s.foot}>
        <AppText variant="h3" style={s.amount}>
          {item.amount}
        </AppText>
        <View style={s.button}>
          <AppText variant="bodySmall" style={s.buttonText}>
            {COPY.open}
          </AppText>
          <EventlyIcon name="arrow-right" size={16} color={ORG_INK.ink} />
        </View>
      </View>
    </PressableScale>
  );
}

export default BookingCard;
