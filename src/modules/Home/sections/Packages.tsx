import { FlatList, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  EventlyIcon,
  EventlyImage,
  EventlyText,
  OccasionArt,
} from '../../../Components';
import { CATEGORY_GRADIENT, HERO_ACCENT_COLOR, HOME_NAVY } from '../constants';
import { packageCardStyles as s } from '../styles';
import { SectionHead } from './SectionHead';
import type { PackageItem, PackagesViewModel } from '../types';

interface PackagesProps {
  data: PackagesViewModel;
  /** Opens the planner for this package's occasion. */
  onPressPackage: (item: PackageItem) => void;
  /** "See all" — the search screen, filtered to packages. */
  onPressSeeAll: () => void;
  /** Ids the account has kept, so each heart shows its own state. */
  savedIds: string[];
  onToggleSaved: (packageId: string) => void;
}

interface PackageCardProps {
  item: PackageItem;
  onPress: () => void;
  saved: boolean;
  onToggleSaved: () => void;
}

function PackageCard({
  item,
  onPress,
  saved,
  onToggleSaved,
}: PackageCardProps) {
  const [start, end] = CATEGORY_GRADIENT[item.art];
  /*
   * SVG ids are global to the document, so a shared id would make every card
   * on the screen paint whichever gradient rendered last. Scoped per package.
   */
  const gradientId = `packageBanner-${item.id}`;
  const rating =
    item.organizer && item.organizer.reviews > 0 ? item.organizer : null;

  return (
    <View style={s.card}>
      {/*
        The whole card is one control — banner and body together — so there is
        one tap target and one accessible name. The heart is its sibling rather
        than a child: nesting it would make keeping a package and opening it
        the same gesture, which is how people lose the thing they meant to save.
      */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={[
          item.title,
          item.organizer?.name,
          item.priceLabel || item.budget,
          item.guests,
        ]
          .filter(Boolean)
          .join(', ')}
      >
        <View style={s.banner}>
          {/* A real photo when the package has one; otherwise the occasion's
              own illustration over its gradient, never a broken frame. */}
          {item.photoUrl ? (
            <EventlyImage
              source={{ uri: item.photoUrl }}
              style={s.bannerLayer}
              resizeMode="cover"
            />
          ) : (
            <>
              <View style={s.bannerLayer}>
                <Svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <Defs>
                    <LinearGradient
                      id={gradientId}
                      x1="20%"
                      y1="0%"
                      x2="80%"
                      y2="100%"
                    >
                      <Stop offset="0" stopColor={start} />
                      <Stop offset="1" stopColor={end} />
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
              <View style={s.bannerArt} pointerEvents="none">
                <OccasionArt art={item.art} />
              </View>
            </>
          )}

          {item.badge ? (
            <View style={s.badge}>
              <EventlyText
                variant="caption"
                style={s.badgeText}
                numberOfLines={1}
              >
                {item.badge.toUpperCase()}
              </EventlyText>
            </View>
          ) : null}

          {item.bannerNote ? (
            <EventlyText
              variant="caption"
              style={s.bannerNote}
              numberOfLines={1}
            >
              {item.bannerNote}
            </EventlyText>
          ) : null}
        </View>

        <View style={s.body}>
          <EventlyText variant="subtitle" style={s.title} numberOfLines={2}>
            {item.title}
          </EventlyText>
          {item.organizer ? (
            <EventlyText
              variant="caption"
              style={s.organizer}
              numberOfLines={1}
            >
              {item.organizer.name}
            </EventlyText>
          ) : null}

          {/* A score with no reviews behind it is not a rating. */}
          {rating ? (
            <View style={s.ratingRow}>
              <EventlyIcon name="star" size={15} color="#e8a33a" />
              <EventlyText variant="caption" style={s.rating}>
                {rating.rating.toFixed(1)}
              </EventlyText>
              <EventlyText variant="caption" style={s.reviews}>
                {`(${rating.reviews})`}
              </EventlyText>
            </View>
          ) : null}

          <View style={s.priceRow}>
            <EventlyText variant="h2" style={s.price}>
              {item.priceLabel || item.budget}
            </EventlyText>
            {/* Only a genuine reduction; the server refuses a "was" figure
                that is not above the current price. */}
            {item.listPriceLabel ? (
              <EventlyText variant="caption" style={s.listPrice}>
                {item.listPriceLabel}
              </EventlyText>
            ) : null}
          </View>

          {item.organizer?.bookedLabel ? (
            <EventlyText variant="caption" style={s.booked}>
              {item.organizer.bookedLabel}
            </EventlyText>
          ) : null}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.heart}
        activeOpacity={0.8}
        onPress={onToggleSaved}
        accessibilityRole="button"
        accessibilityState={{ selected: saved }}
        accessibilityLabel={`${saved ? 'Remove' : 'Save'} ${item.title}${
          saved ? ' from' : ' to'
        } your saved packages`}
      >
        <EventlyIcon
          name={saved ? 'heart' : 'heart-outline'}
          size={18}
          color={saved ? HERO_ACCENT_COLOR : HOME_NAVY}
        />
      </TouchableOpacity>
    </View>
  );
}

/**
 * The packages on offer.
 *
 * Every figure on a card is read live: the price and any reduction from the
 * package itself, the rating, review count and recent bookings from the
 * organizer who delivers it. The "booked this month" line is that organizer's
 * — nothing links a booking back to the package that inspired it — which is
 * why it sits under their name rather than under the title.
 */
export function Packages({
  data,
  onPressPackage,
  onPressSeeAll,
  savedIds,
  onToggleSaved,
}: PackagesProps) {
  return (
    <View>
      <SectionHead
        title={data.title}
        subtitle={data.subtitle}
        actionLabel="See all"
        onPressAction={onPressSeeAll}
      />
      <FlatList
        data={data.items}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={PACKAGE_LIST_PADDING}
        renderItem={({ item }) => (
          <PackageCard
            item={item}
            onPress={() => onPressPackage(item)}
            saved={savedIds.includes(item.id)}
            onToggleSaved={() => onToggleSaved(item.id)}
          />
        )}
      />
    </View>
  );
}

const PACKAGE_LIST_PADDING = {
  paddingHorizontal: 16,
  paddingTop: 14,
  gap: 12,
} as const;

export default Packages;
