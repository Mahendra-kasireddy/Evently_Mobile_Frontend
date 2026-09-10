import { TouchableOpacity, View } from 'react-native';
import { Confetti, EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { eventHeroStyles as s } from '../styles';
import type { CurrentEventViewModel } from '../types';

interface EventHeroProps {
  event: CurrentEventViewModel;
  /** Copy for the main button, chosen by the stage. */
  ctaLabel: string;
  onPressCta: () => void;
  onPressDetails: () => void;
}

/**
 * The customer's live event, at the top of Home.
 *
 * Every line is the event's own record: the stage it has reached, the brief's
 * date, place and headcount, how many organizers have replied and the spread
 * across their prices. A fact the record does not carry produces no line at
 * all — an event with no venue yet reads shorter rather than showing a slot
 * the customer would take for missing information about their own plans.
 *
 * The progress bar's label counts what has arrived, not what was asked for: a
 * broadcast request does not record how many organizers it reached, so "3 of 4
 * quotes in" would be a denominator this system cannot produce.
 */
export function EventHero({ event, ctaLabel, onPressCta, onPressDetails }: EventHeroProps) {
  const spoken = [event.stageLabel, event.title, event.factsLine, event.quotedLabel]
    .filter(Boolean)
    .join('. ');

  return (
    <View style={s.card}>
      <View style={s.decor} pointerEvents="none" />
      <View style={s.decorArt} pointerEvents="none">
        <Confetti />
      </View>

      <View style={s.stageRow}>
        <View style={s.stageDot} />
        <EventlyText variant="caption" style={s.stageText}>
          {event.stageLabel}
        </EventlyText>
      </View>

      <EventlyText variant="h1" style={s.title} numberOfLines={2}>
        {event.title}
      </EventlyText>
      {event.factsLine ? (
        <EventlyText variant="body" style={s.facts} numberOfLines={2}>
          {event.factsLine}
        </EventlyText>
      ) : null}

      <View style={s.progressRow}>
        <View style={s.track}>
          <View style={[s.fill, { width: `${event.progress}%` }]} />
        </View>
        {event.quoteCount > 0 ? (
          <EventlyText variant="caption" style={s.progressLabel}>
            {`${event.quoteCount} quote${event.quoteCount === 1 ? '' : 's'} in`}
          </EventlyText>
        ) : null}
      </View>

      {/* Only once organizers have actually replied, and only with a spread
          that has two priced ends to it. */}
      {event.quotedLabel ? (
        <View style={s.panel}>
          <View style={s.panelIcon}>
            <EventlyIcon name="chart-box-outline" size={21} color={colors.onPrimary} />
          </View>
          <View style={s.panelText}>
            <EventlyText variant="body" style={s.panelTitle}>
              {event.quotedLabel}
            </EventlyText>
            {event.spreadLabel ? (
              <EventlyText variant="caption" style={s.panelBody}>
                {event.spreadLabel}
              </EventlyText>
            ) : null}
          </View>
        </View>
      ) : null}

      <TouchableOpacity
        style={s.cta}
        activeOpacity={0.85}
        onPress={onPressCta}
        accessibilityRole="button"
        accessibilityLabel={`${ctaLabel}. ${spoken}.`}
      >
        <EventlyText variant="subtitle" style={s.ctaText}>
          {ctaLabel}
        </EventlyText>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.link}
        onPress={onPressDetails}
        accessibilityRole="button"
        accessibilityLabel="See full event details"
      >
        <EventlyText variant="body" style={s.linkText}>
          See full event details
        </EventlyText>
      </TouchableOpacity>
    </View>
  );
}

export default EventHero;
