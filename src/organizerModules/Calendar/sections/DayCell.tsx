import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { DAY_LOOK } from '../design';
import { cellStyles as s } from '../styles';
import type { CalendarDayCell } from '../types';
import { dayTitle } from '../utils';

const STATE_LABEL = {
  booked: 'booked',
  blocked: 'blocked',
  free: 'free',
  past: 'past',
} as const;

/**
 * One day. Booked: a filled marigold disc. Blocked: a grey tile, struck
 * through, with a lock. Today: a ring. Past and other months: faded. The day
 * open below the grid is outlined; a day picked for blocking turns red with a
 * tick.
 */
export function DayCell({
  cell,
  selected,
  picked,
  onPress,
  onLongPress,
}: {
  cell: CalendarDayCell;
  selected: boolean;
  picked: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const booked = cell.state === 'booked';
  const blocked = cell.state === 'blocked';
  const faded = !cell.inMonth || (cell.isPast && !selected);

  return (
    <Pressable
      style={s.wrap}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      accessibilityRole="button"
      accessibilityState={{ selected: selected || picked }}
      accessibilityLabel={`${dayTitle(cell.iso)}, ${STATE_LABEL[cell.state]}${
        cell.isToday ? ', today' : ''
      }`}
    >
      <View
        style={[
          s.cell,
          blocked && s.blocked,
          picked && s.picked,
          selected && !picked && s.selected,
          faded && s.faded,
        ]}
      >
        <View
          style={[
            s.dot,
            booked && s.dotBooked,
            cell.isToday && !booked && s.dotToday,
          ]}
        >
          <AppText
            variant="body"
            style={[
              s.text,
              !cell.inMonth && s.textOutside,
              blocked && s.textBlocked,
              booked && s.textBooked,
              picked && s.textPicked,
            ]}
          >
            {cell.day}
          </AppText>
        </View>
        {picked ? (
          <View style={s.corner}>
            <EventlyIcon
              name="check-circle"
              size={12}
              color={DAY_LOOK.pickedInk}
            />
          </View>
        ) : blocked ? (
          <View style={s.corner}>
            <EventlyIcon name="lock" size={11} color={DAY_LOOK.blockedInk} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

export default DayCell;
