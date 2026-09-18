import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { COMPARE_ACCENT, COMPARE_COPY as COPY } from '../constants';
import { quoteCardStyles as s } from '../styles';
import type { QuoteCard } from '../types';

interface QuoteCardViewProps {
  quote: QuoteCard;
  /** True once any quote on this request has been accepted. */
  decided: boolean;
  /** True when this is the only quote — nothing else is declined by accepting. */
  isOnly: boolean;
  isAccepting: boolean;
  onAccept: () => void;
  /** Opens the advance for this quote. Only the accepted card offers it. */
  onPay: () => void;
}

/**
 * One organizer's quote.
 *
 * The breakdown is collapsed by default and expandable per card: the question
 * this screen answers first is "how much, from whom", and three quotes with
 * eight line items each is forty lines to scroll before the totals can be
 * compared at all.
 *
 * The accept button says what accepting does before it is pressed. It picks
 * this organizer and declines the others, and there is no undo — that belongs
 * on the button, not in a toast afterwards.
 *
 * Afterwards the accepted card keeps a button, and it is the advance. Without
 * one, a customer who accepted and then backed out of the payment screen — or
 * simply reopened the app — came back to a card reading "ACCEPTED · ₹83,662
 * advance to confirm" with nothing on it to press, and no way to confirm
 * anything. The other cards are genuinely closed and stay buttonless.
 */
export function QuoteCardView({
  quote,
  decided,
  isOnly,
  isAccepting,
  onAccept,
  onPay,
}: QuoteCardViewProps) {
  const [open, setOpen] = useState(false);
  const acceptNote = isOnly ? COPY.acceptNoteOnly : COPY.acceptNote;
  const badge = quote.isAccepted ? COPY.accepted : quote.isLowest ? COPY.lowest : '';

  return (
    <View
      style={[s.card, quote.isAccepted ? s.cardAccepted : quote.isLowest ? s.cardLowest : null]}
    >
      <View style={s.head}>
        <View style={[s.avatar, { backgroundColor: quote.avatarColor }]}>
          <EventlyText variant="subtitle" style={s.avatarText}>
            {quote.initials}
          </EventlyText>
        </View>

        <View style={s.headText}>
          <EventlyText variant="subtitle" style={s.name} numberOfLines={1}>
            {quote.organizerName}
          </EventlyText>
          <View style={s.metaRow}>
            {/* A score with no reviews behind it is not a rating. */}
            {quote.reviews > 0 ? (
              <>
                <EventlyIcon name="star" size={13} color="#e8a33a" />
                <EventlyText variant="caption" style={s.rating}>
                  {quote.rating.toFixed(1)}
                </EventlyText>
                <EventlyText variant="caption" style={s.meta}>
                  {`(${quote.reviews})`}
                </EventlyText>
              </>
            ) : (
              <EventlyText variant="caption" style={s.meta}>
                No reviews yet
              </EventlyText>
            )}
            {quote.tier ? (
              <EventlyText variant="caption" style={s.meta}>
                {`· ${quote.tier}`}
              </EventlyText>
            ) : null}
          </View>
        </View>

        {badge ? (
          <View style={[s.chip, quote.isAccepted ? s.chipAccepted : s.chipLowest]}>
            <EventlyText
              variant="caption"
              style={[s.chipText, quote.isAccepted ? s.chipTextAccepted : s.chipTextLowest]}
            >
              {badge}
            </EventlyText>
          </View>
        ) : null}
      </View>

      <View style={s.totalRow}>
        <EventlyText variant="caption" style={s.totalLabel}>
          {COPY.total}
        </EventlyText>
        <View>
          <EventlyText variant="h1" style={s.totalValue}>
            {quote.totalLabel}
          </EventlyText>
          {/* Dropped when the organizer set no advance rather than shown as ₹0. */}
          {quote.advanceLabel ? (
            <EventlyText variant="caption" style={s.advance}>
              {`${quote.advanceLabel} ${COPY.advance.toLowerCase()}`}
            </EventlyText>
          ) : null}
        </View>
      </View>

      {quote.lines.length > 0 ? (
        <>
          <TouchableOpacity
            style={s.breakdownToggle}
            onPress={() => setOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityState={{ expanded: open }}
            accessibilityLabel={`${COPY.breakdown}, ${quote.organizerName}`}
          >
            <EventlyText variant="body" style={s.breakdownToggleText}>
              {COPY.breakdown}
            </EventlyText>
            <EventlyIcon name={open ? 'chevron-up' : 'chevron-down'} size={18} color={COMPARE_ACCENT} />
          </TouchableOpacity>

          {open
            ? quote.lines.map((line) => (
                <View key={line.key} style={s.line}>
                  <View style={s.lineText}>
                    <EventlyText variant="body" style={s.lineTitle}>
                      {line.title}
                    </EventlyText>
                    {line.subtitle ? (
                      <EventlyText variant="caption" style={s.lineSubtitle} numberOfLines={2}>
                        {line.subtitle}
                      </EventlyText>
                    ) : null}
                  </View>
                  {line.priceLabel ? (
                    <EventlyText variant="body" style={s.linePrice}>
                      {line.priceLabel}
                    </EventlyText>
                  ) : null}
                </View>
              ))
            : null}
        </>
      ) : null}

      {/*
        Three states, and only one of them is blank: an unaccepted card offers
        accepting, the accepted one offers the advance that confirms it, and a
        card closed by somebody else's acceptance offers nothing, because there
        is nothing left to do with it.
      */}
      {quote.isAccepted ? (
        <>
          <TouchableOpacity
            style={s.accept}
            activeOpacity={0.85}
            onPress={onPay}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.payAdvance(quote.advanceLabel)} to ${quote.organizerName}`}
          >
            <EventlyText variant="subtitle" style={s.acceptText}>
              {COPY.payAdvance(quote.advanceLabel)}
            </EventlyText>
          </TouchableOpacity>
          <EventlyText variant="caption" style={s.acceptNote}>
            {COPY.payAdvanceNote}
          </EventlyText>
        </>
      ) : decided ? null : (
        <>
          <TouchableOpacity
            style={[s.accept, isAccepting && s.acceptDisabled]}
            activeOpacity={0.85}
            disabled={isAccepting}
            onPress={onAccept}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.accept} from ${quote.organizerName}, ${quote.totalLabel}. ${acceptNote}`}
          >
            <EventlyText variant="subtitle" style={s.acceptText}>
              {isAccepting ? COPY.accepting : COPY.accept}
            </EventlyText>
          </TouchableOpacity>
          <EventlyText variant="caption" style={s.acceptNote}>
            {acceptNote}
          </EventlyText>
        </>
      )}
    </View>
  );
}

export default QuoteCardView;
