import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  ORGANIZER_COPY,
  ORGANIZER_STAR_COUNT,
  ORGANIZER_TIER_COLOR,
  ORGANIZER_TIER_ICON,
  HERO_ACCENT_COLOR,
} from '../constants';
import { topOrganizersStyles as s } from '../styles';
import type { OrganizerItem, TopOrganizersViewModel } from '../types';

interface TopOrganizersProps {
  data: TopOrganizersViewModel;
  /** Opens this organizer's profile. */
  onPressProfile: (organizerId: string) => void;
  /** Sends a quote request to this organizer, from the customer's draft. */
  onPressQuote: (organizerId: string) => void;
  /** Organizer ids a request has already gone to this session. */
  requestedIds: string[];
  /** The organizer a request is currently in flight for, if any. */
  requestingId: string | null;
  requestErrorMessage: string | null;
  /** Opens the location picker, from the empty state. */
  onPressChangeCity: () => void;
}

/**
 * Stars for a rating.
 *
 * Deliberately different from the web card, which renders five filled stars
 * for every organizer regardless of `rating` — so an organizer with 0 reviews
 * appears as a five-star business next to the literal text "0 (0)". Here a
 * rating draws only as many filled stars as it has earned, and an organizer
 * with no reviews gets a plain "No reviews yet" instead of a row of stars.
 */
function Stars({ rating }: { rating: number }) {
  const filled = Math.round(Math.min(ORGANIZER_STAR_COUNT, Math.max(0, rating)));

  return (
    <>
      {Array.from({ length: ORGANIZER_STAR_COUNT }).map((_, i) => (
        <EventlyIcon
          key={i}
          name={i < filled ? 'star' : 'star-outline'}
          size={15}
          color={i < filled ? colors.accent : colors.border}
        />
      ))}
    </>
  );
}

function OrganizerCard({
  item,
  onPressProfile,
  onPressQuote,
  isRequested,
  isRequesting,
}: {
  item: OrganizerItem;
  onPressProfile: (id: string) => void;
  onPressQuote: (id: string) => void;
  isRequested: boolean;
  isRequesting: boolean;
}) {
  const tierColor = ORGANIZER_TIER_COLOR[item.tier];
  const hasRating = item.reviews > 0 && item.rating > 0;

  return (
    <View style={s.card}>
      <View style={s.top}>
        <View style={[s.avatar, { backgroundColor: item.avatarColor }]}>
          <EventlyText variant="subtitle" style={s.avatarText}>
            {item.initials}
          </EventlyText>
        </View>
        <View style={s.idCol}>
          <EventlyText variant="subtitle" style={s.name} numberOfLines={2}>
            {item.name}
          </EventlyText>
          <View style={s.tierBadge}>
            <EventlyIcon name={ORGANIZER_TIER_ICON} size={13} color={tierColor} />
            <EventlyText variant="caption" style={[s.tierBadgeText, { color: tierColor }]}>
              {item.tier}
            </EventlyText>
          </View>
        </View>
      </View>

      {hasRating ? (
        <View style={s.ratingRow}>
          <Stars rating={item.rating} />
          <EventlyText variant="body" style={s.ratingValue}>
            {item.rating.toFixed(1)}
          </EventlyText>
          <EventlyText variant="body" style={s.ratingMuted}>
            ({item.reviews}) · {item.events} events
          </EventlyText>
        </View>
      ) : (
        <EventlyText variant="body" style={s.noRating}>
          {ORGANIZER_COPY.noRating}
          {item.events > 0 ? ` · ${item.events} events` : ''}
        </EventlyText>
      )}

      {item.tags.length > 0 ? (
        <View style={s.tagRow}>
          {item.tags.map((tag) => (
            <EventlyText key={tag} variant="caption" style={s.tag}>
              {tag}
            </EventlyText>
          ))}
        </View>
      ) : null}

      {isRequested ? (
        <View style={s.sentRow}>
          <EventlyIcon name="check-circle" size={18} color={colors.success} />
          <EventlyText variant="body" style={s.sentText}>
            {ORGANIZER_COPY.requestSent}
          </EventlyText>
        </View>
      ) : (
        <View style={s.actions}>
          <TouchableOpacity
            style={[s.actionButton, s.viewButton]}
            activeOpacity={0.8}
            onPress={() => onPressProfile(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`${ORGANIZER_COPY.viewProfile}: ${item.name}`}
          >
            <EventlyText variant="subtitle" style={s.viewButtonText}>
              {ORGANIZER_COPY.viewProfile}
            </EventlyText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.actionButton, s.quoteButton, isRequesting && s.quoteButtonBusy]}
            activeOpacity={0.85}
            disabled={isRequesting}
            onPress={() => onPressQuote(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`${ORGANIZER_COPY.getQuote} from ${item.name}`}
          >
            {isRequesting ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <EventlyText variant="subtitle" style={s.quoteButtonText}>
                {ORGANIZER_COPY.getQuote}
              </EventlyText>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/**
 * Home's organizer section. Every organizer comes from the home feed's
 * `topOrganizers`, which the backend resolves against the customer's city.
 *
 * When nothing local matched, the backend says so through `scope`, and the
 * section repeats that rather than letting a "near you" heading imply a
 * locality the results do not have.
 */
export function TopOrganizers({
  data,
  onPressProfile,
  onPressQuote,
  requestedIds,
  requestingId,
  requestErrorMessage,
  onPressChangeCity,
}: TopOrganizersProps) {
  const header = (
    <View style={s.header}>
      <EventlyText variant="h2" style={s.title}>
        {data.title}
      </EventlyText>
    </View>
  );

  if (data.items.length === 0) {
    return (
      <View style={s.section}>
        {header}
        <View style={s.emptyCard}>
          <View style={s.emptyIcon}>
            <EventlyIcon name="compass-outline" size={22} color={HERO_ACCENT_COLOR} />
          </View>
          <EventlyText variant="subtitle" style={s.emptyTitle}>
            {ORGANIZER_COPY.emptyTitle}
          </EventlyText>
          <EventlyText variant="body" style={s.emptyBody}>
            {data.city ? ORGANIZER_COPY.emptyWithCity(data.city) : ORGANIZER_COPY.emptyNoCity}
          </EventlyText>
          <TouchableOpacity
            style={s.emptyCta}
            activeOpacity={0.8}
            onPress={onPressChangeCity}
            accessibilityRole="button"
          >
            <EventlyIcon name="map-marker-outline" size={16} color={HERO_ACCENT_COLOR} />
            <EventlyText variant="caption" style={s.emptyCtaText}>
              {ORGANIZER_COPY.emptyCta}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.section}>
      {header}

      {data.scope === 'all' ? (
        <View style={s.scopeNote}>
          <EventlyIcon name="map-marker-outline" size={14} color={colors.textMuted} />
          <EventlyText variant="caption" style={s.scopeNoteText}>
            {data.city ? ORGANIZER_COPY.scopeWithCity(data.city) : ORGANIZER_COPY.scopeNoCity}
          </EventlyText>
        </View>
      ) : null}

      {requestErrorMessage ? (
        <EventlyText variant="caption" style={s.errorText}>
          {requestErrorMessage}
        </EventlyText>
      ) : null}

      {data.items.map((item) => (
        <OrganizerCard
          key={item.id}
          item={item}
          onPressProfile={onPressProfile}
          onPressQuote={onPressQuote}
          isRequested={requestedIds.includes(item.id)}
          isRequesting={requestingId === item.id}
        />
      ))}
    </View>
  );
}

export default TopOrganizers;
