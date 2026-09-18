import {
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { BASICS_DIVIDER, GET_QUOTES_CTA } from '../constants';
import { basicsStyles as s } from '../styles';
import type { BannerViewModel, HeroDraft } from '../types';
import { BasicsCard } from './BasicsCard';
import { BudgetToggleCard } from './BudgetToggleCard';

interface BannerProps {
  data: BannerViewModel;
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
 * "What shall we celebrate next?" — the pitch, the four basics, and the button
 * that turns them into a brief.
 *
 * It sits on the page rather than on a navy card. It used to be a dark hero
 * with confetti and a garland behind it, and the form is the point of the
 * block: the decoration was competing with the only thing the customer is
 * meant to look at.
 */
export function Banner({
  data,
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
      <EventlyText style={s.heading}>
        {data.headingLead}{' '}
        <EventlyText style={[s.heading, s.headingAccent]}>
          {data.headingAccent}
        </EventlyText>{' '}
        {data.headingTail}
      </EventlyText>
      <EventlyText variant="body" style={s.subtitle}>
        {data.subtitle}
      </EventlyText>

      <View style={s.dividerRow}>
        <View style={s.dividerLine} />
        <EventlyText variant="caption" style={s.dividerText}>
          {BASICS_DIVIDER}
        </EventlyText>
        <View style={s.dividerLine} />
      </View>

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
        {isSubmitting ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <>
            <EventlyIcon
              name="magnify"
              size={20}
              color={ready ? colors.onPrimary : colors.textMuted}
            />
            <EventlyText style={[s.ctaText, !ready && s.ctaTextIdle]}>
              {GET_QUOTES_CTA}
            </EventlyText>
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
