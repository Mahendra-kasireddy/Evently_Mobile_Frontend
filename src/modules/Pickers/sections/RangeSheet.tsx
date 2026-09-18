import { Modal, Pressable, View } from 'react-native';
import { EventlyText } from '../../../Components';
import { guestsSheetStyles as s } from '../styles';

interface RangeSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

/**
 * A sheet of bands to choose one of — the budget row uses it.
 *
 * Chips only, with no custom field, because unlike a headcount a band is not a
 * number the customer knows: the list is what organizers filter on, and a
 * typed "about 7 lakh" would match none of them.
 */
export function RangeSheet({
  visible,
  title,
  subtitle,
  value,
  options,
  onSelect,
  onClose,
}: RangeSheetProps) {
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
            {title}
          </EventlyText>
          {subtitle ? (
            <EventlyText variant="caption" style={s.subtitle}>
              {subtitle}
            </EventlyText>
          ) : null}

          <View style={s.chipRow}>
            {options.map(option => {
              const active = option === value;
              return (
                <Pressable
                  key={option}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => {
                    onSelect(option);
                    onClose();
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={option}
                  testID={`range-${option}`}
                >
                  <EventlyText style={[s.chipText, active && s.chipTextActive]}>
                    {option}
                  </EventlyText>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default RangeSheet;
