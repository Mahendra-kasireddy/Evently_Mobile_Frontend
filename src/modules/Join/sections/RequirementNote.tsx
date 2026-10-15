import { View } from 'react-native';
import { EventlyIcon, AppText } from '../../../Components';
import { brand } from '../../../theme';
import { JOIN_COPY } from '../constants';
import { footnoteStyles as s } from '../styles';

/**
 * How it works, as one row of three — the whole sign-up at a glance, so
 * nothing on the way surprises anyone. Named for what it replaced: the old
 * "needs GST and ID" line, which was neither true nor the first thing to say.
 */
export function RequirementNote() {
  return (
    <View style={s.card}>
      <AppText variant="h3" style={s.title}>
        {JOIN_COPY.howTitle}
      </AppText>
      <View style={s.row}>
        {JOIN_COPY.steps.map((step, i) => (
          <View key={step.title} style={s.step}>
            <View style={s.iconWrap}>
              <View style={s.icon}>
                <EventlyIcon name={step.icon} size={20} color={brand.navy} />
              </View>
              <View style={s.num}>
                <AppText variant="label" style={s.numText}>
                  {i + 1}
                </AppText>
              </View>
            </View>
            <AppText variant="bodySmall" style={s.stepTitle} numberOfLines={1}>
              {step.title}
            </AppText>
            <AppText variant="caption" style={s.stepBody} numberOfLines={1}>
              {step.body}
            </AppText>
          </View>
        ))}
        {/* The dotted thread between the three, behind them. */}
        <View style={s.thread} pointerEvents="none" />
      </View>
    </View>
  );
}

export default RequirementNote;
