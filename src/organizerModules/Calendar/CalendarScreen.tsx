import { useRef } from 'react';
import type { ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyButton,
  FadeInUp,
  ThinkingOrbs,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { CALENDAR_COPY as COPY } from './constants';
import { useCalendarContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { DayPanel } from './sections/DayPanel';
import { MonthCard } from './sections/MonthCard';
import { SelectBar } from './sections/SelectBar';
import { UpcomingList } from './sections/UpcomingList';
import { styles as s } from './styles';
import type { DayBooking } from './types';

/**
 * The organizer's calendar.
 *
 * A month of days — booked, blocked, free — with one day open underneath:
 * its bookings, or "You're free" and a button to block it. "Block several
 * days" turns the grid into a picker. The booked days still ahead this month
 * are listed last.
 */
export function CalendarScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const c = useCalendarContainer();
  const scrollRef = useRef<ScrollView>(null);
  const panelY = useRef(0);

  const openBooking = (booking: DayBooking) =>
    navigation.navigate('OrganizerEvent', {
      bookingId: booking.id,
      title: booking.title,
    });

  const openDay = (iso: string) => {
    c.openDay(iso);
    scrollRef.current?.scrollTo({
      y: Math.max(0, panelY.current - 16),
      animated: true,
    });
  };

  const onPanelLayout = (e: LayoutChangeEvent) => {
    panelY.current = e.nativeEvent.layout.y;
  };

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader title={COPY.title} />
      {body}
    </SafeAreaView>
  );

  if (c.isLoading) {
    return frame(
      <View style={s.centered}>
        <ThinkingOrbs size={56} colors={ORG_ORB_COLORS} label={COPY.loading} />
        <AppText variant="body" style={s.muted}>
          {COPY.loading}
        </AppText>
      </View>,
    );
  }

  if (c.errorMessage) {
    return frame(
      <View style={s.centered}>
        <AppText variant="h3" style={s.title}>
          {COPY.error}
        </AppText>
        <AppText variant="body" style={s.muted}>
          {c.errorMessage}
        </AppText>
        <EventlyButton
          title={COPY.retry}
          onPress={c.refresh}
          accentColor={ORG_ACCENT.saffron}
        />
      </View>,
    );
  }

  return frame(
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={c.isRefreshing}
          onRefresh={c.refresh}
          tintColor={ORG_ACCENT.saffron}
          colors={[ORG_ACCENT.saffron]}
        />
      }
    >
      <FadeInUp>
        <MonthCard
          title={c.monthTitle}
          cells={c.cells}
          selectedIso={c.selecting ? null : c.selected.iso}
          picked={c.picked}
          showToday={!c.onToday}
          onPrev={c.prevMonth}
          onNext={c.nextMonth}
          onToday={c.goToday}
          onPressDay={c.pressDay}
          onLongPressDay={c.longPressDay}
        />
      </FadeInUp>

      {c.notice ? (
        <View style={s.notice}>
          <AppText variant="caption" style={s.noticeText}>
            {c.notice}
          </AppText>
        </View>
      ) : null}

      {c.selecting ? (
        <SelectBar
          count={c.picked.length}
          busy={c.busy}
          onConfirm={c.confirmSelecting}
          onCancel={c.cancelSelecting}
        />
      ) : (
        <>
          <EventlyButton
            title={COPY.blockSeveral}
            variant="outline"
            accentColor={ORG_ACCENT.saffron}
            disabled={c.busy}
            onPress={c.startSelecting}
          />
          <View onLayout={onPanelLayout}>
            <FadeInUp key={c.selected.iso} distance={8}>
              <DayPanel
                day={c.selected}
                busy={c.busy}
                onToggleBlocked={c.toggleBlocked}
                onOpenBooking={openBooking}
              />
            </FadeInUp>
          </View>
          <UpcomingList rows={c.upcoming} onPick={openDay} />
        </>
      )}
    </ScrollView>,
  );
}

export default CalendarScreen;
