import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyText } from '../../Components';
import { useSettingsContainer } from './container';
import { SettingsToggleRow } from './sections/SettingsToggleRow';
import { styles } from './styles';

export function SettingsScreen() {
  const { groups, toggle } = useSettingsContainer();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        {groups.map((group) => (
          <View key={group.title}>
            <EventlyText variant="caption" style={styles.groupLabel}>
              {group.title.toUpperCase()}
            </EventlyText>
            <View style={styles.card}>
              {group.prefs.map((pref, index) => (
                <SettingsToggleRow key={pref.key} pref={pref} isFirst={index === 0} onToggle={toggle} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default SettingsScreen;
