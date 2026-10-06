import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Animated, Image, ScrollView, View } from 'react-native';
import {
  EventlyText,
  GradientFill,
  PressableScale,
  useReducedMotion,
} from '../../../Components';
import { absoluteFileUrl } from '../../../services/urls';
import { LIVE_STREAMS_COPY as COPY, categoryTint } from '../constants';
import { usePublicEvents } from '../hooks';
import type { EventCard } from '../types';
import { liveRowUi as s } from '../ui.styles';

/** How often the row asks again: streams start and stop while Home is open. */
const REFRESH_MS = 60_000;
const SHADE = '#0b0820';

interface LiveStreamsProps {
  /**
   * The section's heading, from Home (its one `SectionHead`), given how many
   * are live — drawn only when there is something live.
   */
  renderHeader: (liveCount: number) => ReactNode;
  onOpenStream: (eventId: string) => void;
}

/** The pulsing dot in the LIVE badge. Still, with Reduce Motion on. */
function LiveDot() {
  const reduceMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduceMotion) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.25, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, pulse]);
  return <Animated.View style={[s.badgeDot, { opacity: pulse }]} />;
}

function StreamCard({ event, onPress }: { event: EventCard; onPress: () => void }) {
  const tint = categoryTint(event.category);
  const place = [event.venueName, event.city].filter(Boolean).join(', ');
  return (
    <PressableScale
      style={s.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Live now: ${event.title}${place ? `, ${place}` : ''}. Watch the stream`}
      testID={`live-stream-${event.id}`}
    >
      {event.coverUrl ? (
        <Image source={{ uri: absoluteFileUrl(event.coverUrl) }} style={s.cover} resizeMode="cover" />
      ) : (
        <GradientFill colors={[tint.bg, '#1b1446']} direction="diagonal" />
      )}
      {/* Clear at the top, dark at the foot where the title sits. */}
      <GradientFill colors={[SHADE, SHADE]} opacities={[0, 0.85]} direction="down" />

      <View style={s.badge}>
        <LiveDot />
        <EventlyText style={s.badgeText}>{COPY.live}</EventlyText>
      </View>

      <View style={s.body}>
        <EventlyText style={s.title} numberOfLines={2}>
          {event.title}
        </EventlyText>
        {place ? (
          <EventlyText style={s.place} numberOfLines={1}>
            {place}
          </EventlyText>
        ) : null}
      </View>
    </PressableScale>
  );
}

/**
 * Events streaming right now, on Home.
 *
 * Live means live: the server picks events whose stream window is open this
 * minute (`live=now`), and the row asks again every minute so a stream that
 * ends drops off and one that starts appears without a pull to refresh.
 * Tapping opens the stream screen, which decides — per ticket — whether this
 * customer may watch. With nothing live the whole section goes, heading and
 * all, rather than announcing an empty row.
 */
export function LiveStreams({ renderHeader, onOpenStream }: LiveStreamsProps) {
  const query = useMemo(() => ({ live: 'now' as const, sort: 'popular' as const, limit: 10 }), []);
  const { data, refetch } = usePublicEvents(query);

  useEffect(() => {
    const timer = setInterval(refetch, REFRESH_MS);
    return () => clearInterval(timer);
  }, [refetch]);

  const streams = (data ?? []).filter((e) => e.liveEnabled && e.liveState === 'live');
  if (streams.length === 0) return null;

  return (
    <View>
      {renderHeader(streams.length)}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>
        {streams.map((event) => (
          <StreamCard key={event.id} event={event} onPress={() => onOpenStream(event.id)} />
        ))}
      </ScrollView>
    </View>
  );
}

export default LiveStreams;
