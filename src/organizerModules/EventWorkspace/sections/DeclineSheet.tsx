import { Alert, Modal, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, EventlyIcon, KeyboardAvoider } from '../../../Components';
import type { DeclineSheetResult } from '../container';
import { EVENT_COPY, REASON_MAX } from '../constants';
import { DANGER, ORG_INK } from '../design';
import { sheetStyles as s } from '../styles';
import { ActionButton } from './ActionButton';

const COPY = EVENT_COPY.decline;

/**
 * Declining, as a bottom sheet: one required reason the customer will read,
 * then a last "are you sure" — a decline refunds the advance and can't be
 * taken back.
 */
export function DeclineSheet({
  d,
  declining,
  onDecline,
}: {
  d: DeclineSheetResult;
  declining: boolean;
  onDecline: (reason: string) => void;
}) {
  const close = () => {
    if (!declining) d.close();
  };
  const submit = () => {
    if (!d.check()) return;
    Alert.alert(COPY.confirmTitle, COPY.confirmBody, [
      { text: COPY.cancel, style: 'cancel' },
      {
        text: COPY.confirm,
        style: 'destructive',
        onPress: () => onDecline(d.reason),
      },
    ]);
  };

  return (
    <Modal
      visible={d.visible}
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
                  {COPY.title}
                </AppText>
              </View>
              <View style={s.content}>
                <AppText variant="body" style={s.body}>
                  {COPY.body}
                </AppText>
                <View style={s.field}>
                  <View style={s.labelRow}>
                    <AppText variant="bodySmall" style={s.label}>
                      {COPY.label}
                    </AppText>
                    <AppText variant="label" style={s.counter}>
                      {`${d.reason.length}/${REASON_MAX}`}
                    </AppText>
                  </View>
                  <TextInput
                    style={[
                      s.input,
                      s.inputMulti,
                      d.error ? s.inputError : null,
                    ]}
                    value={d.reason}
                    onChangeText={d.setReason}
                    placeholder={COPY.placeholder}
                    placeholderTextColor={ORG_INK.inkFaint}
                    maxLength={REASON_MAX}
                    multiline
                    editable={!declining}
                    autoFocus
                    accessibilityLabel={COPY.label}
                  />
                  {d.error ? (
                    <AppText
                      variant="caption"
                      style={s.error}
                      accessibilityLiveRegion="polite"
                    >
                      {d.error}
                    </AppText>
                  ) : null}
                </View>
              </View>
              <View style={s.footer}>
                <ActionButton
                  title={declining ? COPY.declining : COPY.submit}
                  icon="close"
                  kind="danger"
                  onPress={submit}
                  loading={declining}
                />
                <Pressable
                  style={s.cancel}
                  onPress={close}
                  disabled={declining}
                  accessibilityRole="button"
                >
                  <AppText variant="body" style={s.cancelText}>
                    {COPY.cancel}
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

export default DeclineSheet;
