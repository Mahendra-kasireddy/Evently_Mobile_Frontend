import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  EventlyIcon,
  EventlyText,
  EventlyTextInput,
  FadeInUp,
  GradientFill,
  PopIn,
  PressableScale,
} from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import {
  GUEST_ACCENT,
  GUEST_COPY as COPY,
  GUEST_MUTED,
  GUEST_NAVY,
} from './constants';
import { useGuestListContainer } from './container';
import { GroupFilter } from './sections/GroupFilter';
import { GuestRow } from './sections/GuestRow';
import { ContactsSheet } from './sections/ContactsSheet';
import { EventPicker } from './sections/EventPicker';
import { GuestSheet } from './sections/GuestSheet';
import { GuestStats } from './sections/GuestStats';
import { useContactsImport } from './useContactsImport';
import { emptyStyles as e, footerStyles as f, styles as s } from './styles';

const ADD_GRADIENT: [string, string] = ['#f47b4d', '#e2477a'];
const CONTACTS_GRADIENT: [string, string] = ['#5b9bff', '#2554b8'];

type GuestListRouteProp = RouteProp<RootStackParamList, 'GuestList'>;
type GuestListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Everyone the customer is inviting.
 *
 * The list is the invitation's own guest record — the same people the share
 * sheet sends to — so adding somebody here and sending to them later are two
 * halves of one list rather than two lists that drift.
 *
 * Nothing on this screen sends anything. A guest added here has not been
 * invited; the invitation screen is where that happens, which is why the
 * header counts guests and, separately, how many have been sent to.
 */
export function GuestListScreen() {
  const navigation = useNavigation<GuestListNavigationProp>();
  const { params } = useRoute<GuestListRouteProp>();
  const bookingId = params?.bookingId ?? '';

  return bookingId ? (
    <GuestListForBooking
      bookingId={bookingId}
      title={params?.title ?? ''}
      onBack={() => navigation.goBack()}
    />
  ) : (
    <SafeAreaView style={s.container} edges={['top']}>
      <AppHeader title={COPY.title} onBackPress={() => navigation.goBack()} />
      {/*
        Opened from Profile, where there is no event in hand. `push`, not
        `navigate`: navigating to the screen already on top would only swap its
        params, and back from a guest list should land on this chooser.
      */}
      <EventPicker
        onPick={(picked, pickedTitle) =>
          navigation.push('GuestList', {
            bookingId: picked,
            title: pickedTitle,
          })
        }
      />
    </SafeAreaView>
  );
}

/**
 * One event's guest list.
 *
 * Split out so every hook below runs only once a booking is known — a
 * container called with '' would fetch a guest list for no event, and hooks
 * cannot be skipped with an early return.
 */
