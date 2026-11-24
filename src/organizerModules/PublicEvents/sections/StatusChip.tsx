import { View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from '../../../Components';
import { chipStyles as s, toneStyles } from '../styles';
import type { StatusModel } from '../types';

/** A status in its own tone: Draft, Published, Sold out, On sale… */
export function StatusChip({
  status,
  style,
}: {
  status: StatusModel;
  style?: StyleProp<ViewStyle>;
}) {
  const tone = toneStyles[status.tone];
  return (
    <View style={[s.chip, tone.box, style]}>
      <View style={[s.dot, tone.dot]} />
      <AppText variant="label" style={[s.text, tone.text]}>
        {status.label}
      </AppText>
    </View>
  );
}

export default StatusChip;
