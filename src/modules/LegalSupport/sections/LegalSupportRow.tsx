import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { legalSupportRowStyles } from '../styles';
import type { LegalSupportItem } from '../types';

interface LegalSupportRowProps {
  item: LegalSupportItem;
  isFirst: boolean;
  onPress: (item: LegalSupportItem) => void;
}

export function LegalSupportRow({ item, isFirst, onPress }: LegalSupportRowProps) {
  return (
    <TouchableOpacity
      style={[legalSupportRowStyles.row, !isFirst && legalSupportRowStyles.rowDivider]}
      onPress={() => onPress(item)}
    >
      <View style={legalSupportRowStyles.iconBadge}>
        <EventlyIcon name={item.icon} size={18} color={colors.primary} />
      </View>
      <EventlyText variant="body" style={legalSupportRowStyles.label}>
        {item.label}
      </EventlyText>
      <EventlyIcon name="chevron-right" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default LegalSupportRow;