function GuestListForBooking({
  bookingId,
  title,
  onBack,
}: {
  bookingId: string;
  /** The event's own name. '' falls back to the screen's, never to a guess. */
  title: string;
  onBack: () => void;
}) {
  const c = useGuestListContainer(bookingId);
  const contacts = useContactsImport();

  const header = (
    <>
      {/*
        The event's name, because that is what tells one guest list from
        another — a host with three events running would otherwise see three
        identical headers. Falls back to the screen's own name when whoever
        opened it had none to pass.
      */}
      <AppHeader title={title || COPY.title} onBackPress={onBack} />
      {c.summary ? (
        <EventlyText variant="small" style={s.subtitle}>
          {c.summary}
        </EventlyText>
      ) : null}
    </>
  );

  if (c.isLoading && c.isEmpty) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <ActivityIndicator size="large" color={GUEST_ACCENT} />
          <EventlyText variant="body" style={s.centeredText}>
            {COPY.loading}
          </EventlyText>
        </View>
      </SafeAreaView>
    );
  }

  if (c.isError && c.isEmpty) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        {header}
        <View style={s.centered}>
          <EventlyText variant="sectionTitle" style={s.errorTitle}>
            {COPY.errorTitle}
          </EventlyText>
          <EventlyText variant="body" style={s.centeredText}>
            {c.errorMessage ?? ''}
          </EventlyText>
          <TouchableOpacity
            style={s.retry}
            activeOpacity={0.8}
            onPress={c.refetch}
            accessibilityRole="button"
          >
            <EventlyIcon name="refresh" size={16} color={GUEST_ACCENT} />
            <EventlyText variant="label" style={s.retryText}>
              {COPY.retry}
            </EventlyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* Which empty is it — no guests at all, or none under this chip? Telling a
     host with forty guests "No guests yet" because Work is empty is wrong. */
  const activeLabel =
    c.filters.find(option => option.key === c.activeGroup)?.label ?? '';
  const importing = c.isImporting || contacts.isLoading;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <AppHeader title={title || COPY.title} onBackPress={onBack} />

      {c.isEmpty ? (
        /* No guests at all: the two ways in, side by side — not a bare
           sentence above a button. */
        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={e.wrap}>
            <PopIn>
              <View style={e.art}>
                <EventlyIcon
                  name="account-multiple-plus-outline"
                  size={40}
                  color={GUEST_ACCENT}
                />
              </View>
            </PopIn>
            <EventlyText style={e.title}>{COPY.emptyLead}</EventlyText>
            <EventlyText variant="body" style={e.body}>
              {COPY.emptyHint}
            </EventlyText>
            <View style={e.actions}>
              <PressableScale
                style={e.action}
                onPress={contacts.open}
                disabled={importing}
                accessibilityRole="button"
                accessibilityLabel={COPY.fromContacts}
              >
                <View style={e.actionIcon}>
                  <GradientFill
                    colors={CONTACTS_GRADIENT}
                    direction="diagonal"
                  />
                  {importing ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <EventlyIcon
                      name="contacts-outline"
                      size={22}
                      color="#ffffff"
                    />
                  )}
                </View>
                <EventlyText style={e.actionTitle}>
                  {COPY.emptyContactsTitle}
                </EventlyText>
                <EventlyText style={e.actionBody}>
                  {COPY.emptyContactsBody}
                </EventlyText>
              </PressableScale>
              <PressableScale
                style={e.action}
                onPress={c.openAdd}
                accessibilityRole="button"
                accessibilityLabel={COPY.addGuest}
              >
                <View style={e.actionIcon}>
                  <GradientFill colors={ADD_GRADIENT} direction="diagonal" />
                  <EventlyIcon
                    name="account-plus-outline"
                    size={22}
                    color="#ffffff"
                  />
                </View>
                <EventlyText style={e.actionTitle}>
                  {COPY.emptyManualTitle}
                </EventlyText>
                <EventlyText style={e.actionBody}>
                  {COPY.emptyManualBody}
                </EventlyText>
              </PressableScale>
            </View>
          </View>
        </ScrollView>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={s.listScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            stickyHeaderIndices={[2]}
          >
            <GuestStats stats={c.stats} />

            <View style={s.search}>
              <EventlyIcon name="magnify" size={20} color={GUEST_MUTED} />
              <EventlyTextInput
                style={s.searchInput}
                value={c.query}
                onChangeText={c.setQuery}
                placeholder={COPY.searchPlaceholder}
                autoCorrect={false}
                returnKeyType="search"
                accessibilityLabel={COPY.searchPlaceholder}
              />
              {c.query ? (
                <TouchableOpacity
                  onPress={() => c.setQuery('')}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                >
                  <EventlyIcon
                    name="close-circle"
                    size={18}
                    color={GUEST_MUTED}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Stays under the header while the list scrolls. */}
            <View style={s.sticky}>
              <GroupFilter
                options={c.filters}
                active={c.activeGroup}
                onChange={c.setActiveGroup}
              />
            </View>

            {/* What the last import did, and what it could not take. */}
            {c.notice ? (
              <TouchableOpacity
                style={s.notice}
                activeOpacity={0.8}
                onPress={c.dismissNotice}
                accessibilityRole="button"
                accessibilityLabel={c.notice}
              >
                <EventlyIcon
                  name="information-outline"
                  size={16}
                  color={GUEST_NAVY}
                />
                <EventlyText variant="small" style={s.noticeText}>
                  {c.notice}
                </EventlyText>
              </TouchableOpacity>
            ) : null}

            <View style={s.content}>
              {c.rows.length === 0 ? (
                <EventlyText variant="body" style={s.noMatch}>
                  {c.query
                    ? COPY.noMatch(c.query)
                    : COPY.emptyGroup(activeLabel)}
                </EventlyText>
              ) : (
                c.rows.map((guest, i) => (
                  <FadeInUp key={guest.id} delay={Math.min(i, 8) * 30}>
                    <GuestRow guest={guest} onEdit={() => c.openEdit(guest)} />
                  </FadeInUp>
                ))
              )}
            </View>
          </ScrollView>

          <View style={f.bar}>
            <PressableScale
              style={f.contacts}
              disabled={importing}
              onPress={contacts.open}
              accessibilityRole="button"
              accessibilityLabel={COPY.fromContacts}
            >
              {importing ? (
                <ActivityIndicator size="small" color={GUEST_NAVY} />
              ) : (
                <EventlyIcon
                  name="contacts-outline"
                  size={20}
                  color={GUEST_NAVY}
                />
              )}
              <EventlyText style={f.contactsText}>
                {COPY.contactsShort}
              </EventlyText>
            </PressableScale>

            <PressableScale
              style={[f.cta, c.isImporting && f.ctaBusy]}
              onPress={c.openAdd}
              accessibilityRole="button"
              accessibilityLabel={COPY.addGuest}
            >
              <GradientFill colors={ADD_GRADIENT} direction="across" />
              <EventlyIcon name="plus" size={20} color="#ffffff" />
              <EventlyText style={f.ctaText}>{COPY.addGuest}</EventlyText>
            </PressableScale>
          </View>
        </>
      )}

      <ContactsSheet
        candidates={contacts.candidates}
        isSaving={c.isImporting}
        onAdd={guests => {
          contacts.close();
          c.importGuests(guests);
        }}
        onClose={contacts.close}
      />

      <GuestSheet
        visible={c.sheetOpen}
        initial={c.editing}
        isSaving={c.isSaving}
        errorMessage={c.saveError}
        onSave={c.save}
        onClose={c.closeSheet}
        addedName={c.addedName}
        addedTick={c.addedTick}
      />
    </SafeAreaView>
  );
}

export default GuestListScreen;
