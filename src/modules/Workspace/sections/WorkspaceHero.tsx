import { View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  RING_CIRCUMFERENCE,
  RING_RADIUS,
  RING_SIZE,
  RING_STROKE,
  WORKSPACE_ACCENT,
  WORKSPACE_RING_TRACK,
  WORKSPACE_STATUS_COLOR,
} from '../constants';
import { heroStyles as s } from '../styles';
import type { WorkspaceViewModel } from '../types';

/** The workspace header card: how far along, and how long there is left. */
export function WorkspaceHero({ data }: { data: WorkspaceViewModel }) {
  const center = RING_SIZE / 2;
  const offset = RING_CIRCUMFERENCE * (1 - data.progress / 100);
  const statusColor = WORKSPACE_STATUS_COLOR[data.status] ?? colors.onPrimaryMuted;
  const dayWord = data.daysToGo === 1 ? 'day to go' : 'days to go';

  return (
    <View style={s.card}>
      <View style={s.top}>
        <View style={s.ringWrap}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={center}
              cy={center}
              r={RING_RADIUS}
              stroke={WORKSPACE_RING_TRACK}
              strokeWidth={RING_STROKE}
              fill="none"
            />
            {/* Starts at 12 o'clock so the arc reads as progress. */}
            <G rotation={-90} originX={center} originY={center}>
              <Circle
                cx={center}
                cy={center}
                r={RING_RADIUS}
                stroke={WORKSPACE_ACCENT}
                strokeWidth={RING_STROKE}
                strokeLinecap="round"
                strokeDasharray={[RING_CIRCUMFERENCE, RING_CIRCUMFERENCE]}
                strokeDashoffset={offset}
                fill="none"
              />
            </G>
          </Svg>
          <View style={s.ringText} pointerEvents="none">
            <EventlyText variant="h2" style={s.ringPercent}>
              {data.progress}%
            </EventlyText>
            <EventlyText variant="caption" style={s.ringCaption}>
              ready
            </EventlyText>
          </View>
        </View>

        <View style={s.headText}>
          <EventlyText variant="caption" style={s.eyebrow} numberOfLines={1}>
            {data.ref}
          </EventlyText>
          <EventlyText variant="h2" style={s.title} numberOfLines={2}>
            {data.title}
          </EventlyText>
          <View style={s.statusPill}>
            <View style={[s.statusDot, { backgroundColor: statusColor }]} />
            <EventlyText variant="caption" style={s.statusText} numberOfLines={1}>
              {data.statusLabel}
            </EventlyText>
          </View>
        </View>
      </View>

      {/* A booking with no date has no countdown — better than showing "0". */}
      {data.daysToGo != null ? (
        <View style={s.countdown}>
          <EventlyText variant="h1" style={s.countdownCount}>
            {data.daysToGo}
          </EventlyText>
          <EventlyText variant="body" style={s.countdownLabel}>
            {dayWord}
          </EventlyText>
        </View>
      ) : null}
    </View>
  );
}

export default WorkspaceHero;
