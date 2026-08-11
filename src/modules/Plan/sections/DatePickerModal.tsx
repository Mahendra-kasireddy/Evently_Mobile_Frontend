import { useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { dateModalStyles } from '../styles';
import { PLAN_NAVY } from '../constants';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface DatePickerModalProps {
  visible: boolean;
  value: string;
  minIso: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

interface DayCell {
  key: string;
  day: number | null;
  iso: string | null;
}

export function DatePickerModal({ visible, value, minIso, onSelect, onClose }: DatePickerModalProps) {
  const initial = value ? new Date(value) : new Date(minIso);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const [minYear, minMonth] = [Number(minIso.slice(0, 4)), Number(minIso.slice(5, 7)) - 1];
  const atMinMonth = viewYear === minYear && viewMonth === minMonth;

  const cells = useMemo<DayCell[]>(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const leading: DayCell[] = Array.from({ length: firstWeekday }, (_, i) => ({ key: `lead-${i}`, day: null, iso: null }));
    const days: DayCell[] = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return { key: `day-${day}`, day, iso: toIsoDate(viewYear, viewMonth, day) };
    });
    return [...leading, ...days];
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (atMinMonth) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={dateModalStyles.overlay} onPress={onClose} accessibilityLabel="Close date picker">
        <Pressable style={dateModalStyles.card} onPress={() => undefined}>
          <View style={dateModalStyles.headRow}>
            <Pressable
              style={[dateModalStyles.navButton, atMinMonth && dateModalStyles.navButtonDisabled]}
              onPress={goPrevMonth}
              disabled={atMinMonth}
            >
              <EventlyIcon name="chevron-left" size={18} color={PLAN_NAVY} />
            </Pressable>
            <EventlyText variant="subtitle" style={dateModalStyles.monthLabel}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </EventlyText>
            <Pressable style={dateModalStyles.navButton} onPress={goNextMonth}>
              <EventlyIcon name="chevron-right" size={18} color={PLAN_NAVY} />
            </Pressable>
          </View>

          <View style={dateModalStyles.weekdayRow}>
            {WEEKDAY_LABELS.map((label, i) => (
              <EventlyText key={`${label}-${i}`} variant="caption" style={dateModalStyles.weekday}>
                {label}
              </EventlyText>
            ))}
          </View>

          <View style={dateModalStyles.dayGrid}>
            {cells.map((cell) => {
              if (cell.day === null || cell.iso === null) {
                return <View key={cell.key} style={dateModalStyles.dayCell} />;
              }
              const disabled = cell.iso < minIso;
              const selected = cell.iso === value;
              return (
                <View key={cell.key} style={dateModalStyles.dayCell}>
                  <Pressable
                    style={[dateModalStyles.dayCircle, selected && dateModalStyles.daySelected]}
                    disabled={disabled}
                    onPress={() => {
                      onSelect(cell.iso as string);
                      onClose();
                    }}
                  >
                    <EventlyText
                      variant="body"
                      style={[dateModalStyles.dayText, disabled && dateModalStyles.dayTextDisabled, selected && dateModalStyles.dayTextSelected]}
                    >
                      {cell.day}
                    </EventlyText>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default DatePickerModal;
