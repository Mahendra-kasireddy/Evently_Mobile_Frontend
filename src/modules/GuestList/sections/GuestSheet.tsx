import { useEffect, useState } from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, EventlyTextInput, KeyboardAvoider } from '../../../Components';
import { GROUP_LABEL, GUEST_COPY as COPY, GUEST_GROUPS, GUEST_MUTED } from '../constants';
import { sheetStyles as s } from '../styles';
import type { GuestDraft, GuestGroup } from '../types';

interface GuestSheetProps {
  visible: boolean;
  /** The values to open with. Absent means a new guest. */
  initial?: GuestDraft | null;
  isSaving: boolean;
  /** The server's own words when a save is refused — a clashing number, say. */
  errorMessage: string | null;
  onSave: (draft: GuestDraft) => void;
  onClose: () => void;
}

const EMPTY: GuestDraft = { name: '', phone: '', group: 'family' };

/**
 * Adding a guest, or correcting one.
 *
 * One sheet for both, because the fields are the same three and a second sheet
 * would be a second place for the phone rules to drift. The title and the
 * button are what differ.
 *
 * Validation is local and only for the two things the host can see are missing;
 * whether a number is a real mobile is the server's answer, because it is the
 * server that normalises it and enforces one guest per number. Guessing here
 * would mean two different verdicts on the same input.
 */
export function GuestSheet({
  visible,
  initial,
  isSaving,
  errorMessage,
  onSave,
  onClose,
}: GuestSheetProps) {
  const [draft, setDraft] = useState<GuestDraft>(initial ?? EMPTY);
  const [touched, setTouched] = useState(false);

  /*
   * Reseeded whenever the sheet opens, keyed on which guest it opened for.
   * Without this, editing Venkat after editing Sruthi would open on Sruthi's
   * details — the component stays mounted between the two.
   */
  useEffect(() => {
    if (!visible) return;
    setDraft(initial ?? EMPTY);
    setTouched(false);
  }, [visible, initial]);

  const isEdit = !!initial;
  const localError =
    !touched
      ? null
      : !draft.name.trim()
        ? COPY.nameRequired
        : !draft.phone.trim()
          ? COPY.phoneRequired
          : null;

  const submit = () => {
    setTouched(true);
    if (!draft.name.trim() || !draft.phone.trim()) return;
    onSave({ ...draft, name: draft.name.trim(), phone: draft.phone.trim() });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Tapping the dimmed area closes; tapping the card must not. */}
      <Pressable style={s.overlay} onPress={onClose}>
        <KeyboardAvoider>
          <Pressable style={s.card} onPress={() => undefined}>
            <View style={s.grabber} />

            <View style={s.head}>
              <EventlyText style={s.title}>
                {isEdit ? COPY.sheetEditTitle : COPY.sheetAddTitle}
              </EventlyText>
              <TouchableOpacity
                style={s.close}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={COPY.close}
              >
                <EventlyIcon name="close" size={17} color={GUEST_MUTED} />
              </TouchableOpacity>
            </View>

            <EventlyText variant="label" style={s.label}>
              {COPY.name}
            </EventlyText>
            <EventlyTextInput
              style={s.field}
              value={draft.name}
              onChangeText={(name) => setDraft((d) => ({ ...d, name }))}
              placeholder={COPY.namePlaceholder}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              accessibilityLabel={COPY.name}
            />

            <EventlyText variant="label" style={s.label}>
              {COPY.phone}
            </EventlyText>
            <EventlyTextInput
              style={s.field}
              value={draft.phone}
              onChangeText={(phone) => setDraft((d) => ({ ...d, phone }))}
              placeholder={COPY.phonePlaceholder}
              keyboardType="phone-pad"
              accessibilityLabel={COPY.phone}
            />

            <EventlyText variant="label" style={s.label}>
              {COPY.group}
            </EventlyText>
            <View style={s.groupRow}>
              {GUEST_GROUPS.map((group: GuestGroup) => {
                const on = draft.group === group;
                return (
                  <TouchableOpacity
                    key={group}
                    style={[s.group, on && s.groupOn]}
                    activeOpacity={0.85}
                    onPress={() => setDraft((d) => ({ ...d, group }))}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={GROUP_LABEL[group]}
                  >
                    <EventlyText
                      variant="bodyMedium"
                      style={on ? s.groupTextOn : s.groupText}
                    >
                      {GROUP_LABEL[group]}
                    </EventlyText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {localError || errorMessage ? (
              <EventlyText variant="small" style={s.error}>
                {localError ?? errorMessage}
              </EventlyText>
            ) : null}

            <TouchableOpacity
              style={[s.save, isSaving && s.saveBusy]}
              activeOpacity={0.85}
              disabled={isSaving}
              onPress={submit}
              accessibilityRole="button"
              accessibilityLabel={COPY.save}
            >
              <EventlyText style={s.saveText}>{isSaving ? COPY.saving : COPY.save}</EventlyText>
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoider>
      </Pressable>
    </Modal>
  );
}

export default GuestSheet;
