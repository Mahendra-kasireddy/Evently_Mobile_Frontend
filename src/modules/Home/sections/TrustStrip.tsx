import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { HOME_GREEN, TRUST_ICON_NAME } from '../constants';
import { trustStripStyles as s } from '../styles';
import type { TrustItem } from '../types';

interface TrustStripProps {
  items: TrustItem[];
}

/**
 * The three promises at the foot of the screen.
 *
 * Admin-editable copy rather than anything derived — these are commitments the
 * business makes, not facts about this customer, and they are the last thing
 * read before someone decides whether to trust the platform with a deposit.
 */
export function TrustStrip({ items }: TrustStripProps) {
  if (items.length === 0) return null;

  return (
    <View style={s.row}>
      {items.map((item) => (
        <View key={item.label} style={s.card}>
          <EventlyIcon name={TRUST_ICON_NAME[item.icon]} size={19} color={HOME_GREEN} />
          <EventlyText variant="caption" style={s.label} numberOfLines={3}>
            {item.label}
          </EventlyText>
        </View>
      ))}
    </View>
  );
}

export default TrustStrip;
