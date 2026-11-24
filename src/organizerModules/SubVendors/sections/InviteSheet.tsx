import { Modal, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, EventlyIcon, KeyboardAvoider } from '../../../Components';
import { PHONE_LENGTH, SUBVENDORS_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { sheetStyles as s } from '../styles';
import { ActionButton } from './ActionButton';

const SHEET = COPY.sheet;

/**
 * The invite, as a bottom sheet: one field — the mobile number the backend's
 * InviteSubvendorDto takes — and Send. Server errors show under the field.
 */
export function InviteSheet({
  visible,
  phone,
  onChangePhone,
  error,
  sending,
  onSend,
  onClose,
}: {
  visible: boolean;
  phone: string;
  onChangePhone: (text: string) => void;
  error: string | null;
  sending: boolean;
  onSend: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoider style={s.root}>
        <Pressable
          style={s.overlay}
          onPress={onClose}
          accessibilityLabel={SHEET.close}
        >
          <Pressable onPress={() => undefined}>
            <SafeAreaView edges={['bottom']} style={s.sheet}>
              <View style={s.grabber} />
              <View style={s.headRow}>
                <View style={s.icon}>
                  <EventlyIcon
                    name="account-plus-outline"
                    size={22}
                    color={ORG_ACCENT.saffron}
                  />
                </View>
                <AppText variant="h2" style={s.title}>
                  {SHEET.title}
                </AppText>
              </View>
              <AppText variant="body" style={s.body}>
                {SHEET.body}
              </AppText>

              <View style={s.field}>
                <AppText variant="bodySmall" style={s.label}>
                  {SHEET.label}
                </AppText>
                <View style={[s.inputRow, error ? s.inputRowError : null]}>
                  <View style={s.prefix}>
                    <AppText variant="bodyLarge" style={s.prefixText}>
                      {SHEET.prefix}
                    </AppText>
                  </View>
                  <TextInput
                    style={s.input}
                    value={phone}
                    onChangeText={onChangePhone}
                    placeholder={SHEET.placeholder}
                    placeholderTextColor={ORG_INK.inkFaint}
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                    autoFocus
                    editable={!sending}
                    returnKeyType="send"
                    onSubmitEditing={onSend}
                    accessibilityLabel={SHEET.label}
                  />
                </View>
                {error ? (
                  <AppText
                    variant="caption"
                    style={s.error}
                    accessibilityLiveRegion="polite"
                  >
                    {error}
                  </AppText>
                ) : null}
              </View>

              <View style={s.actions}>
                <ActionButton
                  title={sending ? SHEET.sending : SHEET.send}
                  icon="send-outline"
                  onPress={onSend}
                  loading={sending}
                  disabled={phone.length !== PHONE_LENGTH}
                />
                <Pressable
                  style={s.cancel}
                  onPress={onClose}
                  disabled={sending}
                  accessibilityRole="button"
                >
                  <AppText variant="body" style={s.cancelText}>
                    {SHEET.cancel}
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

export default InviteSheet;
