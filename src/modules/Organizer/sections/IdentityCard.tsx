import { View } from 'react-native';
import { EventlyIcon, AppText } from '../../../Components';
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
          <AppText variant="h1" style={s.avatarText}>
            {organizer.initials}
          </AppText>
        </View>

        <View style={s.headText}>
          <AppText variant="h2" style={s.name} numberOfLines={2}>
            {organizer.name}
          </AppText>

          <View style={s.tierChip}>
            <EventlyIcon
              name="medal-outline"
              size={12}
              color={brand.textMuted}
            />
            <AppText variant="bodySmall" style={s.tierText}>
              {organizer.tier} partner
            </AppText>
          </View>

          {organizer.placeLabel ? (
            <AppText variant="body" style={s.place} numberOfLines={1}>
              {organizer.placeLabel}
            </AppText>
          ) : null}
        </View>
      </View>

      {organizer.stats.length > 0 ? (
        <>
          <View style={s.divider} />
          <View style={s.stats}>
            {organizer.stats.map(stat => (
              <View key={stat.key} style={s.stat}>
                <AppText variant="h2" style={s.statValue}>
                  {stat.value}
                </AppText>
                <AppText
                  variant="bodySmall"
                  style={s.statLabel}
                  numberOfLines={1}
                >
                  {stat.label}
                </AppText>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

export default IdentityCard;
