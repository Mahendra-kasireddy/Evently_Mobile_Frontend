import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Confetti, EventlyIcon, EventlyText, OccasionArt } from '../../../Components';
import { CATEGORY_GRADIENT, CATEGORY_ICON_BADGE_COLOR, CATEGORY_ICON_NAME } from '../constants';
import {
  CATEGORY_ART_HEIGHT,
  CATEGORY_ART_WIDTH,
  CATEGORY_CARD_SPACING,
  CATEGORY_CARD_WIDTH,
  categoriesStyles,
} from '../styles';
import { colors } from '../../../theme';
import type { CategoriesViewModel, CategoryItem } from '../types';

const AUTO_SCROLL_INTERVAL_MS = 4000;
const SEE_ALL_LABEL = 'See all';
const CATEGORY_ITEM_STRIDE = CATEGORY_CARD_WIDTH + CATEGORY_CARD_SPACING;

interface CategoriesProps {
  data: CategoriesViewModel;
  onPressOccasion: (occasionId: string) => void;
}

interface CategoryCardProps {
  item: CategoryItem;
  onPress: () => void;
}

function CategoryCard({ item, onPress }: CategoryCardProps) {
  const [gradientStart, gradientEnd] = CATEGORY_GRADIENT[item.art];

  return (
    <TouchableOpacity
      style={categoriesStyles.card}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityLabel={`${item.label} — ${item.cta}`}
    >
      <View style={categoriesStyles.cardBackground}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="cardBg" x1="37%" y1="2%" x2="63%" y2="98%">
              <Stop offset="0" stopColor={gradientStart} />
              <Stop offset="1" stopColor={gradientEnd} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={100} height={100} fill="url(#cardBg)" />
        </Svg>
      </View>
      <View style={categoriesStyles.confettiLayer} pointerEvents="none">
        <Confetti />
      </View>
      <View style={categoriesStyles.artLayer} pointerEvents="none">
        <OccasionArt art={item.art} width={CATEGORY_ART_WIDTH} height={CATEGORY_ART_HEIGHT} />
      </View>
      <View style={categoriesStyles.iconBadge}>
        <EventlyIcon name={CATEGORY_ICON_NAME[item.icon]} size={16} color={CATEGORY_ICON_BADGE_COLOR} />
      </View>
      <View style={categoriesStyles.metaBlock}>
        <EventlyText variant="subtitle" style={categoriesStyles.label} numberOfLines={1}>
          {item.label}
        </EventlyText>
        <View style={categoriesStyles.ctaRow}>
          <EventlyText variant="caption" style={categoriesStyles.meta} numberOfLines={1}>
            {item.cta}
          </EventlyText>
          <EventlyIcon name="chevron-right" size={13} color={colors.onPrimaryMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function Categories({ data, onPressOccasion }: CategoriesProps) {
  const listRef = useRef<FlatList<CategoryItem>>(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [restartTick, setRestartTick] = useState(0);
  const itemCount = data.items.length;

  useEffect(() => {
    indexRef.current = 0;
    setActiveIndex(0);
  }, [itemCount]);

  useEffect(() => {
    if (itemCount <= 1) return undefined;

    const timer = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % itemCount;
      indexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      listRef.current?.scrollToOffset({ offset: nextIndex * CATEGORY_ITEM_STRIDE, animated: true });
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [itemCount, restartTick]);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.min(
      itemCount - 1,
      Math.max(0, Math.round(event.nativeEvent.contentOffset.x / CATEGORY_ITEM_STRIDE)),
    );
    indexRef.current = index;
    setActiveIndex(index);
    setRestartTick((tick) => tick + 1);
  };

  return (
    <View style={categoriesStyles.section}>
      <View style={categoriesStyles.header}>
        <EventlyText variant="h2" style={categoriesStyles.title}>
          {data.title}
        </EventlyText>
        <EventlyText variant="body" style={categoriesStyles.seeAll}>
          {SEE_ALL_LABEL}
        </EventlyText>
      </View>
      <FlatList
        ref={listRef}
        data={data.items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={categoriesStyles.list}
        renderItem={({ item }) => <CategoryCard item={item} onPress={() => onPressOccasion(item.id)} />}
        snapToInterval={CATEGORY_ITEM_STRIDE}
        snapToAlignment="start"
        disableIntervalMomentum
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({ length: CATEGORY_ITEM_STRIDE, offset: CATEGORY_ITEM_STRIDE * index, index })}
      />
      {itemCount > 1 ? (
        <View style={categoriesStyles.dots}>
          {data.items.map((item, index) => (
            <View key={item.id} style={[categoriesStyles.dot, index === activeIndex && categoriesStyles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default Categories;
