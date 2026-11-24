import { View } from 'react-native';
import { AppText } from '../../../Components';
import { chipStyles as s, toneStyles } from '../styles';
import type { Chip } from '../types';

/** A small rounded label in one of the status tones. */
export function StatusChip({ chip }: { chip: Chip }) {
  const tone = toneStyles[chip.tone];
  return (
    <View style={[s.chip, tone.box]}>
      <AppText variant="label" style={[s.text, tone.text]}>
        {chip.label}
      </AppText>
    </View>
  );
}

export default StatusChip;
