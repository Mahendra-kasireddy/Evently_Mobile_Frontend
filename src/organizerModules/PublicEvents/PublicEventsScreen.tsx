import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StatusBar, View } from 'react-native';
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
import { LIST_FILTERS, PUBLIC_EVENTS_COPY as COPY } from './constants';
import { useEventFormSheet, usePublicEventsContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { ActionButton } from './sections/ActionButton';
import { EmptyState } from './sections/EmptyState';
import { EventCard } from './sections/EventCard';
import { EventFormSheet } from './sections/EventFormSheet';
import { FilterChips } from './sections/FilterChips';
import { LoadMore } from './sections/LoadMore';
import { styles as s } from './styles';
import type { PublicEventDTO } from './types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTER_OPTIONS = LIST_FILTERS.map(key => ({
  key,
  label: COPY.filters[key],
}));

/**
 * The organizer's public events.
 *
 * One action — a new event — then the status chips and a big card per event.
 * A new event opens straight into its workspace, where tickets come next.
 */
export function PublicEventsScreen() {
  const navigation = useNavigation<Nav>();
  const c = usePublicEventsContainer();

  const openEvent = (eventId: string, title?: string) =>
    navigation.navigate('OrganizerPublicEvent', { eventId, title });

  const form = useEventFormSheet({
    onCreated: (event: PublicEventDTO) => {
      c.refresh();
      openEvent(event.id, event.title);
    },
  });

  const frame = (body: ReactNode) => (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORG_PAPER.canvas} />
      <AppHeader title={COPY.title} />
      {body}
      <EventFormSheet f={form} />
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

  if (c.isEmpty) {
    return frame(
      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={
          <RefreshControl
            refreshing={c.isRefreshing}
            onRefresh={c.refresh}
            tintColor={ORG_ACCENT.saffron}
            colors={[ORG_ACCENT.saffron]}
          />
        }
      >
        <FadeInUp style={s.section}>
          <EmptyState
            icon="ticket-confirmation-outline"
            title={COPY.emptyTitle}
            body={COPY.emptyBody}
            actionTitle={COPY.newEvent}
            onAction={form.openCreate}
          />
        </FadeInUp>
      </ScrollView>,
    );
  }

  return frame(
    <ScrollView
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
      <FadeInUp style={s.createWrap}>
        <ActionButton
          title={COPY.newEvent}
          icon="plus"
          onPress={form.openCreate}
        />
        <AppText variant="caption" style={s.createNote}>
          {COPY.newEventNote}
        </AppText>
      </FadeInUp>

      <FadeInUp delay={60} style={s.section}>
        <FilterChips
          options={FILTER_OPTIONS}
          value={c.filter}
          onChange={c.setFilter}
        />
      </FadeInUp>

      <View style={s.section}>
        {c.cards.length > 0 ? (
          <AppText variant="caption" style={s.countLine}>
            {COPY.countLine(c.total)}
          </AppText>
        ) : null}

        {c.isFilteredEmpty ? (
          <EmptyState
            icon="filter-variant-remove"
            title={COPY.emptyFilteredTitle}
            body={COPY.emptyFilteredBody}
          />
        ) : null}

        {c.isSwitching ? (
          <View style={s.centered}>
            <ThinkingOrbs size={40} colors={ORG_ORB_COLORS} />
          </View>
        ) : null}

        {c.cards.map((card, i) => (
          <FadeInUp key={card.id} delay={Math.min(i, 6) * 40}>
            <EventCard
              item={card}
              onOpen={() => openEvent(card.id, card.title)}
            />
          </FadeInUp>
        ))}

        {c.hasMore ? (
          <LoadMore loading={c.isLoadingMore} onPress={c.loadMore} />
        ) : null}
        {c.moreError ? (
          <AppText variant="caption" style={s.moreError}>
            {c.moreError}
          </AppText>
        ) : null}
      </View>
    </ScrollView>,
  );
}

export default PublicEventsScreen;
