import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  EventlyIcon,
  EventlyText,
  EventlyTextInput,
  GradientFill,
  KeyboardAvoider,
} from '../../../Components';
import {
  GROUP_LABEL,
  GUEST_ACCENT,
  GUEST_COPY as COPY,
  GUEST_GROUPS,
  GUEST_MUTED,
  GUEST_NAVY,
} from '../constants';
import { sheetStyles as s } from '../styles';
import type { GuestDraft, GuestGroup } from '../types';
import { avatarColorFor, initialsOf, localNumber } from '../utils';

interface GuestSheetProps {
  visible: boolean;
  /** The values to open with. Absent means a new guest. */
  initial?: GuestDraft | null;
  isSaving: boolean;
  /** The server's own words when a save is refused — a clashing number, say. */
  errorMessage: string | null;
  /** `another`: keep the sheet open for the next guest once this one saves. */
  onSave: (draft: GuestDraft, another?: boolean) => void;
  onClose: () => void;
  /**
   * The last guest saved with "Save & add another", and a counter that ticks
   * on each — the sheet clears its fields when it ticks and says who went in.
   */
  addedName?: string | null;
  addedTick?: number;
}

const EMPTY: GuestDraft = { name: '', phone: '', group: 'family' };
const SAVE_GRADIENT: [string, string] = ['#f47b4d', '#e2477a'];

/** Each group's mark, so the three read before they are read. */
const GROUP_ICON: Record<GuestGroup, string> = {
  family: 'home-heart',
  friends: 'account-heart-outline',
  work: 'briefcase-outline',
  other: 'account-outline',
};

/**
 * Adding a guest, or correcting one.
 *
 * One sheet for both, because the fields are the same three and a second sheet
 * would be a second place for the phone rules to drift. The title and the
 * button are what differ.
 *
 * The number is typed next to a fixed +91 — what the host has in front of
 * them is a ten-digit mobile, and the server adds the code. Whether a number
 * is a real mobile is the server's answer; locally the sheet only says which
 * field is empty.
 */
