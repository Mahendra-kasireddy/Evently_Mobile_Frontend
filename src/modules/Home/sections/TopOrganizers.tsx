import { useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyIcon, EventlyText, GradientFill, PressableScale } from '../../../Components';
import { SECTION_TONE_GRADIENT } from '../constants';
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

/**
 * The colours an organizer card can wear, in turn along the row: a gradient
 * for the logo ring and the button, and tints for the tags.
 */
const ORGANIZER_ACCENTS: Array<{ gradient: [string, string]; tags: string[][] }> = [
  { gradient: ['#5b9bff', '#2554b8'], tags: [['#e9f0fd', '#2b5aa8'], ['#f1ecff', '#6d4df2']] },
  { gradient: ['#ff8a5c', '#e8433a'], tags: [['#fff0e8', '#d24a24'], ['#fdeef3', '#c2416b']] },
  { gradient: ['#a084ff', '#5a35e0'], tags: [['#f1ecff', '#6d4df2'], ['#e6f7f1', '#0f8a68']] },
  { gradient: ['#3cc9a1', '#0e8a68'], tags: [['#e6f7f1', '#0f8a68'], ['#fff4e2', '#b8650b']] },
];

function OrganizerCard({
  item,
  index,
  onPress,
  isSaved,
  onToggleSaved,
  inGrid,
}: {
  item: OrganizerItem;
  /** Its place in the row, which picks its colours. */
  index: number;
  onPress: () => void;
  isSaved: boolean;
  onToggleSaved: () => void;
  inGrid: boolean;
}) {
  const accent = ORGANIZER_ACCENTS[index % ORGANIZER_ACCENTS.length];
  const shadeId = `organizerShade-${item.id}`;
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
    <PressableScale
      containerStyle={inGrid ? s.cardInGrid : undefined}
      style={[s.card, inGrid && s.cardFill]}
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
        {/* A soft fade at the foot of the photo, under the logo. */}
        <View style={s.coverShade} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0.45" stopColor="#0b0f24" stopOpacity={0} />
                <Stop offset="1" stopColor="#0b0f24" stopOpacity={0.45} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${shadeId})`} />
          </Svg>
        </View>

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
            color={isSaved ? '#ff5a7a' : '#ffffff'}
          />
        </TouchableOpacity>

        {/* The logo in a ring of the card's own gradient. */}
        <View style={s.logoRing}>
          <GradientFill colors={accent.gradient} direction="diagonal" />
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
      </View>

      <View style={s.body}>
        <View style={s.nameRow}>
          {/* Their own name, as they wrote it. */}
          <EventlyText variant="body" style={s.name} numberOfLines={1}>
            {item.name}
          </EventlyText>
          {item.verified ? (
            <EventlyIcon name="check-decagram" size={15} color="#3b82f6" />
          ) : null}
        </View>

        {/* Where they are, then how they are rated — one line each. The
            tick beside the name is the "verified" mark, so the photo does not
            repeat it. */}
        {item.locationLabel ? (
          <View style={s.locationRow}>
            <EventlyIcon name="map-marker" size={13} color={accent.gradient[1]} />
            <EventlyText variant="caption" style={s.location} numberOfLines={1}>
              {item.locationLabel}
            </EventlyText>
          </View>
        ) : null}

        {/* A score with no reviews behind it is not a rating. */}
        {item.reviews > 0 ? (
          <View style={s.ratingLine}>
            <View style={s.ratingPill}>
              <EventlyIcon name="star" size={12} color="#e8a33a" />
              <EventlyText variant="caption" style={s.rating}>
                {item.rating.toFixed(1)}
              </EventlyText>
            </View>
            <EventlyText variant="caption" style={s.reviews}>
              {`(${item.reviews})`}
            </EventlyText>
          </View>
        ) : (
          <EventlyText variant="caption" style={s.reviews}>
            No reviews yet
          </EventlyText>
        )}

        {item.tags.length > 0 ? (
          <View style={s.tagRow}>
            {item.tags.slice(0, 2).map((tag, t) => {
              const [bg, fg] = accent.tags[t % accent.tags.length];
              return (
                <View key={tag} style={[s.tag, { backgroundColor: bg }]}>
                  <EventlyText
                    variant="caption"
                    style={[s.tagText, { color: fg }]}
                    numberOfLines={1}
                  >
                    {tag}
                  </EventlyText>
                </View>
              );
            })}
          </View>
        ) : null}

      </View>
    </PressableScale>
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

  const cards = data.items.map((item, index) => (
    <OrganizerCard
      key={item.id}
      item={item}
      index={index}
      inGrid={layout === 'grid'}
      isSaved={saved.includes(item.id)}
      onToggleSaved={() => toggleSaved(item.id)}
      onPress={() => onPressOrganizer(item.id)}
    />
  ));

  return (
    <View>
      <SectionHead
        tone={SECTION_TONE_GRADIENT.organizers}
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
