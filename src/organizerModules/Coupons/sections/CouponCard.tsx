import { Switch, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { COUPONS_COPY as COPY } from '../constants';
import { ORG_INK, SWITCH_THUMB, SWITCH_TRACK } from '../design';
import { cardStyles as s } from '../styles';
import type { CouponCardModel } from '../types';
import { StatusChip } from './StatusChip';

/**
 * One coupon: the code large enough to read out to a customer, its terms in
 * plain words, and the switch that turns it on or off for checkout.
 */
export function CouponCard({
  coupon,
  busy,
  onToggle,
}: {
  coupon: CouponCardModel;
  busy: boolean;
  onToggle: (id: string, enabled: boolean) => void;
}) {
  const finished = coupon.state === 'expired' || coupon.state === 'usedUp';
  const meta = [
    { icon: 'cash-multiple', text: coupon.minBooking },
    { icon: 'calendar-blank-outline', text: coupon.validity },
    { icon: 'account-check-outline', text: coupon.used },
  ];

  return (
    <View style={[s.card, finished && s.cardMuted]}>
      <View style={s.top}>
        <View style={s.ticket}>
          <View style={[s.notch, s.notchLeft]} />
          <View style={[s.notch, s.notchRight]} />
          <AppText
            variant="h2"
            style={s.code}
            numberOfLines={1}
            adjustsFontSizeToFit
            selectable
          >
            {coupon.code}
          </AppText>
        </View>
        <View style={s.spacer} />
        <StatusChip state={coupon.state} />
      </View>

      <View>
        <AppText variant="h3" style={s.discount}>
          {coupon.discount}
        </AppText>
        <AppText variant="bodySmall" style={s.title} numberOfLines={1}>
          {coupon.title}
        </AppText>
      </View>

      <View style={s.metaList}>
        {meta.map(m => (
          <View key={m.icon} style={s.metaRow}>
            <EventlyIcon name={m.icon} size={16} color={ORG_INK.inkFaint} />
            <AppText variant="bodySmall" style={s.metaText} numberOfLines={1}>
              {m.text}
            </AppText>
          </View>
        ))}
      </View>

      <View style={s.footer}>
        <AppText
          variant="bodySmall"
          style={[s.footerText, !coupon.enabled && s.footerTextOff]}
        >
          {coupon.enabled ? COPY.switchLabel : COPY.switchOff}
        </AppText>
        <Switch
          value={coupon.enabled}
          onValueChange={next => onToggle(coupon.id, next)}
          disabled={busy}
          trackColor={SWITCH_TRACK}
          thumbColor={SWITCH_THUMB}
          ios_backgroundColor={SWITCH_TRACK.false}
          accessibilityLabel={`${coupon.code}: ${COPY.switchLabel}`}
        />
      </View>
    </View>
  );
}

export default CouponCard;
