import { useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import {
  EventlyIcon,
  AppText,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { absoluteFileUrl } from '../../../services/urls';
import {
  TICKET_STATE_LABEL,
  dateBlock,
  formatEventWhen,
} from '../../PublicEvents/constants';
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
  /** The ⋮ menu's "Event details" — the public event page. */
  onDetails?: (ticket: MyTicket) => void;
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
/**
 * The event's cover — or, when there is none or it will not load, the
 * ticket's own colour with a ticket mark, never an empty grey box.
 */
function TicketCover({
  uri,
  colors,
}: {
  uri: string;
  colors: readonly [string, string];
}) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    return (
      <View style={[s.thumb, s.thumbFallback]}>
        <GradientFill colors={[colors[0], colors[1]]} direction="diagonal" />
        <EventlyIcon
          name="ticket-confirmation"
          size={34}
          color="rgba(255,255,255,0.92)"
        />
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={s.thumb}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

export function EventTicketsSection({
  tickets,
  limit = SHOWN,
  showHead = true,
  onOpen,
  onSeeAll,
  onDetails,
}: EventTicketsSectionProps) {
  /* Which ticket's ⋮ menu is open, if any. */
  const [menuFor, setMenuFor] = useState<string | null>(null);
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
          const where = [ticket.venueName, ticket.city]
            .filter(Boolean)
            .join(', ');
          return (
            <PressableScale
              key={ticket.ticketId}
              style={s.ticket}
              onPress={() => onOpen(ticket)}
              accessibilityRole="button"
              accessibilityLabel={`${ticket.eventTitle}, ${
                TICKET_STATE_LABEL[ticket.state]
              }. Open ticket.`}
              testID={`booking-ticket-${ticket.ticketId}`}
            >
              {/* A soft blush in the corner, as on the design. */}
              <View style={s.glow} pointerEvents="none" />
              <View style={s.thumbWrap}>
                <TicketCover
                  uri={absoluteFileUrl(ticket.coverUrl)}
                  colors={stub}
                />
                {date ? (
                  <View style={s.thumbDate}>
                    <AppText variant="h3" style={s.thumbDay}>
                      {date.day}
                    </AppText>
                    <AppText variant="label" style={s.thumbMonth}>
                      {date.month}
                    </AppText>
                  </View>
                ) : null}
              </View>

              <View style={s.body}>
                <View style={s.kindChip}>
                  <EventlyIcon
                    name="star-four-points"
                    size={11}
                    color="#e2477a"
                  />
                  <AppText variant="label" style={s.kindChipText}>
                    Event ticket
                  </AppText>
                </View>
                <AppText variant="h3" style={s.rowTitle} numberOfLines={1}>
                  {ticket.eventTitle}
                </AppText>
                <View style={s.line}>
                  <EventlyIcon name="clock-outline" size={15} color="#e2552f" />
                  <AppText
                    variant="bodySmall"
                    style={s.lineText}
                    numberOfLines={1}
                  >
                    {formatEventWhen(ticket.startDateTime, ticket.timezone)}
                  </AppText>
                </View>
                {where ? (
                  <View style={s.line}>
                    <EventlyIcon name="map-marker" size={15} color="#6d4df2" />
                    <AppText
                      variant="bodySmall"
                      style={s.lineText}
                      numberOfLines={2}
                    >
                      {where}
                    </AppText>
                  </View>
                ) : null}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={s.pillsScroll}
                  contentContainerStyle={s.pills}
                >
                  {ticket.ticketTypeName ? (
                    <View style={[s.pill, s.typePill]}>
                      <AppText
                        variant="label"
                        style={[s.pillText, s.typePillText]}
                      >
                        {ticket.ticketTypeName}
                      </AppText>
                    </View>
                  ) : null}
                  <View style={[s.pill, { backgroundColor: tint.bg }]}>
                    <AppText
                      variant="label"
                      style={[s.pillText, { color: tint.fg }]}
                    >
                      {TICKET_STATE_LABEL[ticket.state]}
                    </AppText>
                  </View>
                </ScrollView>
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
                  <EventlyIcon name="qrcode" size={26} color="#ffffff" />
                </View>
                <AppText variant="label" style={s.stubText}>
                  QR
                </AppText>
              </View>

              <View style={s.more}>
                <PressableScale
                  style={s.moreHit}
                  onPress={() =>
                    setMenuFor(
                      menuFor === ticket.ticketId ? null : ticket.ticketId,
                    )
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`More for ${ticket.eventTitle}`}
                  testID={`booking-ticket-more-${ticket.ticketId}`}
                >
                  <EventlyIcon name="dots-vertical" size={18} color="#8a8fa0" />
                </PressableScale>
              </View>

              {menuFor === ticket.ticketId ? (
                <View style={s.menu}>
                  <PressableScale
                    style={s.menuItem}
                    onPress={() => {
                      setMenuFor(null);
                      onOpen(ticket);
                    }}
                    accessibilityRole="button"
                  >
                    <EventlyIcon name="qrcode" size={16} color="#1b1438" />
                    <AppText variant="bodySmall" style={s.menuText}>
                      Open ticket
                    </AppText>
                  </PressableScale>
                  {onDetails ? (
                    <PressableScale
                      style={s.menuItem}
                      onPress={() => {
                        setMenuFor(null);
                        onDetails(ticket);
                      }}
                      accessibilityRole="button"
                    >
                      <EventlyIcon
                        name="information-outline"
                        size={16}
                        color="#1b1438"
                      />
                      <AppText variant="bodySmall" style={s.menuText}>
                        Event details
                      </AppText>
                    </PressableScale>
                  ) : null}
                </View>
              ) : null}
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

export default EventTicketsSection;
