import { useEffect, useRef } from 'react';
import { Animated, Image, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  EventlyIcon,
  AppText,
  GradientFill,
  PressableScale,
  useReducedMotion,
} from '../../../Components';
import {
  OCCASION_PHOTO,
  OCCASION_TAGLINE,
  OCCASION_THEME,
  WORKSPACE_COPY,
  WORKSPACE_PREMIUM_COPY as P,
  WORKSPACE_STATUS_COLOR,
} from '../constants';
import { posterUi as s } from '../premium.styles';
import type { WorkspaceViewModel } from '../types';
import { ProgressRing } from './ProgressRing';

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
        Animated.timing(pulse, {
          toValue: 0.25,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, reduceMotion, pulse]);
  return (
    <Animated.View
      style={[s.statusDot, { backgroundColor: color, opacity: pulse }]}
    />
  );
}

/** One row of the details card: a tinted icon tile, a value, a quiet line under it. */
function Fact({
  icon,
  tint,
  ink,
  value,
  sub,
  lines = 1,
}: {
  icon: string;
  tint: string;
  ink: string;
  value: string;
  sub?: string;
  lines?: number;
}) {
  return (
    <View style={s.fact}>
      <View style={[s.factIcon, { backgroundColor: tint }]}>
        <EventlyIcon name={icon} size={16} color={ink} />
      </View>
      <View style={s.factBody}>
        <AppText
          variant="bodySmall"
          weight="semibold"
          style={s.factValue}
          numberOfLines={lines}
        >
          {value}
        </AppText>
        {sub ? (
          <AppText variant="caption" color="textSecondary" numberOfLines={1}>
            {sub}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

/** One column of the progress card: icon tile and ring side by side, then its words. */
function Progress({
  ink,
  percent,
  value,
  label,
  state,
  stateColor,
  last,
}: {
  ink: string;
  percent: number;
  value: string;
  label: string;
  state: string;
  stateColor: string;
  last?: boolean;
}) {
  return (
    <View style={[s.progressCol, !last && s.progressDivider]}>
      <View style={s.progressTop}>
        <ProgressRing
          percent={percent}
          size={58}
          stroke={5}
          colors={[ink, ink]}
          trackColor="#ece9f5"
        >
          <AppText
            variant="bodySmall"
            weight="semibold"
            style={s.ringValue}
            numberOfLines={1}
          >
            {value}
          </AppText>
        </ProgressRing>
      </View>
      <AppText
        variant="caption"
        weight="semibold"
        align="center"
        numberOfLines={1}
        style={s.progressLabel}
      >
        {label}
      </AppText>
      <AppText
        variant="caption"
        align="center"
        numberOfLines={1}
        color={stateColor}
      >
        {state}
      </AppText>
    </View>
  );
}

/**
 * The top of the workspace.
 *
 * A poster in the occasion's colours with the category's own photograph on
 * the right, melting into the gradient; the status and the occasion's name
 * on the left. Under it, one card with the facts (when, where, budget) and the
 * organizer with a way to message them; then the event's progress in three
 * rings — planning, payments, tasks — with a word for where each one stands.
 */
export function WorkspaceOverview({
  data,
  onBack,
  onMessage,
  isOpeningMessage = false,
}: WorkspaceOverviewProps) {
  const insets = useSafeAreaInsets();
  const theme = OCCASION_THEME[data.art] ?? OCCASION_THEME.birthday;
  const photo = OCCASION_PHOTO[data.art] ?? OCCASION_PHOTO.birthday;
  const tagline = OCCASION_TAGLINE[data.art] ?? '';
  const statusColor = WORKSPACE_STATUS_COLOR[data.status] ?? '#22a06b';
  const pending =
    data.status === 'pending' || data.status === 'awaiting_organizer';
  const taskPercent =
    data.tasksTotal > 0 ? (data.tasksDone / data.tasksTotal) * 100 : 0;

  return (
    <View>
      <View
        style={[
          s.poster,
          { paddingTop: insets.top + 8, backgroundColor: theme.from },
        ]}
      >
        {/*
          One layer, no seam: the category photo fills the whole poster and
          the occasion's colour is washed over it — solid behind the words on
          the left, thinning out to the right so the photo shows through.
        */}
        <View style={s.fill} pointerEvents="none">
          <Image
            source={photo}
            style={s.photo}
            resizeMode="cover"
            accessible={false}
          />
          <Svg
            style={s.fill}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient id="wsWashX" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={theme.from} stopOpacity={1} />
                <Stop offset="0.3" stopColor={theme.from} stopOpacity={0.96} />
                <Stop offset="0.55" stopColor={theme.via} stopOpacity={0.62} />
                <Stop offset="0.8" stopColor={theme.via} stopOpacity={0.28} />
                <Stop offset="1" stopColor={theme.via} stopOpacity={0.12} />
              </LinearGradient>
              <LinearGradient id="wsWashY" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={theme.from} stopOpacity={0.45} />
                <Stop offset="0.3" stopColor={theme.from} stopOpacity={0} />
                <Stop offset="0.75" stopColor={theme.via} stopOpacity={0} />
                <Stop offset="1" stopColor={theme.via} stopOpacity={0.35} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width="100%" height="100%" fill="url(#wsWashX)" />
            <Rect x={0} y={0} width="100%" height="100%" fill="url(#wsWashY)" />
          </Svg>
        </View>

        <View style={s.topRow}>
          <PressableScale
            style={s.glassButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <EventlyIcon name="chevron-left" size={22} color="#ffffff" />
          </PressableScale>
          <AppText variant="overline" color="textOnPrimary" style={s.topTitle}>
            {WORKSPACE_COPY.screenTitle}
          </AppText>
          {data.ref ? (
            <View style={s.refChip}>
              <AppText variant="label" color="textOnPrimary" numberOfLines={1}>
                {`# ${data.ref}`}
              </AppText>
            </View>
          ) : (
            <View style={s.topSpacer} />
          )}
        </View>

        <View style={s.eyebrowRow}>
          <AppText variant="h2" style={s.emoji}>
            {theme.emoji}
          </AppText>
          {data.statusLabel ? (
            <View style={s.statusPill}>
              <LiveDot color={statusColor} active={pending} />
              <AppText variant="label" style={s.statusText} numberOfLines={1}>
                {data.statusLabel}
              </AppText>
            </View>
          ) : null}
        </View>

        <AppText
          variant="h1"
          color="textOnPrimary"
          style={s.title}
          numberOfLines={2}
          accessibilityRole="header"
        >
          {data.title}
        </AppText>
        {tagline ? (
          <AppText variant="body" style={s.tagline} numberOfLines={1}>
            {tagline}
          </AppText>
        ) : null}
      </View>

      {/* The facts, and who is organizing it. */}
      <View style={s.detailsCard}>
        <View style={s.factsCol}>
          {data.dateLabel ? (
            <Fact
              icon="calendar-heart"
              tint="#f3e8ff"
              ink="#8b3fd9"
              value={data.dateLabel}
              sub={data.dateDetail}
            />
          ) : null}
          {data.venue ? (
            <Fact
              icon="map-marker"
              tint="#ffe6f1"
              ink="#e0337c"
              value={data.venue}
              lines={2}
            />
          ) : null}
          {data.payment.totalLabel ? (
            <Fact
              icon="currency-inr"
              tint="#e3f7ee"
              ink="#1f9d6b"
              value={data.payment.totalLabel}
              sub={P.estimatedBudget}
            />
          ) : null}
        </View>

        {data.organizerName ? (
          <View style={s.organizerCol}>
            <View style={s.organizerRow}>
              <View style={s.avatarRing}>
                <View
                  style={[
                    s.avatar,
                    { backgroundColor: data.organizerAvatarColor },
                  ]}
                >
                  <AppText
                    variant="bodySmall"
                    weight="semibold"
                    color="textOnPrimary"
                  >
                    {(data.organizerInitials || data.organizerName).slice(0, 1)}
                  </AppText>
                </View>
              </View>
              <View style={s.organizerText}>
                <AppText
                  variant="caption"
                  color="textSecondary"
                  numberOfLines={1}
                >
                  {P.organizedBy}
                </AppText>
                <AppText
                  variant="caption"
                  weight="semibold"
                  numberOfLines={2}
                  style={s.organizerName}
                >
                  {data.organizerName.toUpperCase()}
                </AppText>
              </View>
            </View>
            {onMessage ? (
              <PressableScale
                style={s.messageButton}
                onPress={onMessage}
                disabled={isOpeningMessage}
                accessibilityRole="button"
                accessibilityLabel={`${P.message} ${data.organizerName}`}
              >
                <GradientFill
                  colors={['#8f5cf7', '#6a3be0']}
                  direction="across"
                />
                <EventlyIcon
                  name="message-text-outline"
                  size={16}
                  color="#ffffff"
                />
                <AppText variant="buttonSmall" color="textOnPrimary">
                  {P.message}
                </AppText>
              </PressableScale>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Where the event stands, three ways. */}
      <View style={s.progressCard}>
        <View style={s.progressHead}>
          <AppText variant="h3" style={s.progressTitle}>
            {P.progressTitle}
          </AppText>
        </View>
        <View style={s.progressRow}>
          <Progress
            ink="#1f9d6b"
            percent={data.progress}
            value={`${data.progress}%`}
            label={P.planning}
            state={P.planningState(data.progress)}
            stateColor="#1f9d6b"
          />
          <Progress
            ink="#7c4ddb"
            percent={data.payment.paidPercent}
            value={`${data.payment.paidPercent}%`}
            label={P.payments}
            state={P.paymentState(data.payment.paidPercent)}
            stateColor="#7c4ddb"
          />
          <Progress
            ink="#2f6fe4"
            percent={taskPercent}
            value={`${data.tasksDone}/${data.tasksTotal}`}
            label={P.tasks}
            state={P.tasksState(data.tasksDone)}
            stateColor="#8a8799"
            last
          />
        </View>
      </View>
    </View>
  );
}

export default WorkspaceOverview;
