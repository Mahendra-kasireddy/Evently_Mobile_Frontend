import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { BADGES_COPY as COPY } from '../constants';
import { ORG_INK, tierLook } from '../design';
import { perkStyles as s, styles as base, tierSoftStyles } from '../styles';

/** What the next tier unlocks, two by two. */
export function Perks({
  tier,
  perks,
}: {
  tier: string;
  perks: Array<{ icon: string; label: string }>;
}) {
  const look = tierLook(tier);
  return (
    <View style={base.card}>
      <AppText variant="h3" style={[base.cardTitle, s.title]}>
        {COPY.unlocksTitle(tier)}
      </AppText>
      <View style={s.grid}>
        {perks.map(perk => (
          <View key={perk.label} style={s.perk}>
            <View
              style={[s.icon, tierSoftStyles[tier] ?? tierSoftStyles.Silver]}
            >
              <EventlyIcon name={perk.icon} size={17} color={look.ink} />
            </View>
            <AppText variant="caption" style={s.label}>
              {perk.label}
            </AppText>
          </View>
        ))}
      </View>
      <View style={s.foot}>
        <EventlyIcon name="lock-outline" size={14} color={ORG_INK.inkSoft} />
        <AppText variant="caption" style={s.footText}>
          {`Unlocks at ${tier} tier`}
        </AppText>
      </View>
    </View>
  );
}

export default Perks;
