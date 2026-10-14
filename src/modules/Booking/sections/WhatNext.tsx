import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  EventlyIcon,
  EventlyText,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { nextStyles as s } from '../styles';

/**
 * The "night out" scene: a tilted ticket, a microphone and a spotlight on a
 * soft pink glow, with gold sparkles. Drawn from icons so it scales cleanly.
 */
function NightOutArt() {
  return (
    <View style={s.art} pointerEvents="none">
      <View style={[s.blob, s.blobPink]} />
      <View style={s.artSpot}>
        <EventlyIcon
          name="spotlight-beam"
          size={44}
          color="rgba(232,67,111,0.22)"
        />
      </View>
      <View style={s.artTicket}>
        <EventlyIcon name="ticket-confirmation" size={74} color="#ea4f7d" />
      </View>
      <View style={s.artMic}>
        <EventlyIcon name="microphone-variant" size={50} color="#4b2a6b" />
      </View>
      <View style={s.artStar1}>
        <EventlyIcon name="star-four-points" size={16} color="#f5b942" />
      </View>
      <View style={s.artStar2}>
        <EventlyIcon name="star-four-points" size={11} color="#f5b942" />
      </View>
    </View>
  );
}

/** The "plan" scene: a dressed table with glasses and flowers on lavender. */
function PlanArt() {
  return (
    <View style={s.art} pointerEvents="none">
      <View style={[s.blob, s.blobViolet]} />
      <View style={s.artTable}>
        <EventlyIcon name="table-furniture" size={78} color="#b9a6f2" />
      </View>
      <View style={s.artFlower}>
        <EventlyIcon name="flower-tulip-outline" size={34} color="#e2779b" />
      </View>
      <View style={s.artGlass}>
        <EventlyIcon name="glass-wine" size={26} color="#8f7ae0" />
      </View>
      <View style={s.artStar1}>
        <EventlyIcon name="star-four-points" size={13} color="#f5b942" />
      </View>
    </View>
  );
}

const CARDS = [
  {
    key: 'events',
    icon: 'ticket-confirmation',
    title: 'Find your next night out',
    body: 'Shows, workshops and live events near you.',
    cta: 'Explore Events',
    wash: ['#fff3ee', '#ffe1d8'] as [string, string],
    mark: ['#ff8a5c', '#e8436f'] as [string, string],
    button: ['#ff8a5c', '#e8436f'] as [string, string],
    ink: '#d2522a',
    Art: NightOutArt,
  },
  {
    key: 'plan',
    icon: 'calendar-heart',
    title: 'Plan your own celebration',
    body: 'Tell us the occasion — organizers send you quotes.',
    cta: 'Plan Event',
    wash: ['#f6f2ff', '#e9e1ff'] as [string, string],
    mark: ['#a084ff', '#5a35e0'] as [string, string],
    button: ['#8f6dff', '#5a35e0'] as [string, string],
    ink: '#5a35e0',
    Art: PlanArt,
  },
] as const;

/**
 * Below a short list of bookings: the two ways to book something else, as
 * illustrated cards with one clear button each — so the screen ends with a
 * next step rather than empty space.
 */
export function WhatNext({
  onEvents,
  onPlan,
}: {
  onEvents: () => void;
  onPlan: () => void;
}) {
  return (
    <View style={s.wrap}>
      <View style={s.head}>
        <EventlyIcon name="star-four-points" size={22} color="#f0785a" />
        <View>
          <EventlyText style={s.title}>Book something new</EventlyText>
          {/* A hand-drawn underline under "Book". */}
          <Svg width={64} height={8} style={s.squiggle}>
            <Path
              d="M2 6 C 16 1, 34 1, 62 4"
              stroke="#f0785a"
              strokeWidth={2.4}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </View>
      </View>
      <EventlyText style={s.sub}>
        Tickets and planned events both land here.
      </EventlyText>

      {CARDS.map(c => {
        const go = c.key === 'events' ? onEvents : onPlan;
        return (
          <PressableScale
            key={c.key}
            style={s.card}
            onPress={go}
            accessibilityRole="button"
            accessibilityLabel={`${c.title}. ${c.cta}`}
            testID={`bookings-next-${c.key}`}
          >
            <GradientFill colors={c.wash} direction="diagonal" />
            <c.Art />

            <View style={s.titleRow}>
              <View style={s.icon}>
                <GradientFill colors={c.mark} direction="diagonal" />
                <EventlyIcon name={c.icon} size={24} color="#ffffff" />
              </View>
              <EventlyText style={s.cardTitle} numberOfLines={1}>
                {c.title}
              </EventlyText>
            </View>
            <EventlyText style={s.cardBody}>{c.body}</EventlyText>
            <View style={s.button}>
              <GradientFill colors={c.button} direction="across" />
              <EventlyText style={s.buttonText}>{c.cta}</EventlyText>
              <EventlyIcon name="arrow-right" size={15} color="#ffffff" />
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

export default WhatNext;
