import { TouchableOpacity, View } from 'react-native';
import { Confetti, EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
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
        <EventlyText variant="subtitle" style={s.quoteName} numberOfLines={1}>
          {quote.organizerName}
        </EventlyText>
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

  if (!onPress) return <View style={s.quoteRow}>{body}</View>;

  return (
    <TouchableOpacity
      style={s.quoteRow}
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
 * they asked for. A fact the record does not carry produces no line at all —
 * an event with no venue yet reads shorter rather than showing a slot the
 * customer would take for missing information about their own plans.
 *
 * Once quotes arrive the card becomes the comparison itself: one row per
 * organizer, cheapest first, each priced against the cheapest, and an empty
 * seat for anyone still to reply. Before that it is a progress bar, because
 * there is nothing yet to compare.
 */
export function EventHero({
  event,
  ctaLabel,
  onPressCta,
  onPressDetails,
  onPressQuote,
}: EventHeroProps) {
  const hasQuotes = event.quoteRows.length > 0;
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
      {event.reachLine ? (
        <EventlyText variant="body" style={s.facts} numberOfLines={2}>
          {event.reachLine}
        </EventlyText>
      ) : null}

      {/* Only while the brief is still taking quotes. */}
      {event.closesLabel && hasQuotes ? (
        <View style={s.closesPill}>
          <EventlyIcon
            name="clock-outline"
            size={15}
            color={colors.onPrimary}
          />
          <EventlyText variant="caption" style={s.closesText}>
            {event.closesLabel}
          </EventlyText>
        </View>
      ) : null}

      {hasQuotes ? (
        <>
          {event.quoteRows.map(quote => (
            <QuoteRowView
              key={quote.id}
              quote={quote}
              onPress={onPressQuote ? () => onPressQuote(quote) : undefined}
            />
          ))}

          {event.awaitingLabel ? (
            <View style={s.awaitingRow}>
              <View style={s.awaitingSlot} />
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
        /* Nothing to compare yet — how far along the brief is, instead. */
        <View style={s.progressRow}>
          <View style={s.track}>
            <View style={[s.fill, { width: `${event.progress}%` }]} />
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
        <EventlyText variant="subtitle" style={s.ctaText}>
          {ctaLabel}
        </EventlyText>
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
      </TouchableOpacity>
    </View>
  );
}

export default EventHero;
