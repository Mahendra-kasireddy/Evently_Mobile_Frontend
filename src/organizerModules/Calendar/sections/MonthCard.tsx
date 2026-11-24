import { View } from 'react-native';
import { AppText, EventlyIcon, PressableScale } from '../../../Components';
import { CALENDAR_COPY as COPY, WEEKDAYS } from '../constants';
import { ORG_INK } from '../design';
import { monthStyles as s } from '../styles';
import type { CalendarDayCell } from '../types';
import { DayCell } from './DayCell';
import { Legend } from './Legend';

const WEEKS = [0, 1, 2, 3, 4, 5];

/** The month: title and arrows, the weekday letters, 6×7 days, the legend. */
export function MonthCard({
  title,
  cells,
  selectedIso,
  picked,
  showToday,
  onPrev,
  onNext,
  onToday,
  onPressDay,
  onLongPressDay,
}: {
  title: string;
  cells: CalendarDayCell[];
  /** The open day — not outlined while picking days to block. */
  selectedIso: string | null;
  picked: string[];
  showToday: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onPressDay: (cell: CalendarDayCell) => void;
  onLongPressDay: (cell: CalendarDayCell) => void;
}) {
  const pickedSet = new Set(picked);

  return (
    <View style={s.card}>
      <View style={s.head}>
        <AppText variant="h2" style={s.title} accessibilityRole="header">
          {title}
        </AppText>
        {showToday ? (
          <PressableScale
            style={s.todayChip}
            onPress={onToday}
            accessibilityRole="button"
            accessibilityLabel={COPY.today}
          >
            <AppText variant="bodySmall" style={s.todayText}>
              {COPY.today}
            </AppText>
          </PressableScale>
        ) : null}
        <PressableScale
          style={s.arrow}
          onPress={onPrev}
          accessibilityRole="button"
          accessibilityLabel={COPY.prevMonth}
        >
          <EventlyIcon name="chevron-left" size={24} color={ORG_INK.ink} />
        </PressableScale>
        <PressableScale
          style={s.arrow}
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel={COPY.nextMonth}
        >
          <EventlyIcon name="chevron-right" size={24} color={ORG_INK.ink} />
        </PressableScale>
      </View>

      <View style={s.weekRow}>
        {WEEKDAYS.map((letter, i) => (
          <AppText key={i} variant="label" style={s.weekday}>
            {letter}
          </AppText>
        ))}
      </View>

      <View>
        {WEEKS.map(week => (
          <View key={week} style={s.gridRow}>
            {cells.slice(week * 7, week * 7 + 7).map(cell => (
              <DayCell
                key={cell.iso}
                cell={cell}
                selected={cell.iso === selectedIso}
                picked={pickedSet.has(cell.iso)}
                onPress={() => onPressDay(cell)}
                onLongPress={() => onLongPressDay(cell)}
              />
            ))}
          </View>
        ))}
      </View>

      <Legend />
    </View>
  );
}

export default MonthCard;
