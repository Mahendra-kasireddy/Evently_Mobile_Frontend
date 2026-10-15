import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import {
  artFor,
  EventlyIcon,
  AppText,
  GradientFill,
  PressableScale,
  todayIso,
  useReducedMotion,
} from '../../../Components';
import {
  HERO_FIELD_ICON_NAME,
  HERO_FIELD_LABEL,
  HERO_FIELD_ORDER,
  OCCASION_TINT,
  QUICK_DATES,
  QUICK_DATES_LABEL,
} from '../constants';
import { HOME_ACCENT } from '../design';
import { basicsStyles as s } from '../styles';
import { formatWhen, quickDateIso } from '../utils';
import type { HeroDraft } from '../types';

interface BasicsCardProps {
  draft: HeroDraft;
  onEditField: (field: keyof HeroDraft) => void;
  onPickDate: (iso: string) => void;
}

/**
 * Each question's own colour — marigold for what, rose for when, jade for
 * where, lapis for who — drawn from the one Home palette rather than four
 * unrelated gradients.
 */
const FIELD_ACCENT: Record<keyof HeroDraft, [string, string]> = {
  occasion: [HOME_ACCENT.marigold, HOME_ACCENT.saffron],
  when: ['#ec8fab', HOME_ACCENT.rose],
  where: ['#43b493', HOME_ACCENT.jade],
  guests: ['#7493dd', HOME_ACCENT.lapis],
};

/**
 * The accent a tile wears. Once an occasion is chosen its tile takes that
 * occasion's own colour — the same one it wears on the grid and on every
 * card about it afterwards — so the brief starts wearing what it is about.
 */
function accentFor(field: keyof HeroDraft, value: string): [string, string] {
  if (field === 'occasion' && value) {
    const tint = OCCASION_TINT[artFor(value)];
    if (tint) return [tint.ink, tint.ink];
  }
  return FIELD_ACCENT[field];
}

/** What each tile shows when the customer has not answered it yet. */
const EMPTY_VALUE: Record<keyof HeroDraft, string> = {
  occasion: 'Pick an occasion',
  when: 'Pick a date',
  where: 'City or area',
  guests: 'How many?',
};

/**
 * One question, as a tile.
 *
 * Unanswered it is a recessed well with a quiet outline icon; answered it
 * lifts to white and its icon fills with colour — so a glance across the four
 * says how much of the brief is done without reading any of it.
 */
