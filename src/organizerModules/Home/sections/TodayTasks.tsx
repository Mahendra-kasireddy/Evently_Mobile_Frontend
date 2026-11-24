import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { HOME_COPY as COPY } from '../constants';
import { taskStyles as s } from '../styles';
import type { HomeTask } from '../types';
import { SectionTitle } from './SectionTitle';

/** Today's to-dos across every event; a tap ticks one off (or back). */
export function TodayTasks({
  tasks,
  onToggle,
}: {
  tasks: HomeTask[];
  onToggle: (task: HomeTask) => void;
}) {
  const done = tasks.filter(t => t.done).length;
  return (
    <View>
      <SectionTitle
        title={COPY.tasksTitle}
        action={COPY.tasksDone(done, tasks.length)}
      />
      <View style={s.card}>
        {tasks.map((task, index) => (
          <Pressable
            key={task.id}
            style={[s.row, index > 0 && s.divider]}
            onPress={() => onToggle(task)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.done }}
            accessibilityLabel={task.title}
          >
            <View style={[s.box, task.done && s.boxOn]}>
              {task.done ? (
                <EventlyIcon name="check" size={16} color="#ffffff" />
              ) : null}
            </View>
            <AppText
              variant="body"
              style={[s.title, task.done && s.titleDone]}
              numberOfLines={2}
            >
              {task.title}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default TodayTasks;
