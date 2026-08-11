import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { LEGAL_SUPPORT_ITEMS, SUPPORT_EMAIL } from './constants';
import type { LegalSupportItem } from './types';

export interface LegalSupportContainerResult {
  items: LegalSupportItem[];
  onPressItem: (item: LegalSupportItem) => void;
}

export function useLegalSupportContainer(): LegalSupportContainerResult {
  const onPressItem = useCallback((item: LegalSupportItem) => {
    if (item.action === 'contact') {
      Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {
        Alert.alert('Could not open email', `Reach us at ${SUPPORT_EMAIL}`);
      });
      return;
    }
    Alert.alert(item.label, 'This will be available soon.');
  }, []);

  return { items: LEGAL_SUPPORT_ITEMS, onPressItem };
}
