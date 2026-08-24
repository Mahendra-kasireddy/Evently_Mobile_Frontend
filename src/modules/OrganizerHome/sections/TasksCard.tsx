import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { HOME_COPY } from '../constants';
import { cardStyles, screenStyles, taskStyles } from '../styles';
import type { DashboardTask } from '../types';

interface TasksCardProps {
  tasks: DashboardTask[];
  onToggle: (task: DashboardTask) => void;
}

export function TasksCard({ tasks, onToggle }: TasksCardProps) {
  const sorted = [...tasks].sort((a, b) => Number(a.status === 'done') - Number(b.status === 'done'));

  return (
    <View style={cardStyles.card}>
      <EventlyText variant="h2" style={cardStyles.cardTitle}>
        {HOME_COPY.tasksTitle}
      </EventlyText>
      {sorted.length ? (
        <View style={taskStyles.list}>
          {sorted.map((task) => {
            const done = task.status === 'done';
            return (
              <View key={task.id} style={taskStyles.row}>
                <TouchableOpacity
                  style={[taskStyles.checkbox, done && taskStyles.checkboxOn]}
                  onPress={() => onToggle(task)}
                  accessibilityLabel={done ? 'Mark as not done' : 'Mark as done'}
                >
                  {done ? <EventlyIcon name="check" size={12} color="#fff" /> : null}
                </TouchableOpacity>
                <EventlyText variant="body" style={done ? taskStyles.labelDone : taskStyles.label}>
                  {task.title}
                </EventlyText>
              </View>
            );
          })}
        </View>
      ) : (
        <EventlyText variant="body" style={screenStyles.emptyText}>
          {HOME_COPY.tasksEmpty}
        </EventlyText>
      )}
    </View>
  );
}

export default TasksCard;
