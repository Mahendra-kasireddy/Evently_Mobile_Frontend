import { useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  EventlyIcon,
  EventlyImage,
  EventlyText,
  GradientFill,
  OccasionArt,
  PressableScale,
} from '../../../Components';
import { CATEGORY_GRADIENT, SECTION_TONE_GRADIENT } from '../constants';
import { PACKAGE_STACK_RATIO, packageCardStyles as s } from '../styles';
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
  /** The card's width; its height follows, in the poster's proportion. */
  width: number;
  onPress: () => void;
  saved: boolean;
  onToggleSaved: () => void;
}

/**
 * A badge's colours, read off its words: a gradient for the pill and the
 * arrow, and an icon. Each kind of pick looks like itself across the row.
 */
function badgeTone(badge: string): { gradient: [string, string]; icon: string } {
  const b = badge.toLowerCase();
  if (/budget|save|afford/.test(b)) {
    return { gradient: ['#ff8a5c', '#e8433a'], icon: 'crown-outline' };
  }
  if (/book|popular|trend|loved/.test(b)) {
    return { gradient: ['#a084ff', '#5a35e0'], icon: 'fire' };
  }
  if (/value|best|deal/.test(b)) {
    return { gradient: ['#3cc9a1', '#0e8a68'], icon: 'check-decagram' };
  }
  if (/lux|premium|royal/.test(b)) {
    return { gradient: ['#f5c35b', '#c98a12'], icon: 'diamond-stone' };
  }
  return { gradient: ['#5b9bff', '#2554b8'], icon: 'star-four-points-outline' };
}

