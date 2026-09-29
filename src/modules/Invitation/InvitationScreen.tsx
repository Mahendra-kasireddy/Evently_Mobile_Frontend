import { useEffect, useMemo, useState } from 'react';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  InteractionManager,
  FlatList,
  Linking,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  EventlyIcon,
  EventlyText,
} from '../../Components';
import { colors } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import {
  INVITATION_COPY as COPY,
  INV_ACCENT,
  INV_GREEN,
  INV_NAVY_DEEP,
  OCCASION_ICON,
  OCCASION_ICON_FALLBACK,
} from './constants';
import { mapInvitationList } from './utils';
import {
  useApproveInvitation,
  useGuests,
  useInvitation,
  useMyInvitations,
  useRequestInvitationChange,
  useShareInvitation,
} from './hooks';
import {
  ArtworkPending,
  ArtworkViewer,
  InvitationArtwork,
  artworkOf,
} from './sections/InvitationArtwork';
import { CountdownBlock } from './sections/CountdownBlock';
import { LiveBlock } from './sections/LiveBlock';
import { MemoriesBlock, MemoriesOffCard } from './sections/MemoriesBlock';
import {
  AddMemorySheet,
  ConfirmMemorySheet,
  MemoryViewer,
} from './sections/MemorySheets';
import { useMemories, useMemoryUpload } from './memories.hooks';
import { absoluteFileUrl } from '../../services/urls';
import { SaveTheDate } from './sections/SaveTheDate';
import { StoryBlock } from './sections/StoryBlock';
import type { Artwork } from './sections/InvitationArtwork';
import { RequestChangeSheet, ShareSheet } from './sections/Sheets';
import {
  artworkStyles as w,
  listStyles as l,
  shellStyles as sh,
  styles,
} from './styles';
import type {
  GuestDTO,
  InvitationDTO,
  ShareOutcomeDTO,
} from './types';

type InvitationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Invitations'>;
type InvitationRouteProp = RouteProp<RootStackParamList, 'Invitations'>;

/** Which sheet is open, and what it is about. */
type Sheet =
  /** Telling the organizer what to change about the design they sent. */
  | { kind: 'request' }
  /** Sending the approved invitation to guests. */
  | { kind: 'share' }
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

