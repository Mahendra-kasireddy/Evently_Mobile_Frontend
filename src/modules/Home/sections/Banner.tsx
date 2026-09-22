import {
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { CTA_GRADIENT, GET_QUOTES_CTA } from '../constants';
import { basicsStyles as s } from '../styles';
import type { HeroDraft } from '../types';
import { BasicsCard } from './BasicsCard';
import { BudgetToggleCard } from './BudgetToggleCard';

interface BannerProps {
  heroDraft: HeroDraft;
  onEditField: (field: keyof HeroDraft) => void;
  onPickDate: (iso: string) => void;
  shareBudget: boolean;
  budget: string;
  onToggleBudget: (enabled: boolean) => void;
  onPressBudgetRange: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  quotesRequested: boolean;
  quotesErrorMessage: string | null;
  onEditAgain: () => void;
}

/**
 * The four basics, and the button that turns them into a brief.
 *
 * It sits on the page rather than on a navy card, and it leads with the form
 * itself. It used to open with a heading, a strapline and an "or tell us the
 * basics" divider — three lines of framing above rows whose own labels say
 * what they want, and three lines between the customer and the fold.
 */
export function Banner({
  heroDraft,
  onEditField,
  onPickDate,
  shareBudget,
  budget,
  onToggleBudget,
  onPressBudgetRange,
  onSubmit,
  isSubmitting,
  quotesRequested,
  quotesErrorMessage,
  onEditAgain,
}: BannerProps) {
  /* Every row answered. The button says so rather than going grey, the same
     way the sign-in screen's does. */
  const ready = Boolean(
    heroDraft.occasion && heroDraft.when && heroDraft.where && heroDraft.guests,
  );

  if (quotesRequested) {
    return (
      <View style={s.wrap}>
        <View style={s.successCard}>
          <EventlyIcon name="check-circle" size={26} color={colors.success} />
          <EventlyText variant="subtitle" style={s.successText}>
            Quote request sent — organizers will reach out within a day.
          </EventlyText>
          <TouchableOpacity onPress={onEditAgain} accessibilityRole="button">
            <EventlyText variant="caption" style={s.successEdit}>
              Edit and send again
            </EventlyText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      {/*
        No heading, no strapline, no "or tell us the basics" divider.
        The four rows below say what they want by their own labels, and three
        lines of framing above a form the customer can already read is three
        lines between them and the fold.
      */}
      <BasicsCard
        draft={heroDraft}
        onEditField={onEditField}
        onPickDate={onPickDate}
      />

      <BudgetToggleCard
        enabled={shareBudget}
        value={budget}
        onToggle={onToggleBudget}
        onPressRange={onPressBudgetRange}
      />

      <Pressable
        style={({ pressed }) => [
          s.cta,
          !ready && s.ctaIdle,
          pressed && ready && { opacity: 0.9 },
        ]}
        onPress={onSubmit}
        disabled={!ready || isSubmitting}
        accessibilityRole="button"
        accessibilityLabel={GET_QUOTES_CTA}
        accessibilityState={{
          disabled: !ready || isSubmitting,
          busy: isSubmitting,
        }}
        testID="get-quotes"
      >
        {/* Always, in both states — the idle button is the same sweep at
            half opacity, so a fresh Home still shows the colour. */}
        <View style={s.ctaGradient} pointerEvents="none">
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient id="ctaWarm" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0" stopColor={CTA_GRADIENT[0]} />
                <Stop offset="1" stopColor={CTA_GRADIENT[1]} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={100} height={100} fill="url(#ctaWarm)" />
          </Svg>
        </View>

        {isSubmitting ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <>
            <EventlyIcon name="magnify" size={20} color={colors.onPrimary} />
            <EventlyText style={s.ctaText}>{GET_QUOTES_CTA}</EventlyText>
          </>
        )}
      </Pressable>

      {quotesErrorMessage ? (
        <EventlyText variant="caption" style={s.errorText}>
          {quotesErrorMessage}
        </EventlyText>
      ) : null}
    </View>
  );
}

export default Banner;
