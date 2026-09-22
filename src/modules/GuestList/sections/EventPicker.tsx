import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { useAsync } from '../../../hooks/useAsync';
import { fetchMyInvitations } from '../../Invitation/services';
import { GUEST_ACCENT, GUEST_COPY as COPY, GUEST_MUTED, GUEST_NAVY } from '../constants';
import { pickerStyles as s, styles as base } from '../styles';

interface EventPickerProps {
  /** The name goes with the id: the next screen puts it in its header. */
  onPick: (bookingId: string, title: string) => void;
}

/**
 * Which event's guest list.
 *
 * Shown only when the screen was opened without a booking — from Profile,
 * where there is no event in hand. Every other way in already knows which one,
 * and goes straight to the list.
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
        <EventlyIcon name="card-account-details-outline" size={36} color={GUEST_MUTED} />
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
    <ScrollView contentContainerStyle={base.content} showsVerticalScrollIndicator={false}>
      <EventlyText variant="small" style={s.lead}>
        {COPY.pickEvent}
      </EventlyText>
      {events.map((event) => (
        <TouchableOpacity
          key={event.bookingId}
          style={s.row}
          activeOpacity={0.85}
          onPress={() => onPick(event.bookingId, event.bookingTitle || event.occasion)}
          accessibilityRole="button"
          accessibilityLabel={event.bookingTitle || event.occasion}
        >
          <View style={s.text}>
            <EventlyText variant="cardTitle" style={s.title} numberOfLines={1}>
              {event.bookingTitle || event.occasion}
            </EventlyText>
            {/* Dropped rather than left blank when the booking carries no date. */}
            {event.eventDate ? (
              <EventlyText variant="small" style={s.meta} numberOfLines={1}>
                {event.eventDate}
              </EventlyText>
            ) : null}
          </View>
          <EventlyIcon name="chevron-right" size={20} color={GUEST_NAVY} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default EventPicker;
