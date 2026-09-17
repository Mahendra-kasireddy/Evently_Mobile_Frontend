import { Modal, Pressable, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { brand } from '../../../theme';
import { DIAL_CODES } from '../constants';
import { dialSheetStyles } from '../styles';

interface DialCodeSheetProps {
  visible: boolean;
  selected: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

/** The region picker behind `+91`. One entry today; see DIAL_CODES for why. */
export function DialCodeSheet({
  visible,
  selected,
  onSelect,
  onClose,
}: DialCodeSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={dialSheetStyles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        {/* Swallows taps so a tap inside the sheet does not close it. */}
        <Pressable style={dialSheetStyles.sheet} onPress={() => {}}>
          <View style={dialSheetStyles.grabber} />
          <EventlyText variant="h2" style={dialSheetStyles.title}>
            Country code
          </EventlyText>

          {DIAL_CODES.map(entry => {
            const isSelected = entry.code === selected;
            return (
              <Pressable
                key={entry.code}
                style={[
                  dialSheetStyles.row,
                  isSelected && dialSheetStyles.rowSelected,
                ]}
                onPress={() => onSelect(entry.code)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${entry.country} ${entry.code}`}
              >
                <EventlyText style={dialSheetStyles.rowLabel}>
                  {entry.flag} {entry.country} ({entry.code})
                </EventlyText>
                {isSelected ? (
                  <EventlyIcon name="check" size={18} color={brand.accent} />
                ) : null}
              </Pressable>
            );
          })}

          <EventlyText variant="caption" style={dialSheetStyles.note}>
            Evently currently accepts Indian mobile numbers only.
          </EventlyText>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default DialCodeSheet;
