import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient,
  Rect,
  SvgXml,
  Stop,
} from 'react-native-svg';
import { EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { PUBLIC_EVENTS_COPY, formatEventWhen } from './constants';
import { useDigitalTicket } from './hooks';
import { PE_TICKET_BOTTOM, PE_TICKET_TOP, passUi as s, ui } from './ui.styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'DigitalTicket'>;
type Route = RouteProp<RootStackParamList, 'DigitalTicket'>;

function Backdrop() {
  return (
    <Svg style={ui.fill} width="100%" height="100%">
      <Defs>
        <LinearGradient id="ticketBackdrop" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={PE_TICKET_TOP} />
          <Stop offset="1" stopColor={PE_TICKET_BOTTOM} />
        </LinearGradient>
      </Defs>
      <Rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        fill="url(#ticketBackdrop)"
      />
    </Svg>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <View>
      <EventlyText variant="caption" style={s.factKey}>
        {k}
      </EventlyText>
      <EventlyText variant="caption" style={s.factVal} numberOfLines={1}>
        {v}
      </EventlyText>
    </View>
  );
}

/**
 * 8 — One ticket, to hold up at a door.
 *
 * The QR is drawn by the server and arrives as an SVG, so the token it encodes
 * never reaches this app at all — what travels is a picture of it. A cancelled
 * or refunded ticket keeps this page and loses its QR.
 */
export function DigitalTicketScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { data, loading, error, refetch } = useDigitalTicket(params.ticketId);
  const venue = data?.venue ?? {};

  return (
    <View style={s.screen}>
      <Backdrop />
      <SafeAreaView style={ui.flex} edges={['top', 'bottom']}>
        <View style={s.header}>
          <TouchableOpacity
            onPress={navigation.goBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <EventlyIcon name="chevron-left" size={26} color="#ffffff" />
          </TouchableOpacity>
          <View style={s.brand}>
            <EventlyIcon name="party-popper" size={18} color="#ffffff" />
            <EventlyText variant="body" style={s.brandText}>
              Evently
            </EventlyText>
          </View>
          <View style={ui.spacer26} />
        </View>

        {loading && !data ? (
          <View style={ui.centre}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : error || !data ? (
          <View style={ui.centre}>
            <EventlyText variant="body" style={s.lineText}>
              {error?.message ?? 'We could not open that ticket.'}
            </EventlyText>
            <TouchableOpacity style={[ui.outline, ui.retry]} onPress={refetch}>
              <EventlyText variant="body" style={ui.outlineText}>
                {PUBLIC_EVENTS_COPY.retry}
              </EventlyText>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={s.content}
            showsVerticalScrollIndicator={false}
          >
            {data.checkedInAt ? (
              <View style={s.checked}>
                <EventlyIcon name="check-circle" size={16} color="#7be0bd" />
                <EventlyText variant="caption" style={s.checkedText}>
                  {PUBLIC_EVENTS_COPY.checkedIn}
                </EventlyText>
              </View>
            ) : null}

            <EventlyText variant="h1" style={s.title}>
              {data.eventTitle}
            </EventlyText>
            <View style={s.line}>
              <EventlyIcon
                name="calendar-month-outline"
                size={14}
                color="#ffffff"
              />
              <EventlyText variant="caption" style={s.lineText}>
                {formatEventWhen(data.startDateTime, data.timezone)}
              </EventlyText>
            </View>
            {venue.name || venue.city ? (
              <View style={s.line}>
                <EventlyIcon
                  name="map-marker-outline"
                  size={14}
                  color="#ffffff"
                />
                <EventlyText
                  variant="caption"
                  style={s.lineText}
                  numberOfLines={2}
                >
                  {[venue.name, venue.city].filter(Boolean).join(', ')}
                </EventlyText>
              </View>
            ) : null}

            <View style={s.qrCard}>
              {data.qrSvg ? (
                <>
                  {/* The server's drawing, rendered as-is. */}
                  <SvgXml xml={data.qrSvg} width={210} height={210} />
                  {/* The short code, for when a camera will not focus. */}
                  <EventlyText variant="body" style={s.code}>
                    {data.code}
                  </EventlyText>
                </>
              ) : (
                <EventlyText variant="body" style={ui.muted}>
                  This ticket is {data.status.replace('_', ' ')}, so it has no
                  entry code.
                </EventlyText>
              )}
            </View>

            {data.customerName ? (
              <View style={s.person}>
                <EventlyText variant="body" style={s.personName}>
                  {data.customerName}
                </EventlyText>
                <EventlyText variant="caption" style={s.personNote}>
                  Ticket holder
                </EventlyText>
              </View>
            ) : null}

            <View style={s.facts}>
              <Fact k="Ticket Type" v={data.ticketTypeName || '—'} />
              <Fact k="Admits" v="1" />
              <Fact k="Booking ID" v={data.bookingReference || '—'} />
            </View>

            {data.qrSvg ? (
              <View style={s.hint}>
                <EventlyIcon name="qrcode-scan" size={16} color="#ffffff" />
                <EventlyText variant="caption" style={s.hintText}>
                  {PUBLIC_EVENTS_COPY.showAtEntry}
                </EventlyText>
              </View>
            ) : null}

            {/* The event itself — where its live stream and shared memories
                are — one tap from the ticket for it. */}
            <TouchableOpacity
              style={s.eventLink}
              onPress={() =>
                navigation.navigate('PublicEventDetail', {
                  eventId: data.eventId,
                })
              }
              accessibilityRole="button"
            >
              <EventlyText variant="caption" style={s.eventLinkText}>
                View Event · Live Stream & Memories
              </EventlyText>
              <EventlyIcon name="chevron-right" size={16} color="#ffffff" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

export default DigitalTicketScreen;
