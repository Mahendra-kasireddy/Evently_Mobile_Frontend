import { ActivityIndicator, Image, View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { EVENT_COPY } from '../constants';
import { ORG_ACTION_GRADIENT, ORG_INK, WHITE } from '../design';
import { taskStyles as s } from '../styles';
import type { TaskCardModel } from '../types';
import { StatusChip } from './StatusChip';

const COPY = EVENT_COPY.board;

/**
 * One task: what, who (and whether they said yes), when, how much, and the
 * proof photo. The button moves it one step along; tapping the card edits it.
 * Read-only when the event is closed.
 */
export function TaskCard({
  task,
  editable,
  moving,
  onOpen,
  onMove,
}: {
  task: TaskCardModel;
  editable: boolean;
  moving: boolean;
  onOpen: () => void;
  onMove: () => void;
}) {
  const done = task.status === 'done';
  const primaryMove = !done;
  const moveInk = primaryMove ? WHITE : ORG_INK.ink;

  return (
    <PressableScale
      style={[s.card, done && s.cardDone]}
      onPress={onOpen}
      disabled={!editable}
      accessibilityRole={editable ? 'button' : undefined}
      accessibilityLabel={[task.title, task.assignee, task.due]
        .filter(Boolean)
        .join(', ')}
    >
      <View style={s.top}>
        <View style={s.body}>
          <AppText
            variant="body"
            style={[s.title, done && s.titleDone]}
            numberOfLines={3}
          >
            {task.title}
          </AppText>
          <View style={s.row}>
            {task.assignee ? (
              <>
                <View style={s.avatar}>
                  <AppText variant="label" style={s.avatarText}>
                    {task.assignee.slice(0, 1).toUpperCase()}
                  </AppText>
                </View>
                <AppText variant="caption" style={[s.meta, s.metaStrong]}>
                  {task.assignee}
                </AppText>
              </>
            ) : (
              <AppText variant="caption" style={s.meta}>
                {COPY.unassigned}
              </AppText>
            )}
            {task.assignment ? <StatusChip chip={task.assignment} /> : null}
          </View>
          {task.due ? (
            <View style={s.row}>
              <EventlyIcon
                name="calendar-clock-outline"
                size={14}
                color={ORG_INK.inkSoft}
              />
              <AppText
                variant="caption"
                style={[s.meta, task.overdue && s.overdue]}
              >
                {task.due}
              </AppText>
            </View>
          ) : null}
        </View>
        {task.proofUri ? (
          <Image
            source={{ uri: task.proofUri }}
            style={s.proof}
            accessibilityLabel={COPY.proof}
          />
        ) : null}
      </View>

      {task.amount || editable ? (
        <View style={s.foot}>
          <AppText variant="bodySmall" style={s.amount}>
            {task.amount}
          </AppText>
          {editable ? (
            <PressableScale
              style={[s.move, !primaryMove && s.moveGhost]}
              onPress={onMove}
              disabled={moving}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={`${task.next.label}: ${task.title}`}
              accessibilityState={{ busy: moving }}
            >
              {primaryMove ? (
                <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
              ) : null}
              {moving ? (
                <ActivityIndicator size="small" color={moveInk} />
              ) : (
                <EventlyIcon name={task.next.icon} size={16} color={moveInk} />
              )}
              <AppText
                variant="bodySmall"
                style={[s.moveText, !primaryMove && s.moveTextGhost]}
              >
                {task.next.label}
              </AppText>
            </PressableScale>
          ) : null}
        </View>
      ) : null}
    </PressableScale>
  );
}

export default TaskCard;
