import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import {
  BorderBeam,
  EventlyIcon,
  EventlyText,
  GradientFill,
  PopIn,
  ThinkingOrbs,
} from '../../../Components';
import { GET_QUOTES_CTA, HERO_FIELD_ORDER } from '../constants';
import {
  HOME_ACCENT,
  HOME_ACTION_GRADIENT,
  HOME_BEAM_COLORS,
  HOME_PAPER,
} from '../design';
import { basicsStyles as s } from '../styles';
import type { HeroDraft } from '../types';
import { answeredCount, BasicsCard } from './BasicsCard';
import { BudgetToggleCard } from './BudgetToggleCard';

interface BannerProps {
  heroDraft: HeroDraft;
  onEditField: (field: keyof HeroDraft) => void;
  onPickDate: (iso: string) => void;
  shareBudget: boolean;
  budget: string;
  onToggleBudget: (enabled: boolean) => void;
  onPressBudgetRange: () => void;
  onSubmit: () => void | Promise<unknown>;
  isSubmitting: boolean;
  quotesRequested: boolean;
  quotesErrorMessage: string | null;
  onEditAgain: () => void;
}

/**
 * The brief composer: four questions, an optional budget, and the button that
 * sends them to organizers.
 *
 * One card, lifted over the hero's foot. Its edge is a quiet hairline while
 * the brief is incomplete; the moment all four are answered a beam of
 * marigold light starts travelling round it (BorderBeam) — the single most
 * important thing on Home is now ready to go, and the card says so without a
 * word. It is the only Border Beam on the screen.
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
  const answered = answeredCount(heroDraft);
  const total = HERO_FIELD_ORDER.length;
  const ready = answered === total;

  if (quotesRequested) {
    return (
      <View style={s.wrap}>
        <View style={s.successCard}>
          <PopIn>
            <View style={s.successMark}>
              <EventlyIcon name="check" size={22} color="#ffffff" />
            </View>
          </PopIn>
          <Text style={s.successTitle}>Your brief is out.</Text>
          <EventlyText style={s.successText}>
            Quote request sent — organizers will reach out within a day.
          </EventlyText>
          <TouchableOpacity
            onPress={onEditAgain}
            accessibilityRole="button"
            hitSlop={8}
          >
            <EventlyText style={s.successEdit}>Edit and send again</EventlyText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      <BorderBeam
        active={ready && !isSubmitting}
        radius={26}
        width={1.6}
        colors={HOME_BEAM_COLORS}
        baseColor={HOME_PAPER.hairline}
        fill={HOME_PAPER.card}
        style={s.composerShadow}
      >
        {/* Where the customer is in the brief: a tiny eyebrow and four
            dots, not a heading — the tiles say what they want. */}
        <View style={s.composerHead}>
          <EventlyText style={s.composerEyebrow}>Your brief</EventlyText>
          <View
            style={s.progress}
            accessible
            accessibilityLabel={`${answered} of ${total} answered`}
          >
            {HERO_FIELD_ORDER.map((field, i) => (
              <View
                key={field}
                style={[s.progressDot, i < answered && s.progressDotOn]}
              />
            ))}
            <EventlyText style={s.progressText}>
              {`${answered}/${total}`}
            </EventlyText>
          </View>
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

        <View style={s.ctaWrap}>
          <Pressable
            style={({ pressed }) => [
              s.cta,
              !ready && s.ctaIdle,
              pressed && ready && s.ctaPressed,
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
            <GradientFill colors={HOME_ACTION_GRADIENT} direction="across" />
            {isSubmitting ? (
              <>
                <ThinkingOrbs
                  size={28}
                  colors={['#ffe2a8', '#ffffff', '#ffc2d4']}
                  label="Sending your brief"
                />
                <EventlyText style={s.ctaText}>Sending your brief…</EventlyText>
              </>
            ) : (
              <>
                <EventlyText style={s.ctaText}>{GET_QUOTES_CTA}</EventlyText>
                <View style={s.ctaArrow}>
                  <EventlyIcon
                    name="arrow-right"
                    size={16}
                    color={HOME_ACCENT.sindoor}
                  />
                </View>
              </>
            )}
          </Pressable>
          <EventlyText style={s.ctaNote}>
            {ready
              ? 'Free · verified organizers reply within a day'
              : `Answer ${total - answered} more to get quotes`}
          </EventlyText>
        </View>
      </BorderBeam>

      {quotesErrorMessage ? (
        <EventlyText style={s.errorText}>{quotesErrorMessage}</EventlyText>
      ) : null}
    </View>
  );
}

export default Banner;
