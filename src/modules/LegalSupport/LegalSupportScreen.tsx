import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { LEGAL_COPY as COPY } from './constants';
import { useLegalSupportContainer } from './container';
import { LegalSupportRow } from './sections/LegalSupportRow';
import { styles } from './styles';
import type { LegalSupportItem } from './types';

/**
 * Legal & support.
 *
 * Two groups, because they are different things: one place to reach a person,
 * and the documents the app is expected to carry. "Blog" and "Resources" used
 * to sit alongside them and did nothing at all — they are gone rather than
 * listed as items that alert "coming soon".
 */
export function LegalSupportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items } = useLegalSupportContainer();

  const support = items.filter((i) => i.action === 'contact');
  const legal = items.filter((i) => i.action === 'pending');

  const onPress = (item: LegalSupportItem) => {
    if (item.action === 'contact') {
      navigation.navigate('Contact');
      return;
    }
    Alert.alert(item.label, COPY.pendingBody);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title={COPY.title} compact />
      <ScrollView contentContainerStyle={styles.content}>
        <EventlyText variant="caption" style={[styles.sectionTitle, styles.sectionTitleFirst]}>
          {COPY.supportSection}
        </EventlyText>
        <View style={styles.card}>
          {support.map((item, index) => (
            <LegalSupportRow key={item.key} item={item} isFirst={index === 0} onPress={() => onPress(item)} />
          ))}
        </View>

        <EventlyText variant="caption" style={styles.sectionTitle}>
          {COPY.legalSection}
        </EventlyText>
        <View style={styles.card}>
          {legal.map((item, index) => (
            <LegalSupportRow key={item.key} item={item} isFirst={index === 0} onPress={() => onPress(item)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LegalSupportScreen;
