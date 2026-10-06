import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  AppHeader,
  EventlyIcon,
  EventlyText,
  FadeInUp,
  GradientFill,
  PressableScale,
} from '../../Components';
import { absoluteFileUrl } from '../../services/urls';
import type { RootStackParamList } from '../../navigation/types';
import { PUBLIC_EVENTS_COPY, TICKET_STATE_LABEL, formatEventWhen } from './constants';
import { useMyTickets } from './hooks';
import { TICKET_STATE_TINT, myTicketsUi as s } from './ui.styles';
import type { MyTicket } from './types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MyTickets'>;

/** The header band, the same violet-to-coral as the catalogue's. */
const HERO_GRADIENT: [string, string] = ['#6d4df2', '#ef6a45'];

/** Each card's accent, in turn down the list: its type pill and QR button. */
const TICKET_ACCENTS: Array<[string, string]> = [
  ['#ff8a5c', '#e8433a'],
  ['#a084ff', '#5a35e0'],
  ['#3cc9a1', '#0e8a68'],
  ['#5b9bff', '#2554b8'],
];

/** Still ahead of you: not yet used, or used today and not over. */
const isUpcoming = (t: MyTicket) => t.state === 'upcoming' || t.state === 'checked_in';

/** "Today", "Tomorrow", "In 12 days" — or '' once it has passed. */
function countdown(iso: string | null): string {
  if (!iso) return '';
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return '';
  const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((day(at) - day(new Date())) / 86_400_000);
  if (days < 0) return '';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

/** The perforation between a ticket and its stub: two notches and a dashed line. */
function TearLine() {
  return (
    <View style={s.tear} pointerEvents="none">
      <View style={[s.notch, s.notchLeft]} />
      <View style={s.dashes}>
        {Array.from({ length: 22 }).map((_, i) => (
          <View key={i} style={s.dash} />
        ))}
      </View>
      <View style={[s.notch, s.notchRight]} />
    </View>
  );
}

/**
 * 7 — Every ticket this customer holds, drawn as tickets.
 *
 * One card per seat, because four bought together are four people at the door.
 * The state on each card is the server's word — "completed" is a fact about the
 * clock and "checked in" is a fact about the door.
 */
export function MyTicketsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const { data, loading, error, refetch } = useMyTickets('all');
  const all = data ?? [];
  const upcoming = all.filter(isUpcoming);
  const past = all.filter(t => !isUpcoming(t));
  const tickets = tab === 'upcoming' ? upcoming : past;

  const open = (item: MyTicket) =>
    navigation.navigate('DigitalTicket', { ticketId: item.ticketId });

  const renderItem = ({ item, index }: { item: MyTicket; index: number }) => {
    const tint = TICKET_STATE_TINT[item.state] ?? TICKET_STATE_TINT.upcoming;
    const accent = TICKET_ACCENTS[index % TICKET_ACCENTS.length];
    const when = countdown(item.startDateTime);
    const where = [item.venueName, item.city].filter(Boolean).join(', ');
    const faded = item.state === 'completed' || item.state === 'cancelled';
    const shadeId = `ticketShade-${item.ticketId}`;

    return (
      <FadeInUp delay={index * 70}>
        <PressableScale
          style={[s.card, faded && s.cardFaded]}
          onPress={() => open(item)}
          accessibilityRole="button"
          accessibilityLabel={`${item.eventTitle}, ${TICKET_STATE_LABEL[item.state]}`}
          testID={`my-ticket-${item.ticketId}`}
        >
          <View style={s.cover}>
            <Image
              source={{ uri: absoluteFileUrl(item.coverUrl) }}
              style={s.coverImage}
              resizeMode="cover"
            />
            <View style={s.coverShade} pointerEvents="none">
              <Svg width="100%" height="100%">
                <Defs>
                  <LinearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0.4" stopColor="#0b0f24" stopOpacity={0} />
                    <Stop offset="1" stopColor="#0b0f24" stopOpacity={0.55} />
                  </LinearGradient>
                </Defs>
                <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${shadeId})`} />
              </Svg>
            </View>
            {when && isUpcoming(item) ? (
              <View style={s.countdown}>
                <EventlyIcon name="timer-sand" size={12} color="#ffffff" />
                <EventlyText variant="caption" style={s.countdownText}>
                  {when}
                </EventlyText>
              </View>
            ) : null}
          </View>

          <View style={s.body}>
            <EventlyText variant="body" style={s.title} numberOfLines={2}>
              {item.eventTitle}
            </EventlyText>
            <View style={s.line}>
              <View style={[s.lineIcon, s.lineIconDate]}>
                <EventlyIcon name="calendar-month" size={12} color="#e2552f" />
              </View>
              <EventlyText variant="caption" style={s.lineText} numberOfLines={1}>
                {formatEventWhen(item.startDateTime, item.timezone)}
              </EventlyText>
            </View>
            {where ? (
              <View style={s.line}>
                <View style={[s.lineIcon, s.lineIconPlace]}>
                  <EventlyIcon name="map-marker" size={12} color="#6d4df2" />
                </View>
                <EventlyText variant="caption" style={s.lineText} numberOfLines={1}>
                  {where}
                </EventlyText>
              </View>
            ) : null}
          </View>

          <TearLine />

          {/* The stub: what kind of ticket, where it stands, and the QR. */}
          <View style={s.stub}>
            <View style={s.stubLeft}>
              {item.ticketTypeName ? (
                <View style={s.typePill}>
                  <GradientFill colors={accent} direction="across" />
                  <EventlyIcon name="ticket-confirmation" size={11} color="#ffffff" />
                  <EventlyText variant="caption" style={s.typeText} numberOfLines={1}>
                    {item.ticketTypeName}
                  </EventlyText>
                </View>
              ) : null}
              <View style={[s.statePill, { backgroundColor: tint.bg }]}>
                <View style={[s.stateDot, { backgroundColor: tint.fg }]} />
                <EventlyText variant="caption" style={[s.stateText, { color: tint.fg }]}>
                  {TICKET_STATE_LABEL[item.state]}
                </EventlyText>
              </View>
            </View>
            {/* Drawn as a button, pressed as part of the card. */}
            <View style={s.qr}>
              <GradientFill colors={faded ? ['#b8c0cc', '#8a93a3'] : accent} direction="diagonal" />
              <EventlyIcon name="qrcode" size={15} color="#ffffff" />
              <EventlyText variant="caption" style={s.qrText}>
                {faded ? 'View' : 'Show QR'}
              </EventlyText>
            </View>
          </View>
        </PressableScale>
      </FadeInUp>
    );
  };

  return (
    <View style={s.screen}>
      {/* A light header: the tickets below carry the colour. */}
      <View style={[s.header, { paddingTop: insets.top }]}>
        {/* The app's one header — the same title, size and back arrow as
            every other screen. */}
        <AppHeader
          title="My Tickets"
          onBackPress={navigation.goBack}
        />

        {/* A segmented switch; the chosen side fills with the gradient. */}
        <View style={s.tabs} accessibilityRole="tablist">
          {(
            [
              { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
              { key: 'past', label: 'Past', count: past.length },
            ] as const
          ).map(t => {
            const on = tab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={s.tab}
                onPress={() => setTab(t.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
              >
                {on ? <GradientFill colors={HERO_GRADIENT} direction="across" /> : null}
                <EventlyText variant="caption" style={[s.tabText, on && s.tabTextOn]}>
                  {t.label}
                </EventlyText>
                <View style={[s.tabCount, on && s.tabCountOn]}>
                  <EventlyText
                    variant="caption"
                    style={[s.tabCountText, on && s.tabCountTextOn]}
                  >
                    {t.count}
                  </EventlyText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={tickets}
        keyExtractor={item => item.ticketId}
        renderItem={renderItem}
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
        ListEmptyComponent={
          loading ? null : (
            <FadeInUp style={s.empty}>
              <View style={s.emptyIcon}>
                <GradientFill colors={HERO_GRADIENT} direction="diagonal" />
                <EventlyIcon name="ticket-confirmation-outline" size={30} color="#ffffff" />
              </View>
              <EventlyText variant="body" style={s.emptyTitle}>
                {error
                  ? 'We couldn’t load your tickets'
                  : tab === 'upcoming'
                  ? 'No upcoming tickets'
                  : 'No past tickets yet'}
              </EventlyText>
              <EventlyText variant="caption" style={s.emptyBody}>
                {error ? error.message : PUBLIC_EVENTS_COPY.ticketsEmpty}
              </EventlyText>
              {!error ? (
                <TouchableOpacity
                  style={s.emptyCta}
                  onPress={() => navigation.navigate('Main', { screen: 'Events' })}
                  accessibilityRole="button"
                >
                  <GradientFill colors={HERO_GRADIENT} direction="across" />
                  <EventlyText variant="caption" style={s.emptyCtaText}>
                    Explore events
                  </EventlyText>
                  <EventlyIcon name="arrow-right" size={14} color="#ffffff" />
                </TouchableOpacity>
              ) : null}
            </FadeInUp>
          )
        }
      />
    </View>
  );
}

export default MyTicketsScreen;
