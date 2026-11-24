import { Switch, View } from 'react-native';
import { AppText } from '../../../Components';
import { ORG_ACCENT, ORG_PAPER, WHITE } from '../design';
import { formStyles as s } from '../styles';

/** A yes/no setting. */
export function SwitchRow({
  label,
  value,
  onValueChange,
  disabled = false,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={s.switchRow}>
      <AppText variant="body" style={s.switchLabel}>
        {label}
      </AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: ORG_PAPER.hairline, true: ORG_ACCENT.marigold }}
        thumbColor={WHITE}
        ios_backgroundColor={ORG_PAPER.hairline}
        accessibilityLabel={label}
      />
    </View>
  );
}

export default SwitchRow;
