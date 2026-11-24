import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { CALENDAR_COPY as COPY } from '../constants';
import { ORG_INK } from '../design';
import { styles as base, upcomingStyles as s } from '../styles';
import type { UpcomingRow } from '../types';

/** The booked days still ahead in the month shown; a row opens that day. */
export function UpcomingList({
  rows,
  onPick,
}: {
  rows: UpcomingRow[];
  onPick: (iso: string) => void;
}) {
  return (
    <View style={s.wrap}>
      <AppText variant="h3" style={base.sectionTitle}>
        {COPY.upcomingTitle}
      </AppText>
      <View style={s.card}>
        {rows.length === 0 ? (
          <AppText variant="body" style={s.empty}>
            {COPY.upcomingEmpty}
          </AppText>
        ) : (
          rows.map((row, i) => (
            <Pressable
              key={row.iso}
              style={[s.row, i > 0 && s.divider]}
              onPress={() => onPick(row.iso)}
              accessibilityRole="button"
              accessibilityLabel={`${row.weekday} ${row.day}, ${row.title}`}
            >
              <View style={s.tile}>
                <AppText variant="h3" style={s.tileDay}>
                  {row.day}
                </AppText>
                <AppText variant="label" style={s.tileWeekday}>
                  {row.weekday}
                </AppText>
              </View>
              <View style={s.body}>
                <AppText variant="body" style={s.title} numberOfLines={1}>
                  {row.title}
                </AppText>
                {row.more ? (
                  <AppText variant="caption" style={s.more}>
                    {row.more}
                  </AppText>
                ) : null}
              </View>
              <EventlyIcon
                name="chevron-right"
                size={20}
                color={ORG_INK.inkFaint}
              />
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}

export default UpcomingList;
