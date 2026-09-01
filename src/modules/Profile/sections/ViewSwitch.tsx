import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { PROFILE_ACCENT, PROFILE_COPY as COPY } from '../constants';
import { viewSwitchStyles as s } from '../styles';

interface ViewSwitchProps {
  isOrganizerView: boolean;
  onPress: () => void;
}

/**
 * Switching between the customer app and the organizer dashboard.
 *
 * Given its own card rather than a menu row: every other row goes somewhere,
 * while this changes what the whole app is — and it is offered only to
 * accounts that actually hold both roles.
 */
export function ViewSwitch({ isOrganizerView, onPress }: ViewSwitchProps) {
  return (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={isOrganizerView ? COPY.switchToCustomer : COPY.switchToOrganizer}
    >
      <View style={s.iconBadge}>
        <EventlyIcon
          name={isOrganizerView ? 'home-outline' : 'briefcase-outline'}
          size={20}
          color={colors.onPrimary}
        />
      </View>
      <View style={s.text}>
        <EventlyText variant="body" style={s.label}>
          {isOrganizerView ? COPY.switchToCustomer : COPY.switchToOrganizer}
        </EventlyText>
        <EventlyText variant="caption" style={s.hint}>
          {COPY.switchHint}
        </EventlyText>
      </View>
      <EventlyIcon name="swap-horizontal" size={20} color={PROFILE_ACCENT} />
    </TouchableOpacity>
  );
}

export default ViewSwitch;
