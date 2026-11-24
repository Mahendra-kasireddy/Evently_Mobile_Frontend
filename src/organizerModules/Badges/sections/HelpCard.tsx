import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { BADGES_COPY as COPY } from '../constants';
import { ORG_ACCENT } from '../design';
import { helpStyles as s } from '../styles';

/** A person to talk to about reaching the next tier. */
export function HelpCard({
  tier,
  onPress,
}: {
  tier: string;
  onPress: () => void;
}) {
  return (
    <View style={s.card}>
      <View style={s.icon}>
        <EventlyIcon name="phone-outline" size={20} color={ORG_ACCENT.jade} />
      </View>
      <View style={s.body}>
        <AppText variant="body" style={s.title}>
          {COPY.helpTitle(tier)}
        </AppText>
        <AppText variant="caption" style={s.sub}>
          {COPY.helpBody}
        </AppText>
      </View>
      <Pressable
        style={s.cta}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={COPY.helpCta}
      >
        <AppText variant="bodySmall" style={s.ctaText}>
          {COPY.helpCta}
        </AppText>
      </Pressable>
    </View>
  );
}

export default HelpCard;
