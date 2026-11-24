import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, EventlyIcon, KeyboardAvoider } from '../../../Components';
import { INVITATION_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { sheetStyles as s } from '../styles';
import { ActionButton } from './Buttons';

/** A bottom sheet: grabber, title, a scrolling body and one primary button. */
export function Sheet({
  visible,
  icon,
  title,
  onClose,
  primary,
  children,
}: {
  visible: boolean;
  icon: string;
  title: string;
  onClose: () => void;
  primary: { title: string; onPress: () => void; disabled?: boolean };
  children: ReactNode;
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
          accessibilityLabel={COPY.close}
        >
          <Pressable style={s.sheetWrap} onPress={() => undefined}>
            <SafeAreaView edges={['bottom']} style={s.sheet}>
              <View style={s.grabber} />
              <View style={s.headRow}>
                <View style={s.icon}>
                  <EventlyIcon
                    name={icon}
                    size={20}
                    color={ORG_ACCENT.saffron}
                  />
                </View>
                <AppText variant="h2" style={s.title} numberOfLines={1}>
                  {title}
                </AppText>
                <Pressable
                  style={s.close}
                  onPress={onClose}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={COPY.close}
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
                <ActionButton
                  title={primary.title}
                  onPress={primary.onPress}
                  disabled={primary.disabled}
                />
              </View>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </KeyboardAvoider>
    </Modal>
  );
}

export default Sheet;
