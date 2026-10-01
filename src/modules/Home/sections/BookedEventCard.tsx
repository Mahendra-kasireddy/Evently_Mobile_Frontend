import { useState } from 'react';
import { Image, Modal, Pressable, TouchableOpacity, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { EventlyIcon, EventlyText } from '../../../Components';
import {
  BOOKED_CARD_PHOTO_BG,
  BOOKED_CTA,
  BOOKED_STATUS_LABEL,
  BOOKED_STEP_DONE_COLOR,
  HERO_ACCENT_COLOR,
  HOME_NAVY,
} from '../constants';
import { colors } from '../../../theme';
import { bookedEventStyles as s } from '../styles';
import type { BookedEventViewModel, BookedStep } from '../types';

const CORPORATE_PHOTO = require('../../../assets/images/Corporate.jpeg');
const FLORAL_PHOTO = require('../../../assets/images/flowers_workspace.png');

interface BookedEventCardProps {
  data: BookedEventViewModel;
  /** Opens this booking's workspace. */
  onPress: () => void;
  /** Opens the thread with the organizer. Dropped when there is none to open. */
  onMessageOrganizer?: () => void;
  /**
   * True when this card is one of several in the horizontal row, which fixes
   * its width and leaves the row's own padding to the list.
   */
  inRow?: boolean;
  /** An admin-uploaded photo for this occasion, or '' for the bundled one. */
  photoUrl?: string;
}

/** The bundled picture for an occasion without an uploaded one. */
function bundledPhotoFor(title: string): ImageSourcePropType {
  return /corporate|office|conference/i.test(title)
    ? CORPORATE_PHOTO
    : FLORAL_PHOTO;
}

/** The milestone's glyph, read off its label — the server names the steps. */
function stepIcon(label: string): string {
  if (/organi[sz]er/i.test(label)) return 'account-tie-outline';
  if (/vendor/i.test(label)) return 'account-group-outline';
  if (/invit/i.test(label)) return 'email-outline';
  if (/walk|final|deliver|day/i.test(label)) return 'star-outline';
  return 'circle-outline';
}

/** The line at the bottom: the one thing worth saying about the booking now. */
function statusFor(data: BookedEventViewModel) {
  if (!data.organizerConfirmed) {
    return {
      title: 'Waiting for your organizer',
      body: `${data.organizerName} will confirm the booking shortly.`,
      icon: 'timer-sand',
    };
  }
  if (data.steps.length > 0 && data.steps.every(step => step.done)) {
    return {
      title: 'All set!',
      body: 'Every step is done. Enjoy your event!',
      icon: 'party-popper',
    };
  }
  const days =
    data.daysToGo > 0
      ? `${data.daysToGo} ${data.daysToGo === 1 ? 'day' : 'days'} to go`
      : 'It’s today';
  return {
    title: 'Everything is on track!',
    body: `Your event is well planned. ${days} — keep going!`,
    icon: 'creation',
  };
}

function Fact({
  icon,
  text,
  lines = 1,
}: {
  icon: string;
  text: string;
  lines?: number;
}) {
  if (!text) return null;
  return (
    <View style={s.fact}>
      <EventlyIcon name={icon} size={16} color={HOME_NAVY} />
      <EventlyText variant="caption" style={s.factText} numberOfLines={lines}>
        {text}
      </EventlyText>
    </View>
  );
}

function Milestones({ steps }: { steps: BookedStep[] }) {
  const nextIndex = steps.findIndex(step => !step.done);
  return (
    <View style={s.steps}>
      {steps.map((step, index) => {
        const isNext = index === nextIndex;
        const isLast = index === steps.length - 1;
        return (
          <View
            key={step.label}
            style={s.step}
            accessibilityLabel={`${step.label}: ${
              step.done ? 'done' : isNext ? 'in progress' : 'not yet'
            }`}
          >
            {/* The connector to the next step: green once this step is done,
                grey before. Drawn from this node's centre to the next one's. */}
            {!isLast ? (
              <View style={[s.connector, step.done && s.connectorDone]} />
            ) : null}
            <View
              style={[s.node, step.done && s.nodeDone, isNext && s.nodeNext]}
            >
              <EventlyIcon
                name={step.done ? 'check' : stepIcon(step.label)}
                size={step.done ? 15 : 14}
                color={step.done || isNext ? colors.onPrimary : HOME_NAVY}
              />
            </View>
            <EventlyText
              variant="caption"
              style={[
                s.stepLabel,
                step.done && s.stepLabelDone,
                isNext && s.stepLabelNext,
              ]}
              numberOfLines={2}
            >
              {step.label}
            </EventlyText>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Home's ongoing-booking card: the booking's photo, facts and milestones.
 *
 * Every value is composed by the backend (BookingService.getActiveForUser) and
 * rendered as given. The four milestones are each resolved from real state —
 * the organizer accepting, every assigned sub-vendor accepting, the invitation
 * being approved, delivery starting.
 *
 * The card opens the workspace. Messaging the organizer moved into the "⋯"
 * menu, so the card keeps one obvious action while the second stays reachable.
 */
export function BookedEventCard({
  data,
  onPress,
  onMessageOrganizer,
  inRow = false,
  photoUrl = '',
}: BookedEventCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = statusFor(data);
  /* Per card: two on screen would otherwise share one gradient id. */
  const fadeId = `booked-fade-${data.id}`;

  const card = (
    <TouchableOpacity
      style={[s.card, inRow && s.cardInRow]}
      activeOpacity={0.95}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${BOOKED_CTA} for ${data.title}`}
      testID={`booked-card-${data.id}`}
    >
      <View style={s.head}>
        <View style={s.photo} pointerEvents="none">
          <Image
            source={photoUrl ? { uri: photoUrl } : bundledPhotoFor(data.title)}
            style={s.photoImage}
            resizeMode="cover"
          />
          <Svg style={s.photoFade} width="100%" height="100%">
            <Defs>
              <LinearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
                <Stop
                  offset="0"
                  stopColor={BOOKED_CARD_PHOTO_BG}
                  stopOpacity={1}
                />
                <Stop
                  offset="0.3"
                  stopColor={BOOKED_CARD_PHOTO_BG}
                  stopOpacity={0.85}
                />
                <Stop
                  offset="0.65"
                  stopColor={BOOKED_CARD_PHOTO_BG}
                  stopOpacity={0}
                />
              </LinearGradient>
            </Defs>
            <Rect
              x={0}
              y={0}
              width="100%"
              height="100%"
              fill={`url(#${fadeId})`}
            />
          </Svg>
        </View>

        <View style={s.topRow}>
          <View style={s.statusPill}>
            <EventlyIcon name="check" size={13} color={HERO_ACCENT_COLOR} />
            <EventlyText variant="caption" style={s.statusText}>
              {BOOKED_STATUS_LABEL[data.status]}
            </EventlyText>
          </View>
          {/* Decoration, and optional: an older booking has no reference. */}
          {data.ref ? (
            <EventlyText variant="caption" style={s.ref} numberOfLines={1}>
              {data.ref}
            </EventlyText>
          ) : null}
          <View style={s.topSpacer} />
          <TouchableOpacity
            style={s.more}
            onPress={() => setMenuOpen(true)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`More for ${data.title}`}
          >
            <EventlyIcon name="dots-horizontal" size={20} color={HOME_NAVY} />
          </TouchableOpacity>
        </View>

        <EventlyText variant="h1" style={s.title} numberOfLines={1}>
          {data.title}
        </EventlyText>

        {/* Each fact is dropped rather than left as an empty line for a
            booking that came from no brief. */}
        <View style={s.facts}>
          <Fact icon="calendar-month-outline" text={data.dateLabel} />
          <Fact icon="map-marker-outline" text={data.location} lines={2} />
          <Fact icon="account-group-outline" text={data.guestsLabel} />
        </View>
      </View>

      <View style={s.body}>
        {data.steps.length > 0 ? (
          <>
            <View style={s.progressHead}>
              <EventlyText variant="subtitle" style={s.progressTitle}>
                Event planning progress
              </EventlyText>
              <View style={s.progressCountRow}>
                <EventlyText variant="caption" style={s.progressCount}>
                  {data.stepsDoneLabel}
                </EventlyText>
                <EventlyIcon name="chevron-right" size={16} color={HOME_NAVY} />
              </View>
            </View>
            <Milestones steps={data.steps} />
          </>
        ) : null}

        <View style={s.statusRow}>
          <View style={s.statusIcon}>
            <EventlyIcon
              name={status.icon}
              size={18}
              color={HERO_ACCENT_COLOR}
            />
          </View>
          <View style={s.statusTextCol}>
            <EventlyText
              variant="subtitle"
              style={s.statusTitle}
              numberOfLines={1}
            >
              {status.title}
            </EventlyText>
            <EventlyText
              variant="caption"
              style={s.statusBody}
              numberOfLines={2}
            >
              {status.body}
            </EventlyText>
          </View>
          <EventlyIcon name="chevron-right" size={20} color={HOME_NAVY} />
        </View>
      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={s.menuOverlay} onPress={() => setMenuOpen(false)}>
          <Pressable style={s.menu} onPress={() => undefined}>
            <TouchableOpacity
              style={s.menuItem}
              onPress={() => {
                setMenuOpen(false);
                onPress();
              }}
              accessibilityRole="button"
            >
              <EventlyIcon
                name="view-dashboard-outline"
                size={20}
                color={HOME_NAVY}
              />
              <EventlyText variant="body" style={s.menuText}>
                {BOOKED_CTA}
              </EventlyText>
            </TouchableOpacity>
            {onMessageOrganizer ? (
              <TouchableOpacity
                style={[s.menuItem, s.menuItemDivider]}
                onPress={() => {
                  setMenuOpen(false);
                  onMessageOrganizer();
                }}
                accessibilityRole="button"
              >
                <EventlyIcon
                  name="chat-outline"
                  size={20}
                  color={BOOKED_STEP_DONE_COLOR}
                />
                <EventlyText
                  variant="body"
                  style={s.menuText}
                  numberOfLines={1}
                >
                  {`Message ${data.organizerName}`}
                </EventlyText>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={[s.menuItem, s.menuItemDivider]}
              onPress={() => setMenuOpen(false)}
              accessibilityRole="button"
            >
              <EventlyText variant="body" style={s.menuCancel}>
                Cancel
              </EventlyText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );

  /* In the row the list supplies the gutters and the gap; on its own the card
     still brings its own section spacing. */
  return inRow ? card : <View style={s.section}>{card}</View>;
}

export default BookedEventCard;
