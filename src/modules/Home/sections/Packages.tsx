import { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Confetti, EventlyIcon, EventlyText, OccasionArt } from '../../../Components';
import { colors } from '../../../theme';
import { CATEGORY_GRADIENT, HERO_ACCENT_COLOR, PACKAGE_EXPLORE_CTA } from '../constants';
import { PACKAGE_SNAP_INTERVAL, packagesStyles as s } from '../styles';
import type { PackageItem, PackagesViewModel } from '../types';

interface PackagesProps {
  data: PackagesViewModel;
  /** Opens the planner for this package's occasion. */
  onPressPackage: (item: PackageItem) => void;
  /** "Build your own" — the planner, with nothing pre-set. */
  onPressBuildYourOwn: () => void;
}

function PackageCard({ item, onPress }: { item: PackageItem; onPress: () => void }) {
  const [gradientStart, gradientEnd] = CATEGORY_GRADIENT[item.art];
  /*
   * SVG ids are global to the document, so a shared id would make every card
   * on the screen paint whichever gradient rendered last. Scoped per package.
   */
  const gradientId = `packageBanner-${item.id}`;

  return (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.budget}, ${item.guests}. ${PACKAGE_EXPLORE_CTA}.`}
    >
      <View style={s.banner}>
        <View style={s.bannerLayer}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id={gradientId} x1="37%" y1="2%" x2="63%" y2="98%">
                <Stop offset="0" stopColor={gradientStart} />
                <Stop offset="1" stopColor={gradientEnd} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={100} height={100} fill={`url(#${gradientId})`} />
          </Svg>
        </View>
        <View style={[s.bannerLayer, s.bannerConfetti]} pointerEvents="none">
          <Confetti />
        </View>
        <View style={s.bannerArt} pointerEvents="none">
          <OccasionArt art={item.art} />
        </View>
        <View style={s.badge}>
          <EventlyText variant="caption" style={s.badgeText}>
            {item.badge}
          </EventlyText>
        </View>
      </View>

      <View style={s.body}>
        <View style={s.titleRow}>
          <EventlyText variant="h2" style={s.packageTitle} numberOfLines={2}>
            {item.title}
          </EventlyText>
          <EventlyText variant="body" style={s.guests} numberOfLines={1}>
            {item.guests}
          </EventlyText>
        </View>

        <EventlyText variant="h2" style={s.budget}>
          {item.budget}
        </EventlyText>

        {item.tags.length > 0 ? (
          <View style={s.tagRow}>
            {item.tags.map((tag) => (
              <EventlyText key={tag} variant="body" style={s.tag}>
                {tag}
              </EventlyText>
            ))}
          </View>
        ) : null}

        <View style={s.explore}>
          <EventlyIcon name="chevron-right" size={18} color={colors.onPrimary} />
          <EventlyText variant="subtitle" style={s.exploreText}>
            {PACKAGE_EXPLORE_CTA}
          </EventlyText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Home's curated packages.
 *
 * Every package comes from the home feed's `packages` collection, including
 * the `art` key that picks its banner gradient and illustration — mobile was
 * dropping that field, which is why these cards had no banner at all.
 *
 * The whole card is one control: "Explore package" is presentational, so there
 * is a single tap target with one accessible name, as on the booked card.
 */
export function Packages({ data, onPressPackage, onPressBuildYourOwn }: PackagesProps) {
  const [active, setActive] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / PACKAGE_SNAP_INTERVAL);
    // Clamped: an overscroll bounce at either end would otherwise light up a
    // dot that does not exist.
    const clamped = Math.min(data.items.length - 1, Math.max(0, index));
    if (clamped !== active) setActive(clamped);
  };

  return (
    <View style={s.section}>
      <View style={s.header}>
        <View style={s.headText}>
          <EventlyText variant="h2" style={s.title}>
            {data.title}
          </EventlyText>
          {data.subtitle ? (
            <EventlyText variant="body" style={s.subtitle}>
              {data.subtitle}
            </EventlyText>
          ) : null}
        </View>
        {data.buildLabel ? (
          <TouchableOpacity
            style={s.buildButton}
            activeOpacity={0.7}
            onPress={onPressBuildYourOwn}
            accessibilityRole="button"
          >
            <EventlyText variant="subtitle" style={s.buildText}>
              {data.buildLabel}
            </EventlyText>
            <EventlyIcon name="chevron-right" size={16} color={HERO_ACCENT_COLOR} />
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={data.items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        // Snapping to one card width keeps a package centred instead of
        // leaving the row halfway between two.
        snapToInterval={PACKAGE_SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => <PackageCard item={item} onPress={() => onPressPackage(item)} />}
      />

      {data.items.length > 1 ? (
        <View style={s.dots}>
          {data.items.map((item, i) => (
            <View key={item.id} style={[s.dot, i === active && s.dotOn]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default Packages;
