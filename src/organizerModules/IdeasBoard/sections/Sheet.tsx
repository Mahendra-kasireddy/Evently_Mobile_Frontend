import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppText,
  EventlyButton,
  EventlyIcon,
  KeyboardAvoider,
} from '../../../Components';
import { BOARD_VIOLET, ORG_ACCENT, ORG_INK } from '../design';
import { sheetStyles as s } from '../styles';

/**
 * The bottom-sheet frame both dialogs share: grabber, title, a scrolling
 * body, one primary button and a quiet cancel.
 */
export function Sheet({
  visible,
  icon,
  title,
  closeLabel,
  busy,
  onClose,
  primary,
  cancelLabel,
  children,
}: {
  visible: boolean;
  icon: string;
  title: string;
  closeLabel: string;
  busy: boolean;
  onClose: () => void;
  primary: { title: string; onPress: () => void; disabled?: boolean };
  cancelLabel: string;
  children: ReactNode;
}) {
  const close = () => {
    if (!busy) onClose();
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={close}
      statusBarTranslucent
    >
      <KeyboardAvoider style={s.root}>
        <Pressable
          style={s.overlay}
          onPress={close}
          accessibilityLabel={closeLabel}
        >
          <Pressable style={s.sheetWrap} onPress={() => undefined}>
            <SafeAreaView edges={['bottom']} style={s.sheet}>
              <View style={s.grabber} />
              <View style={s.headRow}>
                <View style={s.icon}>
                  <EventlyIcon name={icon} size={22} color={BOARD_VIOLET} />
                </View>
                <AppText variant="h2" style={s.title}>
                  {title}
                </AppText>
                <Pressable
                  style={s.close}
                  onPress={close}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={closeLabel}
                >
                  <EventlyIcon name="close" size={18} color={ORG_INK.ink} />
                </Pressable>
              </View>
              <ScrollView
                style={s.scroll}
                contentContainerStyle={s.content}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </ScrollView>
              <View style={s.footer}>
                <EventlyButton
                  title={primary.title}
                  onPress={primary.onPress}
                  loading={busy}
                  disabled={busy || primary.disabled}
                  accentColor={ORG_ACCENT.saffron}
                />
                <Pressable
                  style={s.cancel}
                  onPress={close}
                  disabled={busy}
                  accessibilityRole="button"
                >
                  <AppText variant="body" style={s.cancelText}>
                    {cancelLabel}
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

export default Sheet;
