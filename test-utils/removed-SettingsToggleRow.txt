import { Switch, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { settingsRowStyles } from '../styles';
import type { SettingsPref } from '../types';

interface SettingsToggleRowProps {
  pref: SettingsPref;
  isFirst: boolean;
  onToggle: (key: string) => void;
}

export function SettingsToggleRow({ pref, isFirst, onToggle }: SettingsToggleRowProps) {
  return (
    <View style={[settingsRowStyles.row, !isFirst && settingsRowStyles.rowDivider]}>
      <View style={settingsRowStyles.text}>
        <EventlyText variant="body" style={settingsRowStyles.title}>
          {pref.title}
        </EventlyText>
        <EventlyText variant="caption" style={settingsRowStyles.subtitle}>
          {pref.subtitle}
        </EventlyText>
      </View>
      <Switch
        value={pref.enabled}
        onValueChange={() => onToggle(pref.key)}
        trackColor={{ true: colors.primary }}
        accessibilityLabel={pref.title}
      />
    </View>
  );
}

export default SettingsToggleRow;
