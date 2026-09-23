import { useMemo, useState } from 'react';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  AppHeader,
  EventlyIcon,
  EventlyText,
} from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import {
  INVITATION_COPY as COPY,
  INVITATION_TABS,
  INV_ACCENT,
  INV_GREEN,
  INV_NAVY_DEEP,
  OCCASION_ICON,
  OCCASION_ICON_FALLBACK,
} from './constants';
import { mapInvitationList } from './utils';
import {
  useApproveBlock,
  useApproveInvitation,
  useGuests,
  useInvitation,
  useMyInvitations,
  usePersonalizeBlock,
  useRequestInvitationChange,
  useShareInvitation,
} from './hooks';
import { ApproveRow } from './sections/ApproveRow';
import {
  BlockCanvas,
  HiddenNote,
  InvitationHeaderCard,
} from './sections/BlockCanvas';
import {
  MenuSheet,
  PersonalizeSheet,
  PreviewSheet,
  RequestChangeSheet,
  ShareSheet,
} from './sections/Sheets';
import {
  actionStyles as a,
  listStyles as l,
  shellStyles as sh,
  styles,
} from './styles';
import type {
  GuestDTO,
  InvitationDTO,
  InvitationTab,
  ShareOutcomeDTO,
} from './types';

type InvitationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Invitations'>;
type InvitationRouteProp = RouteProp<RootStackParamList, 'Invitations'>;

/** Which sheet is open, and what it is about. */
type Sheet =
  | { kind: 'personalize'; key: string }
  | { kind: 'request'; key?: string }
  /** `key` absent means the whole invitation — one sheet serves both. */
  | { kind: 'preview'; key?: string }
  /** The two things behind the header's menu. */
  | { kind: 'menu' }
  /** `key` absent means the complete invitation — one sheet serves both. */
  | { kind: 'share'; key?: string }
  | null;

/**
 * Every invitation shared with this customer — the Profile entry point, where
 * there is no booking in hand. Drafts never appear: the backend excludes them,
 * because an invitation the organizer is still writing is not yet the
 * customer's to see.
 */
