import { View } from 'react-native';
import { EventlyIcon, EventlyText, PressableScale } from '../../../Components';
import { GUEST_COPY as COPY } from '../constants';
import { rowStyles as s } from '../styles';
import type { GuestRowViewModel, GuestStatus } from '../types';

interface GuestRowProps {
  guest: GuestRowViewModel;
  onEdit: () => void;
}

/** Each status's words and colours — the one thing a host scans this list for. */
const STATUS: Record<
  GuestStatus,
  { label: string; icon: string; ink: string; wash: string }
> = {
  new: {
    label: COPY.statusNew,
    icon: 'clock-outline',
    ink: '#7a7488',
    wash: '#f2f0f5',
  },
  invited: {
    label: COPY.statusInvited,
    icon: 'send-check-outline',
    ink: '#2f6fe0',
    wash: '#eaf1ff',
  },
  opened: {
    label: COPY.statusOpened,
    icon: 'eye-check-outline',
    ink: '#13744f',
    wash: '#e7f6ee',
  },
};

/**
 * One guest: who, their number, and where they are with the invitation.
 *
 * The whole row opens the edit sheet — a host corrects a name by tapping the
 * name. The monogram's colour comes from the name, so it is the same every
 * time the list opens.
 */
export function GuestRow({ guest, onEdit }: GuestRowProps) {
  const st = STATUS[guest.status ?? 'new'];
  return (
    <PressableScale
      style={s.card}
      onPress={onEdit}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${guest.name}`}
    >
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

      <View style={[s.status, { backgroundColor: st.wash }]}>
        <EventlyIcon name={st.icon} size={13} color={st.ink} />
        <EventlyText style={[s.statusText, { color: st.ink }]}>
          {st.label}
        </EventlyText>
      </View>
    </PressableScale>
  );
}

export default GuestRow;
