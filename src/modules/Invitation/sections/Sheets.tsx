import { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { INVITATION_COPY as COPY, INV_ACCENT, INV_GREEN, INV_NAVY } from '../constants';
import {
  previewSheetStyles as p,
  sheetStyles as s,
  shellStyles as sh,
} from '../styles';
import type { BlockPatch, GuestDTO, InvitationBlockDTO, InvitationDTO, ShareOutcomeDTO } from '../types';
import { GuestPreview } from './InvitationParts';
import { GroupFilter } from '../../GuestList/sections/GroupFilter';
import { avatarColorFor, groupFilters, groupOf, initialsOf } from '../../GuestList/utils';
import type { GuestGroup } from '../../GuestList/types';

function Sheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable style={s.container} onPress={() => {}}>
          <View style={s.grabber} />
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface MenuSheetProps {
  visible: boolean;
  onPreview: () => void;
  onGuestList: () => void;
  onClose: () => void;
}

/**
 * Everything that is not a way of working on the invitation.
 *
 * Looking at it as a guest, and the list it would go to. Neither is a step in
 * assembling or approving it — one is a look at the finished thing and the
 * other is a different screen — so they sit behind the header's menu rather
 * than as a third tab and a stray button.
 */
export function MenuSheet({
  visible,
  onPreview,
  onGuestList,
  onClose,
}: MenuSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      <EventlyText variant="h2" style={s.title}>
        {COPY.menuTitle}
      </EventlyText>

      <TouchableOpacity
        style={sh.menuRow}
        activeOpacity={0.85}
        onPress={onPreview}
        accessibilityRole="button"
        accessibilityLabel={COPY.menuPreview}
        testID="menu-preview"
      >
        <View style={sh.menuIcon}>
          <EventlyIcon name="eye-outline" size={19} color={INV_ACCENT} />
        </View>
        <View style={sh.menuText}>
          <EventlyText variant="subtitle" style={sh.menuLabel}>
            {COPY.menuPreview}
          </EventlyText>
          <EventlyText variant="caption" style={sh.menuNote}>
            {COPY.menuPreviewNote}
          </EventlyText>
        </View>
        <EventlyIcon name="chevron-right" size={18} color={INV_ACCENT} />
      </TouchableOpacity>

      <TouchableOpacity
        style={sh.menuRow}
        activeOpacity={0.85}
        onPress={onGuestList}
        accessibilityRole="button"
        accessibilityLabel={COPY.menuGuests}
        testID="menu-guests"
      >
        <View style={sh.menuIcon}>
          <EventlyIcon
            name="account-multiple-outline"
            size={19}
            color={INV_ACCENT}
          />
        </View>
        <View style={sh.menuText}>
          <EventlyText variant="subtitle" style={sh.menuLabel}>
            {COPY.menuGuests}
          </EventlyText>
          <EventlyText variant="caption" style={sh.menuNote}>
            {COPY.menuGuestsNote}
          </EventlyText>
        </View>
        <EventlyIcon name="chevron-right" size={18} color={INV_ACCENT} />
      </TouchableOpacity>
    </Sheet>
  );
}

interface PreviewSheetProps {
  visible: boolean;
  invitation: InvitationDTO;
  /** One section, from its row's eye. Absent means the whole invitation. */
  blockKey?: string | undefined;
  /** Sharing needs a published invitation; a hidden section can never be sent. */
  canShare: boolean;
  onShare: () => void;
  onClose: () => void;
}

/**
 * A guest's view, on demand.
 *
 * Opened from a section's eye it shows that section under the invitation's own
 * header — the context a guest reads it in — and from the top action it shows
 * the whole thing. Either way it is what publishing would actually put in
 * front of a guest.
 *
 * Sending sits here rather than only on the row behind it: having just looked
 * at what a guest would receive is the moment a customer decides to send it,
 * and making them close the sheet to find the button loses that.
 */
