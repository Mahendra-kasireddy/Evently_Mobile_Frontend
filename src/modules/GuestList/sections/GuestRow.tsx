import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { GUEST_NAVY } from '../constants';
import { rowStyles as s } from '../styles';
import type { GuestRowViewModel } from '../types';

interface GuestRowProps {
  guest: GuestRowViewModel;
  onEdit: () => void;
}

/**
 * One guest.
 *
 * The monogram's colour comes from the name, so it is the same every time the
 * host opens the list — a colour that shuffled on each edit would make a row
 * harder to find again, which is the only job a monogram colour has.
 */
export function GuestRow({ guest, onEdit }: GuestRowProps) {
  return (
    <View style={s.card}>
      <View style={[s.avatar, { backgroundColor: guest.avatarColor }]}>
        <EventlyText variant="label" style={s.avatarText}>
          {guest.initials}
        </EventlyText>
      </View>

      <View style={s.text}>
        <EventlyText variant="cardTitle" style={s.name} numberOfLines={1}>
          {guest.name}
        </EventlyText>
        <EventlyText variant="small" style={s.meta} numberOfLines={1}>
          {guest.metaLine}
        </EventlyText>
      </View>

      <TouchableOpacity
        style={s.edit}
        activeOpacity={0.7}
        onPress={onEdit}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${guest.name}`}
      >
        <EventlyIcon name="pencil-outline" size={17} color={GUEST_NAVY} />
      </TouchableOpacity>
    </View>
  );
}

export default GuestRow;
