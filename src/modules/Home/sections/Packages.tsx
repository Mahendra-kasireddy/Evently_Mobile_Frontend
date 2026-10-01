import { FlatList, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  EventlyIcon,
  EventlyImage,
  EventlyText,
  OccasionArt,
} from '../../../Components';
import { CATEGORY_GRADIENT, HERO_ACCENT_COLOR, HOME_NAVY } from '../constants';
import { colors } from '../../../theme';
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

/** Colours per badge, read off its words: the pill and the arrow share them. */
function badgeTint(badge: string): { bg: string; fg: string; icon: string } {
  const b = badge.toLowerCase();
  if (/budget|save|afford/.test(b)) {
    return { bg: '#e8633a', fg: '#ffffff', icon: 'crown-outline' };
  }
  if (/book|popular|trend|loved/.test(b)) {
    return { bg: '#8b5cf6', fg: '#ffffff', icon: 'fire' };
  }
  if (/value|best|deal/.test(b)) {
    return { bg: '#1d9e75', fg: '#ffffff', icon: 'check-decagram' };
  }
  return { bg: HOME_NAVY, fg: '#ffffff', icon: 'star-outline' };
}

/** A glyph for what a package includes, read off the tag's words. */
function featureIcon(tag: string): string {
  const t = tag.toLowerCase();
  if (/food|cater|dine|menu|buffet/.test(t)) return 'silverware-fork-knife';
  if (/decor|flower|stage|floral/.test(t)) return 'palette-outline';
  if (/photo|video|camera/.test(t)) return 'camera-outline';
  if (/music|dj|band|sound|entertain/.test(t)) return 'music-note-outline';
  if (/venue|hall|resort/.test(t)) return 'home-city-outline';
  if (/invit|card/.test(t)) return 'email-outline';
  return 'check-circle-outline';
}

/** "150" -> "150+ guests"; "100+ guests" left as written. */
function guestsFeature(guests: string): string {
  const g = guests.trim();
  if (!g) return '';
  return /guest/i.test(g) ? g : `${g}+ guests`;
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
  const tint = badgeTint(item.badge);
  /* The line under the title: what the package is like, or failing that who
     runs it. */
  const subtitle = item.bannerNote || item.organizer?.name || '';
  const features = [
    ...item.tags
      .slice(0, 2)
      .map(tag => ({ icon: featureIcon(tag), label: tag })),
    ...(item.guests
      ? [{ icon: 'account-group-outline', label: guestsFeature(item.guests) }]
      : []),
  ];

  return (
    <View style={s.card}>
      {/*
        The whole card is one control — photo and body together — so there is
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
          subtitle,
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
              <View style={[s.badgeIcon, { backgroundColor: tint.bg }]}>
                <EventlyIcon name={tint.icon} size={10} color={tint.fg} />
              </View>
              <EventlyText
                variant="caption"
                style={[s.badgeText, { color: tint.bg }]}
                numberOfLines={1}
              >
                {item.badge}
              </EventlyText>
            </View>
          ) : null}
        </View>

        <View style={s.body}>
          <View style={s.titleRow}>
            <View style={s.titleCol}>
              <EventlyText variant="subtitle" style={s.title} numberOfLines={1}>
                {item.title}
              </EventlyText>
              {subtitle ? (
                <EventlyText
                  variant="caption"
                  style={s.subtitle}
                  numberOfLines={1}
                >
                  {subtitle}
                </EventlyText>
              ) : null}
            </View>
            {/* Drawn as a button, pressed as part of the card. */}
            <View style={[s.arrow, { backgroundColor: tint.bg }]}>
              <EventlyIcon name="chevron-right" size={20} color={tint.fg} />
            </View>
          </View>

          <View style={s.priceRow}>
            <EventlyText variant="h2" style={s.price} numberOfLines={1}>
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

          {features.length > 0 ? (
            <View style={s.features}>
              {features.map(feature => (
                <View key={feature.label} style={s.feature}>
                  <EventlyIcon
                    name={feature.icon}
                    size={16}
                    color={HOME_NAVY}
                  />
                  <EventlyText
                    variant="caption"
                    style={s.featureText}
                    numberOfLines={2}
                  >
                    {feature.label}
                  </EventlyText>
                </View>
              ))}
            </View>
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
          color={saved ? HERO_ACCENT_COLOR : colors.onPrimary}
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
      {/* No strapline. "Pre-matched bundles to kick-start your planning" is a
          sentence about the cards, sitting above cards that show what they
          are — and it cost a line of the fold to say it. */}
      <SectionHead
        title={data.title}
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
