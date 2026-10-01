import { Image, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { absoluteFileUrl } from '../../../services/urls';
import {
  TICKET_STATE_LABEL,
  formatEventWhen,
} from '../../PublicEvents/constants';
import type { MyTicket } from '../../PublicEvents/types';
import { BOOKING_ACCENT, BOOKING_NAVY } from '../constants';
import { ticketSectionStyles as s } from '../styles';

/** How many tickets the section lists before "See all" takes over. */
const SHOWN = 3;

const STATE_TINT: Record<string, { bg: string; fg: string }> = {
  upcoming: { bg: '#e8efff', fg: '#3b6fd8' },
  checked_in: { bg: '#e8f6ef', fg: '#1d9e75' },
};

interface EventTicketsSectionProps {
  tickets: MyTicket[];
  onOpen: (ticket: MyTicket) => void;
  onSeeAll: () => void;
}

/**
 * The public-event tickets this customer holds, as a grouped list.
 *
 * Full-width rows in one card rather than a carousel: with one ticket a
 * carousel is a lone half-width tile, and a list reads the same at one ticket
 * as at ten. Each row carries the event, when and where, which ticket, and a
 * QR button — the thing somebody opening Bookings before an event wants.
 */
export function EventTicketsSection({
  tickets,
  onOpen,
  onSeeAll,
}: EventTicketsSectionProps) {
  if (tickets.length === 0) return null;
  const shown = tickets.slice(0, SHOWN);

  return (
    <View style={s.section}>
      <View style={s.head}>
        <View style={s.headTitle}>
          <EventlyText variant="subtitle" style={s.title}>
            Event Tickets
          </EventlyText>
          <View style={s.count}>
            <EventlyText variant="caption" style={s.countText}>
              {tickets.length}
            </EventlyText>
          </View>
        </View>
        <TouchableOpacity
          onPress={onSeeAll}
          hitSlop={8}
          style={s.seeAll}
          accessibilityRole="button"
          accessibilityLabel="See all event tickets"
        >
          <EventlyText variant="caption" style={s.seeAllText}>
            See all
          </EventlyText>
          <EventlyIcon name="chevron-right" size={16} color={BOOKING_ACCENT} />
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        {shown.map((ticket, index) => {
          const tint = STATE_TINT[ticket.state] ?? STATE_TINT.upcoming;
          const where = [ticket.venueName, ticket.city]
            .filter(Boolean)
            .join(', ');
          return (
            <TouchableOpacity
              key={ticket.ticketId}
              style={[s.row, index > 0 && s.rowDivider]}
              activeOpacity={0.7}
              onPress={() => onOpen(ticket)}
              accessibilityRole="button"
              accessibilityLabel={`${ticket.eventTitle}, ${
                TICKET_STATE_LABEL[ticket.state]
              }. Open ticket.`}
              testID={`booking-ticket-${ticket.ticketId}`}
            >
              <Image
                source={{ uri: absoluteFileUrl(ticket.coverUrl) }}
                style={s.thumb}
                resizeMode="cover"
              />
              <View style={s.body}>
                <EventlyText
                  variant="body"
                  style={s.rowTitle}
                  numberOfLines={2}
                >
                  {ticket.eventTitle}
                </EventlyText>
                <View style={s.line}>
                  <EventlyIcon
                    name="calendar-month-outline"
                    size={13}
                    color="#6b7385"
                  />
                  <EventlyText
                    variant="caption"
                    style={s.lineText}
                    numberOfLines={1}
                  >
                    {formatEventWhen(ticket.startDateTime, ticket.timezone)}
                  </EventlyText>
                </View>
                {where ? (
                  <View style={s.line}>
                    <EventlyIcon
                      name="map-marker-outline"
                      size={13}
                      color="#6b7385"
                    />
                    <EventlyText
                      variant="caption"
                      style={s.lineText}
                      numberOfLines={1}
                    >
                      {where}
                    </EventlyText>
                  </View>
                ) : null}
                <View style={s.pills}>
                  {ticket.ticketTypeName ? (
                    <View style={[s.pill, s.typePill]}>
                      <EventlyText
                        variant="caption"
                        style={[s.pillText, s.typePillText]}
                      >
                        {ticket.ticketTypeName}
                      </EventlyText>
                    </View>
                  ) : null}
                  <View style={[s.pill, { backgroundColor: tint.bg }]}>
                    <EventlyText
                      variant="caption"
                      style={[s.pillText, { color: tint.fg }]}
                    >
                      {TICKET_STATE_LABEL[ticket.state]}
                    </EventlyText>
                  </View>
                </View>
              </View>
              <View style={s.qr}>
                <EventlyIcon name="qrcode" size={20} color={BOOKING_NAVY} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default EventTicketsSection;
