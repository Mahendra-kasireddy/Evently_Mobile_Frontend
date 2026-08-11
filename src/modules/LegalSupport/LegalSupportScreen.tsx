import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../Components';
import { useLegalSupportContainer } from './container';
import { LegalSupportRow } from './sections/LegalSupportRow';
import { styles } from './styles';

export function LegalSupportScreen() {
  const { items, onPressItem } = useLegalSupportContainer();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Legal & Support" />
      <View style={styles.content}>
        <View style={styles.card}>
          {items.map((item, index) => (
            <LegalSupportRow key={item.key} item={item} isFirst={index === 0} onPress={onPressItem} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default LegalSupportScreen;
