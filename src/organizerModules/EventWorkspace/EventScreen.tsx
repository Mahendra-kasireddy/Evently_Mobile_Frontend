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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { EVENT_COPY as COPY } from './constants';
import { useDeclineSheet, useEventContainer, useTaskSheet } from './container';
import { ORG_ACCENT, ORG_INK, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { ClosedCard } from './sections/ClosedCard';
import { CompleteCard } from './sections/CompleteCard';
import { DeclineSheet } from './sections/DeclineSheet';
import { HeaderCard } from './sections/HeaderCard';
import { LinksRow } from './sections/LinksRow';
import { NoticeBar } from './sections/NoticeBar';
import { LapsedCard, RespondCard } from './sections/RespondCard';
import { TaskBoard } from './sections/TaskBoard';
import { TaskSheet } from './sections/TaskSheet';
import { styles as s } from './styles';
import type { TaskCardModel } from './types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * One booking, worked from the phone.
 *
 * Top to bottom in the order an organizer needs it: what the event is and
 * the money; the accept/decline gate while the customer waits for an answer;
 * then — once accepted — the task board and, finally, closing the event out.
 * The invitation and ideas board are linked below (still web pages).
 */
export function EventScreen() {
  const navigation = useNavigation<Nav>();
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'OrganizerEvent'>>();
  const bookingId = params.bookingId;
  const e = useEventContainer(bookingId);
  const decline = useDeclineSheet();
  const sheet = useTaskSheet(bookingId, e);

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader
        title={params.title ?? e.header?.title ?? COPY.fallbackTitle}
      />
      {body}
    </SafeAreaView>
  );

  if (e.isLoading) {
    return frame(
      <View style={s.centered}>
        <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
        <AppText variant="body" style={s.muted}>
          {COPY.loading}
        </AppText>
      </View>,
    );
  }

  if (e.notFound) {
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

  if (e.errorMessage || !e.booking || !e.header || !e.can || !e.respond) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        {e.errorMessage ? (
          <AppText variant="body" style={s.muted}>
            {e.errorMessage}
          </AppText>
        ) : null}
        <EventlyButton
          title={COPY.retry}
          onPress={e.refresh}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  const booking = e.booking;
  const can = e.can;
  const header = e.header;

  const onAccept = () =>
    Alert.alert(
      COPY.respond.acceptTitle,
      COPY.respond.acceptBody(
        header.title,
        header.day ? `${header.weekday}, ${header.day} ${header.month}` : '',
      ),
      [
        { text: COPY.respond.acceptCancel, style: 'cancel' },
        {
          text: COPY.respond.acceptConfirm,
          onPress: () => {
            e.accept().catch(() => undefined);
          },
        },
      ],
    );

  const onDecline = (reason: string) => {
    e.decline(reason)
      .then(ok => {
        if (ok) decline.close();
      })
      .catch(() => undefined);
  };

  const onComplete = () =>
    Alert.alert(
      COPY.complete.confirmTitle,
      [e.completeNote, COPY.complete.confirmBody].filter(Boolean).join('\n\n'),
      [
        { text: COPY.complete.cancel, style: 'cancel' },
        {
          text: COPY.complete.confirm,
          onPress: () => {
            e.complete().catch(() => undefined);
          },
        },
      ],
    );

  const onMove = (task: TaskCardModel) => e.moveTask(task.id, task.next.status);

  return frame(
    <>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={e.isRefreshing}
            onRefresh={e.refresh}
            tintColor={ORG_ACCENT.saffron}
            colors={[ORG_ACCENT.saffron]}
          />
        }
      >
        <FadeInUp>
          <HeaderCard header={header} muted={can.closed} />
        </FadeInUp>

        {e.notice ? (
          <NoticeBar notice={e.notice} onDismiss={e.dismissNotice} />
        ) : null}

        {can.canRespond ? (
          <FadeInUp delay={60}>
            <RespondCard
              respond={e.respond}
              accepting={e.busy === 'accept'}
              disabled={e.busy !== null}
              onAccept={onAccept}
              onDecline={decline.open}
            />
          </FadeInUp>
        ) : null}
        {can.respondLapsed ? <LapsedCard /> : null}

        {can.closed ? (
          <ClosedCard
            status={booking.status}
            declineReason={booking.declineReason ?? ''}
          />
        ) : null}

        {can.showBoard ? (
          <TaskBoard
            progress={e.progress}
            column={e.column}
            counts={e.counts}
            cards={e.cards}
            moving={e.moving}
            editable={can.canEditTasks}
            onColumn={e.setColumn}
            onOpen={sheet.openTask}
            onMove={onMove}
            onAdd={sheet.openNew}
          />
        ) : null}

        {can.canComplete ? (
          <CompleteCard
            marking={e.busy === 'complete'}
            disabled={e.busy !== null}
            onComplete={onComplete}
          />
        ) : null}

        <LinksRow
          ideasLabel={e.ideasLabel}
          onInvitation={() =>
            navigation.navigate('OrganizerInvitation', {
              bookingId,
              title: params.title ?? e.header?.title,
            })
          }
          onIdeas={() =>
            navigation.navigate('OrganizerIdeas', {
              bookingId,
              title: params.title ?? e.header?.title,
            })
          }
        />
      </ScrollView>

      <DeclineSheet
        d={decline}
        declining={e.busy === 'decline'}
        onDecline={onDecline}
      />
      {can.canEditTasks ? (
        <TaskSheet
          t={sheet}
          subvendors={e.subvendors}
          subvendorsFailed={e.subvendorsFailed}
        />
      ) : null}
    </>,
  );
}

export default EventScreen;
