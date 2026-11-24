import { View } from 'react-native';
import { AppText } from '../../../Components';
import { COUPONS_COPY as COPY } from '../constants';
import { chipDot, chipInk, chipStyles as s, chipTone } from '../styles';
import type { CouponState } from '../types';

/** Active / Scheduled / Paused / Used up / Expired, each in its own tone. */
export function StatusChip({ state }: { state: CouponState }) {
  return (
    <View style={[s.chip, chipTone[state]]}>
      <View style={[s.dot, chipDot[state]]} />
      <AppText variant="label" style={[s.text, chipInk[state]]}>
        {COPY.states[state]}
      </AppText>
    </View>
  );
}

export default StatusChip;
