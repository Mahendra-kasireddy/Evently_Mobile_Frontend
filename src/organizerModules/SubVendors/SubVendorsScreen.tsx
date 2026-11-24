import type { ReactNode } from 'react';
import { Alert, FlatList, RefreshControl, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyButton,
  FadeInUp,
  ThinkingOrbs,
} from '../../Components';
import { ALL_FILTER, SUBVENDORS_COPY as COPY } from './constants';
import { useSubVendorsContainer } from './container';
import { ORG_ACCENT, ORG_ORB_COLORS, ORG_PAPER } from './design';
import { ActionButton } from './sections/ActionButton';
import { EmptyState } from './sections/EmptyState';
import { InviteSheet } from './sections/InviteSheet';
import { MemberCard } from './sections/MemberCard';
import { PendingInvites } from './sections/PendingInvites';
import { Toolbar } from './sections/Toolbar';
import { actionStyles as a, styles as s } from './styles';
import type { MemberItem, PendingItem } from './types';

/**
 * The organizer's team of sub-vendors — caterers, decorators, photographers
 * they hand tasks to. Big cards, a category filter, the invites still out,
 * and one main action: invite someone by mobile number.
 */
export function SubVendorsScreen() {
  const c = useSubVendorsContainer();

  const confirmRemove = (item: MemberItem) =>
    Alert.alert(COPY.removeTitle, COPY.removeBody(item.name), [
      { text: COPY.keep, style: 'cancel' },
      {
        text: COPY.removeConfirm,
        style: 'destructive',
        onPress: () => c.remove(item.linkId, COPY.removed(item.name)),
      },
    ]);

  const confirmCancel = (item: PendingItem) =>
    Alert.alert(COPY.cancelInviteTitle, COPY.cancelInviteBody(item.phone), [
      { text: COPY.keep, style: 'cancel' },
      {
        text: COPY.cancelInviteConfirm,
        style: 'destructive',
        onPress: () => c.remove(item.linkId, COPY.inviteCancelled),
      },
    ]);

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

  const showPending = c.filter === ALL_FILTER && c.pending.length > 0;

  return frame(
    <>
      <FlatList
        data={c.members}
        keyExtractor={item => item.linkId}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Toolbar
            teamSize={c.allMembersCount}
            chips={c.chips}
            filter={c.filter}
            onFilter={c.setFilter}
            notice={c.notice}
            onDismissNotice={c.dismissNotice}
          />
        }
        ListHeaderComponentStyle={s.listHeader}
        ListEmptyComponent={
          // With invites out but no one signed up yet, the invites say enough.
          showPending ? null : (
            <EmptyState
              filtered={c.filter !== ALL_FILTER}
              onInvite={c.openInvite}
              onShowAll={() => c.setFilter(ALL_FILTER)}
            />
          )
        }
        ListFooterComponent={
          showPending ? (
            <PendingInvites
              items={c.pending}
              removingId={c.removingId}
              onCancel={confirmCancel}
            />
          ) : null
        }
        renderItem={({ item, index }) => (
          <FadeInUp delay={Math.min(index, 6) * 50}>
            <MemberCard
              item={item}
              removing={c.removingId === item.linkId}
              onRemove={() => confirmRemove(item)}
            />
          </FadeInUp>
        )}
        refreshControl={
          <RefreshControl
            refreshing={c.isRefreshing}
            onRefresh={c.refresh}
            tintColor={ORG_ACCENT.saffron}
            colors={[ORG_ACCENT.saffron]}
          />
        }
      />

      {c.isEmpty ? null : (
        <SafeAreaView edges={['bottom']} style={a.footer}>
          <ActionButton title={COPY.invite} onPress={c.openInvite} />
        </SafeAreaView>
      )}

      <InviteSheet
        visible={c.sheetOpen}
        phone={c.phone}
        onChangePhone={c.setPhone}
        error={c.inviteError}
        sending={c.inviting}
        onSend={c.sendInvite}
        onClose={c.closeInvite}
      />
    </>,
  );
}

export default SubVendorsScreen;
