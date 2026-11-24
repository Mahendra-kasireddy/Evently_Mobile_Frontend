import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { EVENT_COPY } from '../constants';
import { DANGER, ORG_ACCENT, ORG_INK } from '../design';
import { closingStyles as s, styles as screen } from '../styles';
import type { BookingStatus } from '../types';

const COPY = EVENT_COPY.closed;

const LOOK: Record<
  'completed' | 'cancelled' | 'rejected' | 'expired',
  { icon: string; color: string; box: 'iconDone' | 'iconStop' | 'iconGrey' }
> = {
  completed: { icon: 'party-popper', color: ORG_ACCENT.jade, box: 'iconDone' },
  cancelled: { icon: 'cancel', color: DANGER, box: 'iconStop' },
  rejected: { icon: 'close-octagon-outline', color: DANGER, box: 'iconStop' },
  expired: {
    icon: 'timer-off-outline',
    color: ORG_INK.inkSoft,
    box: 'iconGrey',
  },
};

/** A closed booking's summary: what happened, and the decline reason if any. */
export function ClosedCard({
  status,
  declineReason,
}: {
  status: BookingStatus;
  declineReason: string;
}) {
  if (!(status in LOOK)) return null;
  const key = status as keyof typeof LOOK;
  const look = LOOK[key];
  return (
    <View style={screen.section}>
      <View style={s.card}>
        <View style={s.headRow}>
          <View style={[s.icon, s[look.box]]}>
            <EventlyIcon name={look.icon} size={22} color={look.color} />
          </View>
          <View style={s.headText}>
            <AppText variant="h3" style={s.title}>
              {COPY[key].title}
            </AppText>
            <AppText variant="bodySmall" style={s.body}>
              {COPY[key].body}
            </AppText>
          </View>
        </View>
        {declineReason.trim() ? (
          <View style={s.reason}>
            <AppText variant="label" style={s.reasonLabel}>
              {COPY.reason}
            </AppText>
            <AppText variant="body" style={s.reasonText}>
              {declineReason.trim()}
            </AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default ClosedCard;
