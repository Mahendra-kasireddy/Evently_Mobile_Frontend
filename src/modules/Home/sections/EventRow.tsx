import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { HERO_ACCENT_COLOR } from '../constants';
import { eventRowStyles as s } from '../styles';
import type { CurrentEventViewModel } from '../types';

interface EventRowProps {
  event: CurrentEventViewModel;
  onPress: () => void;
}

/**
 * A second, third or tenth live event — one line instead of a full card.
 *
 * Home used to draw every event as the same tall navy hero, so a customer with
 * ten of them scrolled past ten screens of card to reach anything else. Only
 * the leading event still gets that treatment; the rest are rows.
 *
 * What survives the shrink is what tells them apart at a glance: the stage,
 * the name, and the date and place. What goes is everything the row cannot act
 * on in one line — the progress bar, the quote list, the second button. The
 * whole row is the button, and it opens the same screen the card's would.
 */
export function EventRow({ event, onPress }: EventRowProps) {
  return (
    <TouchableOpacity
      style={s.row}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[event.title, event.stageLabel, event.factsLine]
        .filter(Boolean)
        .join('. ')}
      testID={`event-row-${event.source}-${event.refId}`}
    >
      <View style={s.body}>
        <View style={s.stageRow}>
          <View style={s.stageDot} />
          <EventlyText variant="caption" style={s.stageText} numberOfLines={1}>
            {event.stageLabel}
          </EventlyText>
        </View>

        <EventlyText variant="subtitle" style={s.title} numberOfLines={1}>
          {event.title}
        </EventlyText>

        {event.factsLine ? (
          <EventlyText variant="caption" style={s.facts} numberOfLines={1}>
            {event.factsLine}
          </EventlyText>
        ) : null}
      </View>

      {/* The one number worth a row's width: how many organizers have replied.
          Silent at zero, because "0 quotes" is not news the customer can act on. */}
      {event.quoteCount > 0 ? (
        <View style={s.countPill}>
          <EventlyText variant="caption" style={s.countText}>
            {event.quoteCount}
          </EventlyText>
        </View>
      ) : null}

      <EventlyIcon name="chevron-right" size={20} color={HERO_ACCENT_COLOR} />
    </TouchableOpacity>
  );
}

export default EventRow;
