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
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyText } from '../../Components';
import { absoluteFileUrl } from '../../services/urls';
import type { RootStackParamList } from '../../navigation/types';
import {
  PUBLIC_EVENTS_COPY,
  TICKET_STATE_LABEL,
  formatEventWhen,
} from './constants';
import { useMyTickets } from './hooks';
import { InfoLine } from './sections/ui';
import { TICKET_STATE_TINT, ticketsUi as s, ui } from './ui.styles';
import type { MyTicket } from './types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MyTickets'>;

/** Still ahead of you: not yet used, or used today and not over. */
const isUpcoming = (t: MyTicket) =>
  t.state === 'upcoming' || t.state === 'checked_in';

/**
 * 7 — Every ticket this customer holds.
 *
 * One card per seat, because four bought together are four people at the door.
 * The state on each card is the server's word — "completed" is a fact about the
 * clock and "checked in" is a fact about the door.
 */
export function MyTicketsScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const { data, loading, error, refetch } = useMyTickets('all');
  const all = data ?? [];
  const upcoming = all.filter(isUpcoming);
  const past = all.filter(t => !isUpcoming(t));
  const tickets = tab === 'upcoming' ? upcoming : past;

  const renderItem = ({ item }: { item: MyTicket }) => {
    const tint = TICKET_STATE_TINT[item.state] ?? TICKET_STATE_TINT.upcoming;
    return (
      <TouchableOpacity
        style={s.card}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('DigitalTicket', { ticketId: item.ticketId })
        }
        accessibilityRole="button"
        accessibilityLabel={`${item.eventTitle}, ${
          TICKET_STATE_LABEL[item.state]
        }`}
        testID={`my-ticket-${item.ticketId}`}
      >
        <Image
          source={{ uri: absoluteFileUrl(item.coverUrl) }}
          style={s.cover}
          resizeMode="cover"
        />
        <View style={s.body}>
          <EventlyText variant="body" style={s.title} numberOfLines={2}>
            {item.eventTitle}
          </EventlyText>
          <InfoLine
            icon="calendar-month-outline"
            text={formatEventWhen(item.startDateTime, item.timezone)}
          />
          <InfoLine
            icon="map-marker-outline"
            text={[item.venueName, item.city].filter(Boolean).join(', ')}
          />
          <View style={s.foot}>
            {item.ticketTypeName ? (
              <View style={[ui.pill, s.typePill]}>
                <EventlyText
                  variant="caption"
                  style={[ui.pillText, s.typePillText]}
                >
                  {item.ticketTypeName}
                </EventlyText>
              </View>
            ) : (
              <View />
            )}
            <View style={[ui.pill, { backgroundColor: tint.bg }]}>
              <EventlyText
                variant="caption"
                style={[ui.pillText, { color: tint.fg }]}
              >
                {TICKET_STATE_LABEL[item.state]}
              </EventlyText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <AppHeader title="My Tickets" onBackPress={navigation.goBack} />

      <View style={s.tabs} accessibilityRole="tablist">
        {(
          [
            { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
            { key: 'past', label: `Past (${past.length})` },
          ] as const
        ).map(t => {
          const on = tab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[s.tab, on && s.tabOn]}
              onPress={() => setTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
            >
              <EventlyText
                variant="caption"
                style={[s.tabText, on && s.tabTextOn]}
              >
                {t.label}
              </EventlyText>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={tickets}
        keyExtractor={item => item.ticketId}
        renderItem={renderItem}
        contentContainerStyle={ui.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={ui.centre}>
              <EventlyText variant="body" style={ui.muted}>
                {error
                  ? error.message
                  : tab === 'upcoming'
                  ? PUBLIC_EVENTS_COPY.ticketsEmpty
                  : 'No past tickets yet.'}
              </EventlyText>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

export default MyTicketsScreen;
