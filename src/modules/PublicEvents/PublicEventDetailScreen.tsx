import { useCallback, useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Appearance,
  Share,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import { absoluteFileUrl } from '../../services/urls';
import type { RootStackParamList } from '../../navigation/types';
import {
  LIVE_LABEL,
  PUBLIC_EVENTS_COPY,
  formatEventWhen,
  formatPrice,
  initialsOf,
  ticketAvailability,
} from './constants';
import { useEventDetail } from './hooks';
import { CategoryPill, LivePill } from './sections/ui';
import { PE_ACCENT, PE_GREEN, PE_NAVY } from './styles';
import { PE_MUTED, PE_PURPLE, detailUi as s, ui } from './ui.styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PublicEventDetail'>;
type Route = RouteProp<RootStackParamList, 'PublicEventDetail'>;

/**
 * 3 — One public event, and the decision to go to it.
 *
 * Everything that governs what the customer may do here — buy, watch, upload —
 * arrives from the server as a yes or a no. This screen renders those answers.
 */
export function PublicEventDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { data, loading, error, refetch } = useEventDetail(params.eventId);
  const [aboutOpen, setAboutOpen] = useState(false);

  /*
   * The cover runs under the status bar, so the clock and battery are drawn
   * light while this screen is in front, and handed back to the app's own
   * style when it is not — every other screen sits on a light page.
   */
  const onCover = Boolean(data);
  useFocusEffect(
    useCallback(() => {
      // Only over the photo: the loading and error states are a light page.
      if (!onCover) return undefined;
      StatusBar.setBarStyle('light-content', true);
      return () =>
        StatusBar.setBarStyle(
          Appearance.getColorScheme() === 'dark'
            ? 'light-content'
            : 'dark-content',
          true,
        );
    }, [onCover]),
  );

  if (loading && !data) {
    return (
      <View style={[ui.screen, ui.centre]}>
        <ActivityIndicator size="large" color={PE_ACCENT} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[ui.screen, ui.centre]}>
        <EventlyText variant="body" style={ui.muted}>
          {error?.message ?? 'We could not open that event.'}
        </EventlyText>
        <TouchableOpacity style={[ui.outline, ui.retry]} onPress={refetch}>
          <EventlyText variant="body" style={ui.outlineText}>
            {PUBLIC_EVENTS_COPY.retry}
          </EventlyText>
        </TouchableOpacity>
      </View>
    );
  }

  const live = data.live;
  const sellable = data.canBook && !data.soldOut;
  const holder = data.you.hasTicket;
  /* Why "Book Ticket" may have nothing behind it — told apart, because
     "you've hit the per-person limit" and "nothing is on sale right now"
     are different news. The limit only counts when a ticket is on sale with
     seats left, and the one thing stopping this customer is the cap. */
  const onSaleWithSeats = data.ticketTypes.filter(
    t => t.onSale && t.available > 0,
  );
  const limitReached =
    sellable &&
    onSaleWithSeats.length > 0 &&
    onSaleWithSeats.every(t => t.maxForYou <= 0);
  const nothingOnSale =
    sellable && data.ticketTypes.length > 0 && onSaleWithSeats.length === 0;
  const canBookMore = sellable && !limitReached && !nothingOnSale;
  const featured = data.ticketTypes[0] ?? null;
  const venueLine = [data.venue?.name, data.venue?.city]
    .filter(Boolean)
    .join(', ');

  const share = () => {
    Share.share({
      message: `${data.title} — ${formatEventWhen(
        data.startDateTime,
        data.timezone,
      )}${venueLine ? ` at ${venueLine}` : ''}. Book on Evently.`,
    }).catch(() => undefined);
  };

  return (
    <View style={ui.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ui.scrollPad}
      >
        <View style={s.cover}>
          <Image
            source={{ uri: absoluteFileUrl(data.coverUrl) }}
            style={s.coverImage}
            resizeMode="cover"
          />
          {/* A shade under the status bar and the two buttons, so they read
              on any picture — a white poster as much as a dark one. */}
          <View
            style={[s.topShade, { height: insets.top + 90 }]}
            pointerEvents="none"
          >
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="detailTopShade" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#000000" stopOpacity={0.55} />
                  <Stop offset="1" stopColor="#000000" stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Rect
                x={0}
                y={0}
                width="100%"
                height="100%"
                fill="url(#detailTopShade)"
              />
            </Svg>
          </View>
          <View style={s.coverPills}>
            <CategoryPill category={data.category} />
            {live.enabled && live.state === 'live' ? (
              <LivePill />
            ) : data.soldOut ? (
              <View style={[ui.pill, ui.whitePill]}>
                <EventlyText
                  variant="caption"
                  style={[ui.pillText, ui.soldOutText]}
                >
                  {PUBLIC_EVENTS_COPY.soldOut}
                </EventlyText>
              </View>
            ) : null}
          </View>
        </View>

        <View style={s.sheet}>
          <EventlyText variant="h1" style={s.title}>
            {data.title}
          </EventlyText>

          <View style={s.fact}>
            <EventlyIcon
              name="calendar-month-outline"
              size={17}
              color={PE_NAVY}
            />
            <View style={s.factText}>
              <EventlyText variant="body" style={s.factValue}>
                {formatEventWhen(data.startDateTime, data.timezone)}
              </EventlyText>
            </View>
          </View>

          {venueLine || data.venue?.address ? (
            <View style={s.fact}>
              <EventlyIcon
                name="map-marker-outline"
                size={17}
                color={PE_NAVY}
              />
              <View style={s.factText}>
                <EventlyText variant="body" style={s.factValue}>
                  {venueLine}
                </EventlyText>
                {data.venue?.address ? (
                  <EventlyText
                    variant="caption"
                    style={s.factNote}
                    numberOfLines={3}
                  >
                    {data.venue.address}
                  </EventlyText>
                ) : null}
              </View>
            </View>
          ) : null}

          {data.contactName ? (
            <View style={s.organizer}>
              <View style={s.avatar}>
                <EventlyText variant="caption" style={s.avatarText}>
                  {initialsOf(data.contactName)}
                </EventlyText>
              </View>
              <View>
                <EventlyText variant="body" style={s.organizerName}>
                  {`By ${data.contactName}`}
                </EventlyText>
                <EventlyText variant="caption" style={ui.muted}>
                  Event Organizer
                </EventlyText>
              </View>
            </View>
          ) : null}

          {/* Already booked: say so first, and where the ticket lives. */}
          {holder ? (
            <View style={s.going}>
              <EventlyIcon name="check-circle" size={22} color={PE_GREEN} />
              <View style={s.featureText}>
                <EventlyText variant="body" style={s.featureTitle}>
                  {data.you.checkedIn ? 'You’re checked in!' : 'You’re going!'}
                </EventlyText>
                <EventlyText variant="caption" style={ui.muted}>
                  Your ticket is saved in My Tickets.
                </EventlyText>
              </View>
              <TouchableOpacity
                style={s.goingButton}
                onPress={() => navigation.navigate('MyTickets')}
                accessibilityRole="button"
              >
                <EventlyText variant="caption" style={s.goingButtonText}>
                  View Ticket
                </EventlyText>
              </TouchableOpacity>
            </View>
          ) : null}

          {data.description ? (
            <>
              <EventlyText
                variant="subtitle"
                style={[s.sectionTitle, ui.gapTop]}
              >
                About this event
              </EventlyText>
              <EventlyText
                variant="body"
                style={s.about}
                numberOfLines={aboutOpen ? undefined : 4}
              >
                {data.description}
              </EventlyText>
              {data.description.length > 180 ? (
                <TouchableOpacity
                  onPress={() => setAboutOpen(v => !v)}
                  accessibilityRole="button"
                >
                  <EventlyText variant="caption" style={s.link}>
                    {aboutOpen ? 'Show less' : 'Read more'}
                  </EventlyText>
                </TouchableOpacity>
              ) : null}
            </>
          ) : null}

          {/* The stream, when there is one — and for a ticket holder, a plain
              word when there is not, so they are not left looking for it. */}
          {live.enabled ? (
            <TouchableOpacity
              style={[s.feature, s.featureLive]}
              onPress={() =>
                navigation.navigate('PublicEventLive', { eventId: data.id })
              }
              accessibilityRole="button"
            >
              <EventlyIcon
                name={live.state === 'live' ? 'broadcast' : 'television-play'}
                size={22}
                color="#d93b3b"
              />
              <View style={s.featureText}>
                <EventlyText variant="body" style={s.featureTitle}>
                  Live Stream · {LIVE_LABEL[live.state]}
                </EventlyText>
                <EventlyText variant="caption" style={ui.muted}>
                  {live.canWatch
                    ? 'You can watch this one.'
                    : live.access === 'ticketed'
                    ? 'Book a ticket to watch the stream.'
                    : 'Open to everyone once it starts.'}
                </EventlyText>
              </View>
              <EventlyIcon name="chevron-right" size={20} color={PE_NAVY} />
            </TouchableOpacity>
          ) : holder ? (
            <View style={[s.feature, s.featureOff]}>
              <EventlyIcon name="television-off" size={22} color={PE_MUTED} />
              <View style={s.featureText}>
                <EventlyText variant="body" style={s.featureTitle}>
                  Live Stream
                </EventlyText>
                <EventlyText variant="caption" style={ui.muted}>
                  The organizer hasn’t set up a live stream for this event.
                </EventlyText>
              </View>
            </View>
          ) : null}

          {/* The shared gallery, for the people allowed to see it. */}
          {data.memories.enabled && data.memories.canView ? (
            <TouchableOpacity
              style={s.feature}
              onPress={() =>
                navigation.navigate('EventMemories', { eventId: data.id })
              }
              accessibilityRole="button"
            >
              <EventlyIcon
                name="image-multiple-outline"
                size={22}
                color={PE_PURPLE}
              />
              <View style={s.featureText}>
                <EventlyText variant="body" style={s.featureTitle}>
                  Event Memories
                </EventlyText>
                <EventlyText variant="caption" style={ui.muted}>
                  {data.memories.canUpload
                    ? 'See the photos and add your own.'
                    : 'See the photos from the event.'}
                </EventlyText>
              </View>
              <EventlyIcon name="chevron-right" size={20} color={PE_NAVY} />
            </TouchableOpacity>
          ) : holder ? (
            <View style={[s.feature, s.featureOff]}>
              <EventlyIcon
                name="image-off-outline"
                size={22}
                color={PE_MUTED}
              />
              <View style={s.featureText}>
                <EventlyText variant="body" style={s.featureTitle}>
                  Event Memories
                </EventlyText>
                <EventlyText variant="caption" style={ui.muted}>
                  {data.memories.enabled
                    ? 'The gallery opens to attendees once the organizer allows it.'
                    : 'The organizer hasn’t turned on shared memories for this event.'}
                </EventlyText>
              </View>
            </View>
          ) : null}

          <View style={s.sectionHead}>
            <EventlyText variant="subtitle" style={s.sectionTitle}>
              Ticket Types
            </EventlyText>
            {data.ticketTypes.length > 1 ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EventTicketSelection', {
                    eventId: data.id,
                  })
                }
                accessibilityRole="button"
              >
                <EventlyText variant="caption" style={s.link}>
                  View all
                </EventlyText>
              </TouchableOpacity>
            ) : null}
          </View>

          {featured ? (
            <TouchableOpacity
              style={s.ticketCard}
              activeOpacity={0.85}
              disabled={!canBookMore}
              onPress={() =>
                navigation.navigate('EventTicketSelection', {
                  eventId: data.id,
                  ticketTypeId: featured.id,
                })
              }
              accessibilityRole="button"
            >
              <View style={s.ticketHead}>
                <EventlyText
                  variant="body"
                  style={s.ticketName}
                  numberOfLines={1}
                >
                  {featured.name}
                </EventlyText>
                <EventlyText variant="body" style={s.ticketPrice}>
                  {formatPrice(featured.price)}
                </EventlyText>
              </View>
              {featured.description ? (
                <EventlyText
                  variant="caption"
                  style={s.ticketNote}
                  numberOfLines={2}
                >
                  {featured.description}
                </EventlyText>
              ) : null}
              <EventlyText variant="caption" style={s.ticketNote}>
                {ticketAvailability(featured, data.timezone)}
              </EventlyText>
            </TouchableOpacity>
          ) : (
            <EventlyText variant="caption" style={ui.muted}>
              No tickets are listed for this event yet.
            </EventlyText>
          )}
        </View>
      </ScrollView>

      {/* Pinned over the photo rather than scrolling with it, so they never
          slide up under the clock. */}
      <View style={[s.topButtons, { top: insets.top + 8 }]}>
        <TouchableOpacity
          style={ui.iconCircle}
          onPress={navigation.goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <EventlyIcon name="chevron-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={ui.iconCircle}
          onPress={share}
          accessibilityRole="button"
          accessibilityLabel="Share this event"
        >
          <EventlyIcon name="share-variant-outline" size={19} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={[ui.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {limitReached ? (
          <EventlyText variant="caption" style={[ui.muted, ui.centerText]}>
            You’ve booked the most tickets allowed per person for this event.
          </EventlyText>
        ) : null}
        <TouchableOpacity
          style={[ui.primary, !canBookMore && ui.primaryOff]}
          disabled={!canBookMore}
          onPress={() =>
            navigation.navigate('EventTicketSelection', { eventId: data.id })
          }
          accessibilityRole="button"
          accessibilityLabel={PUBLIC_EVENTS_COPY.bookCta}
          testID="book-ticket"
        >
          <EventlyText variant="body" style={ui.primaryText}>
            {data.soldOut
              ? PUBLIC_EVENTS_COPY.soldOut
              : limitReached
              ? 'Booking Limit Reached'
              : nothingOnSale
              ? 'Tickets Not On Sale'
              : holder
              ? 'Book More Tickets'
              : PUBLIC_EVENTS_COPY.bookCta}
          </EventlyText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PublicEventDetailScreen;
