import { useCallback, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import { digitsOf, initialsOf } from './utils';

/** What we ask the phonebook for, in words the host will read on the prompt. */
const RATIONALE = {
  title: 'Add guests from your contacts',
  message:
    'Evently reads your contacts so you can pick who to invite. Nothing leaves your phone until you add them.',
  buttonPositive: 'Allow',
} as const;

/** An Indian mobile is 10 digits; with a country code, 11–13. */
const MIN_DIGITS = 10;
const MAX_DIGITS = 13;

/** One phonebook entry, reduced to what the picker needs. */
export interface ContactCandidate {
  key: string;
  name: string;
  initials: string;
  phone: string;
}

/**
 * Whether a phonebook entry is something an invitation could be sent to.
 *
 * An address book is full of landlines, short codes, extensions and
 * half-finished numbers. Filtering here rather than posting all of them means
 * the host is never told that twelve of their contacts "were skipped" by a
 * server that had no business seeing them.
 */
function usableNumber(raw: string): string | null {
  const digits = digitsOf(raw);
  if (digits.length < MIN_DIGITS || digits.length > MAX_DIGITS) return null;
  return (raw ?? '').trim();
}

/**
 * The address book, as a list of people who could actually be invited.
 *
 * One entry per contact, not per number: somebody with a mobile and a landline
 * is one guest, and two rows for one person is a list the host then has to
 * clean up. De-duplicated by number, because the same person saved twice under
 * two names is the normal state of a real phonebook.
 */
function toCandidates(contacts: Array<Record<string, unknown>>): ContactCandidate[] {
  const seen = new Set<string>();
  const out: ContactCandidate[] = [];

  for (const contact of contacts) {
    const numbers = ((contact.phoneNumbers as Array<{ number?: string }> | undefined) ?? [])
      .map((entry) => usableNumber(entry?.number ?? ''))
      .filter((value): value is string => value !== null);
    if (numbers.length === 0) continue;

    const name =
      [contact.givenName, contact.familyName]
        .filter((part): part is string => typeof part === 'string' && part.length > 0)
        .join(' ')
        .trim() ||
      (typeof contact.displayName === 'string' ? contact.displayName : '') ||
      '';
    if (!name) continue;

    const phone = numbers[0];
    const key = digitsOf(phone).slice(-10);
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({ key, name, initials: initialsOf(name), phone });
  }

  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export interface ContactsImportResult {
  /** Asks for permission if needed, then loads the address book. */
  open: () => void;
  isLoading: boolean;
  /** Non-null once loaded — the picker is shown on this. */
  candidates: ContactCandidate[] | null;
  close: () => void;
}

/**
 * Reading the phone's own address book so guests can be picked from it.
 *
 * Permission is asked for at the moment the host taps the contacts button,
 * never on mount: a contacts prompt that appears because a screen opened is
 * the kind a person declines on principle. A refusal is not an error state
 * either — it is answered with one sentence, and "Add guest" needs no
 * permission at all.
 */
export function useContactsImport(): ContactsImportResult {
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState<ContactCandidate[] | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    Contacts.getAllWithoutPhotos()
      .then((all) => {
        const usable = toCandidates(all as unknown as Array<Record<string, unknown>>);
        if (usable.length === 0) {
          Alert.alert(
            'No mobile numbers found',
            'None of your contacts have a mobile number an invitation could be sent to. You can add guests by hand instead.',
          );
          return;
        }
        setCandidates(usable);
      })
      .catch(() => {
        Alert.alert(
          'Could not read your contacts',
          'We could not open your contacts just now. You can add a guest by hand instead.',
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const denied = useCallback((permanently: boolean) => {
    if (permanently) {
      /* "Don't ask again" means the prompt will not come back, so the only way
         forward is Settings — said once, with a way to get there. */
      Alert.alert(
        'Contacts access is off',
        'Turn on Contacts for Evently in Settings to pick guests from your phonebook. You can still add guests by hand.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Open settings', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    Alert.alert(
      'Contacts access needed',
      'Evently needs permission to read your contacts to pick guests from them. You can still add guests by hand.',
    );
  }, []);

  const open = useCallback(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, RATIONALE)
        .then((result) => {
          if (result === PermissionsAndroid.RESULTS.GRANTED) return load();
          return denied(result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN);
        })
        .catch(() => denied(false));
      return;
    }

    /*
     * iOS. "limited" counts: the person chose to share some contacts, and
     * those are exactly the ones we may read — treating it as a refusal would
     * ignore a choice they deliberately made.
     */
    Contacts.requestPermission()
      .then((status) => {
        if (status === 'authorized' || status === 'limited') return load();
        return denied(status === 'denied');
      })
      .catch(() => denied(false));
  }, [denied, load]);

  return {
    open,
    isLoading,
    candidates,
    close: useCallback(() => setCandidates(null), []),
  };
}

export default useContactsImport;
