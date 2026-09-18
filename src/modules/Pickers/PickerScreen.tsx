import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText, EventlyTextInput } from '../../Components';
import { brand } from '../../theme';
import { PICKER_COPY, type RecentKind } from './constants';
import { useRecents } from './hooks';
import { PickerRow } from './sections/PickerRow';
import { styles as s } from './styles';
import type { PickerOption } from './types';

interface PickerScreenProps {
  kind: RecentKind;
  /** The full list this picker chooses from. */
  options: PickerOption[];
  /** What the draft currently holds, so the row can show a tick. */
  selected: string;
  onPick: (option: PickerOption) => void;
  /**
   * Turns whatever was typed into a pick, for a picker whose list cannot be
   * complete. Absent means list-only.
   */
  allowTyped?: (query: string) => PickerOption | null;
}

type Section =
  | { kind: 'heading'; key: string; label: string }
  | {
      kind: 'option';
      key: string;
      option: PickerOption;
      icon: string;
      recentId?: string;
    };

/**
 * The search screen behind Home's Occasion and Where rows.
 *
 * A full screen rather than a sheet because both lists are long enough to need
 * a search field, and a sheet with a keyboard over it leaves about four rows
 * visible. One component for both because they differ only in their list and
 * in whether a typed answer counts — and two screens that drifted apart would
 * be two answers to how choosing something works.
 */
export function PickerScreen({
  kind,
  options,
  selected,
  onPick,
  allowTyped,
}: PickerScreenProps) {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const { recents, remember, forget } = useRecents(kind);
  const copy = PICKER_COPY[kind];

  const trimmed = query.trim();
  const matches = useMemo(() => {
    if (!trimmed) return options;
    const needle = trimmed.toLowerCase();
    return options.filter(option =>
      option.label.toLowerCase().includes(needle),
    );
  }, [options, trimmed]);

  /* Only when nothing typed matches. Offering "Use Hyderabad" directly under
     the Hyderabad row would be two ways to pick one place. */
  const typed =
    allowTyped &&
    trimmed &&
    !matches.some(o => o.label.toLowerCase() === trimmed.toLowerCase())
      ? allowTyped(trimmed)
      : null;

  const choose = (option: PickerOption) => {
    remember(option.rememberAs ?? option.label, option.value);
    onPick(option);
    navigation.goBack();
  };

  const rows: Section[] = [];
  if (typed) {
    rows.push({
      kind: 'option',
      key: `typed:${typed.value}`,
      option: typed,
      icon: 'magnify',
    });
  }
  /* Recents are hidden while searching: someone typing has a place in mind,
     and a list of where they have been is in the way of getting to it. */
  if (!trimmed && recents.length > 0) {
    rows.push({
      kind: 'heading',
      key: 'recents',
      label: PICKER_COPY.recentsHeading,
    });
    for (const recent of recents) {
      rows.push({
        kind: 'option',
        key: `recent:${recent.id}`,
        option: { label: recent.label, value: recent.value },
        icon: 'history',
        recentId: recent.id,
      });
    }
  }
  if (matches.length > 0) {
    rows.push({ kind: 'heading', key: 'list', label: copy.listHeading });
    for (const option of matches) {
      rows.push({
        kind: 'option',
        key: `option:${option.value}`,
        option,
        icon: kind === 'area' ? 'city' : 'party-popper',
      });
    }
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.searchRow}>
        <Pressable
          style={s.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          testID="picker-back"
        >
          <EventlyIcon name="arrow-left" size={22} color={brand.navy} />
        </Pressable>
        <EventlyTextInput
          style={s.input}
          value={query}
          onChangeText={setQuery}
          placeholder={copy.placeholder}
          placeholderTextColor={brand.textPlaceholder}
          autoFocus
          returnKeyType="search"
          accessibilityLabel={copy.placeholder}
          testID="picker-search"
        />
      </View>

      <FlatList
        data={rows}
        keyExtractor={row => row.key}
        contentContainerStyle={s.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          item.kind === 'heading' ? (
            <EventlyText variant="subtitle" style={s.sectionHeading}>
              {item.label}
            </EventlyText>
          ) : (
            <PickerRow
              label={item.option.label}
              icon={item.icon}
              selected={item.option.value === selected}
              onPress={() => choose(item.option)}
              onForget={
                item.recentId
                  ? () => forget(item.recentId as string)
                  : undefined
              }
              testID={`picker-row-${item.option.value}`}
            />
          )
        }
        ListEmptyComponent={
          <EventlyText variant="body" style={s.empty}>
            {copy.empty}
          </EventlyText>
        }
      />
    </SafeAreaView>
  );
}

export default PickerScreen;
