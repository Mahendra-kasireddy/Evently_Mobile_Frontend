import { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import {
  Confetti,
  EventlyIcon,
  EventlyText,
  GradientFill,
  GradientText,
  useReducedMotion,
} from '../../../Components';
import {
  BRIEF_JOURNEY_STEPS,
  CURRENT_EVENT_STAGE_GRADIENT,
  EVENT_DAYS_GRADIENT,
  EVENT_FACT_GRADIENT,
  EVENT_HERO_CTA_GRADIENT,
  EVENT_HERO_GRADIENT,
  EVENT_HERO_TITLE_GRADIENT,
} from '../constants';
import { eventHeroStyles as s } from '../styles';
import type { CurrentEventViewModel, QuoteRow } from '../types';

interface EventHeroProps {
  event: CurrentEventViewModel;
  /** Copy for the main button, chosen by the stage. */
  ctaLabel: string;
  onPressCta: () => void;
  onPressDetails: () => void;
  /** Opens one organizer's quote. Dropped where there is nothing to open. */
  onPressQuote?: (quote: QuoteRow) => void;
}

/** A dot that breathes while something is under way. Still with Reduce Motion on. */
function PulseDot({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!active || reduceMotion) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, reduceMotion, pulse]);
  return <Animated.View style={[s.stageDot, { opacity: pulse }]} />;
}

/** An icon on a small gradient disc. */
function GradientIcon({
  name,
  colors,
  size = 11,
  disc = s.iconDisc,
}: {
  name: string;
  colors: readonly [string, string];
  size?: number;
  disc?: object;
}) {
  return (
    <View style={disc}>
      <GradientFill colors={colors} direction="diagonal" />
      <EventlyIcon name={name} size={size} color="#ffffff" />
    </View>
  );
}

/** "150" → "150 guests"; a value that already says what it is ("150 guests", "100–200") is left alone. */
function guestsLabel(guests: string): string {
  return /^\d+$/.test(guests.trim()) ? `${guests.trim()} guests` : guests;
}

/** One fact of the brief — the date, the place, the headcount — as a chip with a gradient icon. */
function FactChip({
  icon,
  colors,
  label,
}: {
  icon: string;
  colors: readonly [string, string];
  label: string;
}) {
  return (
    <View style={s.factChip}>
      <GradientIcon name={icon} colors={colors} />
      <EventlyText variant="caption" style={s.factText} numberOfLines={1}>
        {label}
      </EventlyText>
    </View>
  );
}

/**
 * Where a sent brief stands before any quote is in: sent, being reviewed,
 * quotes to come. The middle step pulses — that is the one happening now.
 */
function BriefJourney() {
  return (
    <View style={s.journey}>
      {BRIEF_JOURNEY_STEPS.map((label, i) => {
        const done = i === 0;
        const current = i === 1;
        return (
          <View key={label} style={s.journeyStep}>
            <View style={s.journeyMarkRow}>
              {i > 0 ? (
                <View style={[s.journeyLine, s.journeyLineOn]} />
              ) : (
                <View style={s.journeyLineSpacer} />
              )}
              {done ? (
                <GradientIcon
                  name="check"
                  size={13}
                  colors={CURRENT_EVENT_STAGE_GRADIENT.quotes_received}
                  disc={s.journeyMark}
                />
              ) : current ? (
                <View style={s.journeyMark}>
                  <GradientFill
                    colors={CURRENT_EVENT_STAGE_GRADIENT.submitted}
                    direction="diagonal"
                  />
                  <PulseDot active />
                </View>
              ) : (
                <View style={[s.journeyMark, s.journeyMarkTodo]}>
                  <EventlyIcon
                    name="file-document-outline"
                    size={12}
                    color="#b4a9d6"
                  />
                </View>
              )}
              {i < BRIEF_JOURNEY_STEPS.length - 1 ? (
                <View style={[s.journeyLine, done ? s.journeyLineOn : null]} />
              ) : (
                <View style={s.journeyLineSpacer} />
              )}
            </View>
            <EventlyText
              variant="caption"
              style={[s.journeyLabel, (done || current) && s.journeyLabelOn]}
              numberOfLines={2}
            >
              {label}
            </EventlyText>
          </View>
        );
      })}
    </View>
  );
}

