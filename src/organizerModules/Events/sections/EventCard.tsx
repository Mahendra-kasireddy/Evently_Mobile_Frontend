import { View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { EVENTS_COPY as COPY } from '../constants';
import { ORG_ACTION_GRADIENT, ORG_INK } from '../design';
import { cardStyles as s, statusToneStyles } from '../styles';
import type { EventItem } from '../types';

/**
 * One booking. Waiting on the organizer: the deadline and "Review & respond",
 * in the action colour. Otherwise: when, where, how far the tasks are, and
 * the money — and the card opens the event.
 */
export function EventCard({
  item,
  onOpen,
}: {
  item: EventItem;
  onOpen: () => void;
}) {
  const tone = statusToneStyles[item.status.tone];
  const meta = [item.customerName, item.location].filter(Boolean).join(' · ');
  const percent = item.tasksTotal
    ? Math.round((item.tasksDone / item.tasksTotal) * 100)
    : 0;

  return (
    <PressableScale
      style={[s.card, item.awaiting && s.cardUrgent, item.past && s.cardPast]}
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.when}. ${item.status.label}`}
    >
      <View style={s.head}>
        <View style={[s.date, item.past && s.dateMuted]}>
          {item.day ? (
            <>
              <AppText
                variant="h2"
                style={[s.day, item.past && s.dateMutedText]}
              >
                {item.day}
              </AppText>
              <AppText
                variant="label"
                style={[s.month, item.past && s.dateMutedText]}
              >
                {item.month}
              </AppText>
            </>
          ) : (
            <EventlyIcon
              name="calendar-question"
              size={22}
              color={ORG_INK.inkSoft}
            />
          )}
        </View>
        <View style={s.body}>
          <AppText variant="label" style={s.when}>
            {item.when}
          </AppText>
          <AppText variant="h3" style={s.title} numberOfLines={1}>
            {item.title}
          </AppText>
          {meta ? (
            <AppText variant="caption" style={s.meta} numberOfLines={1}>
              {meta}
            </AppText>
          ) : null}
          <View style={[s.chip, tone.box]}>
            <AppText variant="label" style={[s.chipText, tone.text]}>
              {item.status.label}
            </AppText>
          </View>
        </View>
      </View>

      {item.awaiting && item.respondBy ? (
        <View style={[s.respond, item.respondUrgent && s.respondUrgent]}>
          <EventlyIcon
            name="timer-sand"
            size={16}
            color={item.respondUrgent ? '#c2361f' : '#8a5410'}
          />
          <AppText
            variant="caption"
            style={[s.respondText, item.respondUrgent && s.respondTextUrgent]}
          >
            {item.respondBy}
          </AppText>
        </View>
      ) : null}

      {!item.awaiting && !item.past ? (
        <View style={s.progressRow}>
          <View style={s.track}>
            <View style={[s.fill, { width: `${percent}%` }]} />
          </View>
          <AppText variant="label" style={s.tasks}>
            {item.tasksTotal
              ? COPY.tasks(item.tasksDone, item.tasksTotal)
              : COPY.noTasks}
          </AppText>
        </View>
      ) : null}

      <View style={s.foot}>
        <View style={s.money}>
          <AppText variant="h3" style={s.amount}>
            {item.amount}
          </AppText>
          {item.paid ? (
            <AppText variant="label" style={s.paid}>
              {item.paid}
            </AppText>
          ) : null}
        </View>
        <View style={[s.button, !item.awaiting && s.buttonGhost]}>
          {item.awaiting ? (
            <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
          ) : null}
          <AppText
            variant="bodySmall"
            style={[s.buttonText, !item.awaiting && s.buttonTextGhost]}
          >
            {item.awaiting ? COPY.review : COPY.open}
          </AppText>
          <EventlyIcon
            name="arrow-right"
            size={16}
            color={item.awaiting ? '#ffffff' : ORG_INK.ink}
          />
        </View>
      </View>
    </PressableScale>
  );
}

export default EventCard;