/** A glyph for what a package includes, read off the tag's words. */
function featureIcon(tag: string): string {
  const t = tag.toLowerCase();
  if (/food|cater|dine|menu|buffet|cake/.test(t)) return 'silverware-fork-knife';
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

/**
 * One package, as a tall photo card.
 *
 * The picture is the card; the words sit on a dark wash rising from the
 * bottom, so white text reads on any photo. What it costs is the largest
 * thing on it, and what it includes reads as a row of glass chips.
 */
function PackageCard({
  item,
  width,
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
  const shadeId = `packageShade-${item.id}`;
  const tone = badgeTone(item.badge);
  /* What the package is like, or failing that who runs it. */
  const subtitle = item.bannerNote || item.organizer?.name || '';
  const features = [
    ...item.tags.slice(0, 2).map(tag => ({ icon: featureIcon(tag), label: tag })),
    ...(item.guests
      ? [{ icon: 'account-group-outline', label: guestsFeature(item.guests) }]
      : []),
  ];

  return (
    <View style={[s.card, { width, height: Math.round(width * 1.22) }]}>
      {/*
        The whole card is one control, so there is one tap target and one
        accessible name. The heart is its sibling rather than a child: nesting
        it would make keeping a package and opening it the same gesture.
      */}
      <PressableScale
        containerStyle={s.pressArea}
        style={s.press}
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
        {/* A real photo when the package has one; otherwise the occasion's
            own illustration over its gradient, never a broken frame. */}
        {item.photoUrl ? (
          <EventlyImage
            source={{ uri: item.photoUrl }}
            style={s.fill}
            resizeMode="cover"
          />
        ) : (
          <>
            <View style={s.fill}>
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
            <View style={s.art} pointerEvents="none">
              <OccasionArt art={item.art} />
            </View>
          </>
        )}

        {/* The dark wash the words sit on: clear at the top, deep at the foot. */}
        <View style={s.fill} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#0b0f24" stopOpacity={0.05} />
                <Stop offset="0.45" stopColor="#0b0f24" stopOpacity={0.08} />
                <Stop offset="1" stopColor="#0b0f24" stopOpacity={0.78} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${shadeId})`} />
          </Svg>
        </View>

        {/* A frosted badge, its icon on the pick's own gradient. */}
        {item.badge ? (
          <View style={s.badge}>
            <View style={s.badgeIcon}>
              <GradientFill colors={tone.gradient} direction="diagonal" />
              <EventlyIcon name={tone.icon} size={11} color="#ffffff" />
            </View>
            <EventlyText variant="caption" style={s.badgeText} numberOfLines={1}>
              {item.badge}
            </EventlyText>
          </View>
        ) : null}

        <View style={s.content}>
          <EventlyText variant="h2" style={s.title} numberOfLines={2}>
            {item.title}
          </EventlyText>
          {subtitle ? (
            <EventlyText variant="caption" style={s.subtitle} numberOfLines={1}>
              {subtitle}
            </EventlyText>
          ) : null}

          {/* What it includes, as one line: "Decor • Cake • 50–100 guests". */}
          {features.length > 0 ? (
            <EventlyText variant="caption" style={s.meta} numberOfLines={1}>
              {features.map(f => f.label).join('  •  ')}
            </EventlyText>
          ) : null}

          <View style={s.priceLine}>
            <EventlyText variant="caption" style={s.priceCaption}>
              Starting at
            </EventlyText>
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

          {/* Drawn as a button, pressed as part of the card. The square beside
              it is the heart, a control of its own (below). */}
          <View style={s.cta}>
            <EventlyIcon name="arrow-right-circle" size={16} color="#ffffff" />
            <EventlyText variant="body" style={s.ctaText}>
              View Package
            </EventlyText>
          </View>
        </View>
      </PressableScale>

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
          color={saved ? '#ff5a7a' : '#ffffff'}
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
/**
 * The packages on offer, as a carousel.
 *
 * The card in front is full size; its neighbours peek out on either side,
 * smaller and dimmer, so the row reads as a deck to flip through. Every figure on a card is read
 * live: the price and any reduction from the package, the rest from the
 * organizer who delivers it.
 */
export function Packages({
  data,
  onPressPackage,
  onPressSeeAll,
  savedIds,
  onToggleSaved,
}: PackagesProps) {
  const { width: screen } = useWindowDimensions();
  const item = Math.round(screen * PACKAGE_STACK_RATIO);
  const side = Math.round((screen - item) / 2);
  /*
   * Open on the second card when there are three or more, so the row starts
   * the way it is meant to be seen — a card in front with one peeking out on
   * each side — instead of with an empty space on the left.
   */
  const startIndex = data.items.length >= 3 ? 1 : 0;
  const scrollX = useRef(new Animated.Value(startIndex * item)).current;

  /*
   * Driven on the native thread and nothing else: no state is set while the
   * row moves. Re-rendering mid-swipe — to restack the cards — is what made
   * the row jump back to the left on its own.
   */
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true },
  );

  return (
    <View>
      {/* No strapline. "Pre-matched bundles to kick-start your planning" is a
          sentence about the cards, sitting above cards that show what they
          are — and it cost a line of the fold to say it. */}
      <SectionHead
        tone={SECTION_TONE_GRADIENT.packages}
        title={data.title}
        actionLabel="See all"
        onPressAction={onPressSeeAll}
      />
      <Animated.FlatList
          data={data.items}
          keyExtractor={pkg => pkg.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[s.stackList, { paddingHorizontal: side }]}
          snapToInterval={item}
          initialScrollIndex={startIndex}
          /* Every card is the same width, so where any of them sits is known
             without measuring — which is what lets the row open mid-way. */
          getItemLayout={(_, index) => ({ length: item, offset: item * index, index })}
          decelerationRate="fast"
          disableIntervalMomentum
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item: pkg, index }) => {
            /* Where this card stands relative to the one in front: 0 in
               front, ±1 beside it, ±2 behind that. */
            const at = [index - 2, index - 1, index, index + 1, index + 2].map(n => n * item);
            /* The neighbours step back — smaller and dimmer — and are drawn
               a little toward the front card, but never over it: they meet
               it with a small gap, so no card has to be restacked. */
            const scale = scrollX.interpolate({
              inputRange: at,
              outputRange: [0.82, 0.9, 1, 0.9, 0.82],
              extrapolate: 'clamp',
            });
            const translateX = scrollX.interpolate({
              inputRange: at,
              outputRange: [-item * 0.1, -item * 0.03, 0, item * 0.03, item * 0.1],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange: at,
              outputRange: [0.5, 0.8, 1, 0.8, 0.5],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                style={{ width: item, opacity, transform: [{ translateX }, { scale }] }}
              >
                <PackageCard
                  item={pkg}
                  width={item}
                  onPress={() => onPressPackage(pkg)}
                  saved={savedIds.includes(pkg.id)}
                  onToggleSaved={() => onToggleSaved(pkg.id)}
                />
              </Animated.View>
            );
          }}
        />
    </View>
  );
}

export default Packages;
