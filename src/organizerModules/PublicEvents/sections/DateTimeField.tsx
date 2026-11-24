import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import {
  AppText,
  CalendarSheet,
  EventlyIcon,
  todayIso,
} from '../../../Components';
import { PUBLIC_EVENTS_COPY } from '../constants';
import { ORG_INK } from '../design';
import { formStyles as s } from '../styles';
import { normalizeTimeText, pickedDateLabel } from '../utils';

const COPY = PUBLIC_EVENTS_COPY.form;

/**
 * A date and a time, side by side. The date opens the app's calendar; the
 * time is typed as HH:MM (there is no time picker in the app), with "1930"
 * turned into "19:30" as it is typed.
 */
export function DateTimeField({
  label,
  date,
  time,
  onDate,
  onTime,
  dateError,
  timeError,
  minIso,
  blank = COPY.pickDate,
  hint,
  clearable = false,
  calendarTitle,
}: {
  label: string;
  date: string;
  time: string;
  onDate: (iso: string) => void;
  onTime: (text: string) => void;
  dateError?: string;
  timeError?: string;
  /** Earliest pickable day; defaults to today (or the value, if earlier). */
  minIso?: string;
  blank?: string;
  hint?: string;
  clearable?: boolean;
  calendarTitle?: string;
}) {
  const [picking, setPicking] = useState(false);
  const today = todayIso();
  const floor = minIso ?? today;
  const min = date && date < floor ? date : floor;
  const error = dateError || timeError;

  return (
    <View style={s.field}>
      <AppText variant="bodySmall" style={s.label}>
        {label}
      </AppText>
      <View style={s.dateTime}>
        <Pressable
          style={[s.date, dateError ? s.inputError : null]}
          onPress={() => setPicking(true)}
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${
            date ? pickedDateLabel(date) : blank
          }`}
        >
          <EventlyIcon
            name="calendar-blank-outline"
            size={18}
            color={ORG_INK.inkSoft}
          />
          <AppText
            variant="bodySmall"
            style={[s.dateValue, !date && s.dateBlank]}
            numberOfLines={1}
          >
            {date ? pickedDateLabel(date) : blank}
          </AppText>
          {clearable && (date || time) ? (
            <Pressable
              onPress={() => {
                onDate('');
                onTime('');
              }}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`${COPY.clearDate}: ${label}`}
            >
              <EventlyIcon
                name="close-circle"
                size={18}
                color={ORG_INK.inkFaint}
              />
            </Pressable>
          ) : null}
        </Pressable>
        <TextInput
          style={[s.time, timeError ? s.inputError : null]}
          value={time}
          onChangeText={text => onTime(normalizeTimeText(text))}
          placeholder={COPY.timePh}
          placeholderTextColor={ORG_INK.inkFaint}
          keyboardType="numbers-and-punctuation"
          maxLength={5}
          accessibilityLabel={`${label} ${COPY.timePh}`}
          accessibilityHint={COPY.timeHint}
        />
      </View>
      {error ? (
        <AppText
          variant="caption"
          style={s.error}
          accessibilityLiveRegion="polite"
        >
          {error}
        </AppText>
      ) : (
        <AppText variant="caption" style={s.hint}>
          {hint ?? COPY.timeHint}
        </AppText>
      )}

      {/* Mounted per pick, so the calendar opens on the month already chosen. */}
      {picking ? (
        <CalendarSheet
          visible
          value={date}
          minIso={min}
          title={calendarTitle ?? label}
          onSelect={iso => {
            onDate(iso);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      ) : null}
    </View>
  );
}

export default DateTimeField;
