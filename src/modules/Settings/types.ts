export interface SettingsPref {
  key: string;
  group: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}

export interface SettingsGroup {
  title: string;
  prefs: SettingsPref[];
}
