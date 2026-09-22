import { TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyIcon, EventlyText, OccasionArt } from '../../../Components';
import { CATEGORY_GRADIENT, HERO_ACCENT_COLOR } from '../constants';
import { eventRowStyles as s } from '../styles';
import { eventArtFor, eventDateChip } from '../utils';
import type { CurrentEventViewModel } from '../types';

interface EventRowProps {
  event: CurrentEventViewModel;
  onPress: () => void;
  /**
   * Opens the brief for editing. Passed only while nobody has been hired off
   * it — past that there is a booking, and the terms are no longer the
   * customer's alone to change.
   */
  onEdit?: () => void;
}

/**
 * A second, third or tenth live event: its picture, its date, and the one
 * thing to do about it.
 *
 * Home used to draw every event as the same tall navy hero, so a customer
 * with ten of them scrolled past ten screens of card to reach anything else.
 * Only the leading event still gets that treatment. This is the rest — but a
 * row, not a line: three lines of text with a chevron read as a settings
 * menu rather than as three celebrations.
 *
 * What it shows is what tells them apart at a glance — the occasion's
 * illustration, the date on a chip, the title, the stage, and the single fact
 * worth its own weight: how many organizers have replied, when the request
 * closes, or failing both, where it is. The button carries the same words the
 * full card's does, and does the same thing, because the whole row is the
 * button.
 */
export function EventRow({ event, onPress, onEdit }: EventRowProps) {
  const art = eventArtFor(event.occasion);
  const [start, end] = CATEGORY_GRADIENT[art];
  /* SVG ids resolve per document, so a shared one would paint every row with
     whichever gradient rendered last. */
  const gradientId = `eventRow-${event.source}-${event.refId}`;
  const chip = eventDateChip(event.when);
  const fact = event.quotedLabel || event.closesLabel;
  /* The stage, and where it is happening: two events at the same stage are
     told apart by the place, and the date is already on the chip. */
  const stageLine = [event.stageLabel, event.where].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity
      style={s.row}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[event.title, event.stageLabel, event.factsLine]
        .filter(Boolean)
        .join('. ')}
      testID={`event-row-${event.source}-${event.refId}`}
    >
      <View style={s.thumb}>
        <View style={s.thumbLayer}>
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient
                id={gradientId}
                x1="20%"
                y1="0%"
                x2="80%"
                y2="100%"
              >
                <Stop offset="0" stopColor={start} />
                <Stop offset="1" stopColor={end} />
              </LinearGradient>
            </Defs>
            <Rect
              x={0}
              y={0}
              width={100}
              height={100}
              fill={`url(#${gradientId})`}
            />
          </Svg>
        </View>
        <View style={s.thumbArt} pointerEvents="none">
          <OccasionArt art={art} />
        </View>

        {/* Dropped rather than drawn empty for an event with no date yet. */}
        {chip ? (
          <View style={s.dateChip}>
            <EventlyText variant="caption" style={s.dateMonth}>
              {chip.month}
            </EventlyText>
            <EventlyText variant="subtitle" style={s.dateDay}>
              {chip.day}
            </EventlyText>
          </View>
        ) : null}
      </View>

      <View style={s.body}>
        <EventlyText variant="subtitle" style={s.title} numberOfLines={2}>
          {event.title}
        </EventlyText>

        <View style={s.stageRow}>
          <View style={s.stageDot} />
          <EventlyText variant="caption" style={s.stageText} numberOfLines={1}>
            {stageLine}
          </EventlyText>
        </View>

        {fact ? (
          <EventlyText variant="caption" style={s.fact} numberOfLines={1}>
            {fact}
          </EventlyText>
        ) : null}

        <View style={s.actionRow}>
          {/*
            Drawn as a button, pressed as part of the row: it opens what the
            row opens, and a second handler doing the same thing is a second
            way to be told the same news.
          */}
          <View style={s.cta}>
            <EventlyText variant="caption" style={s.ctaText} numberOfLines={1}>
              {event.ctaLabel}
            </EventlyText>
          </View>

          {/* Its own target: the row opens the event, the pencil opens the
              brief, and one control cannot do both. */}
          {onEdit ? (
            <TouchableOpacity
              style={s.edit}
              activeOpacity={0.7}
              onPress={onEdit}
              accessibilityRole="button"
              accessibilityLabel={`Edit the brief for ${event.title}`}
              testID={`edit-brief-${event.refId}`}
            >
              <EventlyIcon
                name="pencil-outline"
                size={17}
                color={HERO_ACCENT_COLOR}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default EventRow;
