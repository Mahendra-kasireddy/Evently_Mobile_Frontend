import {
  Image,
  TouchableOpacity,
  View,
  type DimensionValue,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  GradientText,
} from '../../../Components';
import {
  VERIFY_BADGE_GRADIENT,
  VERIFY_HERO_BG,
  VERIFY_HERO_COPY,
  VERIFY_TAGLINE,
  VERIFY_TITLE_GRADIENT,
} from '../constants';
import { verifyHeroStyles as s } from '../styles';

const LOGO_MARK = require('../../../assets/images/logo_mark.png');
const ORGANIZER_ART = require('../../../assets/images/use_choice_organizer.png');

/** Little rotated pills on the wash: [left, top, colour, angle]. */
// Kept to the band beside the back button, clear of the copy.
const CONFETTI: Array<[DimensionValue, number, string, string]> = [
  ['26%', 10, '#f4a6c6', '35deg'],
  ['44%', 34, '#f7b955', '-25deg'],
  ['60%', 8, '#c9b6ff', '60deg'],
  ['76%', 30, '#9fd8c4', '-40deg'],
];

/**
 * The verification step's head: the brand lockup and a two-tone title on a
 * blush wash, with the organizer illustration and two trust badges (verified,
 * bookings) on the right. Light, unlike the night-sky picker before it — this
 * is the moment the app asks for trust, so it should feel open.
 */
export function VerifyHero({
  titleLead,
  titleAccent,
  subtitle,
  onBack,
}: {
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.hero, { paddingTop: insets.top + 8 }]}>
      <GradientFill colors={VERIFY_HERO_BG} direction="diagonal" />
      <View style={s.blob} pointerEvents="none" />
      {CONFETTI.map(([left, top, color, angle], i) => (
        <View
          key={i}
          pointerEvents="none"
          style={[
            s.confetti,
            {
              left,
              top: insets.top + top,
              backgroundColor: color,
              transform: [{ rotate: angle }],
            },
          ]}
        />
      ))}

      <TouchableOpacity
        style={s.back}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <EventlyIcon name="chevron-left" size={22} color="#1a2e5a" />
      </TouchableOpacity>

      <View style={s.row}>
        <View style={s.copy}>
          <View
            style={s.brandRow}
            accessible
            accessibilityRole="header"
            accessibilityLabel={VERIFY_HERO_COPY.wordmark}
          >
            <Image source={LOGO_MARK} style={s.logo} resizeMode="contain" />
            <View>
              <AppText variant="h2" style={s.wordmark}>
                {VERIFY_HERO_COPY.wordmark}
              </AppText>
              <View style={s.taglineRow}>
                <AppText variant="caption" style={s.tagline}>
                  {VERIFY_HERO_COPY.tagline}
                </AppText>
                <EventlyIcon
                  name="heart-outline"
                  size={11}
                  color={VERIFY_TAGLINE}
                />
              </View>
            </View>
          </View>

          <AppText variant="display" style={s.titleLead}>
            {titleLead}
          </AppText>
          <GradientText colors={VERIFY_TITLE_GRADIENT} style={s.titleAccent}>
            {titleAccent}
          </GradientText>
          <AppText variant="body" style={s.subtitle}>
            {subtitle}
          </AppText>
        </View>

        {/* The illustration, with its two trust badges pinned to its own
            left edge — inside its column, so they never cover the copy. */}
        <View
          style={s.artColumn}
          importantForAccessibility="no-hide-descendants"
        >
          <Image
            source={ORGANIZER_ART}
            style={s.art}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <View style={[s.badge, s.badgeTop]}>
            <View style={s.badgeInner}>
              <GradientFill
                colors={VERIFY_BADGE_GRADIENT}
                direction="diagonal"
              />
              <EventlyIcon name="shield-check" size={20} color="#ffffff" />
            </View>
          </View>
          <View style={[s.badge, s.badgeBottom]}>
            <View style={s.badgeInner}>
              <GradientFill
                colors={VERIFY_BADGE_GRADIENT}
                direction="diagonal"
              />
              <EventlyIcon name="calendar-check" size={20} color="#ffffff" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default VerifyHero;
