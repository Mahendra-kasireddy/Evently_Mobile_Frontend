import { View } from 'react-native';
import { AppText, EventlyIcon, PressableScale } from '../../../Components';
import { EVENT_COPY } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { linkStyles as s, styles as screen } from '../styles';

const COPY = EVENT_COPY.links;

function LinkCard({
  icon,
  iconColor,
  tint,
  title,
  count,
  sub,
  onPress,
}: {
  icon: string;
  iconColor: string;
  tint: object;
  title: string;
  count?: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      style={s.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[title, count].filter(Boolean).join(', ')}
    >
      <View style={[s.icon, tint]}>
        <EventlyIcon name={icon} size={22} color={iconColor} />
      </View>
      <View style={s.text}>
        <View style={s.titleRow}>
          <AppText variant="body" style={s.title} numberOfLines={1}>
            {title}
          </AppText>
          {count ? (
            <View style={s.count}>
              <AppText variant="label" style={s.countText}>
                {count}
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText variant="caption" style={s.sub} numberOfLines={2}>
          {sub}
        </AppText>
      </View>
      <EventlyIcon name="chevron-right" size={22} color={ORG_INK.inkFaint} />
    </PressableScale>
  );
}

/** The two pages built with the customer — both still web pages for now. */
export function LinksRow({
  ideasLabel,
  onInvitation,
  onIdeas,
}: {
  ideasLabel: string;
  onInvitation: () => void;
  onIdeas: () => void;
}) {
  return (
    <View style={screen.section}>
      <AppText variant="h3" style={screen.sectionTitle}>
        {COPY.title}
      </AppText>
      <View style={s.row}>
        <LinkCard
          icon="email-heart-outline"
          iconColor={ORG_ACCENT.rose}
          tint={s.invite}
          title={COPY.invitation}
          sub={COPY.invitationSub}
          onPress={onInvitation}
        />
        <LinkCard
          icon="lightbulb-on-outline"
          iconColor={ORG_ACCENT.saffron}
          tint={s.ideas}
          title={COPY.ideas}
          count={ideasLabel}
          sub={COPY.ideasSub}
          onPress={onIdeas}
        />
      </View>
    </View>
  );
}

export default LinksRow;