/** The screen's own row: the arrow, its name, and the guest list. */
function InvitationBar({ onBack, onGuests }: { onBack: () => void; onGuests?: () => void }) {
  return (
    <View style={sh.bar}>
      <TouchableOpacity
        style={sh.back}
        activeOpacity={0.7}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        testID="invitation-back"
      >
        <EventlyIcon name="chevron-left" size={22} color={INV_NAVY_DEEP} />
      </TouchableOpacity>
      <EventlyText variant="subtitle" style={sh.barTitle} numberOfLines={1}>
        {COPY.artworkTitle}
      </EventlyText>
      {/* Only once there is something to send: a guest list on an invitation
          nobody has approved is a list with nothing to do. */}
      {onGuests ? (
        <TouchableOpacity
          style={sh.barAction}
          activeOpacity={0.8}
          onPress={onGuests}
          accessibilityRole="button"
          accessibilityLabel={COPY.artworkGuests}
          testID="invitation-guests"
        >
          <EventlyText variant="caption" style={sh.barActionText}>
            {COPY.artworkGuests}
          </EventlyText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/**
 * One booking's guest invitation.
 *
 * The invitation is a design, not a form: the organizer makes it in whatever
 * they already design in, uploads the finished image or video, and sends it.
 * So this screen is the artwork and the two decisions the customer has about
 * it — approve it, or ask for a change — and nothing else.
 *
 * Approving is the only thing that makes the guest link live, so nothing here
 * reaches a guest before the customer decides it should.
 */
function InvitationDetail({ bookingId }: { bookingId: string }) {
  const navigation = useNavigation<InvitationNavigationProp>();
  const { data, loading, error, refetch } = useInvitation(bookingId);
  const approve = useApproveInvitation();
  const requestChange = useRequestInvitationChange();
  const guestList = useGuests();
  const share = useShareInvitation();

  /** The server's latest copy, which any mutation returns. */
  const [patched, setPatched] = useState<InvitationDTO | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [viewing, setViewing] = useState(false);
  /*
   * What the full-screen viewer is showing. The invitation itself when it is
   * null, and a story photograph when it is not — one viewer rather than two,
   * because a story photo full screen is the same thing as the invitation
   * full screen with a different picture in it.
   */
  const [viewingPhoto, setViewingPhoto] = useState<Artwork | null>(null);
  const [guests, setGuests] = useState<GuestDTO[]>([]);
  /* Shared Memories: the sheet that is open, the item being viewed, and the
     one line about the last upload. */
  const [adding, setAdding] = useState(false);
  /*
   * Which picker to open once the sheet has actually gone.
   *
   * iOS will not present a view controller while another is still being
   * dismissed: launching the camera in the same tick as closing this sheet
   * silently does nothing at all, which is exactly how it behaved. So the
   * choice is remembered, the sheet closes, and the picker opens after the
   * dismissal has finished.
   */
  const [pendingPick, setPendingPick] = useState<'photo' | 'library' | 'reel' | null>(null);
  const [viewingMemory, setViewingMemory] = useState(-1);
  const [say, setSay] = useState('');
  const [sayWarn, setSayWarn] = useState(false);

  /*
   * The gallery and the uploader. Both are scoped to this booking, and both
   * ask the server what is allowed rather than deciding here — the section
   * simply does not exist when it answers no.
   */
  const memories = useMemories(bookingId);
  const upload = useMemoryUpload(bookingId);

  /*
   * Open the chosen picker once the sheet's dismissal animation has finished.
   *
   * `runAfterInteractions` rather than a timeout, and rather than the Modal's
   * `onDismiss`, which iOS fires but Android never does — one path that
   * behaves the same on both.
   */
  useEffect(() => {
    if (adding || !pendingPick) return;
    const action = pendingPick;
    setPendingPick(null);
    const task = InteractionManager.runAfterInteractions(() => {
      const open =
        action === 'photo'
          ? upload.takePhoto
          : action === 'library'
            ? upload.pickFromLibrary
            : upload.recordReel;
      open().catch(() => undefined);
    });
    return () => task.cancel();
  }, [adding, pendingPick, upload]);
  const [outcomes, setOutcomes] = useState<ShareOutcomeDTO[] | null>(null);

  const invitation = patched ?? data;

  const openShare = () => {
    setOutcomes(null);
    setSheet({ kind: 'share' });
    guestList
      .execute(bookingId)
      .then(setGuests)
      .catch(() => {
        // error surfaces through guestList.error
      });
  };

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
        <TouchableOpacity
          style={styles.retryButton}
          activeOpacity={0.8}
          onPress={refetch}
          accessibilityRole="button"
        >
          <EventlyIcon name="refresh" size={16} color={INV_ACCENT} />
          <EventlyText variant="caption" style={styles.retryText}>
            {COPY.retry}
          </EventlyText>
        </TouchableOpacity>
      </View>
    );
  }

  // null rather than an error: the organizer has not shared anything yet.
  if (!invitation) {
    return (
      <>
        <InvitationBar onBack={() => navigation.goBack()} />
        <ArtworkPending />
      </>
    );
  }

  const approved = invitation.status === 'approved';
  const artwork = artworkOf(invitation);

  return (
    <>
      <InvitationBar
        onBack={() => navigation.goBack()}
        onGuests={
          approved
            ? () =>
                navigation.navigate('GuestList', {
                  bookingId,
                  title: invitation.bookingTitle || invitation.occasion,
                })
            : undefined
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        {/* The invitation, then where it stands, then the two decisions. */}
        {artwork ? (
          <InvitationArtwork artwork={artwork} onView={() => setViewing(true)} />
        ) : (
          <ArtworkPending />
        )}

        {artwork ? (
          <>
            <View style={w.status}>
              <View style={[w.statusDot, approved && w.statusDotDone]} />
              <View style={w.statusText}>
                <EventlyText
                  variant="subtitle"
                  style={[w.statusTitle, approved && w.statusTitleDone]}
                >
                  {approved ? COPY.artworkApproved : COPY.artworkWaiting}
                </EventlyText>
                <EventlyText variant="caption" style={w.statusNote}>
                  {approved ? COPY.artworkApprovedNote : COPY.artworkWaitingNote}
                </EventlyText>
              </View>
            </View>

            <View style={w.actions}>
              {/* Before approval the one thing to do is approve; after it, the
                  one thing to do is send it. Never both at once. */}
              {approved ? (
                <TouchableOpacity
                  style={[w.approve, w.share]}
                  activeOpacity={0.9}
                  onPress={openShare}
                  accessibilityRole="button"
                  accessibilityLabel={COPY.shareAll}
                  testID="invitation-share"
                >
                  <EventlyIcon name="whatsapp" size={18} color={colors.onPrimary} />
                  <EventlyText variant="subtitle" style={w.approveText}>
                    {COPY.shareAll}
                  </EventlyText>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[w.approve, approve.loading && w.approveDisabled]}
                  activeOpacity={0.9}
                  disabled={approve.loading}
                  onPress={() =>
                    approve
                      .execute(bookingId)
                      .then(setPatched)
                      .catch(() => {
                        // error surfaces below
                      })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={COPY.artworkApprove}
                  testID="invitation-approve"
                >
                  {approve.loading ? (
                    <ActivityIndicator size="small" color={colors.onPrimary} />
                  ) : (
                    <EventlyIcon name="check" size={18} color={colors.onPrimary} />
                  )}
                  <EventlyText variant="subtitle" style={w.approveText}>
                    {approve.loading ? COPY.artworkApproving : COPY.artworkApprove}
                  </EventlyText>
                </TouchableOpacity>
              )}

              {/* Always available: approving ends this round, not the
                  conversation with the organizer. */}
              <TouchableOpacity
                style={w.ask}
                activeOpacity={0.85}
                onPress={() => {
                  setRequestSent(false);
                  setSheet({ kind: 'request' });
                }}
                accessibilityRole="button"
                accessibilityLabel={COPY.artworkAsk}
                testID="invitation-ask"
              >
                <EventlyIcon
                  name="message-question-outline"
                  size={17}
                  color={INV_NAVY_DEEP}
                />
                <EventlyText variant="subtitle" style={w.askText}>
                  {COPY.artworkAsk}
                </EventlyText>
              </TouchableOpacity>

              <EventlyText variant="caption" style={w.askNote}>
                {COPY.artworkAskNote}
              </EventlyText>

              {approve.error ? (
                <EventlyText variant="caption" style={w.errorText}>
                  {approve.error.message}
                </EventlyText>
              ) : null}
              {requestSent ? (
                <EventlyText variant="caption" style={w.sentText}>
                  {COPY.requestSent}
                </EventlyText>
              ) : null}
            </View>
          </>
        ) : null}

        {/*
         * The countdown, below the invitation. Independent of everything else
         * on the screen: it ticks whether or not the invitation is approved.
         */}
        {/*
         * The live stream, above the countdown: it is the thing happening
         * right now, and everything below it is what has not happened yet.
         * It renders itself away when nothing is on air.
         */}
        <LiveBlock subEvents={invitation.subEvents ?? []} />

        <CountdownBlock countdown={invitation.countdown ?? null} />

        {/*
         * Save the Date: one card per celebration. The list arrives already
         * filtered by the server, so nothing here decides who sees what.
         */}
        <SaveTheDate
          subEvents={invitation.subEvents ?? []}
          palette={invitation.cardPalette}
          defaultMinutes={invitation.defaultSubEventMinutes ?? 120}
          invitationName={invitation.bookingTitle || invitation.occasion}
        />

        {/*
         * The story, below the invitation and inside the same scroll — the
         * customer approves what their guests will get, so they have to be
         * able to see it. It renders itself away when there are no cards.
         */}
        {/*
         * Shared Memories, last: the invitation is what the hosts made, and
         * this is what everyone brought to it. The whole section is absent
         * unless the server says it exists for this person.
         */}
        {/* Known and off: offer the switch rather than showing nothing. */}
        {memories.known && !memories.enabled ? (
          <MemoriesOffCard
            busy={memories.loading}
            onEnable={() => memories.enable().catch(() => undefined)}
          />
        ) : null}

        {memories.canView ? (
          <MemoriesBlock
            gallery={memories.gallery}
            items={memories.items}
            kind={memories.kind}
            subEvent={memories.subEvent}
            paging={memories.paging}
            canUpload={memories.canUpload}
            say={say}
            sayWarn={sayWarn}
            onFilter={memories.changeFilter}
            onMore={() => memories.loadMore().catch(() => undefined)}
            onOpen={setViewingMemory}
            onAdd={() => setAdding(true)}
          />
        ) : null}

        <StoryBlock
          cards={invitation.storyCards ?? []}
          title={invitation.details.storyTitle ?? ''}
          onOpen={(imageUrl) => {
            setViewingPhoto({ kind: 'image', url: imageUrl, seconds: 0 });
            setViewing(true);
          }}
        />
      </ScrollView>

      <AddMemorySheet
        visible={adding}
        onClose={() => {
          setPendingPick(null);
          setAdding(false);
        }}
        onTakePhoto={() => {
          setPendingPick('photo');
          setAdding(false);
        }}
        onPickMedia={() => {
          setPendingPick('library');
          setAdding(false);
        }}
        onRecordReel={() => {
          setPendingPick('reel');
          setAdding(false);
        }}
      />

      <ConfirmMemorySheet
        picked={upload.picked}
        subEvents={memories.gallery?.subEvents ?? []}
        busy={upload.busy}
        progress={upload.progress}
        error={upload.error}
        onRetake={() => {
          upload.clear();
          setAdding(true);
        }}
        onCancel={upload.clear}
        onSend={(subEventId, caption) => {
          upload
            .send(subEventId, caption)
            .then((outcome) => {
            if (!outcome) return;
            /* The server's own sentence, shown as it arrives — duplicate,
               quality warning or waiting for approval are all its words. */
            setSay(outcome.message);
            setSayWarn(outcome.status === 'duplicate' || outcome.status === 'flagged');
            if (outcome.status !== 'duplicate') memories.load().catch(() => undefined);
            })
            .catch(() => undefined);
        }}
      />

      <MemoryViewer
        items={memories.items}
        index={viewingMemory}
        canDownload={memories.canDownload}
        onIndex={setViewingMemory}
        onClose={() => setViewingMemory(-1)}
        onDownload={(item) => {
          /* The original, and only because the server said downloads are on —
             the same permission it enforces on the guest route. */
          Linking.openURL(absoluteFileUrl(item.url)).catch(() => undefined);
        }}
      />

      {/* What a guest gets, whole, with nothing over it — the invitation, or
          whichever story photograph was tapped. */}
      <ArtworkViewer
        visible={viewing}
        artwork={viewingPhoto ?? artwork}
        onClose={() => {
          setViewing(false);
          setViewingPhoto(null);
        }}
      />

      <ShareSheet
        visible={sheet?.kind === 'share'}
        guests={guests}
        isLoadingGuests={guestList.loading}
        isSending={share.loading}
        errorMessage={share.error?.message ?? guestList.error?.message ?? null}
        outcomes={outcomes}
        onSend={(guestIds, newGuest) => {
          share
            .execute(bookingId, { guestIds, newGuests: newGuest ? [newGuest] : [] })
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

      <RequestChangeSheet
        visible={sheet?.kind === 'request'}
        isSending={requestChange.loading}
        errorMessage={requestChange.error?.message ?? null}
        onSend={(note) => {
          requestChange
            .execute(bookingId, note, undefined)
            .then(() => {
              setRequestSent(true);
              setSheet(null);
              // The ask is on the invitation now; the organizer has been told.
              refetch();
            })
            .catch(() => {
              // error surfaces in the sheet
            });
        }}
        onClose={() => setSheet(null)}
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