function SelectorTile({
  field,
  raw,
  onPress,
}: {
  field: keyof HeroDraft;
  raw: string;
  onPress: () => void;
}) {
  const value = field === 'when' && raw ? formatWhen(raw) : raw;
  const answered = Boolean(value);
  const accent = accentFor(field, value);

  return (
    <PressableScale
      containerStyle={s.tileSlot}
      style={[s.tile, answered && s.tileAnswered]}
      scaleTo={0.96}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${HERO_FIELD_LABEL[field]}, ${value || 'not set'}`}
      accessibilityHint="Opens the picker"
      testID={`basics-${field}`}
    >
      <View style={s.tileTop}>
        <View style={[s.tileIcon, !answered && s.tileIconIdle]}>
          {answered ? <GradientFill colors={accent} /> : null}
          <EventlyIcon
            name={HERO_FIELD_ICON_NAME[field]}
            size={16}
            color={answered ? '#ffffff' : accent[1]}
          />
        </View>
        <AppText variant="overline" style={s.tileLabel}>
          {HERO_FIELD_LABEL[field]}
        </AppText>
      </View>
      <AppText
        variant="h3"
        style={[s.tileValue, !answered && s.tileValueEmpty]}
        numberOfLines={1}
      >
        {value || EMPTY_VALUE[field]}
      </AppText>
    </PressableScale>
  );
}

/** The pill's own width before it is stretched onto a chip. */
const PILL_BASE = 100;

type ChipBox = { x: number; w: number; h: number };

/**
 * Quick dates, with a liquid selection.
 *
 * The chosen chip is marked by one pill that flows from chip to chip: its
 * position springs quickly and its width follows more slowly, so it stretches
 * as it travels and squashes as it lands — the gooey feel, on two native-
 * driver transforms. Shortcuts, not a second date control: each sets a real
 * day, and the When tile above shows exactly which.
 */
function QuickDates({
  when,
  onPickDate,
}: {
  when: string;
  onPickDate: (iso: string) => void;
}) {
  const reduced = useReducedMotion();
  const [boxes, setBoxes] = useState<Record<string, ChipBox>>({});
  const x = useRef(new Animated.Value(0)).current;
  const sx = useRef(new Animated.Value(1)).current;
  const sy = useRef(new Animated.Value(1)).current;
  const shown = useRef(new Animated.Value(0)).current;
  const placed = useRef(false);
  /* The date the customer had before they reached for a shortcut — from the
     calendar, or the seeded default — so taking the shortcut back restores
     it rather than leaving When empty. */
  const beforeQuick = useRef<string | null>(null);

  const chips = QUICK_DATES.map(quick => ({
    ...quick,
    iso: quickDateIso(quick.kind, quick.months ?? 0),
  }));
  const active = chips.find(chip => chip.iso === when)?.label ?? null;
  const box = active ? boxes[active] : undefined;

  useEffect(() => {
    if (!box) {
      placed.current = false;
      Animated.timing(shown, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }).start();
      return;
    }
    const toX = box.x + box.w / 2 - PILL_BASE / 2;
    const toS = box.w / PILL_BASE;
    if (!placed.current || reduced) {
      x.setValue(toX);
      sx.setValue(toS);
      placed.current = true;
      Animated.timing(shown, {
        toValue: 1,
        duration: reduced ? 0 : 200,
        useNativeDriver: true,
      }).start();
      return;
    }
    Animated.parallel([
      Animated.spring(x, {
        toValue: toX,
        tension: 170,
        friction: 17,
        useNativeDriver: true,
      }),
      Animated.spring(sx, {
        toValue: toS,
        tension: 90,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(sy, {
          toValue: 0.8,
          duration: 110,
          useNativeDriver: true,
        }),
        Animated.spring(sy, {
          toValue: 1,
          tension: 220,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [box, reduced, shown, sx, sy, x]);

  return (
    <View style={s.quickRow}>
      <AppText variant="label" style={s.quickLabel} numberOfLines={1}>
        {QUICK_DATES_LABEL}
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.quickScroll}
        contentContainerStyle={s.quickChips}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            s.pill,
            {
              width: PILL_BASE,
              height: box?.h ?? 34,
              opacity: shown,
              transform: [{ translateX: x }, { scaleX: sx }, { scaleY: sy }],
            },
          ]}
        />
        {chips.map(chip => {
          const isActive = chip.label === active;
          return (
            <Pressable
              key={chip.label}
              style={[s.chip, isActive && s.chipActive]}
              onLayout={e => {
                const { x: cx, width, height } = e.nativeEvent.layout;
                setBoxes(prev => {
                  const was = prev[chip.label];
                  if (was && was.x === cx && was.w === width) return prev;
                  return {
                    ...prev,
                    [chip.label]: { x: cx, w: width, h: height },
                  };
                });
              }}
              /* A second tap on the chosen chip takes the shortcut back:
                 When returns to the date it held before (or today). */
              onPress={() => {
                if (isActive) {
                  onPickDate(beforeQuick.current || todayIso());
                  beforeQuick.current = null;
                  return;
                }
                if (!active) beforeQuick.current = when;
                onPickDate(chip.iso);
              }}
              accessibilityHint={
                isActive
                  ? 'Tap again to go back to your earlier date'
                  : undefined
              }
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${chip.label}, ${formatWhen(chip.iso)}`}
              testID={`quick-date-${chip.label}`}
            >
              <AppText
                variant="label"
                style={[s.chipText, isActive && s.chipTextActive]}
                numberOfLines={1}
              >
                {chip.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

/**
 * The four questions a brief needs, as a two-by-two of selector tiles, and
 * the quick-date shortcuts under them.
 *
 * Every tile is a button rather than a field: none of the four is typed. Two
 * open their own search screen, two open a sheet, and which is which is the
 * screen's business — this only reports the tap.
 */
export function BasicsCard({
  draft,
  onEditField,
  onPickDate,
}: BasicsCardProps) {
  return (
    <View>
      <View style={s.grid}>
        {HERO_FIELD_ORDER.map(field => (
          <SelectorTile
            key={field}
            field={field}
            raw={draft[field]}
            onPress={() => onEditField(field)}
          />
        ))}
      </View>
      <QuickDates when={draft.when} onPickDate={onPickDate} />
    </View>
  );
}

/** For the composer's progress line. */
export function answeredCount(draft: HeroDraft): number {
  return HERO_FIELD_ORDER.filter(field => Boolean(draft[field])).length;
}

export default BasicsCard;
