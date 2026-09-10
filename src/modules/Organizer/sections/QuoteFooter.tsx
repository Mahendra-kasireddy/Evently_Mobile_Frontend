import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { ORG_NAVY } from '../constants';
import { ORGANIZER_COPY as COPY } from '../constants';
import { footerStyles as s } from '../styles';

interface QuoteFooterProps {
  /** "₹6.5L – 8L" — the row is dropped when there is no published estimate. */
  typicalLabel: string;
  hasRequested: boolean;
  isRequesting: boolean;
  errorMessage: string | null;
  onPress: () => void;
  /** Opens the thread with this organizer, creating it on first contact. */
  onPressMessage: () => void;
  isOpeningMessage: boolean;
}

/**
 * The one thing this screen is for.
 *
 * Pinned rather than scrolled past, because a customer who has read to the
 * bottom of a profile should not have to scroll back to act on it. The
 * reassurance beside the price is there because "request a quote" reads like
 * a commitment to people who have not used the app before, and it is not one.
 *
 * Once a request has gone out the button becomes a receipt — pressing it
 * again would raise a second request for the same event.
 */
export function QuoteFooter({
  typicalLabel,
  hasRequested,
  isRequesting,
  errorMessage,
  onPress,
  onPressMessage,
  isOpeningMessage,
}: QuoteFooterProps) {
  return (
    <View style={s.bar}>
      <View style={s.row}>
        {typicalLabel ? (
          <View style={s.typicalRow}>
            <EventlyText variant="caption" style={s.typicalLabel}>
              {COPY.typical}
            </EventlyText>
            <EventlyText variant="h2" style={s.typicalValue}>
              {typicalLabel}
            </EventlyText>
          </View>
        ) : (
          <View />
        )}
        <EventlyText variant="body" style={s.reassurance} numberOfLines={1}>
          {COPY.freeToAsk}
        </EventlyText>
      </View>

      <View style={s.actions}>
        {/*
          Messaging and asking for a quote are different commitments — one is a
          question, the other starts a priced conversation — so they are
          separate controls rather than one button that does both.
        */}
        <TouchableOpacity
          style={s.message}
          activeOpacity={0.8}
          disabled={isOpeningMessage}
          onPress={onPressMessage}
          accessibilityRole="button"
          accessibilityLabel={COPY.message}
        >
          {isOpeningMessage ? (
            <ActivityIndicator size="small" color={ORG_NAVY} />
          ) : (
            <EventlyIcon name="chat-outline" size={22} color={ORG_NAVY} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.cta, isRequesting && s.ctaBusy, hasRequested && s.ctaDone]}
          activeOpacity={0.85}
          disabled={isRequesting || hasRequested}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={hasRequested ? COPY.requested : COPY.requestQuote}
        >
          <EventlyText variant="subtitle" style={[s.ctaText, hasRequested && s.ctaDoneText]}>
            {hasRequested ? COPY.requested : isRequesting ? COPY.requesting : COPY.requestQuote}
          </EventlyText>
        </TouchableOpacity>
      </View>

      {errorMessage ? (
        <EventlyText variant="caption" style={s.error}>
          {errorMessage}
        </EventlyText>
      ) : null}
    </View>
  );
}

export default QuoteFooter;
