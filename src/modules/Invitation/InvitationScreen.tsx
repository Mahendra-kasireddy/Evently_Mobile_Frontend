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
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader, EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import {
  INVITATION_COPY as COPY,
  INV_ACCENT,
  INV_GREEN,
  INV_NAVY,
  OCCASION_ICON,
  OCCASION_ICON_FALLBACK,
} from './constants';
import { mapInvitationList } from './utils';
import {
  useApproveInvitation,
  useGuests,
  useInvitation,
  useMyInvitations,
  usePersonalizeBlock,
  useRequestInvitationChange,
  useShareInvitation,
} from './hooks';
import { InvitationHero, OwnerBanner } from './sections/InvitationParts';
import { SectionRow } from './sections/SectionRow';
import { PersonalizeSheet, PreviewSheet, RequestChangeSheet, ShareSheet } from './sections/Sheets';
import { actionStyles as a, listStyles as l, sectionStyles as sec, styles } from './styles';
import type { GuestDTO, InvitationDTO, ShareOutcomeDTO } from './types';

type InvitationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Invitations'>;
type InvitationRouteProp = RouteProp<RootStackParamList, 'Invitations'>;

/** Which sheet is open, and what it is about. */
type Sheet =
  | { kind: 'personalize'; key: string }
  | { kind: 'request'; key?: string }
  /** `key` absent means the whole invitation — one sheet serves both. */
  | { kind: 'preview'; key?: string }
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
function InvitationDetail({ bookingId, organizerName }: { bookingId: string; organizerName?: string }) {
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

  const invitation = patched ?? data;
  const organizer = organizerName || 'Your organizer';

  /** Open asks per section, so a row can say the organizer already has one. */
  const pendingByBlock = useMemo(() => {
    const counts = new Map<string, number>();
    for (const request of invitation?.changeRequests ?? []) {
      counts.set(request.blockKey, (counts.get(request.blockKey) ?? 0) + 1);
    }
    return counts;
  }, [invitation]);

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <InvitationHero invitation={invitation} organizerName={organizer} />

        <View style={a.wrap}>
          {approved ? (
            <View style={a.approvedChip}>
              <EventlyIcon name="check-circle" size={18} color={INV_GREEN} />
              <EventlyText variant="subtitle" style={a.approvedChipText}>
                {COPY.approved}
              </EventlyText>
            </View>
          ) : (
            <TouchableOpacity
              style={a.primary}
              activeOpacity={0.85}
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
              accessibilityLabel={COPY.approve}
            >
              {approve.loading ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <EventlyIcon name="check" size={18} color={colors.onPrimary} />
              )}
              <EventlyText variant="subtitle" style={a.primaryText}>
                {approve.loading ? COPY.approving : COPY.approve}
              </EventlyText>
            </TouchableOpacity>
          )}

          <View style={a.secondaryRow}>
            <TouchableOpacity
              style={a.secondary}
              activeOpacity={0.8}
              onPress={() => setSheet({ kind: 'preview' })}
              accessibilityRole="button"
              accessibilityLabel={COPY.previewAll}
            >
              <EventlyIcon name="eye-outline" size={16} color={INV_NAVY} />
              <EventlyText variant="caption" style={a.secondaryText}>
                {COPY.previewSection}
              </EventlyText>
            </TouchableOpacity>

            {!approved ? (
              <TouchableOpacity
                style={a.secondary}
                activeOpacity={0.8}
                onPress={() => {
                  setRequestSent(false);
                  setSheet({ kind: 'request' });
                }}
                accessibilityRole="button"
                accessibilityLabel={COPY.requestChanges}
              >
                <EventlyIcon name="message-question-outline" size={16} color={INV_NAVY} />
                <EventlyText variant="caption" style={a.secondaryText}>
                  {COPY.requestChanges}
                </EventlyText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[a.secondary, a.share]}
                activeOpacity={0.85}
                onPress={() => openShare()}
                accessibilityRole="button"
                accessibilityLabel={COPY.shareAll}
              >
                <EventlyIcon name="whatsapp" size={16} color={colors.onPrimary} />
                <EventlyText variant="caption" style={a.shareText}>
                  {COPY.shareAll}
                </EventlyText>
              </TouchableOpacity>
            )}
          </View>

          {approve.error ? (
            <EventlyText variant="caption" style={a.errorText}>
              {approve.error.message}
            </EventlyText>
          ) : null}
          {requestSent ? (
            <EventlyText variant="caption" style={a.sentText}>
              {COPY.requestSent}
            </EventlyText>
          ) : null}
        </View>

        <OwnerBanner />

        <View style={sec.header}>
          <EventlyText variant="h2" style={sec.title}>
            {COPY.sections}
          </EventlyText>
          <EventlyText variant="caption" style={sec.count}>
            {invitation.blocks.length}
          </EventlyText>
        </View>

        {invitation.blocks.map((block) => (
          <SectionRow
            key={block.key}
            block={block}
            pendingRequests={pendingByBlock.get(block.key) ?? 0}
            canShare={approved}
            onPersonalize={() => setSheet({ kind: 'personalize', key: block.key })}
            onRequestChange={() => {
              setRequestSent(false);
              setSheet({ kind: 'request', key: block.key });
            }}
            onShare={() => openShare(block.key)}
            onPreview={() => setSheet({ kind: 'preview', key: block.key })}
          />
        ))}
      </ScrollView>

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
      <AppHeader title={bookingId ? COPY.detailTitle : COPY.listTitle} compact />
      {bookingId ? (
        <InvitationDetail bookingId={bookingId} organizerName={params?.organizerName} />
      ) : (
        <InvitationList />
      )}
    </SafeAreaView>
  );
}

export default InvitationScreen;
