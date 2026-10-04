import { Pressable } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { BUSINESS_ENTRY_COPY } from '../constants';
import { AUTH_ACCENT, businessEntryStyles as s } from '../styles';

interface BusinessEntryCardProps {
  onPress: () => void;
}

/**
 * The single door to the organizer / sub-vendor side, as one quiet line.
 * Customers never need it, so it does not compete with "Send OTP".
 */
export function BusinessEntryCard({ onPress }: BusinessEntryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [s.link, pressed && { opacity: 0.6 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={BUSINESS_ENTRY_COPY.a11y}
      testID="business-entry-card"
    >
      <EventlyText variant="caption" style={s.lead}>
        {BUSINESS_ENTRY_COPY.lead}
      </EventlyText>
      <EventlyText variant="caption" style={s.action}>
        {BUSINESS_ENTRY_COPY.action}
      </EventlyText>
      <EventlyIcon name="chevron-right" size={16} color={AUTH_ACCENT} />
    </Pressable>
  );
}

export default BusinessEntryCard;
