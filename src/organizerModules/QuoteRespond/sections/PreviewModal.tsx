import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../../Components';
import { QUOTE_COPY as COPY } from '../constants';
import { previewStyles as s } from '../styles';
import type { PreviewLine, QuoteTotals } from '../types';
import { QuotePreview } from './QuotePreview';

/** "Customer view": the quote as it will read on the customer's phone. */
export function PreviewModal({
  visible,
  onClose,
  lines,
  totals,
  notes,
  siteVisit,
}: {
  visible: boolean;
  onClose: () => void;
  lines: PreviewLine[];
  totals: QuoteTotals;
  notes: string;
  siteVisit: boolean;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={s.sheet} edges={['top', 'bottom']}>
        <View style={s.sheetHead}>
          <AppText variant="h3" style={s.sheetTitle}>
            {COPY.previewTitle}
          </AppText>
          <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button">
            <AppText variant="body" style={s.close}>
              {COPY.close}
            </AppText>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={s.sheetBody}>
          <QuotePreview
            lines={lines}
            totals={totals}
            notes={notes}
            siteVisit={siteVisit}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default PreviewModal;
