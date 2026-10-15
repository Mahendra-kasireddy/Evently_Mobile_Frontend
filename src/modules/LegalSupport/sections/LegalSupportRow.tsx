import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, AppText } from '../../../Components';
import { colors } from '../../../theme';
import { LEGAL_ACCENT, LEGAL_COPY as COPY, LEGAL_NAVY } from '../constants';
import { legalSupportRowStyles as s } from '../styles';
import type { LegalSupportItem } from '../types';

interface LegalSupportRowProps {
  item: LegalSupportItem;
  isFirst: boolean;
  onPress: () => void;
}

export function LegalSupportRow({
  item,
  isFirst,
  onPress,
}: LegalSupportRowProps) {
  const isAction = item.action === 'contact';

  return (
    <TouchableOpacity
      style={[s.row, !isFirst && s.rowDivider]}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <View style={[s.iconBadge, isAction && s.iconBadgeAction]}>
        <EventlyIcon
          name={item.icon}
          size={18}
          color={isAction ? LEGAL_ACCENT : LEGAL_NAVY}
        />
      </View>
      <View style={s.text}>
        <AppText variant="body" style={s.label}>
          {item.label}
        </AppText>
        {/* Says up front that a policy is not published, rather than leaving
            the customer to find out by tapping. */}
        <AppText variant="caption" style={isAction ? s.hint : s.pending}>
          {isAction ? item.hint : COPY.pendingTitle}
        </AppText>
      </View>
      <EventlyIcon name="chevron-right" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default LegalSupportRow;
