import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { EventlyIcon, AppText, EventlyTextInput } from '../../../Components';
import { GUEST_MUTED } from '../constants';
import { contactsSheetStyles as s, sheetStyles as base } from '../styles';
import type { ContactCandidate } from '../useContactsImport';
import type { GuestDraft } from '../types';

interface ContactsSheetProps {
  /** Non-null once the address book has been read. */
  candidates: ContactCandidate[] | null;
  isSaving: boolean;
  onAdd: (guests: GuestDraft[]) => void;
  onClose: () => void;
}

/**
 * Picking guests out of the phonebook.
 *
 * A search box and ticks rather than one-at-a-time, because the reason to
 * reach for contacts at all is that there are twenty people to add. Nothing is
 * pre-ticked: a sheet that opened with four hundred contacts selected is one
 * bad tap away from a guest list nobody can undo.
 *
 * Group is left unfiled on everyone imported. An address book does not say
 * whether somebody is family, and guessing would put a label on the row that
 * the host never chose — they file it from the edit sheet afterwards.
 */
export function ContactsSheet({
  candidates,
  isSaving,
  onAdd,
  onClose,
}: ContactsSheetProps) {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  const visible = candidates !== null;
  /* Memoised so the filter below is not recomputed on every keystroke's
     render as well as on the query change that caused it. */
  const all = useMemo(() => candidates ?? [], [candidates]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      contact =>
        contact.name.toLowerCase().includes(q) ||
        contact.phone.replace(/\s/g, '').includes(q),
    );
  }, [all, query]);

  const toggle = (key: string) =>
    setPicked(current =>
      current.includes(key)
        ? current.filter(k => k !== key)
        : [...current, key],
    );

  const submit = () => {
    const chosen = all.filter(contact => picked.includes(contact.key));
    if (chosen.length === 0) return;
    onAdd(
      chosen.map(contact => ({
        name: contact.name,
        phone: contact.phone,
        group: 'other',
      })),
    );
    setPicked([]);
    setQuery('');
  };

  const close = () => {
    setPicked([]);
    setQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={close}
    >
      <Pressable style={base.overlay} onPress={close}>
        <Pressable style={[base.card, s.card]} onPress={() => undefined}>
          <View style={base.grabber} />

          <View style={base.head}>
            <AppText variant="h2" style={base.title}>
              Add from contacts
            </AppText>
            <TouchableOpacity
              style={base.close}
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <EventlyIcon name="close" size={17} color={GUEST_MUTED} />
            </TouchableOpacity>
          </View>

          <EventlyTextInput
            style={s.search}
            value={query}
            onChangeText={setQuery}
            placeholder="Search your contacts"
            autoCorrect={false}
            accessibilityLabel="Search your contacts"
          />

          <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
            {shown.length === 0 ? (
              <AppText variant="body" style={s.empty}>
                No contacts match that.
              </AppText>
            ) : (
              shown.map(contact => {
                const on = picked.includes(contact.key);
                return (
                  <TouchableOpacity
                    key={contact.key}
                    style={s.row}
                    activeOpacity={0.75}
                    onPress={() => toggle(contact.key)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={`${contact.name}, ${contact.phone}`}
                  >
                    <View style={[s.check, on && s.checkOn]}>
                      {on ? (
                        <EventlyIcon name="check" size={13} color="#ffffff" />
                      ) : null}
                    </View>
                    <View style={s.rowText}>
                      <AppText variant="h3" style={s.name} numberOfLines={1}>
                        {contact.name}
                      </AppText>
                      <AppText
                        variant="bodySmall"
                        style={s.phone}
                        numberOfLines={1}
                      >
                        {contact.phone}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          <TouchableOpacity
            style={[
              base.save,
              (isSaving || picked.length === 0) && base.saveBusy,
            ]}
            activeOpacity={0.85}
            disabled={isSaving || picked.length === 0}
            onPress={submit}
            accessibilityRole="button"
            accessibilityLabel={
              picked.length === 0
                ? 'Pick contacts to add'
                : `Add ${picked.length} ${
                    picked.length === 1 ? 'guest' : 'guests'
                  }`
            }
          >
            <AppText variant="h3" style={base.saveText}>
              {isSaving
                ? 'Adding…'
                : picked.length === 0
                ? 'Pick contacts to add'
                : `Add ${picked.length} ${
                    picked.length === 1 ? 'guest' : 'guests'
                  }`}
            </AppText>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default ContactsSheet;
