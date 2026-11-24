import { View } from 'react-native';
import { AppText, EventlyIcon, EventlyImage } from '../../../Components';
import { PUBLIC_EVENTS_COPY as COPY } from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { headerStyles as s } from '../styles';
import type {
  EventStatusAction,
  HeaderModel,
  StatusActionModel,
} from '../types';
import { ActionButton } from './ActionButton';
import { StatusChip } from './StatusChip';

const ICONS: Record<EventStatusAction, string> = {
  publish: 'rocket-launch-outline',
  unpublish: 'pencil-outline',
  complete: 'flag-checkered',
  cancel: 'close-circle-outline',
};

/**
 * The event at a glance — cover, name, when, where, status — and the status
 * moves the server allows from here. The forward move (publish / complete)
 * is the big button; going back or calling it off sits quietly beneath.
 */
export function WorkspaceHeader({
  header,
  actions,
  busy,
  editable,
  onAction,
}: {
  header: HeaderModel;
  actions: StatusActionModel[];
  busy: EventStatusAction | null;
  editable: boolean;
  onAction: (action: StatusActionModel) => void;
}) {
  const primary = actions.filter(a => a.primary);
  const secondary = actions.filter(a => !a.primary);
  const blocked = primary.find(a => a.blockedReason);

  return (
    <View style={s.card}>
      {header.coverUri ? (
        <View style={s.cover}>
          <EventlyImage
            source={{ uri: header.coverUri }}
            style={s.coverImage}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View style={s.coverEmpty}>
          <EventlyIcon
            name="ticket-confirmation-outline"
            size={40}
            color={ORG_ACCENT.saffron}
          />
        </View>
      )}
      <View style={s.body}>
        <StatusChip status={header.status} />
        <AppText variant="h2" style={s.title}>
          {header.title}
        </AppText>
        <View style={s.line}>
          <EventlyIcon
            name="calendar-month-outline"
            size={16}
            color={ORG_INK.inkSoft}
          />
          <AppText variant="bodySmall" style={s.lineText}>
            {header.when}
          </AppText>
        </View>
        <View style={s.line}>
          <EventlyIcon
            name="map-marker-outline"
            size={16}
            color={ORG_INK.inkSoft}
          />
          <AppText variant="bodySmall" style={s.lineText} numberOfLines={2}>
            {header.place}
          </AppText>
        </View>

        {actions.length ? (
          <View style={s.actions}>
            {primary.map(a => (
              <ActionButton
                key={a.key}
                title={a.label}
                icon={ICONS[a.key]}
                loading={busy === a.key}
                disabled={busy !== null && busy !== a.key}
                onPress={() => onAction(a)}
              />
            ))}
            {blocked ? (
              <AppText variant="caption" style={s.blocked}>
                {blocked.blockedReason}
              </AppText>
            ) : null}
            {secondary.length ? (
              <View style={s.secondary}>
                {secondary.map(a => (
                  <ActionButton
                    key={a.key}
                    title={a.label}
                    icon={ICONS[a.key]}
                    kind={a.danger ? 'dangerGhost' : 'ghost'}
                    small
                    loading={busy === a.key}
                    disabled={busy !== null && busy !== a.key}
                    onPress={() => onAction(a)}
                    containerStyle={s.secondaryItem}
                  />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
        {!editable ? (
          <AppText variant="caption" style={s.readOnly}>
            {COPY.readOnly}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

export default WorkspaceHeader;
