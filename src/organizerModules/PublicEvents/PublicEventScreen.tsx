import type { ReactNode } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyButton,
  EventlyIcon,
  FadeInUp,
  ThinkingOrbs,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { PUBLIC_EVENTS_COPY as COPY } from './constants';
import {
  useAttendees,
  useCancelSheet,
  useCheckIn,
  useEventFormSheet,
  useMemoriesLive,
  usePublicEventContainer,
  useTicketSheet,
} from './container';
import { ORG_ACCENT, ORG_INK, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { AttendeesTab } from './sections/AttendeesTab';
import { CancelSheet } from './sections/CancelSheet';
import { CheckInTab } from './sections/CheckInTab';
import { DetailsTab } from './sections/DetailsTab';
import { EventFormSheet } from './sections/EventFormSheet';
import { MemoriesLiveTab } from './sections/MemoriesLiveTab';
import { NoticeBar } from './sections/NoticeBar';
import { OverviewTab } from './sections/OverviewTab';
import { TicketSheet } from './sections/TicketSheet';
import { TicketsTab } from './sections/TicketsTab';
import { WorkspaceHeader } from './sections/WorkspaceHeader';
import { WorkspaceTabs } from './sections/WorkspaceTabs';
import { styles as s } from './styles';
import type { PublicEventDTO, StatusActionModel } from './types';

/**
 * One public event, run from the phone.
 *
 * The event and its status moves on top; below, one tab at a time: the
 * numbers, the tickets, who is coming, the door, the details, and the
 * memories and stream settings.
 */
export function PublicEventScreen() {
  const navigation = useNavigation();
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'OrganizerPublicEvent'>>();
  const eventId = params.eventId;

  const w = usePublicEventContainer(eventId);
  const cancel = useCancelSheet();
  const tickets = useTicketSheet(eventId, w);
  const attendees = useAttendees(
    eventId,
    w.tab === 'attendees',
    w.reloadNumbers,
    w.setNotice,
  );
  const door = useCheckIn(eventId, (ticketId, at) => {
    attendees.markCheckedIn(ticketId, at);
    w.reloadNumbers();
  });
  const settings = useMemoriesLive(eventId, w);
  const form = useEventFormSheet({
    onUpdated: (saved: PublicEventDTO) => {
      w.apply(saved);
      w.setNotice({ text: COPY.form.saved, tone: 'ok' });
    },
  });

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader title={w.event?.title ?? params.title ?? COPY.fallbackTitle} />
      {body}
    </SafeAreaView>
  );

  if (w.isLoading) {
    return frame(
      <View style={s.centered}>
        <ThinkingOrbs
          size={56}
          colors={ORG_ORB_COLORS}
          label={COPY.loadingOne}
        />
        <AppText variant="body" style={s.muted}>
          {COPY.loadingOne}
        </AppText>
      </View>,
    );
  }

  if (w.notFound) {
    return frame(
      <View style={s.centered}>
        <EventlyIcon
          name="calendar-remove-outline"
          size={44}
          color={ORG_INK.inkFaint}
        />
        <AppText variant="h3" style={s.title}>
          {COPY.notFoundTitle}
        </AppText>
        <AppText variant="body" style={s.muted}>
          {COPY.notFoundBody}
        </AppText>
        <EventlyButton
          title={COPY.back}
          onPress={() => navigation.goBack()}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  if (w.errorMessage || !w.event || !w.header) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        {w.errorMessage ? (
          <AppText variant="body" style={s.muted}>
            {w.errorMessage}
          </AppText>
        ) : null}
        <EventlyButton
          title={COPY.retry}
          onPress={w.refresh}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  const event = w.event;

  const addTickets = () => {
    w.setTab('tickets');
    if (w.editable) tickets.openNew();
  };

  const onAction = (a: StatusActionModel) => {
    if (a.blockedReason) {
      Alert.alert(a.label, a.blockedReason, [
        { text: COPY.keep, style: 'cancel' },
        { text: COPY.addTickets, onPress: addTickets },
      ]);
      return;
    }
    if (a.key === 'cancel') {
      cancel.open();
      return;
    }
    const confirm = COPY.confirm[a.key];
    Alert.alert(confirm.title, confirm.body, [
      { text: COPY.keep, style: 'cancel' },
      {
        text: confirm.ok,
        onPress: () => {
          w.runStatus(a.key).catch(() => undefined);
        },
      },
    ]);
  };

  const onCancelConfirm = (reason: string) => {
    w.runStatus('cancel', reason)
      .then(ok => {
        if (ok) cancel.close();
      })
      .catch(() => undefined);
  };

  const refresh = () => {
    w.refresh();
    attendees.reload();
  };

  const publish = w.actions.find(a => a.key === 'publish');
  const nextStep =
    event.status !== 'draft' || !publish
      ? ''
      : publish.blockedReason
      ? COPY.overview.nextDraft
      : COPY.overview.nextPublish;

  return frame(
    <>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={w.isRefreshing}
            onRefresh={refresh}
            tintColor={ORG_ACCENT.saffron}
            colors={[ORG_ACCENT.saffron]}
          />
        }
      >
        <FadeInUp>
          <WorkspaceHeader
            header={w.header}
            actions={w.actions}
            busy={w.busy}
            editable={w.editable}
            onAction={onAction}
          />
        </FadeInUp>

        {w.notice ? (
          <NoticeBar notice={w.notice} onDismiss={() => w.setNotice(null)} />
        ) : null}

        <WorkspaceTabs tab={w.tab} onTab={w.setTab} />

        {w.tab === 'overview' ? (
          <OverviewTab
            dashboard={w.dashboard}
            failed={w.dashboardFailed}
            nextStep={nextStep}
          />
        ) : null}
        {w.tab === 'tickets' ? (
          <TicketsTab
            tickets={w.tickets}
            loading={w.ticketsLoading}
            failed={w.ticketsFailed}
            editable={w.editable}
            archiving={w.archiving}
            onAdd={tickets.openNew}
            onEdit={tickets.openEdit}
            onArchive={w.archive}
          />
        ) : null}
        {w.tab === 'attendees' ? (
          <AttendeesTab a={attendees} checkInOpen={w.checkInOpen} />
        ) : null}
        {w.tab === 'checkin' ? (
          <CheckInTab c={door} open={w.checkInOpen} />
        ) : null}
        {w.tab === 'details' ? (
          <DetailsTab
            rows={w.details}
            editable={w.editable}
            onEdit={() => form.openEdit(event)}
          />
        ) : null}
        {w.tab === 'memories' ? <MemoriesLiveTab m={settings} /> : null}
      </ScrollView>

      <TicketSheet t={tickets} />
      <CancelSheet
        c={cancel}
        cancelling={w.busy === 'cancel'}
        onConfirm={onCancelConfirm}
      />
      <EventFormSheet f={form} />
    </>,
  );
}

export default PublicEventScreen;
