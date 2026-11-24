import { View } from 'react-native';
import { AppText } from '../../../Components';
import { CALENDAR_COPY as COPY } from '../constants';
import { legendStyles as s } from '../styles';

const ITEMS = [
  { key: 'booked', label: COPY.legend.booked, swatch: s.booked },
  { key: 'blocked', label: COPY.legend.blocked, swatch: s.blocked },
  { key: 'free', label: COPY.legend.free, swatch: s.free },
  { key: 'today', label: COPY.legend.today, swatch: s.today },
] as const;

/** What the day colours mean. */
export function Legend() {
  return (
    <View style={s.row}>
      {ITEMS.map(item => (
        <View key={item.key} style={s.item}>
          <View style={[s.swatch, item.swatch]} />
          <AppText variant="caption" style={s.label}>
            {item.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export default Legend;
