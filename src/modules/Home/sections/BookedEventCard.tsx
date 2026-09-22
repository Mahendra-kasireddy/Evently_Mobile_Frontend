import { TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyIcon, EventlyText } from '../../../Components';
import {
  BOOKED_CTA,
  BOOKED_STATUS_LABEL,
  CTA_GRADIENT,
  HERO_ACCENT_COLOR,
} from '../constants';
import { colors } from '../../../theme';
import { bookedEventStyles as s } from '../styles';
import type { BookedEventViewModel } from '../types';

interface BookedEventCardProps {
  data: BookedEventViewModel;
  /** Opens this booking's workspace. */
  onPress: () => void;
  /** Opens the thread with the organizer. Dropped when there is none to open. */
  onMessageOrganizer?: () => void;
  /**
   * True when this card is one of several in the horizontal row, which fixes
   * its width and leaves the row's own padding to the list.
   */
  inRow?: boolean;
}

/**
 * Home's ongoing-booking card: the one place on the discovery screen that
 * turns into a live event summary once the customer actually has a booking.
 *
 * Every value is composed by the backend (BookingService.getActiveForUser) and
 * rendered as given. The four milestones are each resolved from real state —
 * the organizer accepting, every assigned sub-vendor accepting, the invitation
 * being approved, delivery starting — and the bar above them is the share of
 * those that are done, so the bar and the dots can never disagree.
 *
 * The card is no longer one big tap target. It has two things worth doing —
 * open the workspace, message the organizer — and collapsing them into a
 * single control would mean one of them could not be reached.
 */
export function BookedEventCard({
  data,
  onPress,
  onMessageOrganizer,
  inRow = false,
}: BookedEventCardProps) {
  const nextIndex = data.steps.findIndex(step => !step.done);
  /* Per card: two of these on screen would otherwise both resolve the same
     gradient id, and the second would inherit the first one's box. */
  const gradientId = `booked-${data.id}`;

  const card = (
    <View style={[s.card, inRow && s.cardInRow]}>
      <View style={s.head}>
        <View style={s.headGradient} pointerEvents="none">
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient
                id={gradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0" stopColor={CTA_GRADIENT[0]} />
                <Stop offset="1" stopColor={CTA_GRADIENT[1]} />
              </LinearGradient>
            </Defs>
            <Rect
              x={0}
              y={0}
              width={100}
              height={100}
              fill={`url(#${gradientId})`}
            />
          </Svg>
        </View>

        <View style={s.topRow}>
          <View style={s.statusPill}>
            <EventlyIcon name="check" size={13} color={colors.onPrimary} />
            <EventlyText variant="caption" style={s.statusText}>
              {BOOKED_STATUS_LABEL[data.status]}
            </EventlyText>
          </View>
          {/* Decoration, and optional: an older booking row has no reference,
              and that is not a reason to leave a gap where one would sit. */}
          {data.ref ? (
            <EventlyText variant="caption" style={s.ref} numberOfLines={1}>
              {data.ref}
            </EventlyText>
          ) : null}
          {/* "Today" carries no trailing word — a countdown of nothing does not
              need the units it is not counting. */}
          <View style={s.days}>
            <EventlyText variant="subtitle" style={s.daysCount}>
              {data.daysToGoValue}
            </EventlyText>
            {data.daysToGoLabel ? (
              <EventlyText variant="caption" style={s.daysLabel}>
                {data.daysToGoLabel}
              </EventlyText>
            ) : null}
          </View>
        </View>

        <EventlyText variant="h1" style={s.title} numberOfLines={2}>
          {data.title}
        </EventlyText>

        {/* Dropped rather than left as an empty line for a booking that came
            from no brief and so has no date, venue or headcount to state. */}
        {data.factsLine ? (
          <EventlyText variant="body" style={s.facts} numberOfLines={2}>
            {data.factsLine}
          </EventlyText>
        ) : null}
      </View>

      <View style={s.body}>
        <View style={s.organizer}>
          <View
            style={[s.avatar, { backgroundColor: data.organizerAvatarColor }]}
          >
            <EventlyText variant="subtitle" style={s.avatarText}>
              {data.organizerInitials}
            </EventlyText>
          </View>
          <View style={s.organizerText}>
            <EventlyText
              variant="subtitle"
              style={s.organizerName}
              numberOfLines={1}
            >
              {data.organizerName}
            </EventlyText>
            <EventlyText
              variant="caption"
              style={s.organizerNote}
              numberOfLines={1}
            >
              {data.organizerNote}
            </EventlyText>
          </View>
          {onMessageOrganizer ? (
            <TouchableOpacity
              style={s.chat}
              activeOpacity={0.7}
              onPress={onMessageOrganizer}
              accessibilityRole="button"
              accessibilityLabel={`Message ${data.organizerName}`}
            >
              <EventlyIcon
                name="chat-outline"
                size={19}
                color={HERO_ACCENT_COLOR}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {data.steps.length > 0 ? (
          <>
            <View style={s.progressHead}>
              <EventlyText variant="subtitle" style={s.progressTitle}>
                Getting ready
              </EventlyText>
              <EventlyText variant="caption" style={s.progressCount}>
                {data.stepsDoneLabel}
              </EventlyText>
            </View>

            <View
              style={s.track}
              accessibilityRole="progressbar"
              accessibilityValue={{ now: data.progress, min: 0, max: 100 }}
            >
              <View style={[s.fill, { width: `${data.progress}%` }]} />
            </View>

            <View style={s.steps}>
              {data.steps.map((step, index) => {
                // Done, next, or not yet — told apart by the dot's colour and
                // the label's, so neither carries the state on its own.
                const isNext = index === nextIndex;
                return (
                  <View
                    key={step.label}
                    style={s.step}
                    accessibilityLabel={`${step.label}: ${
                      step.done ? 'done' : 'not yet'
                    }`}
                  >
                    <View
                      style={[
                        s.stepDot,
                        step.done && s.stepDotDone,
                        isNext && s.stepDotNext,
                      ]}
                    />
                    <EventlyText
                      variant="caption"
                      style={[
                        s.stepLabel,
                        step.done && s.stepLabelDone,
                        isNext && s.stepLabelNext,
                      ]}
                      numberOfLines={2}
                    >
                      {step.label}
                    </EventlyText>
                  </View>
                );
              })}
            </View>
          </>
        ) : null}

        <TouchableOpacity
          style={s.cta}
          activeOpacity={0.85}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${BOOKED_CTA} for ${data.title}`}
        >
          <EventlyText variant="subtitle" style={s.ctaText}>
            {BOOKED_CTA}
          </EventlyText>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* In the row the list supplies the gutters and the gap; on its own the card
     still brings its own section spacing. */
  return inRow ? card : <View style={s.section}>{card}</View>;
}

export default BookedEventCard;