/** One organizer's reply, priced against the cheapest one. */
function QuoteRowView({
  quote,
  onPress,
}: {
  quote: QuoteRow;
  onPress?: () => void;
}) {
  const body = (
    <>
      <View style={[s.quoteAvatar, { backgroundColor: quote.avatarColor }]}>
        <EventlyText variant="subtitle" style={s.quoteAvatarText}>
          {quote.initials}
        </EventlyText>
      </View>
      <View style={s.quoteText}>
        <View style={s.quoteNameRow}>
          <EventlyText variant="subtitle" style={s.quoteName} numberOfLines={1}>
            {quote.organizerName}
          </EventlyText>
          {quote.isLowest ? (
            <View style={s.bestTag}>
              <GradientFill
                colors={CURRENT_EVENT_STAGE_GRADIENT.quotes_received}
                direction="across"
              />
              <EventlyText variant="caption" style={s.bestTagText}>
                Best price
              </EventlyText>
            </View>
          ) : null}
        </View>
        {/* Dropped rather than left blank for a quote with no priced lines and
            no timestamp — an empty second line reads as missing information. */}
        {quote.metaLabel ? (
          <EventlyText variant="caption" style={s.quoteMeta} numberOfLines={1}>
            {quote.metaLabel}
          </EventlyText>
        ) : null}
      </View>
      <View style={s.quoteMoney}>
        <EventlyText variant="subtitle" style={s.quoteTotal}>
          {quote.totalLabel}
        </EventlyText>
        <EventlyText
          variant="caption"
          style={[s.quoteDelta, quote.isLowest && s.quoteDeltaLowest]}
        >
          {quote.deltaLabel}
        </EventlyText>
      </View>
    </>
  );

  if (!onPress)
    return (
      <View style={[s.quoteRow, quote.isLowest && s.quoteRowBest]}>{body}</View>
    );

  return (
    <TouchableOpacity
      style={[s.quoteRow, quote.isLowest && s.quoteRowBest]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${quote.organizerName}, ${quote.totalLabel}. ${quote.deltaLabel}.`}
    >
      {body}
    </TouchableOpacity>
  );
}

/**
 * The customer's live event, at the top of Home.
 *
 * Every line is the event's own record: the stage it has reached, the brief's
 * date, place and headcount, who the brief went to, who has answered and what
 * they asked for. A fact the record does not carry produces no chip at all —
 * an event with no venue yet reads shorter rather than showing a slot the
 * customer would take for missing information about their own plans.
 *
 * Waiting on replies, it shows where the brief is on its way (sent → being
 * reviewed → quotes) rather than a bare progress bar. Once quotes arrive the
 * card becomes the comparison itself: one row per organizer, cheapest first
 * and marked, and an empty seat for anyone still to reply.
 */
export function EventHero({
  event,
  ctaLabel,
  onPressCta,
  onPressDetails,
  onPressQuote,
}: EventHeroProps) {
  const hasQuotes = event.quoteRows.length > 0;
  const stageColors =
    CURRENT_EVENT_STAGE_GRADIENT[event.stage] ??
    CURRENT_EVENT_STAGE_GRADIENT.draft;
  const waitingOnReplies = event.stage === 'submitted' && !hasQuotes;
  const daysLabel =
    event.daysToGo != null && event.daysToGo > 0
      ? `${event.daysToGo} ${event.daysToGo === 1 ? 'day' : 'days'} to go`
      : event.daysToGo === 0
      ? 'Today'
      : '';
  const spoken = [
    event.stageLabel,
    event.title,
    event.factsLine,
    event.reachLine,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <View style={s.card}>
      <GradientFill colors={EVENT_HERO_GRADIENT} direction="diagonal" />
      <View style={[s.glow, s.glowOne]} pointerEvents="none" />
      <View style={[s.glow, s.glowTwo]} pointerEvents="none" />
      <View style={s.decorArt} pointerEvents="none">
        <Confetti />
      </View>

      <View style={s.topRow}>
        <View style={s.stagePill}>
          <GradientFill colors={stageColors} direction="across" />
          <PulseDot
            active={waitingOnReplies || event.stage === 'in_progress'}
          />
          <EventlyText variant="caption" style={s.stageText} numberOfLines={1}>
            {event.stageLabel}
          </EventlyText>
        </View>
        {daysLabel ? (
          <View style={s.daysBadge}>
            <GradientFill colors={EVENT_DAYS_GRADIENT} direction="across" />
            <EventlyIcon name="calendar-heart" size={11} color="#ffffff" />
            <EventlyText variant="caption" style={s.daysText}>
              {daysLabel}
            </EventlyText>
          </View>
        ) : null}
      </View>

      <View style={s.titleWrap}>
        <GradientText
          colors={EVENT_HERO_TITLE_GRADIENT}
          style={s.title}
          numberOfLines={2}
        >
          {event.title}
        </GradientText>
      </View>

      {event.when || event.where || event.guests ? (
        <View style={s.factRow}>
          {event.when ? (
            <FactChip
              icon="calendar-blank-outline"
              colors={EVENT_FACT_GRADIENT.when}
              label={event.when}
            />
          ) : null}
          {event.where ? (
            <FactChip
              icon="map-marker-outline"
              colors={EVENT_FACT_GRADIENT.where}
              label={event.where}
            />
          ) : null}
          {event.guests ? (
            <FactChip
              icon="account-group-outline"
              colors={EVENT_FACT_GRADIENT.guests}
              label={guestsLabel(event.guests)}
            />
          ) : null}
        </View>
      ) : null}

      {waitingOnReplies ? (
        <View style={s.panel}>
          <BriefJourney />
          {event.reachLine || event.closesLabel ? (
            <View style={s.panelFoot}>
              {event.reachLine ? (
                <View style={s.panelLine}>
                  <GradientIcon
                    name="send-check-outline"
                    colors={EVENT_FACT_GRADIENT.where}
                  />
                  <EventlyText
                    variant="caption"
                    style={s.panelLineText}
                    numberOfLines={2}
                  >
                    {event.reachLine}
                  </EventlyText>
                </View>
              ) : null}
              {event.closesLabel ? (
                <View style={s.panelLine}>
                  <GradientIcon
                    name="clock-outline"
                    colors={CURRENT_EVENT_STAGE_GRADIENT.submitted}
                  />
                  <EventlyText
                    variant="caption"
                    style={[s.panelLineText, s.panelLineStrong]}
                  >
                    {event.closesLabel}
                  </EventlyText>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : hasQuotes ? (
        <>
          {event.reachLine ? (
            <EventlyText variant="body" style={s.reach} numberOfLines={2}>
              {event.reachLine}
            </EventlyText>
          ) : null}
          {/* Only while the brief is still taking quotes. */}
          {event.closesLabel ? (
            <View style={s.closesPill}>
              <GradientFill
                colors={CURRENT_EVENT_STAGE_GRADIENT.submitted}
                direction="across"
              />
              <EventlyIcon name="clock-outline" size={14} color="#ffffff" />
              <EventlyText variant="caption" style={s.closesText}>
                {event.closesLabel}
              </EventlyText>
            </View>
          ) : null}
          {event.quoteRows.map(quote => (
            <QuoteRowView
              key={quote.id}
              quote={quote}
              onPress={onPressQuote ? () => onPressQuote(quote) : undefined}
            />
          ))}
          {event.awaitingLabel ? (
            <View style={s.awaitingRow}>
              <View style={s.awaitingSlot}>
                <EventlyIcon name="dots-horizontal" size={15} color="#b4a9d6" />
              </View>
              <EventlyText
                variant="body"
                style={s.awaitingText}
                numberOfLines={2}
              >
                {event.awaitingLabel}
              </EventlyText>
            </View>
          ) : null}
        </>
      ) : (
        /* Nothing to compare and not waiting on replies — how far along it is. */
        <View style={s.progressBlock}>
          <View style={s.progressHead}>
            <EventlyText variant="caption" style={s.progressCaption}>
              Progress
            </EventlyText>
            <EventlyText variant="caption" style={s.progressPercent}>
              {`${Math.round(event.progress)}%`}
            </EventlyText>
          </View>
          <View style={s.track}>
            <View style={[s.fill, { width: `${event.progress}%` }]}>
              <GradientFill colors={stageColors} direction="across" />
            </View>
          </View>
          {event.closesLabel ? (
            <EventlyText variant="caption" style={s.progressLabel}>
              {event.closesLabel}
            </EventlyText>
          ) : null}
        </View>
      )}

      <TouchableOpacity
        style={s.cta}
        activeOpacity={0.85}
        onPress={onPressCta}
        accessibilityRole="button"
        accessibilityLabel={`${ctaLabel}. ${spoken}.`}
      >
        <GradientFill colors={EVENT_HERO_CTA_GRADIENT} direction="across" />
        <EventlyText variant="subtitle" style={s.ctaText}>
          {ctaLabel}
        </EventlyText>
        <View style={s.ctaArrow}>
          <EventlyIcon name="arrow-right" size={16} color="#ffffff" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.link}
        activeOpacity={0.7}
        onPress={onPressDetails}
        accessibilityRole="button"
      >
        <EventlyText variant="body" style={s.linkText}>
          See all quotes & your brief
        </EventlyText>
        <EventlyIcon name="chevron-right" size={16} color="#7c5cdb" />
      </TouchableOpacity>
    </View>
  );
}

export default EventHero;
