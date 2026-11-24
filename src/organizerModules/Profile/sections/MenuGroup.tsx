import { Fragment } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { ROW_GRADIENT } from '../constants';
import { ORG_INK } from '../design';
import { groupStyles as s } from '../styles';
import type { MenuGroupSpec, ProfileAction } from '../types';

/** One labelled group of rows, each on its own colour tile — the customer Profile's menu. */
export function MenuGroup({
  group,
  hintFor,
  onPress,
}: {
  group: MenuGroupSpec;
  /** A short note on a row, e.g. "Opening…" while it works. */
  hintFor: (action: ProfileAction) => string;
  onPress: (action: ProfileAction) => void;
}) {
  return (
    <View style={s.group}>
      <AppText variant="overline" style={s.title}>
        {group.title}
      </AppText>
      <View style={s.card}>
        {group.rows.map((row, index) => {
          const hint = hintFor(row.action);
          return (
            <Fragment key={row.action}>
              {index > 0 ? <View style={s.divider} /> : null}
              <TouchableOpacity
                style={s.row}
                activeOpacity={0.7}
                onPress={() => onPress(row.action)}
                accessibilityRole="button"
                accessibilityLabel={hint ? `${row.label}, ${hint}` : row.label}
              >
                <View style={s.iconTile}>
                  <GradientFill
                    colors={ROW_GRADIENT[row.action]}
                    direction="diagonal"
                  />
                  <EventlyIcon name={row.icon} size={17} color="#ffffff" />
                </View>
                <AppText
                  variant="body"
                  style={[s.label, row.action === 'signOut' && s.labelDanger]}
                  numberOfLines={1}
                >
                  {row.label}
                </AppText>
                {hint ? (
                  <AppText variant="caption" style={s.hint}>
                    {hint}
                  </AppText>
                ) : null}
                <EventlyIcon
                  name="chevron-right"
                  size={18}
                  color={ORG_INK.inkFaint}
                />
              </TouchableOpacity>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}

export default MenuGroup;
