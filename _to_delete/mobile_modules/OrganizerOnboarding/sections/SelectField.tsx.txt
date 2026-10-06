import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, EventlyTextInput } from '../../../Components';
import { ORG_ACCENT, ORG_TEXT_MUTED } from '../constants';
import { fieldStyles, selectStyles } from '../styles';
import type { Option } from '../types';

interface SelectFieldProps {
  label: string;
  value: string;
  options: Option[];
  onSelect: (key: string) => void;
  placeholder?: string;
  optional?: boolean;
  /** Allows free text beyond the preset list (e.g. city autocomplete). */
  allowCustomInput?: boolean;
}

/** Mobile-native dropdown: a tappable row that opens a bottom-sheet option list. */
export function SelectField({ label, value, options, onSelect, placeholder = 'Select', optional = false, allowCustomInput = false }: SelectFieldProps) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const selectedLabel = useMemo(() => options.find((o) => o.key === value)?.label ?? value, [options, value]);

  const visibleOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const close = () => {
    setQuery('');
    setVisible(false);
  };
  const choose = (key: string) => {
    onSelect(key);
    close();
  };
  const confirmCustom = () => {
    const trimmed = query.trim();
    if (trimmed) choose(trimmed);
  };

  return (
    <View style={fieldStyles.group}>
      <EventlyText variant="subtitle" style={fieldStyles.label}>
        {label} {optional ? <EventlyText variant="caption" style={fieldStyles.optional}>(optional)</EventlyText> : null}
      </EventlyText>
      <TouchableOpacity style={selectStyles.control} onPress={() => setVisible(true)} accessibilityRole="button" accessibilityLabel={label}>
        <EventlyText variant="body" style={selectedLabel ? selectStyles.controlText : selectStyles.controlPlaceholder} numberOfLines={1}>
          {selectedLabel || placeholder}
        </EventlyText>
        <EventlyIcon name="chevron-down" size={18} color={ORG_TEXT_MUTED} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
        <Pressable style={selectStyles.overlay} onPress={close}>
          <Pressable style={selectStyles.card} onPress={() => undefined}>
            <View style={selectStyles.headRow}>
              <EventlyText variant="h2" style={selectStyles.title}>
                {label}
              </EventlyText>
              <TouchableOpacity style={selectStyles.closeButton} onPress={close} accessibilityLabel={`Close ${label}`}>
                <EventlyIcon name="close" size={18} color={ORG_TEXT_MUTED} />
              </TouchableOpacity>
            </View>

            {allowCustomInput ? (
              <View style={selectStyles.searchRow}>
                <EventlyIcon name="map-marker-outline" size={16} color={ORG_TEXT_MUTED} />
                <EventlyTextInput
                  style={selectStyles.searchInput}
                  value={query}
                  placeholder={`Search or type a ${label.toLowerCase()}`}
                  onChangeText={setQuery}
                  onSubmitEditing={confirmCustom}
                  autoFocus
                />
              </View>
            ) : null}

            <ScrollView keyboardShouldPersistTaps="handled">
              {visibleOptions.length === 0 ? (
                <EventlyText variant="body" style={selectStyles.emptyText}>
                  No matches{allowCustomInput ? ' — you can still use what you typed.' : '.'}
                </EventlyText>
              ) : (
                visibleOptions.map((option) => {
                  const isSelected = option.key === value;
                  return (
                    <TouchableOpacity key={option.key} style={selectStyles.optionRow} onPress={() => choose(option.key)}>
                      <EventlyText variant="body" style={isSelected ? selectStyles.optionTextSelected : selectStyles.optionText}>
                        {option.label}
                      </EventlyText>
                      {isSelected ? <EventlyIcon name="check" size={16} color={ORG_ACCENT} /> : null}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default SelectField;
