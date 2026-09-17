import { Pressable, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { brand } from '../../../theme';
import { BUSINESS_ENTRY_COPY } from '../constants';
import { businessEntryStyles } from '../styles';

interface BusinessEntryCardProps {
  onPress: () => void;
}

/** The single door to the organizer / sub-vendor side. Customers never need it. */
export function BusinessEntryCard({ onPress }: BusinessEntryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        businessEntryStyles.card,
        pressed && businessEntryStyles.cardPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${BUSINESS_ENTRY_COPY.title}. ${BUSINESS_ENTRY_COPY.body}`}
      testID="business-entry-card"
    >
      <View style={businessEntryStyles.iconTile}>
        <EventlyIcon
          name="briefcase-outline"
          size={19}
          color={brand.accentDeep}
        />
      </View>

      <View style={businessEntryStyles.textBlock}>
        <EventlyText variant="subtitle" style={businessEntryStyles.title}>
          {BUSINESS_ENTRY_COPY.title}
        </EventlyText>
        <EventlyText variant="caption" style={businessEntryStyles.body}>
          {BUSINESS_ENTRY_COPY.body}
        </EventlyText>
      </View>

      <EventlyIcon name="chevron-right" size={20} color={brand.accent} />
    </Pressable>
  );
}

export default BusinessEntryCard;
