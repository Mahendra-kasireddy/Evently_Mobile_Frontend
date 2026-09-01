import { TouchableOpacity, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  BOOKED_CTA,
  BOOKED_RING_CIRCUMFERENCE,
  BOOKED_RING_RADIUS,
  BOOKED_RING_SIZE,
  BOOKED_RING_STROKE,
  BOOKED_RING_TRACK_COLOR,
  BOOKED_STATUS_LABEL,
  BOOKED_STEP_DONE_COLOR,
  HERO_ACCENT_COLOR,
} from '../constants';
import { bookedEventStyles as s } from '../styles';
import type { BookedEventViewModel } from '../types';

interface BookedEventCardProps {
  data: BookedEventViewModel;
  /** Opens this booking's workspace. */
  onPress: () => void;
}

/**
 * Home's ongoing-booking card: the one place on the discovery screen that
 * turns into a live event summary once the customer actually has a booking.
 *
 * Every value is composed by the backend (BookingService.getActiveForUser) and
 * rendered as given. In particular the ring's percentage is the share of the
 * milestones below it that are done, so the ring and the ticks can never
 * disagree — a card reading "82% ready" with nothing ticked is a bug the
 * customer can see.
 *
 * The whole card is one control, as on web: a single tap target with one
 * accessible name, so the "Open workspace" pill is presentational rather than
 * a nested button.
 */
export function BookedEventCard({ data, onPress }: BookedEventCardProps) {
  const center = BOOKED_RING_SIZE / 2;
  const offset = BOOKED_RING_CIRCUMFERENCE * (1 - data.progress / 100);
  const dayWord = data.daysToGo === 1 ? 'day to go' : 'days to go';

  return (
    <View style={s.section}>
      <TouchableOpacity
        style={s.card}
        activeOpacity={0.9}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${data.title} — ${data.progress}% ready, ${data.daysToGo} ${dayWord}. ${BOOKED_CTA}.`}
      >
        <View style={s.accent} pointerEvents="none" />

        <View style={s.ringWrap}>
          <Svg width={BOOKED_RING_SIZE} height={BOOKED_RING_SIZE}>
            <Circle
              cx={center}
              cy={center}
              r={BOOKED_RING_RADIUS}
              stroke={BOOKED_RING_TRACK_COLOR}
              strokeWidth={BOOKED_RING_STROKE}
              fill="none"
            />
            {/* Starts at 12 o'clock rather than 3, so the arc reads as progress. */}
            <G rotation={-90} originX={center} originY={center}>
              <Circle
                cx={center}
                cy={center}
                r={BOOKED_RING_RADIUS}
                stroke={HERO_ACCENT_COLOR}
                strokeWidth={BOOKED_RING_STROKE}
                strokeLinecap="round"
                strokeDasharray={[BOOKED_RING_CIRCUMFERENCE, BOOKED_RING_CIRCUMFERENCE]}
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

        <View style={s.refPill}>
          <EventlyText variant="caption" style={s.refText}>
            {BOOKED_STATUS_LABEL[data.status]} · {data.ref}
          </EventlyText>
        </View>

        <EventlyText variant="h2" style={s.title}>
          {data.title}
        </EventlyText>

        {data.description ? (
          <EventlyText variant="body" style={s.desc}>
            {data.description}
          </EventlyText>
        ) : null}

        {data.steps.length > 0 ? (
          <View style={s.steps}>
            {data.steps.map((step) => (
              <View
                key={step.label}
                style={s.step}
                accessibilityLabel={`${step.label}: ${step.done ? 'done' : 'not yet'}`}
              >
                <View style={[s.stepDot, step.done && { backgroundColor: BOOKED_STEP_DONE_COLOR }]}>
                  {step.done ? <EventlyIcon name="check" size={10} color={colors.onPrimary} /> : null}
                </View>
                <EventlyText variant="caption" style={[s.stepLabel, step.done && s.stepLabelDone]}>
                  {step.label}
                </EventlyText>
              </View>
            ))}
          </View>
        ) : null}

        <View style={s.footer}>
          <View style={s.days}>
            <EventlyText variant="h1" style={s.daysCount}>
              {data.daysToGo}
            </EventlyText>
            <EventlyText variant="body" style={s.daysLabel}>
              {dayWord}
            </EventlyText>
          </View>
          <View style={s.cta}>
            <EventlyIcon name="chevron-right" size={16} color={colors.onPrimary} />
            <EventlyText variant="subtitle" style={s.ctaText}>
              {BOOKED_CTA}
            </EventlyText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default BookedEventCard;
