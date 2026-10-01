import { useState } from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../../Components';
import {
  DEFAULT_OCCASION_TINT,
  OCCASION_TINT,
  PLAN_TEXT_MUTED,
} from '../constants';
import { occasionPickerStyles as s } from '../styles';
import { colors } from '../../../theme';
import type { OccasionOption } from '../utils';

/** Tiles shown in the grid before the rest move behind "Others". */
const PRIMARY_COUNT = 5;

const OTHERS_TINT = { bg: '#eef0f4', fg: PLAN_TEXT_MUTED };

interface OccasionPickerProps {
  occasions: OccasionOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

interface TileProps {
  label: string;
  icon: string;
  tint: { bg: string; fg: string };
  isSelected: boolean;
  onPress: () => void;
  /** "Others" opens a sheet rather than choosing, so it has no radio. */
  showRadio?: boolean;
}

/** A light tile: tinted round icon, name, and a radio in the corner. */
function Tile({
  label,
  icon,
  tint,
  isSelected,
  onPress,
  showRadio = true,
}: TileProps) {
  return (
    <TouchableOpacity
      style={[s.card, isSelected && s.cardSelected]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole={showRadio ? 'radio' : 'button'}
      accessibilityState={showRadio ? { selected: isSelected } : undefined}
      accessibilityLabel={label}
    >
      {showRadio ? (
        <View style={[s.radio, isSelected && s.radioOn]}>
          {isSelected ? (
            <EventlyIcon name="check" size={11} color={colors.onPrimary} />
          ) : null}
        </View>
      ) : null}
      <View style={[s.iconCircle, { backgroundColor: tint.bg }]}>
        <EventlyIcon name={icon} size={22} color={tint.fg} />
      </View>
      <EventlyText
        variant="caption"
        style={[s.label, isSelected && s.labelSelected]}
        numberOfLines={1}
      >
        {label}
      </EventlyText>
    </TouchableOpacity>
  );
}

function tintFor(id: string) {
  return OCCASION_TINT[id] ?? DEFAULT_OCCASION_TINT;
}

/**
 * The occasions, as a 3×2 grid: five of them and "Others".
 *
 * The grid fits the screen width, so the whole choice is visible without a
 * sideways scroll. Everything past the fifth occasion lives in a bottom sheet
 * behind "Others". An occasion picked from the sheet takes the fifth slot, so
 * the current choice is always visible in the grid.
 */
export function OccasionPicker({
  occasions,
  selectedId,
  onSelect,
}: OccasionPickerProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const hasMore = occasions.length > PRIMARY_COUNT;
  let visible = occasions.slice(0, PRIMARY_COUNT);
  const selected = occasions.find(o => o.id === selectedId);
  if (hasMore && selected && !visible.some(o => o.id === selectedId)) {
    visible = [...visible.slice(0, PRIMARY_COUNT - 1), selected];
  }
  const extras = occasions.filter(o => !visible.some(v => v.id === o.id));

  const choose = (id: string) => {
    onSelect(id);
    setSheetOpen(false);
  };

  return (
    <View style={s.section}>
      <EventlyText variant="h2" style={s.sectionTitle}>
        What are we celebrating?
      </EventlyText>
      <EventlyText variant="caption" style={s.sectionSubtitle}>
        Choose the occasion for your event
      </EventlyText>

      <View style={s.grid}>
        {visible.map(occasion => (
          <Tile
            key={occasion.id}
            label={occasion.label}
            icon={occasion.icon}
            tint={tintFor(occasion.id)}
            isSelected={occasion.id === selectedId}
            onPress={() => onSelect(occasion.id)}
          />
        ))}
        {hasMore ? (
          <Tile
            label="Others"
            icon="dots-horizontal"
            tint={OTHERS_TINT}
            isSelected={false}
            showRadio={false}
            onPress={() => setSheetOpen(true)}
          />
        ) : null}
      </View>

      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable style={s.sheetOverlay} onPress={() => setSheetOpen(false)}>
          <Pressable
            style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}
            onPress={() => undefined}
          >
            <View style={s.sheetHandle} />
            <EventlyText variant="h2" style={s.sheetTitle}>
              More occasions
            </EventlyText>
            <EventlyText variant="caption" style={s.sheetSubtitle}>
              Select the occasion you&rsquo;re celebrating
            </EventlyText>

            <View style={s.grid}>
              {extras.map(occasion => (
                <Tile
                  key={occasion.id}
                  label={occasion.label}
                  icon={occasion.icon}
                  tint={tintFor(occasion.id)}
                  isSelected={occasion.id === selectedId}
                  onPress={() => choose(occasion.id)}
                />
              ))}
            </View>

            <TouchableOpacity
              style={s.sheetCancel}
              onPress={() => setSheetOpen(false)}
              accessibilityRole="button"
            >
              <EventlyText variant="body" style={s.sheetCancelText}>
                Cancel
              </EventlyText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default OccasionPicker;
