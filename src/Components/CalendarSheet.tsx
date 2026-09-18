import { useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { brand } from '../theme';
import { EventlyIcon } from './EventlyIcon';
import { EventlyText } from './EventlyText';
import { calendarSheetStyles as s } from './styles';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface CalendarSheetProps {
  visible: boolean;
  /** ISO `YYYY-MM-DD`, or '' for nothing chosen yet. */
  value: string;
  /** Nothing before this can be picked — normally today. */
  minIso: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
  title?: string;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Built from the parts, not from `toISOString`, which shifts to UTC and can
 *  hand back yesterday for anyone east of Greenwich — including every user
 *  this app has. */
export function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** Today, in the device's own timezone. */
export function todayIso(): string {
  const now = new Date();
  return toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
}

interface DayCell {
  key: string;
  day: number | null;
  iso: string | null;
}

/**
 * The app's one calendar.
 *
 * It was the Plan wizard's private date modal; Home's "When" row needs the
 * same thing, and two calendars would be two answers to what a valid date is.
 */
export function CalendarSheet({
  visible,
  value,
  minIso,
  onSelect,
  onClose,
  title,
}: CalendarSheetProps) {
  const initial = value ? new Date(value) : new Date(minIso);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const [minYear, minMonth] = [
    Number(minIso.slice(0, 4)),
    Number(minIso.slice(5, 7)) - 1,
  ];
  const atMinMonth = viewYear === minYear && viewMonth === minMonth;

  const cells = useMemo<DayCell[]>(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const leading: DayCell[] = Array.from({ length: firstWeekday }, (_, i) => ({
      key: `lead-${i}`,
      day: null,
      iso: null,
    }));
    const days: DayCell[] = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        key: `day-${day}`,
        day,
        iso: toIsoDate(viewYear, viewMonth, day),
      };
    });
    return [...leading, ...days];
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (atMinMonth) return;
    if (viewMonth === 0) {
      setViewYear(y => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(y => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={s.overlay}
        onPress={onClose}
        accessibilityLabel="Close date picker"
      >
        <Pressable style={s.card} onPress={() => undefined}>
          <View style={s.grabber} />
          {title ? (
            <EventlyText variant="h2" style={s.title}>
              {title}
            </EventlyText>
          ) : null}

          <View style={s.headRow}>
            <Pressable
              style={[s.navButton, atMinMonth && s.navButtonDisabled]}
              onPress={goPrevMonth}
              disabled={atMinMonth}
              accessibilityRole="button"
              accessibilityLabel="Previous month"
              accessibilityState={{ disabled: atMinMonth }}
            >
              <EventlyIcon name="chevron-left" size={18} color={brand.navy} />
            </Pressable>
            <EventlyText variant="subtitle" style={s.monthLabel}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </EventlyText>
            <Pressable
              style={s.navButton}
              onPress={goNextMonth}
              accessibilityRole="button"
              accessibilityLabel="Next month"
            >
              <EventlyIcon name="chevron-right" size={18} color={brand.navy} />
            </Pressable>
          </View>

          <View style={s.weekdayRow}>
            {WEEKDAY_LABELS.map((label, i) => (
              <EventlyText
                key={`${label}-${i}`}
                variant="caption"
                style={s.weekday}
              >
                {label}
              </EventlyText>
            ))}
          </View>

          <View style={s.dayGrid}>
            {cells.map(cell => {
              if (cell.day === null || cell.iso === null) {
                return <View key={cell.key} style={s.dayCell} />;
              }
              const iso = cell.iso;
              const disabled = iso < minIso;
              const selected = iso === value;
              return (
                <View key={cell.key} style={s.dayCell}>
                  <Pressable
                    style={[s.dayCircle, selected && s.daySelected]}
                    disabled={disabled}
                    onPress={() => {
                      onSelect(iso);
                      onClose();
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ disabled, selected }}
                    accessibilityLabel={iso}
                    testID={`calendar-day-${iso}`}
                  >
                    <EventlyText
                      style={[
                        s.dayText,
                        disabled && s.dayTextDisabled,
                        selected && s.dayTextSelected,
                      ]}
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

export default CalendarSheet;
