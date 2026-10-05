import { Pressable, ScrollView, View } from 'react-native';
import { artFor, EventlyIcon, EventlyText, GradientFill } from '../../../Components';
import { colors } from '../../../theme';
import {
  CHIP_SELECTED_GRADIENT,
  HERO_FIELD_GRADIENT,
  HERO_FIELD_ICON_NAME,
  HERO_FIELD_LABEL,
  HERO_FIELD_ORDER,
  OCCASION_TINT,
  QUICK_DATES,
  QUICK_DATES_LABEL,
} from '../constants';
import { basicsStyles as s } from '../styles';
import { formatWhen, quickDateIso } from '../utils';
import type { HeroDraft } from '../types';

interface BasicsCardProps {
  draft: HeroDraft;
  onEditField: (field: keyof HeroDraft) => void;
  onPickDate: (iso: string) => void;
}

/**
 * The gradient a row's icon tile wears.
 *
 * Every row has its own, except the occasion row once it has been answered —
 * that one borrows the chosen occasion's colour, which is the same colour that
 * occasion wears on the grid below and on every card about it afterwards.
 */
function fieldGradient(field: keyof HeroDraft, value: string): [string, string] {
  if (field === 'occasion' && value) {
    const tint = OCCASION_TINT[artFor(value)];
    if (tint) return [tint.ink, tint.ink];
  }
  return HERO_FIELD_GRADIENT[field];
}

/** What each row shows when the customer has not answered it yet. */
const EMPTY_VALUE: Record<keyof HeroDraft, string> = {
  occasion: 'Pick an occasion',
  when: 'Pick a date',
  where: 'Pick a city or area',
  guests: 'How many?',
};

/**
 * The four questions a brief needs, one row each.
 *
 * Every row is a button rather than a field: none of the four is typed. Two
 * open their own search screen, two open a sheet, and which is which is the
 * screen's business — this only reports the tap.
 */
export function BasicsCard({
  draft,
  onEditField,
  onPickDate,
}: BasicsCardProps) {
  return (
    <View style={s.card}>
      {HERO_FIELD_ORDER.map((field, index) => {
        const raw = draft[field];
        const value = field === 'when' && raw ? formatWhen(raw) : raw;
        const shown = value || EMPTY_VALUE[field];

        return (
          <Pressable
            key={field}
            style={({ pressed }) => [
              s.row,
              index > 0 && s.rowDivided,
              pressed && s.rowPressed,
            ]}
            onPress={() => onEditField(field)}
            accessibilityRole="button"
            accessibilityLabel={`${HERO_FIELD_LABEL[field]}, ${
              value || 'not set'
            }`}
            accessibilityHint="Opens the picker"
            testID={`basics-${field}`}
          >
            {/*
              The question's own colour, on a tile rather than a bare glyph.
              Four identical navy marks made the brief a list to read; four
              colours make it a form you can find your place in.

              The occasion row is the exception that proves it: once an
              occasion is chosen the tile takes *that* occasion's colour, so
              the brief starts wearing the thing it is about.
            */}
            <View style={s.rowIcon}>
              <GradientFill colors={fieldGradient(field, value)} />
              <EventlyIcon
                name={HERO_FIELD_ICON_NAME[field]}
                size={19}
                color={colors.onPrimary}
              />
            </View>
            <View style={s.rowText}>
              <EventlyText variant="caption" style={s.rowLabel}>
                {HERO_FIELD_LABEL[field]}
              </EventlyText>
              <EventlyText
                style={[s.rowValue, !value && s.rowValueEmpty]}
                numberOfLines={1}
              >
                {shown}
              </EventlyText>
            </View>
            <EventlyIcon
              name="chevron-down"
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        );
      })}

      {/*
        Shortcuts, not a second date control. Each one sets a real day, so the
        When row above updates to the date it chose — a customer who taps "This
        weekend" can still see which weekend that turned out to be.
      */}
      <View style={s.quickRow}>
        <EventlyText variant="caption" style={s.quickLabel}>
          {QUICK_DATES_LABEL}
        </EventlyText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.quickChips}
        >
          {QUICK_DATES.map(quick => {
            const iso = quickDateIso(quick.kind, quick.months ?? 0);
            const active = draft.when === iso;
            return (
              <Pressable
                key={quick.label}
                style={[s.chip, active && s.chipActive]}
                onPress={() => onPickDate(iso)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${quick.label}, ${formatWhen(iso)}`}
                testID={`quick-date-${quick.label}`}
              >
                {/* Filled, not outlined. A pale wash behind a coral word was
                    hard to tell from an unchosen chip at arm's length. */}
                {active ? <GradientFill colors={CHIP_SELECTED_GRADIENT} direction="across" /> : null}
                <EventlyText style={[s.chipText, active && s.chipTextActive]}>
                  {quick.label}
                </EventlyText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

export default BasicsCard;
