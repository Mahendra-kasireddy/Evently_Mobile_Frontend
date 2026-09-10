import { Fragment } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { groupStyles as g, rowStyles as s } from '../styles';
import type { ProfileAction, ProfileGroupSpec } from '../types';

interface ProfileGroupProps {
  group: ProfileGroupSpec;
  /** The pill on a row, when that row has a count worth showing. */
  badgeFor: (action: ProfileAction) => string;
  onPress: (action: ProfileAction) => void;
}

/**
 * One labelled group of menu rows.
 *
 * The divider is drawn between rows rather than under each one, so the last
 * row meets the card's rounded edge cleanly instead of being cut by a line.
 */
export function ProfileGroup({ group, badgeFor, onPress }: ProfileGroupProps) {
  return (
    <View style={g.group}>
      <EventlyText variant="caption" style={g.title}>
        {group.title}
      </EventlyText>

      <View style={g.card}>
        {group.rows.map((row, index) => {
          const badge = badgeFor(row.action);
          return (
            <Fragment key={row.action}>
              {index > 0 ? <View style={s.divider} /> : null}
              <TouchableOpacity
                style={s.row}
                activeOpacity={0.7}
                onPress={() => onPress(row.action)}
                accessibilityRole="button"
                accessibilityLabel={badge ? `${row.label}, ${badge}` : row.label}
              >
                <EventlyIcon name={row.icon} size={21} color="#5b6470" />
                <EventlyText variant="body" style={s.label} numberOfLines={1}>
                  {row.label}
                </EventlyText>
                {badge ? (
                  <View style={s.badge}>
                    <EventlyText variant="caption" style={s.badgeText}>
                      {badge}
                    </EventlyText>
                  </View>
                ) : null}
                <EventlyIcon name="chevron-right" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}

export default ProfileGroup;