export function PreviewSheet({
  visible,
  invitation,
  blockKey,
  canShare,
  onShare,
  onClose,
}: PreviewSheetProps) {
  const block = blockKey ? invitation.blocks.find((b) => b.key === blockKey) : undefined;
  const approved = invitation.status === 'approved';
  const hidden = block?.hidden ?? false;
  /* A hidden section is not part of the published invitation, and the API
     rejects sending one — so the button is withheld and the reason given. */
  const sendable = canShare && approved && !hidden;

  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={p.head}>
        <View style={p.headText}>
          <EventlyText variant="h2" style={p.title} numberOfLines={2}>
            {block ? COPY.previewSectionTitle(block.title) : COPY.previewTitle}
          </EventlyText>
          <View style={p.meta}>
            {block ? (
              <EventlyText
                variant="caption"
                style={block.owner === 'customer' ? p.ownerCustomer : p.metaText}
              >
                {block.owner === 'customer' ? COPY.previewOwnerCustomer : COPY.previewOwnerOrganizer}
              </EventlyText>
            ) : (
              <EventlyText variant="caption" style={p.metaText}>
                {invitation.blocks.filter((b) => !b.hidden).length} sections
              </EventlyText>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={p.close}
          activeOpacity={0.7}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={COPY.previewClose}
        >
          <EventlyIcon name="close" size={18} color={INV_NAVY} />
        </TouchableOpacity>
      </View>

      <GuestPreview invitation={invitation} blockKey={blockKey} />

      {sendable ? (
        <TouchableOpacity
          style={p.share}
          activeOpacity={0.85}
          onPress={onShare}
          accessibilityRole="button"
          accessibilityLabel={block ? COPY.previewShareSection : COPY.previewShareAll}
        >
          <EventlyIcon name="whatsapp" size={18} color={colors.onPrimary} />
          <EventlyText variant="subtitle" style={p.shareText}>
            {block ? COPY.previewShareSection : COPY.previewShareAll}
          </EventlyText>
        </TouchableOpacity>
      ) : (
        <View style={p.blockedNote}>
          <EventlyIcon name="information-outline" size={14} color={colors.textMuted} />
          <EventlyText variant="caption" style={p.blockedText}>
            {hidden ? COPY.previewShareHidden : COPY.previewShareNotApproved}
          </EventlyText>
        </View>
      )}
    </Sheet>
  );
}

interface PersonalizeSheetProps {
  block: InvitationBlockDTO | null;
  isSaving: boolean;
  errorMessage: string | null;
  onSave: (patch: BlockPatch) => void;
  onClose: () => void;
}

/**
 * Editing a section the customer owns.
 *
 * The heading is optional — left blank the section keeps its own name — and
 * hiding is offered here rather than as a separate control, because "I don't
 * want this section" and "I want it to say something else" are the same
 * decision made in the same place.
 */
export function PersonalizeSheet({ block, isSaving, errorMessage, onSave, onClose }: PersonalizeSheetProps) {
  const [heading, setHeading] = useState(block?.heading ?? '');
  const [body, setBody] = useState(block?.body ?? '');
  const [hidden, setHidden] = useState(block?.hidden ?? false);

  return (
    <Sheet visible={block !== null} onClose={onClose}>
      <EventlyText variant="h2" style={s.title}>
        {COPY.personalizeTitle}
      </EventlyText>
      <EventlyText variant="caption" style={s.subtitle}>
        {block?.title ?? ''}
      </EventlyText>

      <EventlyText variant="body" style={s.label}>
        {COPY.fieldHeading}
      </EventlyText>
      <EventlyText variant="caption" style={s.hint}>
        {COPY.fieldHeadingHint}
      </EventlyText>
      <TextInput
        style={s.input}
        value={heading}
        onChangeText={setHeading}
        maxLength={120}
        placeholder={block?.title ?? ''}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={COPY.fieldHeading}
      />

      <EventlyText variant="body" style={s.label}>
        {COPY.fieldBody}
      </EventlyText>
      <TextInput
        style={[s.input, s.inputMultiline]}
        value={body}
        onChangeText={setBody}
        maxLength={2000}
        multiline
        accessibilityLabel={COPY.fieldBody}
      />

      <TouchableOpacity
        style={s.toggleRow}
        activeOpacity={0.7}
        onPress={() => setHidden((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: hidden }}
        accessibilityLabel={COPY.fieldHide}
      >
        <View style={[s.checkbox, hidden && s.checkboxOn]}>
          {hidden ? <EventlyIcon name="check" size={14} color={colors.onPrimary} /> : null}
        </View>
        <EventlyText variant="body" style={s.toggleLabel}>
          {COPY.fieldHide}
        </EventlyText>
      </TouchableOpacity>

      {errorMessage ? (
        <EventlyText variant="caption" style={s.errorText}>
          {errorMessage}
        </EventlyText>
      ) : null}

      <TouchableOpacity
        style={[s.primary, isSaving && s.primaryDisabled]}
        activeOpacity={0.85}
        disabled={isSaving}
        onPress={() => onSave({ heading: heading.trim(), body: body.trim(), hidden })}
        accessibilityRole="button"
        accessibilityLabel={COPY.save}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <EventlyText variant="subtitle" style={s.primaryText}>
            {COPY.save}
          </EventlyText>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={s.secondary} activeOpacity={0.8} onPress={onClose} accessibilityRole="button">
        <EventlyText variant="subtitle" style={s.secondaryText}>
          {COPY.cancel}
        </EventlyText>
      </TouchableOpacity>
    </Sheet>
  );
}

interface RequestChangeSheetProps {
  visible: boolean;
  /** The section being asked about, or undefined for the whole invitation. */
  blockTitle?: string;
  isSending: boolean;
  errorMessage: string | null;
  onSend: (note: string) => void;
  onClose: () => void;
}

export function RequestChangeSheet({
  visible,
  blockTitle,
  isSending,
  errorMessage,
  onSend,
  onClose,
}: RequestChangeSheetProps) {
  const [note, setNote] = useState('');
  // The API requires at least three characters; enforcing it here means the
  // customer finds out before the round-trip rather than after it.
  const canSend = note.trim().length >= 3 && !isSending;

  return (
    <Sheet visible={visible} onClose={onClose}>
      <EventlyText variant="h2" style={s.title}>
        {COPY.requestTitle}
      </EventlyText>
      <EventlyText variant="caption" style={s.subtitle}>
        {blockTitle ? `${blockTitle} · ${COPY.requestSub}` : COPY.requestSub}
      </EventlyText>

      <EventlyText variant="body" style={s.label}>
        {COPY.requestField}
      </EventlyText>
      <TextInput
        style={[s.input, s.inputMultiline]}
        value={note}
        onChangeText={setNote}
        maxLength={2000}
        multiline
        placeholder={COPY.requestPlaceholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={COPY.requestField}
      />

      {errorMessage ? (
        <EventlyText variant="caption" style={s.errorText}>
          {errorMessage}
        </EventlyText>
      ) : null}

      <TouchableOpacity
        style={[s.primary, !canSend && s.primaryDisabled]}
        activeOpacity={0.85}
        disabled={!canSend}
        onPress={() => onSend(note.trim())}
        accessibilityRole="button"
        accessibilityLabel={COPY.requestSend}
      >
        {isSending ? (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <EventlyText variant="subtitle" style={s.primaryText}>
            {COPY.requestSend}
          </EventlyText>
        )}
      </TouchableOpacity>
    </Sheet>
  );
}

interface ShareSheetProps {
  visible: boolean;
  /** The section being sent, or undefined for the complete invitation. */
  sectionKey?: string;
  sectionTitle?: string;
  guests: GuestDTO[];
  isLoadingGuests: boolean;
  isSending: boolean;
  errorMessage: string | null;
  outcomes: ShareOutcomeDTO[] | null;
  onSend: (guestIds: string[], newGuest: { name: string; phone: string } | null) => void;
  onOpenHandoff: (url: string) => void;
  /** Opens the guest-list screen, where guests are added and filed. */
  onManageGuests: () => void;
  onClose: () => void;
}

/**
 * Sending the invitation to guests.
 *
 * Guests already on the list can be ticked; someone new can be typed in
 * without leaving the sheet — a number that already belongs to a guest
 * resolves to them server-side rather than creating a duplicate.
 *
 * The WhatsApp caveat is stated up front because we cannot verify a number has
 * WhatsApp: a message to one that does not simply never arrives, and the
 * customer should know that before they rely on it.
 */
export function ShareSheet({
  visible,
  sectionKey,
  sectionTitle,
  guests,
  isLoadingGuests,
  isSending,
  errorMessage,
  outcomes,
  onSend,
  onOpenHandoff,
  onManageGuests,
  onClose,
}: ShareSheetProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState<GuestGroup | null>(null);

  const filters = useMemo(() => groupFilters(guests), [guests]);
  const shown = useMemo(
    () => (activeGroup ? guests.filter((g) => groupOf(g) === activeGroup) : guests),
    [guests, activeGroup],
  );
  const activeLabel = filters.find((f) => f.key === activeGroup)?.label ?? '';

  /*
   * "Select all" means the chip that is showing, not the whole list. Ticking
   * Family and pressing it must not quietly select the sixty people the host
   * has just filtered out.
   */
  const allShown = shown.length > 0 && shown.every((g) => selected.includes(g.id));

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const toggleAll = () => {
    const ids = shown.map((g) => g.id);
    setSelected((prev) =>
      allShown ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])],
    );
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={s.shareHead}>
        <View style={s.shareHeadText}>
          <EventlyText variant="h2" style={s.title}>
            {COPY.shareHeading(sectionTitle)}
          </EventlyText>
          <EventlyText variant="caption" style={s.subtitle}>
            {COPY.shareLead}
          </EventlyText>
        </View>
        <TouchableOpacity
          style={s.shareClose}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <EventlyIcon name="close" size={17} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Results replace the picker: the send has happened, and what matters
          now is which of them actually went. */}
      {outcomes ? (
        <>
          {outcomes.map((outcome) => (
            <View key={outcome.guest.id} style={s.outcomeRow}>
              <EventlyIcon
                name={
                  outcome.status === 'sent'
                    ? 'check-circle'
                    : outcome.status === 'handoff'
                      ? 'open-in-new'
                      : 'alert-circle-outline'
                }
                size={18}
                color={
                  outcome.status === 'failed'
                    ? colors.danger
                    : outcome.status === 'sent'
                      ? INV_GREEN
                      : INV_ACCENT
                }
              />
              <EventlyText variant="body" style={s.outcomeText}>
                {outcome.guest.name}
                {outcome.status === 'failed' ? ` — ${outcome.error || COPY.shareFailed}` : ''}
              </EventlyText>
              {outcome.status === 'handoff' && outcome.handoffUrl ? (
                <TouchableOpacity
                  onPress={() => onOpenHandoff(outcome.handoffUrl as string)}
                  accessibilityRole="button"
                  accessibilityLabel={`${COPY.shareOpenWhatsapp} — ${outcome.guest.name}`}
                >
                  <EventlyText variant="caption" style={s.outcomeLink}>
                    {COPY.shareOpenWhatsapp}
                  </EventlyText>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}

          {outcomes.some((o) => o.status === 'handoff') ? (
            <View style={s.caveat}>
              <EventlyIcon name="information-outline" size={14} color={colors.textMuted} />
              <EventlyText variant="caption" style={s.caveatText}>
                {COPY.shareHandoff}
              </EventlyText>
            </View>
          ) : null}

          <TouchableOpacity style={s.primary} activeOpacity={0.85} onPress={onClose} accessibilityRole="button">
            <EventlyText variant="subtitle" style={s.primaryText}>
              {COPY.shareDone}
            </EventlyText>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* The same chips as the guest-list screen, so a group means the
              same thing on both and the filter is not learnt twice. */}
          <GroupFilter options={filters} active={activeGroup} onChange={setActiveGroup} />

          <View style={s.selectRow}>
            <EventlyText variant="caption" style={s.selectCount}>
              {COPY.shareSelected(selected.length)}
            </EventlyText>
            {shown.length > 0 ? (
              <TouchableOpacity
                onPress={toggleAll}
                accessibilityRole="button"
                accessibilityLabel={allShown ? COPY.shareClearAll : COPY.shareSelectAll}
              >
                <EventlyText variant="caption" style={s.selectAll}>
                  {allShown ? COPY.shareClearAll : COPY.shareSelectAll}
                </EventlyText>
              </TouchableOpacity>
            ) : null}
          </View>

          {isLoadingGuests ? (
            <ActivityIndicator size="small" color={colors.primary} style={s.guestsLoading} />
          ) : shown.length === 0 ? (
            <EventlyText variant="body" style={s.emptyGuests}>
              {/* Which empty is it — nobody at all, or nobody under this chip? */}
              {guests.length === 0 ? COPY.shareNoGuests : COPY.shareEmptyGroup(activeLabel)}
            </EventlyText>
          ) : (
            shown.map((guest) => {
              const on = selected.includes(guest.id);
              const already = sectionKey
                ? guest.sharedSections.includes(sectionKey)
                : guest.sharedSections.includes('');
              return (
                <TouchableOpacity
                  key={guest.id}
                  style={s.guestRow}
                  activeOpacity={0.7}
                  onPress={() => toggle(guest.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={`${guest.name}, ${guest.phoneDisplay}`}
                >
                  <View style={[s.guestAvatar, { backgroundColor: avatarColorFor(guest.name) }]}>
                    <EventlyText variant="caption" style={s.guestAvatarText}>
                      {initialsOf(guest.name)}
                    </EventlyText>
                  </View>
                  <View style={s.guestText}>
                    <EventlyText variant="body" style={s.guestName} numberOfLines={1}>
                      {guest.name}
                    </EventlyText>
                    <EventlyText variant="caption" style={s.guestMeta} numberOfLines={1}>
                      {guest.phoneDisplay}
                    </EventlyText>
                  </View>
                  {/* Said on the row rather than as a badge column: it is the
                      one fact that changes whether ticking them again is a
                      duplicate message or a first one. */}
                  {already ? (
                    <EventlyText variant="caption" style={s.guestSent}>
                      {COPY.shareAlreadySent}
                    </EventlyText>
                  ) : null}
                  <View style={[s.checkbox, on && s.checkboxOn]}>
                    {on ? <EventlyIcon name="check" size={13} color={colors.onPrimary} /> : null}
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          <View style={s.caveat}>
            <EventlyIcon name="information-outline" size={14} color={colors.textMuted} />
            <EventlyText variant="caption" style={s.caveatText}>
              {COPY.shareWhatsappCaveat}
            </EventlyText>
          </View>

          {errorMessage ? (
            <EventlyText variant="caption" style={s.errorText}>
              {errorMessage}
            </EventlyText>
          ) : null}

          {/*
            Disabled until somebody is ticked, and it says which step is
            missing rather than offering a send that would do nothing.
          */}
          <TouchableOpacity
            style={[
              s.primary,
              isSending && s.primaryDisabled,
              selected.length === 0 && !isSending && s.primaryInert,
            ]}
            activeOpacity={0.85}
            disabled={isSending || selected.length === 0}
            onPress={() => onSend(selected, null)}
            accessibilityRole="button"
            accessibilityLabel={
              selected.length === 0 ? COPY.sharePickFirst : COPY.shareSendTo(selected.length)
            }
          >
            {isSending ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <EventlyIcon
                name={selected.length === 0 ? 'arrow-right' : 'whatsapp'}
                size={18}
                color={selected.length === 0 ? colors.textMuted : colors.onPrimary}
              />
            )}
            <EventlyText
              variant="subtitle"
              style={[s.primaryText, selected.length === 0 && s.primaryTextDisabled]}
            >
              {isSending
                ? COPY.shareSending
                : selected.length === 0
                  ? COPY.sharePickFirst
                  : COPY.shareSendTo(selected.length)}
            </EventlyText>
          </TouchableOpacity>

          {/* Adding and correcting guests belongs on its own screen, which
              also files them into the groups this sheet filters by. */}
          <TouchableOpacity
            style={s.manageGuests}
            activeOpacity={0.7}
            onPress={onManageGuests}
            accessibilityRole="button"
            accessibilityLabel={COPY.shareManageGuests}
          >
            <EventlyText variant="subtitle" style={s.manageGuestsText}>
              {COPY.shareManageGuests}
            </EventlyText>
          </TouchableOpacity>
        </>
      )}
    </Sheet>
  );
}

export { INV_NAVY };
