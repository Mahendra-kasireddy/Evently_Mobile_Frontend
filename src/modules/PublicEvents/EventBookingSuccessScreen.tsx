import { useCallback } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  BackHandler,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, AppText, FadeInUp, PopIn } from '../../Components';
import { absoluteFileUrl } from '../../services/urls';
import type { RootStackParamList } from '../../navigation/types';
import { calendarUrl, formatEventWhen, formatPrice } from './constants';
import { useEventDetail } from './hooks';
import { InfoLine } from './sections/ui';
import { PE_ACCENT } from './styles';
import { checkoutUi as kv, successUi as s, ui } from './ui.styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EventBookingSuccess'>;
type Route = RouteProp<RootStackParamList, 'EventBookingSuccess'>;

/**
 * 6 — Booking confirmed.
 *
 * Reached only once the server has verified the payment and minted the
 * tickets. Back does not return to the checkout — there is nothing left to pay
 * — it returns to the event.
 */
export function EventBookingSuccessScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { data } = useEventDetail(params.eventId);

  const toEvent = useCallback(() => {
    navigation.navigate('PublicEventDetail', { eventId: params.eventId });
    return true;
  }, [navigation, params.eventId]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', toEvent);
      return () => sub.remove();
    }, [toEvent]),
  );

  const venue = [data?.venue?.name, data?.venue?.city]
    .filter(Boolean)
    .join(', ');

  const addToCalendar = () => {
    if (!data) return;
    Linking.openURL(
      calendarUrl({
        title: data.title,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        venueName: data.venue?.name,
        address: data.venue?.address,
        description: data.description,
      }),
    ).catch(() => undefined);
  };

  return (
    <SafeAreaView style={ui.screen} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* The tick lands with a pop; everything under it follows. */}
        <PopIn style={s.tick}>
          <EventlyIcon name="check" size={40} color="#ffffff" />
        </PopIn>
        <FadeInUp delay={180}>
          <AppText variant="h1" style={s.heading}>
            You’re Going!
          </AppText>
          <AppText variant="body" style={s.sub}>
            Your booking has been confirmed.
          </AppText>
        </FadeInUp>

        <View style={ui.card}>
          {data?.coverUrl ? (
            <Image
              source={{ uri: absoluteFileUrl(data.coverUrl) }}
              style={s.cover}
              resizeMode="cover"
            />
          ) : null}
          {data ? (
            <>
              <AppText variant="h3" style={s.title}>
                {data.title}
              </AppText>
              <InfoLine
                icon="calendar-month-outline"
                text={formatEventWhen(data.startDateTime, data.timezone)}
              />
              <InfoLine icon="map-marker-outline" text={venue} />
            </>
          ) : null}
          <View style={ui.divider} />
          <View style={kv.kv}>
            <AppText variant="bodySmall" style={kv.key}>
              {`${params.ticketTypeName} × ${params.quantity}`}
            </AppText>
            <AppText variant="bodySmall" style={kv.value}>
              {formatPrice(params.amount)}
            </AppText>
          </View>
          <View style={kv.kv}>
            <AppText variant="bodySmall" style={kv.key}>
              Booking ID
            </AppText>
            <AppText variant="bodySmall" style={kv.value}>
              {params.reference}
            </AppText>
          </View>
          <View style={kv.kv}>
            <AppText variant="bodySmall" style={kv.key}>
              {params.ticketIds.length > 1 ? 'Tickets' : 'Ticket'}
            </AppText>
            <AppText variant="bodySmall" style={kv.value}>
              {params.ticketIds.length > 1
                ? `${params.ticketIds.length} issued`
                : '1 issued'}
            </AppText>
          </View>
        </View>

        <View style={s.actions}>
          <TouchableOpacity
            style={ui.primary}
            onPress={() =>
              navigation.replace('DigitalTicket', {
                ticketId: params.ticketIds[0],
              })
            }
            accessibilityRole="button"
          >
            <AppText variant="h3" style={ui.primaryText}>
              View Ticket
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={ui.outline}
            onPress={() => navigation.replace('MyTickets')}
            accessibilityRole="button"
          >
            <AppText variant="body" style={ui.outlineText}>
              View My Tickets
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={ui.outline}
            onPress={addToCalendar}
            disabled={!data}
            accessibilityRole="button"
          >
            <EventlyIcon name="calendar-plus" size={18} color={PE_ACCENT} />
            <AppText variant="body" style={ui.outlineText}>
              Add to Calendar
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default EventBookingSuccessScreen;
