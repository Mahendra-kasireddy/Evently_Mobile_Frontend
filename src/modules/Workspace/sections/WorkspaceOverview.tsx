import { useEffect, useRef } from 'react';
import { Animated, Image, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Confetti,
  EventlyIcon,
  EventlyText,
  PressableScale,
  useReducedMotion,
} from '../../../Components';
import {
  OCCASION_THEME,
  STAT_RING,
  WORKSPACE_COPY,
  WORKSPACE_PREMIUM_COPY as P,
  WORKSPACE_STATUS_COLOR,
} from '../constants';
import { heroStyles as s } from '../premium.styles';
import type { WorkspaceViewModel } from '../types';
import { ProgressRing } from './ProgressRing';

/** The bundled floral spray, laid faintly into the poster's light corner. */
const HERO_ART = require('../../../assets/images/flowers_workspace.png');

interface WorkspaceOverviewProps {
  data: WorkspaceViewModel;
  onBack: () => void;
  /** Opens the conversation with the organizer; absent when there is none. */
  onMessage?: () => void;
  isOpeningMessage?: boolean;
}

/** A slow breath for the status dot while something is still pending. */
function LiveDot({ color, active }: { color: string; active: boolean }) {
  const reduceMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!active || reduceMotion) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.25, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, reduceMotion, pulse]);
  return <Animated.View style={[s.statusDot, { backgroundColor: color, opacity: pulse }]} />;
}

/** One of the three figures under the poster, as a ring you can read at a glance. */
function Stat({
  percent,
  colors,
  value,
  label,
}: {
  percent: number;
  colors: readonly [string, string];
  value: string;
  label: string;
}) {
  return (
    <View style={s.stat}>
      <ProgressRing percent={percent} size={58} stroke={6} colors={colors} trackColor="#f1edf8">
        <EventlyText style={s.statValue} numberOfLines={1}>
          {value}
        </EventlyText>
      </ProgressRing>
      <EventlyText variant="caption" style={s.statLabel}>
        {label}
      </EventlyText>
    </View>
  );
}

/**
 * The top of the workspace — a poster for the event, not a form header.
 *
 * Painted in the occasion's own colours (a birthday does not open on a
 * wedding's blush), with the countdown as its centrepiece: a ring that fills
 * as the event gets ready, the days left inside it. The date and the place
 * sit beside it, the organizer — and a way to message them — under it. Three
 * figures float on a card across the poster's foot. The tabs follow it in the
 * screen (see WorkspaceTabs), and pin to the top with a compact header once
 * the poster has scrolled away.
 *
 * Every figure is the booking's own; a booking with no date shows its date
 * chip instead of a countdown, and one with no amount drops the paid ring.
 */
