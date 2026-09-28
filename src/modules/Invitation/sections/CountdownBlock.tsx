import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { INV_GOLD } from '../constants';
import { INVITATION_COPY as COPY } from '../constants';
import { colors } from '../../../theme';
import { countdownFrom, dateInZone, pad2, timeInZone } from '../countdown';
import { countdownStyles as s } from '../styles';
import type { InvitationCountdownDTO } from '../types';

/**
 * The live countdown to the event the organizer chose.
 *
 * One interval for the whole block, cleared when the target changes or the
 * screen goes — so a customer opening and closing the invitation cannot leave
 * timers running behind them.
 */
export function CountdownBlock({ countdown }: { countdown: InvitationCountdownDTO | null }) {
  const targetMs = countdown?.startsAt ? Date.parse(countdown.startsAt) : NaN;
  const valid = Number.isFinite(targetMs);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!valid) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [valid, targetMs]);

  /* No date on the record: there is nothing to count down to, and a row of
     zeros would read as "starting right now". */
  if (!countdown || !valid) return null;

  const { days, hours, minutes, seconds, passed } = countdownFrom(targetMs, now);
  const lines = (countdown.postEventMessage || COPY.countdownStarted)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const headline = lines[0] ?? '';
  const rest = lines.slice(1).join(' ');

  /*
   * The event's own date and time, printed in the event's zone — not the
   * phone's. A guest abroad is told when it starts where it is happening.
   */
  const when = [
    dateInZone(countdown.startsAt, countdown.timezone),
    timeInZone(countdown.startsAt, countdown.timezone),
  ]
    .filter(Boolean)
    .join(' · ');
  const venue = [countdown.venueName, countdown.venueAddress]
    .filter((v, i, a) => v && a.indexOf(v) === i)
    .join(', ');

  return (
    <View style={s.block}>
      {/* A hairline with a diamond on it — the same mark the web card is
          ruled with, drawn from the two pieces a stylesheet already has. */}
      <View style={s.flourish}>
        <View style={s.rule} />
        <View style={s.diamond} />
        <View style={s.rule} />
      </View>

      <EventlyText variant="caption" style={s.eyebrow}>
        {COPY.countdownTo.toUpperCase()}
      </EventlyText>
      {countdown.name ? (
        <EventlyText variant="h2" style={s.title} numberOfLines={2}>
          {countdown.name}
        </EventlyText>
      ) : null}

      {passed ? (
        /* Past the moment the timer is replaced, never run negative. The
           organizer's first line carries the announcement; anything after it
           is the note under it. */
        <View style={s.afterWrap}>
          <EventlyIcon name="heart-outline" size={22} color={INV_GOLD} />
          <EventlyText variant="h2" style={s.afterHead}>
            {headline}
          </EventlyText>
          {rest ? (
            <EventlyText variant="body" style={s.afterBody}>
              {rest}
            </EventlyText>
          ) : null}
        </View>
      ) : (
        <View style={s.row} accessibilityLabel={COPY.countdownRemaining}>
          <Unit value={String(days)} label={COPY.countdownDays} />
          <View style={s.dot} />
          <Unit value={pad2(hours)} label={COPY.countdownHours} />
          <View style={s.dot} />
          <Unit value={pad2(minutes)} label={COPY.countdownMinutes} />
          <View style={s.dot} />
          <Unit value={pad2(seconds)} label={COPY.countdownSeconds} />
        </View>
      )}

      {when || venue ? (
        <>
          <View style={s.divider}>
            <View style={s.rule} />
            <View style={s.rings}>
              <View style={s.ring} />
              <View style={[s.ring, s.ringOverlap]} />
            </View>
            <View style={s.rule} />
          </View>

          {when ? (
            <View style={s.fact}>
              <EventlyIcon name="calendar-blank-outline" size={14} color={colors.textMuted} />
              <EventlyText variant="body" style={s.factText}>
                {when}
              </EventlyText>
            </View>
          ) : null}
          {venue ? (
            <View style={s.fact}>
              <EventlyIcon name="map-marker-outline" size={14} color={colors.textMuted} />
              <EventlyText variant="body" style={s.factText} numberOfLines={3}>
                {venue}
              </EventlyText>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <View style={s.unit}>
      <EventlyText variant="h2" style={s.value}>
        {value}
      </EventlyText>
      <EventlyText variant="caption" style={s.unitLabel}>
        {label}
      </EventlyText>
    </View>
  );
}

export default CountdownBlock;
