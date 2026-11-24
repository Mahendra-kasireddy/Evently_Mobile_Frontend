import { View } from 'react-native';
import { AppText, EventlyIcon, PressableScale } from '../../../Components';
import { EARNINGS_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { couponStyles as s } from '../styles';

/** The way to Coupons, which sits with Earnings. */
export function CouponsCard({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale
      style={s.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={COPY.coupons}
    >
      <View style={s.icon}>
        <EventlyIcon
          name="ticket-percent-outline"
          size={22}
          color={ORG_ACCENT.rose}
        />
      </View>
      <View style={s.body}>
        <AppText variant="h3" style={s.title}>
          {COPY.coupons}
        </AppText>
        <AppText variant="caption" style={s.hint}>
          {COPY.couponsHint}
        </AppText>
      </View>
      <EventlyIcon name="chevron-right" size={22} color={ORG_INK.inkFaint} />
    </PressableScale>
  );
}

export default CouponsCard;