export function WorkspaceOverview({
  data,
  onBack,
  onMessage,
  isOpeningMessage = false,
}: WorkspaceOverviewProps) {
  const insets = useSafeAreaInsets();
  const theme = OCCASION_THEME[data.art] ?? OCCASION_THEME.wedding;
  const statusColor = WORKSPACE_STATUS_COLOR[data.status] ?? '#ffffff';
  const pending = data.status === 'pending' || data.status === 'awaiting_organizer';
  const days = data.daysToGo;

  return (
    <View>
      <View style={[s.poster, { paddingTop: insets.top + 6 }]}>
        {/* The poster's colour: deep corner to warm light, three stops. */}
        <View style={s.fill} pointerEvents="none">
          <Svg width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="wsPoster" x1="0" y1="1" x2="1" y2="0">
                <Stop offset="0" stopColor={theme.from} />
                <Stop offset="0.55" stopColor={theme.via} />
                <Stop offset="1" stopColor={theme.to} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width="100%" height="100%" fill="url(#wsPoster)" />
          </Svg>
        </View>
        <View style={[s.glow, s.glowOne, { backgroundColor: theme.glow }]} pointerEvents="none" />
        <View style={[s.glow, s.glowTwo]} pointerEvents="none" />
        <Image source={HERO_ART} style={s.art} resizeMode="cover" accessible={false} />
        <View style={s.confetti} pointerEvents="none">
          <Confetti />
        </View>

        <View style={s.topRow}>
          <PressableScale
            style={s.glassButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <EventlyIcon name="chevron-left" size={24} color="#ffffff" />
          </PressableScale>
          <EventlyText variant="caption" style={s.topTitle}>
            {WORKSPACE_COPY.screenTitle}
          </EventlyText>
          {data.ref ? (
            <View style={s.refChip}>
              <EventlyIcon name="pound" size={12} color="rgba(255,255,255,0.85)" />
              <EventlyText variant="caption" style={s.refText} numberOfLines={1}>
                {data.ref}
              </EventlyText>
            </View>
          ) : (
            <View style={s.topSpacer} />
          )}
        </View>

        <View style={s.eyebrowRow}>
          <EventlyText style={s.emoji}>{theme.emoji}</EventlyText>
          {data.statusLabel ? (
            <View style={s.statusPill}>
              <LiveDot color={statusColor === '#ffffff' ? '#ffffff' : statusColor} active={pending} />
              <EventlyText variant="caption" style={s.statusText} numberOfLines={1}>
                {data.statusLabel}
              </EventlyText>
            </View>
          ) : null}
        </View>

        <EventlyText variant="h1" style={s.title} numberOfLines={2} accessibilityRole="header">
          {data.title}
        </EventlyText>

        <View style={s.countRow}>
          {days != null ? (
            <ProgressRing
              percent={data.progress}
              size={112}
              stroke={8}
              colors={['#ffffff', theme.glow]}
              trackColor="rgba(255,255,255,0.18)"
            >
              <View style={s.countInner}>
                {days > 0 ? (
                  <>
                    <EventlyText style={s.countNumber}>{days}</EventlyText>
                    <EventlyText variant="caption" style={s.countLabel}>
                      {P.daysToGo(days)}
                    </EventlyText>
                  </>
                ) : (
                  <EventlyText variant="caption" style={s.countToday}>
                    {days === 0 ? P.today : P.past}
                  </EventlyText>
                )}
              </View>
            </ProgressRing>
          ) : data.dateChip ? (
            <View style={s.dateBlock}>
              <EventlyText variant="caption" style={s.dateMonth}>
                {data.dateChip.month}
              </EventlyText>
              <EventlyText style={s.dateDay}>{data.dateChip.day}</EventlyText>
            </View>
          ) : null}

          <View style={s.facts}>
            {data.dateLabel ? (
              <View style={s.fact}>
                <View style={s.factIcon}>
                  <EventlyIcon name="calendar-heart" size={15} color="#ffffff" />
                </View>
                <EventlyText variant="body" style={s.factText} numberOfLines={2}>
                  {data.dateLabel}
                </EventlyText>
              </View>
            ) : null}
            {data.venue ? (
              <View style={s.fact}>
                <View style={s.factIcon}>
                  <EventlyIcon name="map-marker" size={15} color="#ffffff" />
                </View>
                <EventlyText variant="body" style={s.factText} numberOfLines={3}>
                  {data.venue}
                </EventlyText>
              </View>
            ) : null}
            {data.payment.totalLabel ? (
              <View style={s.fact}>
                <View style={s.factIcon}>
                  <EventlyIcon name="wallet" size={15} color="#ffffff" />
                </View>
                <EventlyText variant="body" style={[s.factText, s.factStrong]} numberOfLines={1}>
                  {data.payment.totalLabel}
                </EventlyText>
              </View>
            ) : null}
          </View>
        </View>

        {data.organizerName ? (
          <View style={s.organizerBar}>
            <View style={[s.avatar, { backgroundColor: data.organizerAvatarColor }]}>
              <EventlyText style={s.avatarText}>{data.organizerInitials || '·'}</EventlyText>
            </View>
            <View style={s.organizerText}>
              <EventlyText variant="caption" style={s.organizerLead}>
                Organized by
              </EventlyText>
              <EventlyText variant="subtitle" style={s.organizerName} numberOfLines={1}>
                {data.organizerName}
              </EventlyText>
            </View>
            {onMessage ? (
              <PressableScale
                style={s.messageButton}
                onPress={onMessage}
                disabled={isOpeningMessage}
                accessibilityRole="button"
                accessibilityLabel={`${P.message} ${data.organizerName}`}
              >
                <EventlyIcon name="chat-processing-outline" size={16} color={theme.via} />
                <EventlyText variant="caption" style={[s.messageText, { color: theme.via }]}>
                  {P.message}
                </EventlyText>
              </PressableScale>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Three figures, floating across the poster's foot. */}
      <View style={s.statsCard}>
        <Stat percent={data.progress} colors={STAT_RING.ready} value={`${data.progress}%`} label={P.ready} />
        {data.payment.totalLabel ? (
          <Stat
            percent={data.payment.paidPercent}
            colors={STAT_RING.paid}
            value={`${data.payment.paidPercent}%`}
            label={P.paid}
          />
        ) : null}
        <Stat
          percent={data.tasksTotal > 0 ? (data.tasksDone / data.tasksTotal) * 100 : 0}
          colors={STAT_RING.tasks}
          value={data.tasksTotal > 0 ? `${data.tasksDone}/${data.tasksTotal}` : '—'}
          label={data.tasksTotal > 0 ? P.tasks : P.noTasksShort}
        />
      </View>

    </View>
  );
}

export default WorkspaceOverview;
