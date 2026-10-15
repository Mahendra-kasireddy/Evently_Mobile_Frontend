import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, AppText } from '../../../Components';
import { ORG_GREEN, ORGANIZER_COPY as COPY } from '../constants';
import { availabilityStyles as s } from '../styles';
import type { AvailabilityViewModel } from '../types';

interface AvailabilityCardProps {
  availability: AvailabilityViewModel;
  /** Opens the plan wizard with this organizer and this date already filled. */
  onHoldDate: () => void;
}

/**
 * When they are next free.
 *
 * "Hold date" is not a reservation — nothing in the API reserves a date, and a
 * button that told somebody their date was held when it was not would be the
 * worst thing on this screen. It opens the brief with this organizer and this
 * date filled in, which is the only thing that actually puts a claim on it:
 * a request they can accept.
 */
export function AvailabilityCard({
  availability,
  onHoldDate,
}: AvailabilityCardProps) {
  return (
    <View style={s.card}>
      <EventlyIcon name="calendar-check-outline" size={20} color={ORG_GREEN} />

      <View style={s.text}>
        <AppText variant="h2" style={s.title}>
          {COPY.freeOn(availability.dateLabel)}
        </AppText>
        {availability.detail ? (
          <AppText variant="bodySmall" style={s.detail}>
            {availability.detail}
          </AppText>
        ) : null}
      </View>

      <TouchableOpacity
        style={s.hold}
        activeOpacity={0.85}
        onPress={onHoldDate}
        accessibilityRole="button"
        accessibilityLabel={`${COPY.holdDate} — ${availability.dateLabel}`}
      >
        <AppText variant="label" style={s.holdText}>
          {COPY.holdDate}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

export default AvailabilityCard;
