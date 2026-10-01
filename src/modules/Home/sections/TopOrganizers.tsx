import { useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { HERO_ACCENT_COLOR, HOME_GREEN, HOME_NAVY } from '../constants';
import { organizerRowStyles as s } from '../styles';
import { SectionHead } from './SectionHead';
import type { OrganizerItem, TopOrganizersViewModel } from '../types';

interface TopOrganizersProps {
  data: TopOrganizersViewModel;
  onPressOrganizer: (organizerId: string) => void;
  onPressSeeAll: () => void;
  /** Offered when the list had to widen past the customer's city. */
  onPressChangeCity: () => void;
  /**
   * 'carousel' is Home's swipeable row; 'grid' lays the same cards two to a
   * row, for a results list like Search.
   */
  layout?: 'carousel' | 'grid';
}

function OrganizerCard({
  item,
  onPress,
  isSaved,
  onToggleSaved,
  inGrid,
}: {
  item: OrganizerItem;
  onPress: () => void;
  isSaved: boolean;
  onToggleSaved: () => void;
  inGrid: boolean;
}) {
  const spoken = [
    item.name,
    item.verified ? 'Verified' : '',
    item.reviews > 0
      ? `${item.rating.toFixed(1)} from ${item.reviews} reviews`
      : 'No reviews yet',
    item.locationLabel,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <TouchableOpacity
      style={[s.card, inGrid && s.cardInGrid]}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${spoken}. View profile.`}
    >
      <View style={s.cover}>
        {item.coverUrl ? (
          <Image
            source={{ uri: item.coverUrl }}
            style={s.coverImage}
            resizeMode="cover"
          />
        ) : (
          /* No photo yet: their own colour, never somebody else's picture. */
          <View style={[s.coverImage, { backgroundColor: item.avatarColor }]}>
            <EventlyIcon
              name="party-popper"
              size={34}
              color="rgba(255,255,255,0.35)"
            />
          </View>
        )}

        {item.verified ? (
          <View style={s.verified}>
            <EventlyIcon name="check-decagram" size={12} color={HOME_GREEN} />
            <EventlyText variant="caption" style={s.verifiedText}>
              Verified
            </EventlyText>
          </View>
        ) : null}

        {/* Session-only for now: there is no saved-organizers API yet. */}
        <TouchableOpacity
          style={s.heart}
          onPress={onToggleSaved}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={
            isSaved ? `Remove ${item.name} from saved` : `Save ${item.name}`
          }
        >
          <EventlyIcon
            name={isSaved ? 'heart' : 'heart-outline'}
            size={17}
            color={isSaved ? HERO_ACCENT_COLOR : HOME_NAVY}
          />
        </TouchableOpacity>

        <View style={[s.logo, { backgroundColor: item.avatarColor }]}>
          {item.logoUrl ? (
            <Image source={{ uri: item.logoUrl }} style={s.logoImage} />
          ) : (
            <EventlyText variant="caption" style={s.logoText}>
              {item.initials}
            </EventlyText>
          )}
        </View>
      </View>

      <View style={s.body}>
        {/* Their own name, as they wrote it. */}
        <EventlyText variant="body" style={s.name} numberOfLines={1}>
          {item.name}
        </EventlyText>

        <View style={s.metaRow}>
          {/* A score with no reviews behind it is not a rating. */}
          {item.reviews > 0 ? (
            <View style={s.ratingRow}>
              <EventlyIcon name="star" size={13} color="#e8a33a" />
              <EventlyText variant="caption" style={s.rating}>
                {item.rating.toFixed(1)}
              </EventlyText>
              <EventlyText variant="caption" style={s.reviews}>
                {`(${item.reviews})`}
              </EventlyText>
            </View>
          ) : (
            <EventlyText variant="caption" style={s.reviews}>
              No reviews yet
            </EventlyText>
          )}
          {item.locationLabel ? (
            <EventlyText variant="caption" style={s.location} numberOfLines={1}>
              {item.locationLabel}
            </EventlyText>
          ) : null}
        </View>

        {item.tags.length > 0 ? (
          <View style={s.tagRow}>
            {item.tags.slice(0, 2).map(tag => (
              <View key={tag} style={s.tag}>
                <EventlyText
                  variant="caption"
                  style={s.tagText}
                  numberOfLines={1}
                >
                  {tag}
                </EventlyText>
              </View>
            ))}
          </View>
        ) : null}

        {/* Drawn as a button, pressed as part of the card. */}
        <View style={s.cta}>
          <EventlyText variant="caption" style={s.ctaText}>
            View profile
          </EventlyText>
          <EventlyIcon
            name="chevron-right"
            size={16}
            color={HERO_ACCENT_COLOR}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Organizers the customer can actually reach.
 *
 * The heading tells the truth about how the list was built: when nothing local
 * matched, the server widens the search and says so, and this section then
 * offers to change the city rather than calling organizers in another state
 * "near you".
 */
export function TopOrganizers({
  data,
  onPressOrganizer,
  onPressSeeAll,
  onPressChangeCity,
  layout = 'carousel',
}: TopOrganizersProps) {
  const [saved, setSaved] = useState<string[]>([]);
  const toggleSaved = (id: string) =>
    setSaved(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );

  const cards = data.items.map(item => (
    <OrganizerCard
      key={item.id}
      item={item}
      inGrid={layout === 'grid'}
      isSaved={saved.includes(item.id)}
      onToggleSaved={() => toggleSaved(item.id)}
      onPress={() => onPressOrganizer(item.id)}
    />
  ));

  return (
    <View>
      <SectionHead
        title={data.title}
        actionLabel="See all"
        onPressAction={onPressSeeAll}
      />

      {data.scopeNote ? (
        <TouchableOpacity
          onPress={onPressChangeCity}
          accessibilityRole="button"
        >
          <EventlyText variant="caption" style={s.emptyText}>
            {data.scopeNote}
          </EventlyText>
        </TouchableOpacity>
      ) : null}

      {/* A heading with nothing under it reads as a section that failed to
          load. When there is genuinely nobody, say so and offer the one thing
          that can change it. */}
      {data.items.length === 0 ? (
        <TouchableOpacity
          onPress={onPressChangeCity}
          accessibilityRole="button"
        >
          <EventlyText variant="body" style={s.emptyText}>
            {data.city
              ? `No organizers listed for ${data.city} yet. Change your city to look further afield.`
              : 'Set your city and we will show the organizers who serve it.'}
          </EventlyText>
        </TouchableOpacity>
      ) : layout === 'grid' ? (
        <View style={s.grid}>{cards}</View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.rowContent}
        >
          {cards}
        </ScrollView>
      )}
    </View>
  );
}

export default TopOrganizers;
