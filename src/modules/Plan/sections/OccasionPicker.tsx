import { ScrollView, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  Confetti,
  EventlyIcon,
  EventlyText,
  OccasionArt,
} from '../../../Components';
import { OCCASION_GRADIENT, PLAN_NAVY } from '../constants';
import { occasionPickerStyles } from '../styles';
import { colors } from '../../../theme';
import type { OccasionOption } from '../utils';

interface OccasionPickerProps {
  occasions: OccasionOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

interface OccasionCardProps {
  occasion: OccasionOption;
  isSelected: boolean;
  onPress: () => void;
}

function OccasionCard({ occasion, isSelected, onPress }: OccasionCardProps) {
  const [gradientStart, gradientEnd] = OCCASION_GRADIENT[occasion.art];

  return (
    <TouchableOpacity
      style={[
        occasionPickerStyles.card,
        isSelected && occasionPickerStyles.cardSelected,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={occasion.label}
    >
      <View style={occasionPickerStyles.cardBackground}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient id="occasionBg" x1="37%" y1="2%" x2="63%" y2="98%">
              <Stop offset="0" stopColor={gradientStart} />
              <Stop offset="1" stopColor={gradientEnd} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={100} height={100} fill="url(#occasionBg)" />
        </Svg>
      </View>
      <View style={occasionPickerStyles.artLayer} pointerEvents="none">
        <Confetti />
        <OccasionArt art={occasion.art} />
      </View>
      <View style={occasionPickerStyles.iconBadge}>
        <EventlyIcon name={occasion.icon} size={12} color={PLAN_NAVY} />
      </View>
      {isSelected ? (
        <View style={occasionPickerStyles.check}>
          <EventlyIcon name="check" size={11} color={colors.onPrimary} />
        </View>
      ) : null}
      <EventlyText
        variant="caption"
        style={occasionPickerStyles.label}
        numberOfLines={1}
      >
        {occasion.label}
      </EventlyText>
    </TouchableOpacity>
  );
}

/**
 * The occasions, one row deep.
 *
 * It used to wrap into a grid, which put two rows of tall tiles above the form
 * and pushed the first question below the fold. A single scrolling row keeps
 * the whole picker inside one band and lets the fields start where a customer
 * is still looking — the occasion is usually already chosen anyway, since Home
 * passes one in.
 */
export function OccasionPicker({
  occasions,
  selectedId,
  onSelect,
}: OccasionPickerProps) {
  return (
    <View style={occasionPickerStyles.section}>
      <EventlyText variant="subtitle" style={occasionPickerStyles.sectionTitle}>
        What are we celebrating?
      </EventlyText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={occasionPickerStyles.gridContent}
      >
        {occasions.map(occasion => (
          <OccasionCard
            key={occasion.id}
            occasion={occasion}
            isSelected={occasion.id === selectedId}
            onPress={() => onSelect(occasion.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default OccasionPicker;
