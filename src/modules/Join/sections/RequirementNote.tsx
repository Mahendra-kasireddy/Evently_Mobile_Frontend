import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
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
      <EventlyText style={s.title}>{JOIN_COPY.howTitle}</EventlyText>
      <View style={s.row}>
        {JOIN_COPY.steps.map((step, i) => (
          <View key={step.title} style={s.step}>
            <View style={s.iconWrap}>
              <View style={s.icon}>
                <EventlyIcon name={step.icon} size={20} color={brand.navy} />
              </View>
              <View style={s.num}>
                <EventlyText style={s.numText}>{i + 1}</EventlyText>
              </View>
            </View>
            <EventlyText style={s.stepTitle} numberOfLines={1}>
              {step.title}
            </EventlyText>
            <EventlyText style={s.stepBody} numberOfLines={1}>
              {step.body}
            </EventlyText>
          </View>
        ))}
        {/* The dotted thread between the three, behind them. */}
        <View style={s.thread} pointerEvents="none" />
      </View>
    </View>
  );
}

export default RequirementNote;