export function GuestSheet({
  visible,
  initial,
  isSaving,
  errorMessage,
  onSave,
  onClose,
  addedName = null,
  addedTick = 0,
}: GuestSheetProps) {
  const [draft, setDraft] = useState<GuestDraft>(initial ?? EMPTY);
  const [touched, setTouched] = useState(false);
  const [focus, setFocus] = useState<'name' | 'phone' | null>(null);
  const phoneRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);

  /*
   * Reseeded whenever the sheet opens, keyed on which guest it opened for.
   * Without this, editing Venkat after editing Sruthi would open on Sruthi's
   * details — the component stays mounted between the two.
   */
  useEffect(() => {
    if (!visible) return;
    setDraft(
      initial ? { ...initial, phone: localNumber(initial.phone) } : EMPTY,
    );
    setTouched(false);
  }, [visible, initial]);

  /* Saved with "add another": clear for the next guest, keep the group. */
  useEffect(() => {
    if (addedTick === 0) return;
    setDraft(d => ({ ...EMPTY, group: d.group }));
    setTouched(false);
    nameRef.current?.focus();
  }, [addedTick]);

  const isEdit = !!initial;
  const localError = !touched
    ? null
    : !draft.name.trim()
    ? COPY.nameRequired
    : !draft.phone.trim()
    ? COPY.phoneRequired
    : null;

  const submit = (another: boolean) => {
    setTouched(true);
    if (!draft.name.trim() || !draft.phone.trim()) return;
    onSave(
      { ...draft, name: draft.name.trim(), phone: draft.phone.trim() },
      another,
    );
  };

  const previewName = draft.name.trim();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Tapping the dimmed area closes; tapping the card must not. */}
      <Pressable style={s.overlay} onPress={onClose}>
        <KeyboardAvoider>
          <Pressable style={s.card} onPress={() => undefined}>
            <View style={s.grabber} />

            <View style={s.head}>
              <View>
                <EventlyText style={s.title}>
                  {isEdit ? COPY.sheetEditTitle : COPY.sheetAddTitle}
                </EventlyText>
                <EventlyText variant="small" style={s.sub}>
                  {isEdit ? COPY.sheetEditSub : COPY.sheetAddSub}
                </EventlyText>
              </View>
              <TouchableOpacity
                style={s.close}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={COPY.close}
              >
                <EventlyIcon name="close" size={17} color={GUEST_MUTED} />
              </TouchableOpacity>
            </View>

            {/* The guest as their row will read, filled in as the host types. */}
            <View style={s.preview}>
              <View
                style={[
                  s.previewAvatar,
                  previewName
                    ? { backgroundColor: avatarColorFor(previewName) }
                    : s.previewAvatarEmpty,
                ]}
              >
                {previewName ? (
                  <EventlyText style={s.previewInitials}>
                    {initialsOf(previewName)}
                  </EventlyText>
                ) : (
                  <EventlyIcon
                    name="account-plus-outline"
                    size={24}
                    color="#ffffff"
                  />
                )}
              </View>
              <View style={s.previewText}>
                <EventlyText style={s.previewName} numberOfLines={1}>
                  {previewName || COPY.namePlaceholder}
                </EventlyText>
                <EventlyText style={s.previewMeta} numberOfLines={1}>
                  {[
                    draft.phone.trim() ? `+91 ${draft.phone.trim()}` : '',
                    GROUP_LABEL[draft.group],
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </EventlyText>
              </View>
            </View>

            {addedName ? (
              <View style={s.added}>
                <EventlyIcon name="check-circle" size={18} color="#13a06f" />
                <EventlyText style={s.addedText}>
                  {COPY.added(addedName)}
                </EventlyText>
              </View>
            ) : null}

            <EventlyText variant="label" style={s.label}>
              {COPY.name}
            </EventlyText>
            <View style={[s.inputBox, focus === 'name' && s.inputBoxFocus]}>
              <EventlyIcon
                name="account-outline"
                size={20}
                color={focus === 'name' ? GUEST_ACCENT : GUEST_MUTED}
              />
              <EventlyTextInput
                ref={nameRef}
                style={s.field}
                value={draft.name}
                onChangeText={name => setDraft(d => ({ ...d, name }))}
                placeholder={COPY.namePlaceholder}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
                onFocus={() => setFocus('name')}
                onBlur={() => setFocus(null)}
                accessibilityLabel={COPY.name}
              />
            </View>

            <EventlyText variant="label" style={s.label}>
              {COPY.phone}
            </EventlyText>
            <View style={[s.inputBox, focus === 'phone' && s.inputBoxFocus]}>
              <View style={s.dial}>
                <EventlyText style={s.dialText}>🇮🇳 +91</EventlyText>
              </View>
              <EventlyTextInput
                ref={phoneRef}
                style={s.field}
                value={draft.phone}
                onChangeText={phone => setDraft(d => ({ ...d, phone }))}
                placeholder="98490 11234"
                keyboardType="phone-pad"
                maxLength={14}
                onFocus={() => setFocus('phone')}
                onBlur={() => setFocus(null)}
                accessibilityLabel={COPY.phone}
              />
            </View>

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
                    onPress={() => setDraft(d => ({ ...d, group }))}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={GROUP_LABEL[group]}
                  >
                    <EventlyIcon
                      name={GROUP_ICON[group]}
                      size={22}
                      color={on ? GUEST_ACCENT : GUEST_NAVY}
                    />
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
              onPress={() => submit(false)}
              accessibilityRole="button"
              accessibilityLabel={COPY.save}
            >
              <GradientFill colors={SAVE_GRADIENT} direction="across" />
              <EventlyIcon name="check" size={18} color="#ffffff" />
              <EventlyText style={s.saveText}>
                {isSaving ? COPY.saving : isEdit ? COPY.saveChanges : COPY.save}
              </EventlyText>
            </TouchableOpacity>

            {/* Adding a family's worth one after another, without reopening. */}
            {isEdit ? null : (
              <TouchableOpacity
                style={s.another}
                activeOpacity={0.7}
                disabled={isSaving}
                onPress={() => submit(true)}
                accessibilityRole="button"
                accessibilityLabel={COPY.saveAnother}
              >
                <EventlyText style={s.anotherText}>
                  {COPY.saveAnother}
                </EventlyText>
              </TouchableOpacity>
            )}
          </Pressable>
        </KeyboardAvoider>
      </Pressable>
    </Modal>
  );
}

export default GuestSheet;
