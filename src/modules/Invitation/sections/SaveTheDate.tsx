import { Linking, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { INVITATION_COPY as COPY, INV_NAVY_DEEP } from '../constants';
import { cardDate, cardTone, clockLabel, dayOfWeek, venueOf } from '../saveTheDate';
import { saveTheDateStyles as s } from '../styles';
import type { CardColourDTO, InvitationSubEventDTO } from '../types';

interface SaveTheDateProps {
  /** Already filtered by the server — nothing here decides who sees what. */
  subEvents: InvitationSubEventDTO[];
  palette: CardColourDTO[] | undefined;
  /** Duration a calendar entry gets when a card has no end time. */
  defaultMinutes: number;
  /** The celebration these cards belong to, named inside the calendar entry. */
  invitationName: string;
}

/**
 * Google Calendar's template URL for one card.
 *
 * The handoff the phone can always make: `Linking` opens it in the calendar
 * app when one is installed and in the browser otherwise, and the guest
 * confirms there. Nothing is written to a calendar by this app, which is why
 * dismissing the prompt adds nothing.
 *
 * The web invitation offers an `.ics` file as well, which is what iOS prefers;
 * writing one here would need a file-system dependency this app does not have,
 * so the one URL serves both platforms.
 */
function calendarUrl(
  sub: InvitationSubEventDTO,
  defaultMinutes: number,
  invitationName: string,
): string | null {
  const start = instantOf(sub.eventDate, sub.eventTime, sub.timezone ?? 'UTC');
  if (start === null) return null;

  const explicitEnd = sub.endTime
    ? instantOf(sub.eventDate, sub.endTime, sub.timezone ?? 'UTC')
    : null;
  /* An end before the start reads as crossing midnight — a reception running
     to 01:00 is ordinary — so it rolls a day rather than going negative. */
  const end =
    explicitEnd === null
      ? start + Math.max(1, defaultMinutes) * 60_000
      : explicitEnd <= start
        ? explicitEnd + 86_400_000
        : explicitEnd;

  const details = [invitationName, sub.dressCode && `Dress code: ${sub.dressCode}`, sub.note]
    .filter(Boolean)
    .join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: sub.name,
    dates: `${stamp(start)}/${stamp(end)}`,
  });
  const where = venueOf(sub);
  if (where) params.set('location', where);
  if (details) params.set('details', details);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** `20261009T043000Z` — the UTC form Google's template expects. */
