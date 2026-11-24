import { Alert, View } from 'react-native';
import { AppText, EventlyIcon, ThinkingOrbs } from '../../../Components';
import { PUBLIC_EVENTS_COPY } from '../constants';
import { ORG_INK, ORG_ORB_COLORS } from '../design';
import { fillWidth, styles as screen, ticketStyles as s } from '../styles';
import type { TicketCardModel } from '../types';
import { ActionButton } from './ActionButton';
import { EmptyState } from './EmptyState';
import { StatusChip } from './StatusChip';

const COPY = PUBLIC_EVENTS_COPY.tickets;

function TicketCard({
  t,
  editable,
  archiving,
  onEdit,
  onArchive,
}: {
  t: TicketCardModel;
  editable: boolean;
  archiving: boolean;
  onEdit: () => void;
  onArchive: () => void;
}) {
  const confirmArchive = () =>
    Alert.alert(COPY.archiveTitle, COPY.archiveBody, [
      { text: PUBLIC_EVENTS_COPY.keep, style: 'cancel' },
      { text: COPY.archiveOk, style: 'destructive', onPress: onArchive },
    ]);

  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={s.headText}>
          <AppText variant="h3" style={s.name} numberOfLines={2}>
            {t.name}
          </AppText>
          <AppText variant="body" style={s.price}>
            {t.price}
          </AppText>
        </View>
        <StatusChip status={t.state} />
      </View>
      <AppText variant="bodySmall" style={s.sold}>
        {t.soldLine}
      </AppText>
      <View style={s.track}>
        <View style={[s.fill, fillWidth(t.percent)]} />
      </View>
      <View style={s.meta}>
        <EventlyIcon name="clock-outline" size={14} color={ORG_INK.inkSoft} />
        <AppText variant="caption" style={s.metaText}>
          {t.window}
        </AppText>
      </View>
      {t.perCustomer ? (
        <View style={s.meta}>
          <EventlyIcon
            name="account-outline"
            size={14}
            color={ORG_INK.inkSoft}
          />
          <AppText variant="caption" style={s.metaText}>
            {t.perCustomer}
          </AppText>
        </View>
      ) : null}
      {editable ? (
        <View style={s.actions}>
          <ActionButton
            title={COPY.edit}
            icon="pencil-outline"
            kind="ghost"
            small
            onPress={onEdit}
            disabled={archiving}
            containerStyle={s.action}
          />
          {t.canArchive ? (
            <ActionButton
              title={COPY.archive}
              icon="archive-outline"
              kind="dangerGhost"
              small
              loading={archiving}
              onPress={confirmArchive}
              containerStyle={s.action}
            />
          ) : null}
        </View>
      ) : null}
      {editable && !t.canArchive ? (
        <AppText variant="caption" style={s.soldHint}>
          {COPY.soldHint}
        </AppText>
      ) : null}
    </View>
  );
}

/** The ticket types: one card each, with Add as the tab's one action. */
export function TicketsTab({
  tickets,
  loading,
  failed,
  editable,
  archiving,
  onAdd,
  onEdit,
  onArchive,
}: {
  tickets: TicketCardModel[];
  loading: boolean;
  failed: boolean;
  editable: boolean;
  archiving: Record<string, boolean>;
  onAdd: () => void;
  onEdit: (typeId: string) => void;
  onArchive: (typeId: string) => void;
}) {
  if (loading) {
    return (
      <View style={screen.centered}>
        <ThinkingOrbs size={40} colors={ORG_ORB_COLORS} />
      </View>
    );
  }
  if (failed) {
    return (
      <View style={screen.section}>
        <AppText variant="body" style={screen.muted}>
          {COPY.loadFailed}
        </AppText>
      </View>
    );
  }
  if (tickets.length === 0) {
    return (
      <View style={screen.section}>
        <EmptyState
          icon="ticket-outline"
          title={COPY.emptyTitle}
          body={COPY.emptyBody}
          actionTitle={editable ? COPY.add : undefined}
          onAction={editable ? onAdd : undefined}
        />
      </View>
    );
  }
  return (
    <View style={screen.section}>
      {editable ? (
        <ActionButton title={COPY.add} icon="plus" onPress={onAdd} />
      ) : null}
      {tickets.map(t => (
        <TicketCard
          key={t.id}
          t={t}
          editable={editable}
          archiving={!!archiving[t.id]}
          onEdit={() => onEdit(t.id)}
          onArchive={() => onArchive(t.id)}
        />
      ))}
    </View>
  );
}

export default TicketsTab;
