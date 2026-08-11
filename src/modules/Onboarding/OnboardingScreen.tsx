import { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyButton, EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { useAppDispatch } from '../../store/hooks';
import { setHasSeenOnboarding } from '../../store/onboardingSlice';
import { ONBOARDING_ACCENT, ONBOARDING_ACCENT_WARM, ONBOARDING_SLIDES } from './constants';
import { styles } from './styles';
import type { OnboardingSlide } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<OnboardingSlide>);

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList>;

function OnboardingSlideItem({ item, index, scrollX }: { item: OnboardingSlide; index: number; scrollX: Animated.Value }) {
  const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
  const opacity = scrollX.interpolate({ inputRange, outputRange: [0.25, 1, 0.25], extrapolate: 'clamp' });
  const scale = scrollX.interpolate({ inputRange, outputRange: [0.82, 1, 0.82], extrapolate: 'clamp' });
  const translateY = scrollX.interpolate({ inputRange, outputRange: [18, 0, 18], extrapolate: 'clamp' });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.iconCircle, { opacity, transform: [{ scale }] }]}>
        <EventlyIcon name={item.icon} size={40} color={ONBOARDING_ACCENT_WARM} />
      </Animated.View>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <EventlyText variant="h1" style={styles.heading}>
          {item.heading}
        </EventlyText>
        <EventlyText variant="body" style={styles.subtitle}>
          {item.subtitle}
        </EventlyText>
      </Animated.View>
    </View>
  );
}

function OnboardingDot({ index, scrollX }: { index: number; scrollX: Animated.Value }) {
  const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
  const width = scrollX.interpolate({ inputRange, outputRange: [8, 22, 8], extrapolate: 'clamp' });
  const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });
  return <Animated.View style={[styles.dot, { width, opacity }]} />;
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
    navigation.replace('Login');
  };

  const goNext = () => {
    if (isLastSlide) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const width = event.nativeEvent.layoutMeasurement.width;
    if (!width) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(Math.min(Math.max(index, 0), ONBOARDING_SLIDES.length - 1));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.skipRow}>
        {isLastSlide ? null : (
          <TouchableOpacity onPress={finish} accessibilityLabel="Skip onboarding">
            <EventlyText variant="body" style={styles.skipText}>
              Skip
            </EventlyText>
          </TouchableOpacity>
        )}
      </View>

      <AnimatedFlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(slide: OnboardingSlide) => slide.key}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item, index }: { item: OnboardingSlide; index: number }) => (
          <OnboardingSlideItem item={item} index={index} scrollX={scrollX} />
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((slide, index) => (
            <OnboardingDot key={slide.key} index={index} scrollX={scrollX} />
          ))}
        </View>
        <EventlyButton
          title={isLastSlide ? 'Get started' : 'Next'}
          onPress={goNext}
          accentColor={ONBOARDING_ACCENT}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

export default OnboardingScreen;