function stamp(instantMs: number): string {
  const d = new Date(instantMs);
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}00Z`
  );
}

/**
 * A wall-clock date and time in a zone, as a UTC instant.
 *
 * Two passes, because a zone's offset depends on the instant being asked
 * about: the first gets close, the second settles it across a DST boundary.
 * The same method the server and the web client use.
 */
function instantOf(date: string, time: string, timeZone: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const clock = /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? time : '00:00';
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const [hh, mm] = clock.split(':').map(Number) as [number, number];

  let zone = timeZone;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone }).format(0);
  } catch {
    zone = 'UTC';
  }

  const wallAsUtc = Date.UTC(y, m - 1, d, hh, mm, 0, 0);
  if (Number.isNaN(wallAsUtc)) return null;
  let instant = wallAsUtc - offsetAt(wallAsUtc, zone);
  instant = wallAsUtc - offsetAt(instant, zone);
  return instant;
}

function offsetAt(instantMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instantMs));
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return (
    Date.UTC(read('year'), read('month') - 1, read('day'), read('hour'), read('minute'), read('second')) -
    instantMs
  );
}

/**
 * Save the Date: one card per celebration this guest is invited to.
 *
 * An itinerary rather than a list — each card carries one celebration and the
 * one thing anyone wants to do about it, which is put it in their diary.
 */
export function SaveTheDate({
  subEvents,
  palette,
  defaultMinutes,
  invitationName,
}: SaveTheDateProps) {
  /*
   * The visibility rule: no cards, no block. Not an empty frame and not a
   * heading over nothing.
   */
  if (subEvents.length === 0) return null;

  return (
    <View style={s.block}>
      <View style={s.flourish}>
        <View style={s.rule} />
        <View style={s.diamond} />
        <View style={s.rule} />
      </View>
      <EventlyText variant="caption" style={s.title}>
        {COPY.saveTheDateTitle.toUpperCase()}
      </EventlyText>
      <EventlyText variant="h2" style={s.lead}>
        {COPY.saveTheDateLead}
      </EventlyText>

      {subEvents.map((sub, index) => {
        const tone = cardTone(sub.colour, palette, INV_NAVY_DEEP);
        const url = calendarUrl(sub, defaultMinutes, invitationName);
        const when = [dayOfWeek(sub.eventDate), cardDate(sub.eventDate)]
          .filter(Boolean)
          .join(' · ');
        const time = clockLabel(sub.eventTime);
        const ends = clockLabel(sub.endTime);

        return (
          <View
            key={sub.id || `${sub.name}-${index}`}
            style={[s.card, { backgroundColor: tone.wash, borderColor: `${tone.ink}22` }]}
          >
            <View style={[s.edge, { backgroundColor: tone.ink }]} />

            <EventlyText variant="h2" style={[s.name, { color: tone.ink }]} numberOfLines={2}>
              {sub.name}
            </EventlyText>

            {when ? (
              <Fact icon="calendar-blank-outline" text={when} strong />
            ) : null}
            {time ? <Fact icon="clock-outline" text={ends ? `${time} – ${ends}` : time} /> : null}

            <View style={[s.hair, { backgroundColor: tone.ink }]} />

            {sub.venueName ? (
              <Fact
                icon="map-marker-outline"
                text={sub.venueName}
                sub={sub.venueAddress !== sub.venueName ? sub.venueAddress : ''}
              />
            ) : null}
            {sub.dressCode ? (
              <Fact icon="tshirt-crew-outline" label={COPY.saveTheDateDress} sub={sub.dressCode} />
            ) : null}

            {sub.note ? (
              <EventlyText variant="body" style={[s.note, { color: tone.ink }]}>
                {sub.note}
              </EventlyText>
            ) : null}

            <TouchableOpacity
              style={[s.add, { backgroundColor: tone.ink }, !url && s.addOff]}
              activeOpacity={0.9}
              disabled={!url}
              onPress={() => {
                if (url) Linking.openURL(url).catch(() => undefined);
              }}
              accessibilityRole="button"
              accessibilityLabel={`${COPY.saveTheDateAdd} — ${sub.name}`}
              testID={`save-the-date-add-${index}`}
            >
              <EventlyIcon name="calendar-plus" size={16} color={colors.onPrimary} />
              <EventlyText variant="subtitle" style={s.addText}>
                {COPY.saveTheDateAdd}
              </EventlyText>
            </TouchableOpacity>

            {/* A card with no date has nothing to put in a calendar; saying so
                beats a button that silently does nothing. */}
            {!url ? (
              <EventlyText variant="caption" style={s.noDate}>
                {COPY.saveTheDateNoDate}
              </EventlyText>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

/** One line of a card: an icon, and what it says. */
function Fact({
  icon,
  text,
  sub,
  label,
  strong,
}: {
  icon: string;
  text?: string;
  sub?: string;
  label?: string;
  strong?: boolean;
}) {
  return (
    <View style={s.fact}>
      <EventlyIcon name={icon} size={14} color={colors.textMuted} />
      <View style={s.factText}>
        {label ? (
          <EventlyText variant="caption" style={s.factLabel}>
            {label}
          </EventlyText>
        ) : null}
        {text ? (
          <EventlyText variant="body" style={[s.factValue, strong && s.factStrong]}>
            {text}
          </EventlyText>
        ) : null}
        {sub ? (
          <EventlyText variant="caption" style={s.factSub}>
            {sub}
          </EventlyText>
        ) : null}
      </View>
    </View>
  );
}

export default SaveTheDate;
