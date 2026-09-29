import { useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import {
  INVITATION_COPY as COPY,
  INV_ACCENT_INK,
  INV_BLUSH_PETAL,
  INV_GOLD,
} from '../constants';
import { cardDate, clockLabel, venueOf } from '../saveTheDate';
import { liveStyles as s } from '../styles';
import { CornerBloom } from '../../../Components';
import { canEmbedStream, LivePlayer } from './LivePlayer';
import type { InvitationSubEventDTO } from '../types';

/** One way of watching, and where it goes. */
interface LiveMode {
  id: 'standard' | '360' | 'vr';
  label: string;
  /** Each way of watching has a mark, so the row reads before it is read. */
  icon: string;
  url: string;
}

/**
 * The event whose stream is on, or null.
 *
 * Read from the sub-events this screen was already handed, so the block needs
 * no request of its own and no second idea of what "live" means. A stream
 * switched on with no url is not live — a LIVE badge over nothing to watch is
 * worse than no badge at all.
 */
export function liveOf(subEvents: InvitationSubEventDTO[]): InvitationSubEventDTO | null {
  return (
    subEvents.find((e) => e.liveEnabled === true && (e.liveUrl ?? '').trim() !== '') ?? null
  );
}

/** The modes the organizer actually supplied a feed for. */
function modesOf(sub: InvitationSubEventDTO): LiveMode[] {
  const modes: LiveMode[] = [
    {
      id: 'standard',
      label: COPY.liveStandard,
      icon: 'television-play',
      url: (sub.liveUrl ?? '').trim(),
    },
  ];
  /*
   * Offered only when there is something behind them. A 360° control that
   * opens the flat feed is a promise the invitation cannot keep.
   */
  if ((sub.live360Url ?? '').trim()) {
    modes.push({
      id: '360',
      label: COPY.live360,
      icon: 'rotate-3d-variant',
      url: (sub.live360Url ?? '').trim(),
    });
  }
  if ((sub.liveVrUrl ?? '').trim()) {
    modes.push({
      id: 'vr',
      label: COPY.liveVr,
      icon: 'glasses',
      url: (sub.liveVrUrl ?? '').trim(),
    });
  }
  return modes;
}

interface LiveBlockProps {
  /** The customer's own sub-events — the same list Save the Date reads. */
  subEvents: InvitationSubEventDTO[];
}

/**
 * The live stream, on the customer's copy of the invitation.
 *
 * It opens the stream rather than embedding it. This app bundles no web view
 * and no video player, and adding one for a feed the platform does not host
 * would be a dependency carried by every screen for the sake of one — so the
 * phone's own browser or the streaming app takes over, which is where a guest
 * would end up anyway. The card says so rather than implying a player that is
 * not here.
 */
export function LiveBlock({ subEvents }: LiveBlockProps) {
  const sub = liveOf(subEvents);
  const [mode, setMode] = useState<LiveMode['id']>('standard');

  /* Nothing on: no block. Not an empty frame, not a heading over nothing —
     the same rule the story and Save the Date follow. */
  if (!sub) return null;

  const modes = modesOf(sub);
  const current = modes.find((m) => m.id === mode) ?? modes[0];
  if (!current) return null;

  const when = cardDate(sub.eventDate);
  const at = clockLabel(sub.eventTime);
  const where = venueOf(sub);

  return (
    <View style={s.block} testID="live-block">
      {/* Behind the words, at the two corners the reference decorates. */}
      <View style={s.bloomTop} pointerEvents="none">
        <CornerBloom size={104} petal={INV_BLUSH_PETAL} stem={INV_GOLD} />
      </View>
      <View style={s.bloomBottom} pointerEvents="none">
        <CornerBloom size={88} flip petal={INV_BLUSH_PETAL} stem={INV_GOLD} />
      </View>

      <View style={s.head}>
        <EventlyText variant="subtitle" style={s.heading}>
          {COPY.liveTitle}
        </EventlyText>
      </View>

      <View style={s.state}>
        <View style={s.badge}>
          <View style={s.pulse} />
          <EventlyText variant="caption" style={s.badgeText}>
            {COPY.liveBadge}
          </EventlyText>
        </View>
      </View>

      <EventlyText variant="h2" style={s.name} numberOfLines={2}>
        {sub.name}
      </EventlyText>
      {sub.liveTitle ? (
        <EventlyText variant="caption" style={s.lead}>
          {sub.liveTitle}
        </EventlyText>
      ) : null}

      {/* Only drawn when there is a choice to make. */}
      {modes.length > 1 ? (
        <View style={s.modes}>
          {modes.map((m) => {
            const on = m.id === current.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[s.mode, on && s.modeOn]}
                activeOpacity={0.9}
                onPress={() => setMode(m.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                testID={`live-mode-${m.id}`}
              >
                <EventlyIcon
                  name={m.icon}
                  size={15}
                  color={on ? colors.onPrimary : colors.text}
                />
                <EventlyText variant="caption" style={[s.modeText, on && s.modeTextOn]}>
                  {m.label}
                </EventlyText>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      {/*
        The stream itself, with the player's own controls inside the frame.
        The button below is not an alternative to it — it is what is left when
        the native side of the web view is not in the build yet, which is the
        case until the app is rebuilt after the dependency lands.
      */}
      {canEmbedStream ? (
        <LivePlayer uri={current.url} />
      ) : (
        <>
          <TouchableOpacity
            style={s.watch}
            activeOpacity={0.9}
            onPress={() => Linking.openURL(current.url).catch(() => undefined)}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.liveWatch} — ${sub.name}`}
            testID="live-watch"
          >
            <EventlyIcon name="play-circle-outline" size={18} color={colors.onPrimary} />
            <EventlyText variant="subtitle" style={s.watchText}>
              {COPY.liveWatch}
            </EventlyText>
          </TouchableOpacity>
          <EventlyText variant="caption" style={s.opens}>
            {COPY.liveOpens}
          </EventlyText>
        </>
      )}

      {when || where || sub.dressCode ? (
        <View style={s.details}>
          <View style={s.detailsBloom} pointerEvents="none">
            <CornerBloom size={74} petal={INV_BLUSH_PETAL} stem={INV_GOLD} />
          </View>

          <EventlyText variant="subtitle" style={s.detailsHead}>
            {COPY.liveDetails}
          </EventlyText>
          {when ? (
            <Fact icon="calendar-blank-outline" text={at ? `${when} · ${at}` : when} />
          ) : null}
          {where ? <Fact icon="map-marker-outline" text={where} /> : null}
          {sub.dressCode ? (
            <Fact icon="tshirt-crew-outline" label={COPY.liveDress} text={sub.dressCode} />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** One line of the details card: an icon, an optional label, and the text. */
function Fact({ icon, text, label }: { icon: string; text: string; label?: string }) {
  return (
    <View style={s.fact}>
      <View style={s.factTile}>
        <EventlyIcon name={icon} size={15} color={INV_ACCENT_INK} />
      </View>
      <View style={s.factBody}>
        {label ? (
          <EventlyText variant="caption" style={s.factLabel}>
            {label}
          </EventlyText>
        ) : null}
        <EventlyText variant="body" style={s.factText}>
          {text}
        </EventlyText>
      </View>
    </View>
  );
}

export default LiveBlock;
