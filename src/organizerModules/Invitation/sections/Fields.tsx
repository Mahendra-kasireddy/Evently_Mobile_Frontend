import { useState, type ReactNode } from 'react';
import {
  Pressable,
  Switch,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import {
  AppText,
  CalendarSheet,
  EventlyIcon,
  todayIso,
} from '../../../Components';
import { INVITATION_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK, ORG_PAPER, WHITE } from '../design';
import { fieldStyles as s } from '../styles';
import { dayLabel, normalizeTimeText } from '../utils';

/** A white card holding one group of fields, with an optional heading. */
export function Group({
  title,
  hint,
  children,
}: {
  title?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <View style={s.card}>
      {title ? (
        <View style={s.cardHead}>
          <AppText variant="h3" style={s.cardTitle}>
            {title}
          </AppText>
          {hint ? (
            <AppText variant="caption" style={s.hint}>
              {hint}
            </AppText>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

/** A labelled text field with an optional counter, hint and error. */
export function FormField({
  label,
  value,
  onChangeText,
  max,
  hint,
  error,
  multiline = false,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  max?: number;
  hint?: string;
  error?: string;
  multiline?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'multiline'>) {
  return (
    <View style={s.field}>
      <View style={s.labelRow}>
        <AppText variant="bodySmall" style={s.label}>
          {label}
        </AppText>
        {max && multiline ? (
          <AppText variant="label" style={s.counter}>
            {COPY.count(value.length, max)}
          </AppText>
        ) : null}
      </View>
      <TextInput
        {...rest}
        style={[
          s.input,
          multiline && s.inputMulti,
          error ? s.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        maxLength={max}
        placeholderTextColor={ORG_INK.inkFaint}
        accessibilityLabel={label}
      />
      {error ? (
        <AppText
          variant="caption"
          style={s.error}
          accessibilityLiveRegion="polite"
        >
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" style={s.hint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

/** A yes/no setting. */
export function SwitchRow({
  label,
  hint,
  value,
  onValueChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={s.switchRow}>
      <View style={s.switchText}>
        <AppText variant="body" style={s.switchLabel}>
          {label}
        </AppText>
        {hint ? (
          <AppText variant="caption" style={s.hint}>
            {hint}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: ORG_PAPER.hairline, true: ORG_ACCENT.marigold }}
        thumbColor={WHITE}
        ios_backgroundColor={ORG_PAPER.hairline}
        accessibilityLabel={label}
      />
    </View>
  );
}

const swatchTone = (color: string): ViewStyle => ({ backgroundColor: color });

/** One of several, as wrapping chips. */
export function ChoiceChips({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: Array<{ key: string; label: string; swatch?: string }>;
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <View style={s.field}>
      <AppText variant="bodySmall" style={s.label}>
        {label}
      </AppText>
      <View style={s.chips} accessibilityRole="radiogroup">
        {options.map(o => {
          const on = o.key === value;
          return (
            <Pressable
              key={o.key}
              style={[s.chip, on && s.chipOn]}
              onPress={() => onChange(o.key)}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={o.label}
            >
              {o.swatch ? (
                <View style={[s.swatch, swatchTone(o.swatch)]} />
              ) : null}
              <AppText
                variant="bodySmall"
                style={[s.chipText, on && s.chipTextOn]}
              >
                {o.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {hint ? (
        <AppText variant="caption" style={s.hint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

/** HH:MM typed, "1930" becoming "19:30" as it goes. */
export function TimeInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: boolean;
}) {
  return (
    <TextInput
      style={[s.time, error ? s.inputError : null]}
      value={value}
      onChangeText={text => onChange(normalizeTimeText(text))}
      placeholder={COPY.timePh}
      placeholderTextColor={ORG_INK.inkFaint}
      keyboardType="numbers-and-punctuation"
      maxLength={5}
      accessibilityLabel={`${label} ${COPY.timePh}`}
      accessibilityHint={COPY.timeHint}
    />
  );
}

/**
 * A date and a time side by side: the date opens the app's calendar, the time
 * is typed (the app has no time picker). Past dates stay pickable — an
 * invitation is edited after its date too.
 */
export function DateTimeField({
  label,
  date,
  time,
  onDate,
  onTime,
  dateError,
  timeError,
  hint,
}: {
  label: string;
  date: string;
  time: string;
  onDate: (iso: string) => void;
  onTime: (text: string) => void;
  dateError?: string;
  timeError?: string;
  hint?: string;
}) {
  const [picking, setPicking] = useState(false);
  const today = todayIso();
  const min = date && date < today ? date : today;
  const error = dateError || timeError;
  const shown = dayLabel(date);

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
          accessibilityLabel={`${label}: ${shown || COPY.pickDate}`}
        >
          <EventlyIcon
            name="calendar-blank-outline"
            size={18}
            color={ORG_INK.inkSoft}
          />
          <AppText
            variant="bodySmall"
            style={[s.dateValue, !shown && s.dateBlank]}
            numberOfLines={1}
          >
            {shown || COPY.pickDate}
          </AppText>
          {date ? (
            <Pressable
              onPress={() => onDate('')}
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
        <TimeInput
          label={label}
          value={time}
          onChange={onTime}
          error={!!timeError}
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
      {picking ? (
        <CalendarSheet
          visible
          value={date}
          minIso={min}
          title={label}
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
