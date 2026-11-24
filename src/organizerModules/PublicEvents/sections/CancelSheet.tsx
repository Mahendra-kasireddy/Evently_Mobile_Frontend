import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, EventlyIcon, KeyboardAvoider } from '../../../Components';
import type { CancelSheetResult } from '../container';
import { CANCEL_REASON_MAX, PUBLIC_EVENTS_COPY as COPY } from '../constants';
import { DANGER } from '../design';
import { sheetStyles as s } from '../styles';
import { ActionButton } from './ActionButton';
import { FormField } from './FormField';

/**
 * Calling the event off: what it means, an optional reason the attendees
 * will read, and one red button.
 */
export function CancelSheet({
  c,
  cancelling,
  onConfirm,
}: {
  c: CancelSheetResult;
  cancelling: boolean;
  onConfirm: (reason: string) => void;
}) {
  const close = () => {
    if (!cancelling) c.close();
  };
  return (
    <Modal
      visible={c.visible}
      transparent
      animationType="slide"
      onRequestClose={close}
      statusBarTranslucent
    >
      <KeyboardAvoider style={s.root}>
        <Pressable
          style={s.overlay}
          onPress={close}
          accessibilityLabel={COPY.close}
        >
          <Pressable style={s.sheetWrap} onPress={() => undefined}>
            <SafeAreaView edges={['bottom']} style={s.sheet}>
              <View style={s.grabber} />
              <View style={s.headRow}>
                <View style={[s.icon, s.iconDanger]}>
                  <EventlyIcon
                    name="close-octagon-outline"
                    size={22}
                    color={DANGER}
                  />
                </View>
                <AppText variant="h2" style={s.title}>
                  {COPY.cancelSheetTitle}
                </AppText>
              </View>
              <View style={s.content}>
                <AppText variant="body" style={s.body}>
                  {COPY.confirm.cancel.body}
                </AppText>
                <FormField
                  label={COPY.cancelReason}
                  value={c.reason}
                  onChangeText={c.setReason}
                  placeholder={COPY.cancelReasonPh}
                  max={CANCEL_REASON_MAX}
                  multiline
                  editable={!cancelling}
                />
              </View>
              <View style={s.footer}>
                <ActionButton
                  title={cancelling ? COPY.cancelling : COPY.confirm.cancel.ok}
                  icon="close"
                  kind="danger"
                  loading={cancelling}
                  onPress={() => onConfirm(c.reason)}
                />
                <Pressable
                  style={s.cancel}
                  onPress={close}
                  disabled={cancelling}
                  accessibilityRole="button"
                >
                  <AppText variant="body" style={s.cancelText}>
                    {COPY.keep}
                  </AppText>
                </Pressable>
              </View>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </KeyboardAvoider>
    </Modal>
  );
}

export default CancelSheet;
