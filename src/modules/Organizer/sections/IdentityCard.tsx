import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { brand } from '../../../theme';
import { identityStyles as s } from '../styles';
import type { OrganizerViewModel } from '../types';

interface IdentityCardProps {
  organizer: OrganizerViewModel;
}

/**
 * Who this organizer is, and the three figures worth leading with.
 *
 * Every stat tile is dropped when the organizer has not earned it: a new
 * business shows one or two rather than a row of zeros, which reads as
 * failing rather than as new.
 */
export function IdentityCard({ organizer }: IdentityCardProps) {
  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={[s.avatar, { backgroundColor: organizer.avatarColor }]}>
          <EventlyText style={s.avatarText}>{organizer.initials}</EventlyText>
        </View>

        <View style={s.headText}>
          <EventlyText style={s.name} numberOfLines={2}>
            {organizer.name}
          </EventlyText>

          <View style={s.tierChip}>
            <EventlyIcon name="medal-outline" size={12} color={brand.textMuted} />
            <EventlyText variant="small" style={s.tierText}>
              {organizer.tier} partner
            </EventlyText>
          </View>

          {organizer.placeLabel ? (
            <EventlyText variant="body" style={s.place} numberOfLines={1}>
              {organizer.placeLabel}
            </EventlyText>
          ) : null}
        </View>
      </View>

      {organizer.stats.length > 0 ? (
        <>
          <View style={s.divider} />
          <View style={s.stats}>
            {organizer.stats.map((stat) => (
              <View key={stat.key} style={s.stat}>
                <EventlyText style={s.statValue}>{stat.value}</EventlyText>
                <EventlyText variant="small" style={s.statLabel} numberOfLines={1}>
                  {stat.label}
                </EventlyText>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

export default IdentityCard;
