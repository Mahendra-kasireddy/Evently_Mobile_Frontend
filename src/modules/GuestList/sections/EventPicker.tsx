import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  EventlyIcon,
  EventlyText,
  FadeInUp,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { useAsync } from '../../../hooks/useAsync';
import { fetchMyInvitations } from '../../Invitation/services';
import type { InvitationSummaryDTO } from '../../Invitation/types';
import {
  GUEST_ACCENT,
  GUEST_COPY as COPY,
  GUEST_MUTED,
  GUEST_NAVY,
} from '../constants';
import { pickerStyles as s, styles as base } from '../styles';
import { eventDateParts } from '../utils';

interface EventPickerProps {
  /** The name goes with the id: the next screen puts it in its header. */
  onPick: (bookingId: string, title: string) => void;
}

/** A tile colour per occasion, so the events are told apart at a glance. */
const TILE: Record<string, [string, string]> = {
  wedding: ['#ff8aa8', '#e2477a'],
  birthday: ['#ffb36b', '#f0791a'],
  housewarming: ['#5fd3a8', '#14946b'],
  naming: ['#a58bff', '#6a45e8'],
  anniversary: ['#ffcf5c', '#d99a12'],
  corporate: ['#7fb2ff', '#2f6fe0'],
};
const TILE_FALLBACK: [string, string] = ['#f47b4d', '#e2477a'];

/** Where the invitation is: live, waiting on the customer, or still being made. */
function statusOf(event: InvitationSummaryDTO): {
  label: string;
  color: string;
} {
  if (event.status === 'approved')
    return { label: COPY.statusLive, color: '#13a06f' };
  if (event.sentAt) return { label: COPY.statusReview, color: '#e8633a' };
  return { label: COPY.statusDraft, color: '#9a93a8' };
}

/**
 * Which event's guest list.
 *
 * Shown only when the screen was opened without a booking — from Profile or
 * the + menu, where there is no event in hand. Every other way in already
 * knows which one, and goes straight to the list.
 *
 * Drawn from the customer's invitations rather than their bookings, because a
 * guest list belongs to an invitation: a booking whose organizer has not built
 * one yet has nobody to invite and no list to keep.
 */
export function EventPicker({ onPick }: EventPickerProps) {
  const { data, loading, error, refetch } = useAsync(fetchMyInvitations, []);
  const events = data ?? [];

  if (loading && events.length === 0) {
    return (
      <View style={base.centered}>
        <ActivityIndicator size="large" color={GUEST_ACCENT} />
        <EventlyText variant="body" style={base.centeredText}>
          {COPY.loadingEvents}
        </EventlyText>
      </View>
    );
  }

  if (error && events.length === 0) {
    return (
      <View style={base.centered}>
        <EventlyText variant="sectionTitle" style={base.errorTitle}>
          {COPY.eventsErrorTitle}
        </EventlyText>
        <TouchableOpacity
          style={base.retry}
          activeOpacity={0.8}
          onPress={refetch}
          accessibilityRole="button"
        >
          <EventlyIcon name="refresh" size={16} color={GUEST_ACCENT} />
          <EventlyText variant="label" style={base.retryText}>
            {COPY.retry}
          </EventlyText>
        </TouchableOpacity>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={base.centered}>
        <EventlyIcon
          name="card-account-details-outline"
          size={36}
          color={GUEST_MUTED}
        />
        <EventlyText variant="sectionTitle" style={base.errorTitle}>
          {COPY.noEventsTitle}
        </EventlyText>
        <EventlyText variant="body" style={base.centeredText}>
          {COPY.noEventsBody}
        </EventlyText>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={base.content}
      showsVerticalScrollIndicator={false}
    >
      <EventlyText variant="body" style={s.lead}>
        {COPY.pickLead}
      </EventlyText>
      {events.map((event, i) => {
        const name = event.bookingTitle || event.occasion;
        const date = eventDateParts(event.eventDate);
        const status = statusOf(event);
        const tile =
          TILE[(event.occasion ?? '').toLowerCase()] ?? TILE_FALLBACK;
        return (
          <FadeInUp key={event.bookingId} delay={i * 60}>
            <PressableScale
              style={s.row}
              onPress={() => onPick(event.bookingId, name)}
              accessibilityRole="button"
              accessibilityLabel={name}
            >
              {/* The date as a calendar leaf — the thing that tells two events apart. */}
              <View style={s.tile}>
                <GradientFill colors={tile} direction="diagonal" />
                {date ? (
                  <>
                    <EventlyText style={s.tileDay}>{date.day}</EventlyText>
                    <EventlyText style={s.tileMonth}>{date.month}</EventlyText>
                  </>
                ) : (
                  <EventlyIcon
                    name="calendar-blank-outline"
                    size={24}
                    color="#ffffff"
                  />
                )}
              </View>
              <View style={s.text}>
                <EventlyText
                  variant="cardTitle"
                  style={s.title}
                  numberOfLines={1}
                >
                  {name}
                </EventlyText>
                {date ? (
                  <EventlyText variant="small" style={s.meta} numberOfLines={1}>
                    {date.line}
                  </EventlyText>
                ) : null}
                <View style={s.status}>
                  <View
                    style={[s.statusDot, { backgroundColor: status.color }]}
                  />
                  <EventlyText style={[s.statusText, { color: status.color }]}>
                    {status.label}
                  </EventlyText>
                </View>
              </View>
              <View style={s.go}>
                <EventlyIcon
                  name="chevron-right"
                  size={20}
                  color={GUEST_NAVY}
                />
              </View>
            </PressableScale>
          </FadeInUp>
        );
      })}
    </ScrollView>
  );
}

export default EventPicker;