function InvitationList() {
  const navigation = useNavigation<InvitationNavigationProp>();
  const { data, loading, error, refetch } = useMyInvitations();
  const items = useMemo(() => mapInvitationList(data ?? []), [data]);
  const needsYou = items.filter((i) => i.needsYou).length;

  if (loading && items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={styles.centered}>
        <EventlyText variant="body" style={styles.errorText}>
          {error.message}
        </EventlyText>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.centered}>
        <View style={styles.centeredIcon}>
          <EventlyIcon name="email-heart-outline" size={28} color={INV_ACCENT} />
        </View>
        <EventlyText variant="h2" style={styles.centeredTitle}>
          {COPY.emptyTitle}
        </EventlyText>
        <EventlyText variant="body" style={styles.centeredBody}>
          {COPY.emptyBody}
        </EventlyText>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.bookingId}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      /* The question this list exists to answer, answered before the rows. */
      ListHeaderComponent={
        <View style={[l.summary, needsYou > 0 ? l.summaryAction : l.summaryDone]}>
          <EventlyIcon
            name={needsYou > 0 ? 'clock-outline' : 'check-circle'}
            size={18}
            color={needsYou > 0 ? INV_ACCENT : INV_GREEN}
          />
          <EventlyText variant="caption" style={l.summaryText}>
            {needsYou > 0 ? COPY.listNeedsYou(needsYou) : COPY.listAllApproved}
          </EventlyText>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[l.row, item.needsYou && l.rowNeedsYou]}
          activeOpacity={0.85}
          onPress={() => navigation.push('Invitations', { bookingId: item.bookingId })}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, ${item.statusLabel}`}
        >
          <View style={l.head}>
            <View style={l.iconChip}>
              <EventlyIcon
                name={OCCASION_ICON[item.occasion] ?? OCCASION_ICON_FALLBACK}
                size={19}
                color={INV_ACCENT}
              />
            </View>
            <View style={l.text}>
              <EventlyText variant="subtitle" style={l.title} numberOfLines={2}>
                {item.title}
              </EventlyText>
              {item.ref ? (
                <EventlyText variant="caption" style={l.ref}>
                  {item.ref}
                </EventlyText>
              ) : null}
            </View>
            <View style={[l.statusChip, item.needsYou ? l.statusChipAction : l.statusChipDone]}>
              <EventlyText
                variant="caption"
                style={[l.statusText, { color: item.needsYou ? INV_ACCENT : INV_GREEN }]}
                numberOfLines={1}
              >
                {item.statusLabel}
              </EventlyText>
            </View>
          </View>

          <View style={l.footer}>
            {item.dateLabel ? (
              <View style={l.meta}>
                <EventlyIcon name="calendar-blank-outline" size={14} color={colors.textMuted} />
                <EventlyText variant="caption" style={l.metaText}>
                  {item.dateLabel}
                </EventlyText>
              </View>
            ) : (
              <View />
            )}
            <View style={l.open}>
              <EventlyText variant="caption" style={l.openText}>
                {item.needsYou ? COPY.listReview : COPY.listView}
              </EventlyText>
              <EventlyIcon name="chevron-right" size={15} color={INV_ACCENT} />
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

/**
 * One booking's guest invitation — the customer's half of the approval loop.
 *
 * Every section the organizer assembled, marked with who owns it, the ones
 * that are theirs editable in place, a preview of exactly what publishing
 * would show, and — once approved — sending it to guests.
 *
 * Approving is the only thing that makes the guest link live, so nothing here
 * reaches a guest before the customer decides it should.
 */
function InvitationDetail({ bookingId }: { bookingId: string }) {
  const navigation = useNavigation<InvitationNavigationProp>();
  const { data, loading, error, refetch } = useInvitation(bookingId);
  const approve = useApproveInvitation();
  const personalize = usePersonalizeBlock();
  const requestChange = useRequestInvitationChange();
  const guestList = useGuests();
  const share = useShareInvitation();

  /** The server's latest copy, which any mutation returns. */
  const [patched, setPatched] = useState<InvitationDTO | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [guests, setGuests] = useState<GuestDTO[]>([]);
  const [outcomes, setOutcomes] = useState<ShareOutcomeDTO[] | null>(null);
  const [tab, setTab] = useState<InvitationTab>('organizer');
  const approveBlock = useApproveBlock();
  const [approvingKey, setApprovingKey] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const invitation = patched ?? data;

  if (loading && !invitation) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <EventlyText variant="body" style={styles.centeredBody}>
          {COPY.loading}
        </EventlyText>
      </View>
    );
  }

  if (error && !invitation) {
    return (
      <View style={styles.centered}>
        <EventlyText variant="h2" style={styles.centeredTitle}>
          {COPY.errorTitle}
        </EventlyText>
        <EventlyText variant="body" style={styles.centeredBody}>
          {error.message}
        </EventlyText>
        <TouchableOpacity style={styles.retryButton} activeOpacity={0.8} onPress={refetch} accessibilityRole="button">
          <EventlyIcon name="refresh" size={16} color={INV_ACCENT} />
          <EventlyText variant="caption" style={styles.retryText}>
            {COPY.retry}
          </EventlyText>
        </TouchableOpacity>
      </View>
    );
  }

  // null rather than an error: the organizer is still drafting it.
  if (!invitation) {
    return (
      <View style={styles.centered}>
        <View style={styles.centeredIcon}>
          <EventlyIcon name="email-fast-outline" size={28} color={INV_ACCENT} />
        </View>
        <EventlyText variant="h2" style={styles.centeredTitle}>
          {COPY.preparingTitle}
        </EventlyText>
        <EventlyText variant="body" style={styles.centeredBody}>
          {COPY.preparingBody}
        </EventlyText>
      </View>
    );
  }

  const approved = invitation.status === 'approved';
  const openBlock =
    sheet?.kind === 'personalize' ? invitation.blocks.find((b) => b.key === sheet.key) ?? null : null;
  const shareBlockTitle =
    sheet?.kind === 'share' && sheet.key
      ? invitation.blocks.find((b) => b.key === sheet.key)?.title
      : undefined;

  /* Hidden sections are not part of the published invitation, so they are
     neither read, approved nor counted here. */
  const visibleBlocks = invitation.blocks.filter((b) => !b.hidden);
  /*
   * A server that predates per-section sign-off sends no `approved` at all,
   * and an invitation approved before it existed has none stored. Approving
   * the whole thing is approving every section of it, so the status decides
   * when the field cannot — otherwise an approved invitation asks to be
   * approved again, ten times.
   */
  const waiting = approved
    ? 0
    : visibleBlocks.filter((b) => b.approved !== true).length;

  /* The section the header card stands for, so its Edit opens the right one. */
  const headerBlock =
    invitation.blocks.find((b) => b.key === 'header') ?? invitation.blocks[0];

  const openShare = (key?: string) => {
    setOutcomes(null);
    setSheet({ kind: 'share', ...(key ? { key } : {}) });
    guestList
      .execute(bookingId)
      .then(setGuests)
      .catch(() => {
        // error surfaces through guestList.error
      });
  };

  return (
    <>
      {/*
        Stationery, not a dashboard.

        This screen is a card somebody is about to send to their family, so
        its head is paper: a cream ground, the screen's name, and everything
        else behind one menu. A workspace and an ideas feed are measured in
        counts; an invitation is read, so there is no bar of figures on it.
      */}
      <View style={sh.paper}>
        <View style={sh.bar}>
          <TouchableOpacity
            style={sh.back}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <EventlyIcon name="chevron-left" size={22} color={INV_NAVY_DEEP} />
          </TouchableOpacity>
          <View style={sh.barText}>
            <EventlyText variant="subtitle" style={sh.barTitle} numberOfLines={1}>
              {COPY.detailTitle}
            </EventlyText>
          </View>
          {/*
            The two things that are not a way of working on the invitation —
            looking at it as a guest, and the list it would go to — behind one
            control rather than as a third tab and a row of buttons.
          */}
          <TouchableOpacity
            style={sh.menu}
            activeOpacity={0.7}
            onPress={() => setSheet({ kind: 'menu' })}
            accessibilityRole="button"
            accessibilityLabel={COPY.menuTitle}
            testID="invitation-menu"
          >
            <EventlyIcon name="menu" size={22} color={INV_NAVY_DEEP} />
          </TouchableOpacity>
        </View>
      </View>

      {/*
        Two ways of working on it: read what the organizer assembled, or sign
        it off section by section. The guest's view is not a third — it is a
        look at the finished thing, and it lives in the menu.
      */}
      <View style={sh.tabs}>
        {INVITATION_TABS.map((item) => {
          const on = item.key === tab;
          return (
            <TouchableOpacity
              key={item.key}
              style={[sh.tab, on && sh.tabOn]}
              activeOpacity={0.85}
              onPress={() => setTab(item.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={item.label}
              testID={`invitation-tab-${item.key}`}
            >
              <EventlyText variant="caption" style={[sh.tabText, on && sh.tabTextOn]}>
                {item.label}
              </EventlyText>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <>
            <InvitationHeaderCard
              invitation={invitation}
              /* The header block is the customer's when they own it — and on
                 an invitation where the organizer keeps it, there is nothing
                 for this button to open. */
              onEdit={
                headerBlock && headerBlock.owner === 'customer'
                  ? () => setSheet({ kind: 'personalize', key: headerBlock.key })
                  : undefined
              }
            />

            {tab === 'organizer' ? (
              <>
                {visibleBlocks.map((block) => (
                  <BlockCanvas
                    key={block.key}
                    block={block}
                    /* Whose section it is decides what the control does: the
                       customer edits their own, and can only ask about the
                       organizer's. That is the rule the API enforces, so the
                       page never offers an edit that would 403. */
                    onEdit={() => {
                      if (block.owner === 'customer') {
                        setSheet({ kind: 'personalize', key: block.key });
                        return;
                      }
                      setRequestSent(false);
                      setSheet({ kind: 'request', key: block.key });
                    }}
                  />
                ))}
                <HiddenNote count={invitation.blocks.length - visibleBlocks.length} />
              </>
            ) : (
              visibleBlocks.map((block) => (
                <ApproveRow
                  key={block.key}
                  block={block}
                  isApproving={approvingKey === block.key}
                  canShare={approved}
                  onShare={() => openShare(block.key)}
                  onAccept={() => {
                    setApprovingKey(block.key);
                    approveBlock
                      .execute(bookingId, block.key)
                      .then(setPatched)
                      .catch(() => {
                        // error surfaces through approveBlock.error
                      })
                      .finally(() => setApprovingKey(null));
                  }}
                  onRequestChange={() => {
                    setRequestSent(false);
                    setSheet({ kind: 'request', key: block.key });
                  }}
                />
              ))
            )}

            {approve.error || approveBlock.error ? (
              <EventlyText variant="caption" style={a.errorText}>
                {(approve.error ?? approveBlock.error)?.message}
              </EventlyText>
            ) : null}
            {requestSent ? (
              <EventlyText variant="caption" style={a.sentText}>
                {COPY.requestSent}
              </EventlyText>
            ) : null}
        </>
      </ScrollView>

      {/*
        One action, pinned. On the approve pass it is the whole invitation in
        one tap; everywhere else it is sending it — disabled until it is
        approved, because the API refuses to send an unapproved invitation and
        a button that fails is worse than one that says why.
      */}
      <View style={[sh.foot, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {tab === 'approve' && waiting > 0 ? (
          <TouchableOpacity
            style={[sh.footButton, sh.footButtonApprove, approve.loading && sh.footButtonDisabled]}
            activeOpacity={0.9}
            disabled={approve.loading}
            onPress={() =>
              approve
                .execute(bookingId)
                .then(setPatched)
                .catch(() => {
                  // error surfaces through approve.error
                })
            }
            accessibilityRole="button"
            accessibilityLabel={COPY.approveAll(waiting)}
          >
            {approve.loading ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <EventlyIcon name="check" size={18} color={colors.onPrimary} />
            )}
            <EventlyText variant="subtitle" style={sh.footButtonText}>
              {COPY.approveAll(waiting)}
            </EventlyText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[sh.footButton, !approved && sh.footButtonDisabled]}
            activeOpacity={0.9}
            disabled={!approved}
            onPress={() => openShare()}
            accessibilityRole="button"
            accessibilityLabel={COPY.shareAll}
          >
            <EventlyIcon name="whatsapp" size={18} color={colors.onPrimary} />
            <EventlyText variant="subtitle" style={sh.footButtonText}>
              {COPY.shareAll}
            </EventlyText>
          </TouchableOpacity>
        )}
        <EventlyText variant="caption" style={sh.footNote}>
          {tab === 'approve' && waiting > 0
            ? COPY.approveAllNote
            : approved
              ? COPY.shareNote
              : COPY.shareLockedNote}
        </EventlyText>
      </View>

      <MenuSheet
        visible={sheet?.kind === 'menu'}
        onPreview={() => setSheet({ kind: 'preview' })}
        onGuestList={() => {
          /* Closing first, so backing out of the guest list lands on the
             invitation rather than on a sheet over it. */
          setSheet(null);
          navigation.navigate('GuestList', {
            bookingId,
            title: invitation.bookingTitle || invitation.occasion,
          });
        }}
        onClose={() => setSheet(null)}
      />

      <PreviewSheet
        visible={sheet?.kind === 'preview'}
        invitation={invitation}
        blockKey={sheet?.kind === 'preview' ? sheet.key : undefined}
        canShare={approved}
        // Straight from looking at it to sending it: the share sheet opens on
        // whatever the preview was showing.
        onShare={() => openShare(sheet?.kind === 'preview' ? sheet.key : undefined)}
        onClose={() => setSheet(null)}
      />

      <PersonalizeSheet
        key={openBlock?.key ?? 'none'}
        block={openBlock}
        isSaving={personalize.loading}
        errorMessage={personalize.error?.message ?? null}
        onSave={(patch) => {
          if (!openBlock) return;
          personalize
            .execute(bookingId, openBlock.key, patch)
            .then((updated) => {
              setPatched(updated);
              setSheet(null);
            })
            .catch(() => {
              // error surfaces in the sheet
            });
        }}
        onClose={() => setSheet(null)}
      />

      <RequestChangeSheet
        visible={sheet?.kind === 'request'}
        blockTitle={
          sheet?.kind === 'request' && sheet.key
            ? invitation.blocks.find((b) => b.key === sheet.key)?.title
            : undefined
        }
        isSending={requestChange.loading}
        errorMessage={requestChange.error?.message ?? null}
        onSend={(note) => {
          const key = sheet?.kind === 'request' ? sheet.key : undefined;
          requestChange
            .execute(bookingId, note, key)
            .then(() => {
              setRequestSent(true);
              setSheet(null);
              // The ask is now on the invitation; the rows count them.
              refetch();
            })
            .catch(() => {
              // error surfaces in the sheet
            });
        }}
        onClose={() => setSheet(null)}
      />

      <ShareSheet
        visible={sheet?.kind === 'share'}
        sectionKey={sheet?.kind === 'share' ? sheet.key : undefined}
        sectionTitle={shareBlockTitle}
        guests={guests}
        isLoadingGuests={guestList.loading}
        isSending={share.loading}
        errorMessage={share.error?.message ?? guestList.error?.message ?? null}
        outcomes={outcomes}
        onSend={(guestIds, newGuest) => {
          const section = sheet?.kind === 'share' ? sheet.key : undefined;
          share
            .execute(bookingId, {
              ...(section ? { section } : {}),
              guestIds,
              newGuests: newGuest ? [newGuest] : [],
            })
            .then((result) => setOutcomes(result.results))
            .catch(() => {
              // error surfaces in the sheet
            });
        }}
        onManageGuests={() => {
          /* Closing first, so backing out of the guest list lands on the
             invitation rather than on a sheet the customer had finished with. */
          setSheet(null);
          navigation.navigate('GuestList', {
            bookingId,
            title: invitation.bookingTitle || invitation.occasion,
          });
        }}
        onOpenHandoff={(url) => {
          Linking.openURL(url).catch(() => {
            // Nothing to recover: the outcome row still shows the link.
          });
        }}
        onClose={() => {
          setSheet(null);
          setOutcomes(null);
        }}
      />
    </>
  );
}

/**
 * The guest invitation.
 *
 * Two entry points, so two modes: the workspace opens one booking's
 * invitation, while Profile — which has no booking in hand — lists every
 * invitation shared with the customer.
 */
export function InvitationScreen() {
  const { params } = useRoute<InvitationRouteProp>();
  const bookingId = params?.bookingId;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* The detail view draws its own bar — title, count and tabs together —
          so the shared header would be a second "Guest invitation" above it.
          The list has no bar of its own and keeps this one. */}
      {bookingId ? (
        <InvitationDetail bookingId={bookingId} />
      ) : (
        <>
          <AppHeader title={COPY.listTitle} compact />
          <InvitationList />
        </>
      )}
    </SafeAreaView>
  );
}

export default InvitationScreen;
