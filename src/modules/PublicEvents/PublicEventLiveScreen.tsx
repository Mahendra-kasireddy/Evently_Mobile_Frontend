import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { absoluteFileUrl } from '../../services/urls';
import { LivePlayer, canEmbedStream } from '../Invitation/sections/LivePlayer';
import type { RootStackParamList } from '../../navigation/types';
import { LIVE_LABEL, PUBLIC_EVENTS_COPY } from './constants';
import { useEventDetail } from './hooks';
import { LivePill } from './sections/ui';
import { PE_ACCENT, PE_GREEN } from './styles';
import { PE_PURPLE, liveUi as s, ui } from './ui.styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PublicEventLive'>;
type Route = RouteProp<RootStackParamList, 'PublicEventLive'>;

/**
 * 10 — The event's live stream.
 *
 * Entitlement is the server's and arrives already decided: the detail endpoint
 * withholds the stream URL entirely unless this customer may watch, so there
 * is no link here to leak. An empty URL is refusal, and it is drawn as one.
 *
 * The player is the invitation's — the same embed, resolved the same way.
 */
export function PublicEventLiveScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { data, loading, error, refetch } = useEventDetail(params.eventId);
  const [playing, setPlaying] = useState(false);

  if (loading && !data) {
    return (
      <SafeAreaView style={[ui.screen, ui.centre]} edges={['top']}>
        <ActivityIndicator size="large" color={PE_ACCENT} />
      </SafeAreaView>
    );
  }

  const live = data?.live;
  const watchable = Boolean(live?.canWatch && live?.url);

  if (error || !data || !live?.enabled) {
    return (
      <SafeAreaView style={ui.screen} edges={['top']}>
        <AppHeader title="Live Stream" onBackPress={navigation.goBack} />
        <View style={ui.centre}>
          <EventlyText variant="body" style={ui.muted}>
            {error?.message ?? 'There is no stream for this event.'}
          </EventlyText>
          <TouchableOpacity style={[ui.outline, ui.retry]} onPress={refetch}>
            <EventlyText variant="body" style={ui.outlineText}>
              {PUBLIC_EVENTS_COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const watch = () => {
    if (!watchable) return;
    if (canEmbedStream) {
      setPlaying(true);
    } else {
      /* The native player is not in this build; the browser can play it. */
      Linking.openURL(live.url).catch(() => undefined);
    }
  };

  const accessLine =
    live.access === 'ticketed' ? 'Ticket Required' : 'Open to everyone';
  const statusLine = watchable
    ? 'You have access to this stream.'
    : live.access === 'ticketed'
    ? 'Book a ticket and the stream opens here.'
    : live.state === 'upcoming'
    ? 'The stream has not started yet.'
    : 'This stream has ended and no replay was left up.';

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <AppHeader title="Live Stream" onBackPress={navigation.goBack} />
      <ScrollView
        contentContainerStyle={ui.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.player}>
          {playing ? (
            <LivePlayer uri={live.url} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={watch}
              disabled={!watchable}
              accessibilityRole="button"
              accessibilityLabel="Play the live stream"
              style={ui.flex}
            >
              <Image
                source={{ uri: absoluteFileUrl(data.coverUrl) }}
                style={s.poster}
                resizeMode="cover"
              />
              <View style={s.posterShade} />
              {watchable ? (
                <View style={s.bigPlay}>
                  <EventlyIcon name="play" size={30} color={PE_PURPLE} />
                </View>
              ) : null}
            </TouchableOpacity>
          )}
          {live.state === 'live' ? (
            <View style={s.livePill} pointerEvents="none">
              <LivePill />
            </View>
          ) : null}
        </View>

        <EventlyText variant="h2" style={s.title}>
          {`${data.title} – ${live.state === 'ended' ? 'Replay' : 'Live'}`}
        </EventlyText>
        <EventlyText variant="body" style={ui.muted}>
          {live.state === 'live'
            ? 'Watch the live stream of the event happening right now.'
            : live.state === 'upcoming'
            ? 'The live stream will appear here when the event starts.'
            : 'A recording of the event.'}
        </EventlyText>

        <View style={s.access}>
          <View style={s.accessHead}>
            <View style={s.accessIcon}>
              <EventlyIcon
                name={live.access === 'ticketed' ? 'ticket-outline' : 'earth'}
                size={20}
                color={PE_PURPLE}
              />
            </View>
            <View style={ui.flex}>
              <EventlyText variant="caption" style={ui.muted}>
                Access
              </EventlyText>
              <EventlyText variant="body" style={s.accessTitle}>
                {accessLine}
              </EventlyText>
            </View>
          </View>
          <View style={s.ok}>
            <EventlyIcon
              name={watchable ? 'check-circle' : 'information-outline'}
              size={16}
              color={watchable ? PE_GREEN : PE_PURPLE}
            />
            <EventlyText
              variant="caption"
              style={[s.okText, !watchable && { color: PE_PURPLE }]}
            >
              {statusLine}
            </EventlyText>
          </View>
          {watchable ? (
            <TouchableOpacity
              style={s.watch}
              onPress={watch}
              accessibilityRole="button"
            >
              <EventlyIcon
                name="play-circle-outline"
                size={18}
                color="#ffffff"
              />
              <EventlyText variant="body" style={ui.primaryText}>
                {live.state === 'ended' ? 'Watch Replay' : 'Watch Live'}
              </EventlyText>
            </TouchableOpacity>
          ) : live.access === 'ticketed' && data.canBook ? (
            <TouchableOpacity
              style={s.watch}
              onPress={() =>
                navigation.navigate('EventTicketSelection', {
                  eventId: data.id,
                })
              }
              accessibilityRole="button"
            >
              <EventlyText variant="body" style={ui.primaryText}>
                Book a Ticket
              </EventlyText>
            </TouchableOpacity>
          ) : null}
        </View>

        <EventlyText variant="subtitle" style={[ui.cardTitle, ui.sectionTitle]}>
          About Live Stream
        </EventlyText>
        <EventlyText variant="body" style={ui.muted}>
          {`Experience the event from anywhere. ${LIVE_LABEL[live.state]}${
            live.access === 'ticketed'
              ? ' for ticket holders only.'
              : ' — free for everyone.'
          }`}
        </EventlyText>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PublicEventLiveScreen;
