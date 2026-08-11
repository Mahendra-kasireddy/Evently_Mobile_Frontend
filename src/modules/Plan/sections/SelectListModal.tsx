import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, EventlyTextInput } from '../../../Components';
import { PLAN_ACCENT, PLAN_TEXT_MUTED } from '../constants';
import { selectModalStyles } from '../styles';

interface SelectListModalProps {
  visible: boolean;
  title: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  /** City needs free text beyond the preset list (matches web's autocomplete-not-strict-select behavior). */
  allowCustomInput?: boolean;
  customPlaceholder?: string;
  /** Budget is optional — shows a "No preference" row that clears the value. */
  clearLabel?: string;
}

export function SelectListModal({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
  allowCustomInput = false,
  customPlaceholder,
  clearLabel,
}: SelectListModalProps) {
  const [query, setQuery] = useState('');

  const visibleOptions = useMemo(() => {
    if (!allowCustomInput || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [allowCustomInput, options, query]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const choose = (option: string) => {
    onSelect(option);
    setQuery('');
    onClose();
  };

  const confirmCustom = () => {
    const trimmed = query.trim();
    if (trimmed) choose(trimmed);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={selectModalStyles.overlay} onPress={handleClose}>
        <Pressable style={selectModalStyles.card} onPress={() => undefined}>
          <View style={selectModalStyles.headRow}>
            <EventlyText variant="h2" style={selectModalStyles.title}>
              {title}
            </EventlyText>
            <TouchableOpacity style={selectModalStyles.closeButton} onPress={handleClose} accessibilityLabel={`Close ${title}`}>
              <EventlyIcon name="close" size={18} color={PLAN_TEXT_MUTED} />
            </TouchableOpacity>
          </View>

          {allowCustomInput ? (
            <View style={selectModalStyles.searchRow}>
              <EventlyIcon name="map-marker-outline" size={16} color={PLAN_TEXT_MUTED} />
              <EventlyTextInput
                style={selectModalStyles.searchInput}
                value={query || value}
                placeholder={customPlaceholder}
                onChangeText={setQuery}
                onSubmitEditing={confirmCustom}
                autoFocus
              />
            </View>
          ) : null}

          <ScrollView keyboardShouldPersistTaps="handled">
            {clearLabel ? (
              <TouchableOpacity style={selectModalStyles.clearRow} onPress={() => choose('')}>
                <EventlyIcon name="close-circle-outline" size={16} color={PLAN_TEXT_MUTED} />
                <EventlyText variant="body" style={selectModalStyles.clearText}>
                  {clearLabel}
                </EventlyText>
              </TouchableOpacity>
            ) : null}

            {visibleOptions.length === 0 ? (
              <EventlyText variant="body" style={selectModalStyles.emptyText}>
                No matches — you can still use what you typed.
              </EventlyText>
            ) : (
              visibleOptions.map((option, index) => {
                const isSelected = option === value;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[selectModalStyles.optionRow, index === 0 && selectModalStyles.optionRowFirst]}
                    onPress={() => choose(option)}
                  >
                    <EventlyText variant="body" style={isSelected ? selectModalStyles.optionTextSelected : selectModalStyles.optionText}>
                      {option}
                    </EventlyText>
                    {isSelected ? <EventlyIcon name="check" size={16} color={PLAN_ACCENT} /> : null}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default SelectListModal;
