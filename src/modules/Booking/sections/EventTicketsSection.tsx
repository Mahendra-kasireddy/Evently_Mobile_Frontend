import { Image, View } from 'react-native';
import { EventlyIcon, EventlyText, GradientFill, PressableScale } from '../../../Components';
import { absoluteFileUrl } from '../../../services/urls';
import { TICKET_STATE_LABEL, dateBlock, formatEventWhen } from '../../PublicEvents/constants';
import type { MyTicket } from '../../PublicEvents/types';
import { ticketSectionStyles as s } from '../styles';
import { BookingSectionHead } from './BookingSectionHead';

/** How many tickets the section lists before "See all" takes over. */
const SHOWN = 3;

const TICKETS_GRADIENT: [string, string] = ['#ff8a5c', '#e8433a'];

/** Each ticket's stub, in turn down the list. */
const STUB_GRADIENTS: Array<[string, string]> = [
  ['#ff8a5c', '#e8433a'],
  ['#a084ff', '#5a35e0'],
  ['#3cc9a1', '#0e8a68'],
];

const STATE_TINT: Record<string, { bg: string; fg: string }> = {
  upcoming: { bg: '#e8efff', fg: '#3b6fd8' },
  checked_in: { bg: '#e8f6ef', fg: '#1d9e75' },
};

interface EventTicketsSectionProps {
  tickets: MyTicket[];
  /** How many to list; the rest are behind "See all". */
  limit?: number;
  /** Off inside a tab, where the tab already names the section. */
  showHead?: boolean;
  onOpen: (ticket: MyTicket) => void;
  onSeeAll: () => void;
}

/**
 * The public-event tickets this customer holds, as little tickets: the
 * poster and the details, a perforation, and a stub that opens the QR.
 */
export function EventTicketsSection({
  tickets,
  limit = SHOWN,
  showHead = true,
  onOpen,
  onSeeAll,
}: EventTicketsSectionProps) {
  if (tickets.length === 0) return null;
  const shown = tickets.slice(0, limit);

  return (
    <View style={s.section}>
      {showHead ? (
        <BookingSectionHead
          title="Event Tickets"
          icon="ticket-confirmation"
          gradient={TICKETS_GRADIENT}
          count={tickets.length}
          onSeeAll={onSeeAll}
        />
      ) : null}

      <View style={s.list}>
        {shown.map((ticket, index) => {
          const tint = STATE_TINT[ticket.state] ?? STATE_TINT.upcoming;
          const stub = STUB_GRADIENTS[index % STUB_GRADIENTS.length];
          const date = dateBlock(ticket.startDateTime, ticket.timezone);
          const where = [ticket.venueName, ticket.city].filter(Boolean).join(', ');
          return (
            <PressableScale
              key={ticket.ticketId}
              style={s.ticket}
              onPress={() => onOpen(ticket)}
              accessibilityRole="button"
              accessibilityLabel={`${ticket.eventTitle}, ${TICKET_STATE_LABEL[ticket.state]}. Open ticket.`}
              testID={`booking-ticket-${ticket.ticketId}`}
            >
              <View style={s.thumbWrap}>
                <Image source={{ uri: absoluteFileUrl(ticket.coverUrl) }} style={s.thumb} resizeMode="cover" />
                {date ? (
                  <View style={s.thumbDate}>
                    <EventlyText variant="caption" style={s.thumbDay}>
                      {date.day}
                    </EventlyText>
                    <EventlyText variant="caption" style={s.thumbMonth}>
                      {date.month}
                    </EventlyText>
                  </View>
                ) : null}
              </View>

              <View style={s.body}>
                <EventlyText variant="body" style={s.rowTitle} numberOfLines={1}>
                  {ticket.eventTitle}
                </EventlyText>
                <View style={s.line}>
                  <EventlyIcon name="clock-outline" size={12} color="#e2552f" />
                  <EventlyText variant="caption" style={s.lineText} numberOfLines={1}>
                    {formatEventWhen(ticket.startDateTime, ticket.timezone)}
                  </EventlyText>
                </View>
                {where ? (
                  <View style={s.line}>
                    <EventlyIcon name="map-marker" size={12} color="#6d4df2" />
                    <EventlyText variant="caption" style={s.lineText} numberOfLines={1}>
                      {where}
                    </EventlyText>
                  </View>
                ) : null}
                <View style={s.pills}>
                  {ticket.ticketTypeName ? (
                    <View style={[s.pill, s.typePill]}>
                      <EventlyText variant="caption" style={[s.pillText, s.typePillText]}>
                        {ticket.ticketTypeName}
                      </EventlyText>
                    </View>
                  ) : null}
                  <View style={[s.pill, { backgroundColor: tint.bg }]}>
                    <EventlyText variant="caption" style={[s.pillText, { color: tint.fg }]}>
                      {TICKET_STATE_LABEL[ticket.state]}
                    </EventlyText>
                  </View>
                </View>
              </View>

              {/* The perforation, cut top and bottom, then the stub. */}
              <View style={s.perf} pointerEvents="none">
                <View style={[s.perfNotch, s.perfNotchTop]} />
                <View style={s.perfLine}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <View key={i} style={s.perfDash} />
                  ))}
                </View>
                <View style={[s.perfNotch, s.perfNotchBottom]} />
              </View>
              <View style={s.stub}>
                <View style={s.qr}>
                  <GradientFill colors={stub} direction="diagonal" />
                  <EventlyIcon name="qrcode" size={20} color="#ffffff" />
                </View>
                <EventlyText variant="caption" style={s.stubText}>
                  QR
                </EventlyText>
              </View>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

export default EventTicketsSection;
