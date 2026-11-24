import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon, FadeInUp } from '../../../Components';
import { EVENT_COPY, TASK_COLUMNS } from '../constants';
import { ORG_ACCENT } from '../design';
import { boardStyles as s, columnDotStyles, styles as screen } from '../styles';
import type { TaskCardModel, TaskProgress, TaskStatus } from '../types';
import { ActionButton } from './ActionButton';
import { TaskCard } from './TaskCard';

const COPY = EVENT_COPY.board;

/**
 * The work: how far along it is, To do · In progress · Done as tabs (one list
 * at a time), and Add task. Read-only once the event is closed.
 */
export function TaskBoard({
  progress,
  column,
  counts,
  cards,
  moving,
  editable,
  onColumn,
  onOpen,
  onMove,
  onAdd,
}: {
  progress: TaskProgress;
  column: TaskStatus;
  counts: Record<TaskStatus, number>;
  cards: TaskCardModel[];
  moving: Record<string, boolean>;
  editable: boolean;
  onColumn: (column: TaskStatus) => void;
  onOpen: (taskId: string) => void;
  onMove: (task: TaskCardModel) => void;
  onAdd: () => void;
}) {
  const header = (
    <View style={screen.sectionHead}>
      <AppText variant="h3" style={screen.sectionTitle}>
        {COPY.title}
      </AppText>
    </View>
  );

  if (progress.total === 0) {
    return (
      <View style={screen.section}>
        {header}
        <View style={s.empty}>
          <View style={s.emptyIcon}>
            <EventlyIcon
              name="clipboard-check-outline"
              size={26}
              color={ORG_ACCENT.saffron}
            />
          </View>
          <AppText variant="h3" style={s.emptyTitle}>
            {editable ? COPY.firstTitle : COPY.noTasks}
          </AppText>
          {editable ? (
            <AppText variant="bodySmall" style={s.emptyText}>
              {COPY.firstBody}
            </AppText>
          ) : null}
        </View>
        {editable ? (
          <ActionButton title={COPY.add} icon="plus" onPress={onAdd} />
        ) : null}
      </View>
    );
  }

  return (
    <View style={screen.section}>
      {header}
      <View style={s.progressCard}>
        <View style={s.progressRow}>
          <AppText variant="body" style={s.progressLabel}>
            {progress.label}
          </AppText>
          <AppText variant="bodySmall" style={s.progressPercent}>
            {`${progress.percent}%`}
          </AppText>
        </View>
        <View
          style={s.track}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: progress.percent }}
        >
          <View style={[s.fill, { width: `${progress.percent}%` }]} />
        </View>
      </View>

      <View style={s.tabs} accessibilityRole="tablist">
        {TASK_COLUMNS.map(c => {
          const on = c === column;
          return (
            <Pressable
              key={c}
              style={[s.tab, on && s.tabOn]}
              onPress={() => onColumn(c)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${COPY.columns[c]}, ${counts[c]}`}
            >
              <View style={[s.tabDot, columnDotStyles[c]]} />
              <AppText
                variant="bodySmall"
                style={[s.tabText, on && s.tabTextOn]}
              >
                {`${COPY.columns[c]} · ${counts[c]}`}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={s.list}>
        {cards.length === 0 ? (
          <View style={s.empty}>
            <AppText variant="bodySmall" style={s.emptyText}>
              {COPY.empty[column]}
            </AppText>
          </View>
        ) : (
          cards.map((task, i) => (
            <FadeInUp key={task.id} delay={Math.min(i, 6) * 40}>
              <TaskCard
                task={task}
                editable={editable}
                moving={!!moving[task.id]}
                onOpen={() => onOpen(task.id)}
                onMove={() => onMove(task)}
              />
            </FadeInUp>
          ))
        )}
      </View>

      {editable ? (
        <ActionButton
          title={COPY.add}
          icon="plus"
          kind="ghost"
          onPress={onAdd}
        />
      ) : (
        <AppText variant="caption" style={s.readOnly}>
          {COPY.readOnly}
        </AppText>
      )}
    </View>
  );
}

export default TaskBoard;
