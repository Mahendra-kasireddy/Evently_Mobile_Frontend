import { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { useAppDispatch } from '../../store/hooks';
import { setHasSeenOnboarding } from '../../store/onboardingSlice';
import { ONBOARDING_BUTTON, ONBOARDING_SLIDES } from './constants';
import { styles } from './styles';
import type { OnboardingArt, OnboardingSlide } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<OnboardingSlide>,
);

const WEDDING = require('../../assets/images/MrandMrs.jpg');
const BIRTHDAY = require('../../assets/images/login_hero_birthday.jpg');

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/** Small sparkles scattered around a picture. */
function Sparkles() {
  return (
    <>
      <View style={[styles.spark, styles.sparkA]}>
        <EventlyIcon name="star-four-points" size={16} color="#f5b942" />
      </View>
      <View style={[styles.spark, styles.sparkB]}>
        <EventlyIcon name="star-four-points" size={11} color="#ff6f9c" />
      </View>
      <View style={[styles.spark, styles.sparkC]}>
        <EventlyIcon name="star-four-points" size={12} color="#8a6dff" />
      </View>
    </>
  );
}

/** What floats around each slide's picture. */
function ArtExtras({ art }: { art: OnboardingArt }) {
  if (art === 'discover') {
    return (
      <>
        {/* Two event photos pinned behind her, tilted like cards. */}
        <View style={[styles.photoCard, styles.photoLeft]}>
          <Image source={WEDDING} style={styles.photoImg} />
          <View style={styles.photoHeart}>
            <EventlyIcon name="heart" size={11} color="#ff4f7a" />
          </View>
        </View>
        <View style={[styles.photoCard, styles.photoRight]}>
          <Image source={BIRTHDAY} style={styles.photoImg} />
        </View>
        <View style={[styles.bubble, styles.bubblePin]}>
          <EventlyIcon name="map-marker" size={16} color="#f0603a" />
        </View>
        <View style={[styles.bubble, styles.bubbleHeart]}>
          <EventlyIcon name="heart" size={14} color="#ff4f7a" />
        </View>
        <Sparkles />
      </>
    );
  }
  return <Sparkles />;
}

function OnboardingSlideItem({
  item,
  index,
  scrollX,
}: {
  item: OnboardingSlide;
  index: number;
  scrollX: Animated.Value;
}) {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.85, 1, 0.85],
    extrapolate: 'clamp',
  });
  // The picture drifts a little slower than the page, for depth.
  const drift = scrollX.interpolate({
    inputRange,
    outputRange: [SCREEN_WIDTH * 0.25, 0, -SCREEN_WIDTH * 0.25],
    extrapolate: 'clamp',
  });
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [24, 0, 24],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.slide}>
      <Animated.View
        style={[
          styles.artStage,
          { opacity, transform: [{ translateX: drift }, { scale }] },
        ]}
      >
        <View style={[styles.glow, { backgroundColor: item.glow }]} />
        <View style={[styles.glowRing, { borderColor: item.glow }]} />
        <ArtExtras art={item.art} />
        <Image
          source={item.image}
          style={[
            styles.artImage,
            item.art === 'discover' && styles.artImageTall,
          ]}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[styles.copy, { opacity, transform: [{ translateY }] }]}
      >
        <AppText style={styles.heading} accessibilityRole="header">
          {item.heading}
        </AppText>
        <AppText style={styles.subtitle}>{item.subtitle}</AppText>
      </Animated.View>
    </View>
  );
}

function OnboardingDot({
  index,
  scrollX,
}: {
  index: number;
  scrollX: Animated.Value;
}) {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];
  const width = scrollX.interpolate({
    inputRange,
    outputRange: [8, 24, 8],
    extrapolate: 'clamp',
  });
  const active = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View style={[styles.dot, { width }]}>
      <Animated.View style={[styles.dotFill, { opacity: active }]}>
        <GradientFill colors={ONBOARDING_BUTTON} direction="across" />
      </Animated.View>
    </Animated.View>
  );
}

export function OnboardingScreen() {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const dispatch = useAppDispatch();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;

  const finish = () => {
    dispatch(setHasSeenOnboarding());
    navigation.replace('UseChoice');
  };

  const goNext = () => {
    if (isLastSlide) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const width = event.nativeEvent.layoutMeasurement.width;
    if (!width) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(Math.min(Math.max(index, 0), ONBOARDING_SLIDES.length - 1));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {/* Soft corner washes, as on the splash and the choice screen. */}
      <View style={[styles.wash, styles.washTop]} pointerEvents="none" />
      <View style={[styles.wash, styles.washBottom]} pointerEvents="none" />

      <View style={styles.skipRow}>
        {isLastSlide ? null : (
          <TouchableOpacity
            onPress={finish}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
          >
            <AppText style={styles.skipText}>Skip</AppText>
          </TouchableOpacity>
        )}
      </View>

      <AnimatedFlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(slide: OnboardingSlide) => slide.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({
          item,
          index,
        }: {
          item: OnboardingSlide;
          index: number;
        }) => (
          <OnboardingSlideItem item={item} index={index} scrollX={scrollX} />
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((slide, index) => (
            <OnboardingDot key={slide.key} index={index} scrollX={scrollX} />
          ))}
        </View>
        <PressableScale
          style={styles.button}
          onPress={goNext}
          accessibilityRole="button"
          testID="onboarding-next"
        >
          <GradientFill colors={ONBOARDING_BUTTON} direction="across" />
          <AppText style={styles.buttonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </AppText>
          <EventlyIcon name="arrow-right" size={18} color="#ffffff" />
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

export default OnboardingScreen;
