import { useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { EventlyText, EventlyTextInput } from '../../../Components';
import { brand } from '../../../theme';
import { GUESTS_COPY, GUESTS_FALLBACK } from '../constants';
import { guestsSheetStyles as s } from '../styles';

interface GuestsSheetProps {
  visible: boolean;
  value: string;
  /** The server's guest ranges. Falls back to a sensible spread when empty. */
  options: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

/** Digits only, capped — a headcount is a number, and the field is 20 chars server-side. */
function sanitize(input: string): string {
  return input.replace(/\D/g, '').slice(0, 6);
}

/**
 * How many people.
 *
 * Presets plus a field, because the two are used by different people: most
 * customers round to a hundred, and the ones who do not already know their
 * number and should not have to find the nearest chip to it.
 */
export function GuestsSheet({
  visible,
  value,
  options,
  onSelect,
  onClose,
}: GuestsSheetProps) {
  const presets = options.length > 0 ? options : GUESTS_FALLBACK;
  const [custom, setCustom] = useState('');

  /* Reopening starts clean unless the current value really is a custom one —
     otherwise the field shows whatever was typed and abandoned last time. */
  useEffect(() => {
    if (!visible) return;
    setCustom(presets.includes(value) ? '' : value);
  }, [visible, value, presets]);

  const canApply = custom.length > 0 && custom !== value;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={s.backdrop}
        onPress={onClose}
        accessibilityLabel="Close"
      >
        <Pressable style={s.sheet} onPress={() => undefined}>
          <View style={s.grabber} />
          <EventlyText variant="h2" style={s.title}>
            {GUESTS_COPY.title}
          </EventlyText>
          <EventlyText variant="caption" style={s.subtitle}>
            {GUESTS_COPY.subtitle}
          </EventlyText>

          <View style={s.chipRow}>
            {presets.map(preset => {
              const active = preset === value;
              return (
                <Pressable
                  key={preset}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => {
                    onSelect(preset);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`${preset} guests`}
                  testID={`guests-${preset}`}
                >
                  <EventlyText style={[s.chipText, active && s.chipTextActive]}>
                    {preset}
                  </EventlyText>
                </Pressable>
              );
            })}
          </View>

          <EventlyText variant="subtitle" style={s.customLabel}>
            {GUESTS_COPY.customLabel}
          </EventlyText>
          <View style={s.customRow}>
            <EventlyTextInput
              style={s.customInput}
              value={custom}
              onChangeText={text => setCustom(sanitize(text))}
              placeholder={GUESTS_COPY.customPlaceholder}
              placeholderTextColor={brand.textPlaceholder}
              keyboardType="number-pad"
              returnKeyType="done"
              accessibilityLabel={GUESTS_COPY.customLabel}
              testID="guests-custom"
            />
            <Pressable
              style={[s.done, !canApply && s.doneIdle]}
              disabled={!canApply}
              onPress={() => {
                onSelect(custom);
                onClose();
              }}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canApply }}
              accessibilityLabel={GUESTS_COPY.done}
              testID="guests-done"
            >
              <EventlyText style={[s.doneText, !canApply && s.doneTextIdle]}>
                {GUESTS_COPY.done}
              </EventlyText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default GuestsSheet;
