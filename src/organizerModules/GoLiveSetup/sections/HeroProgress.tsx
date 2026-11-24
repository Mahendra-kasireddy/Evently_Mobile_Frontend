import { View } from 'react-native';
import { AppText, GradientFill } from '../../../Components';
import { SETUP_COPY as COPY } from '../constants';
import { ORG_ACTION_GRADIENT } from '../design';
import { heroStyles as s } from '../styles';
import type { HubModel } from '../types';

/** "2 of 4 done" and a bar — how far the organizer is from submitting. */
export function HeroProgress({ hub }: { hub: HubModel }) {
  const fillWidth = { width: `${Math.max(4, hub.percent)}%` as const };
  return (
    <View
      style={s.card}
      accessible
      accessibilityLabel={`${COPY.progress(hub.done, hub.total)}, ${
        hub.percent
      }%`}
    >
      <AppText variant="overline" style={s.eyebrow}>
        {COPY.heroEyebrow}
      </AppText>
      <View style={s.row}>
        <AppText variant="h1" style={s.count}>
          {COPY.progress(hub.done, hub.total)}
        </AppText>
        <AppText variant="h3" style={s.percent}>
          {`${hub.percent}%`}
        </AppText>
      </View>
      <View style={s.track}>
        <View style={[s.fill, fillWidth]}>
          <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
        </View>
      </View>
      <AppText variant="bodySmall" style={s.body}>
        {hub.canSubmit ? COPY.heroReady : COPY.heroTodo}
      </AppText>
    </View>
  );
}

export default HeroProgress;
