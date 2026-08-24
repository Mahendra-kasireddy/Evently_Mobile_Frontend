import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { HOME_COPY } from '../constants';
import { cardStyles, screenStyles, scheduleStyles } from '../styles';
import { dayLabel } from '../utils';
import type { DashboardScheduleItem } from '../types';

interface ScheduleCardProps {
  items: DashboardScheduleItem[];
}

export function ScheduleCard({ items }: ScheduleCardProps) {
  return (
    <View style={cardStyles.card}>
      <EventlyText variant="h2" style={cardStyles.cardTitle}>
        {HOME_COPY.scheduleTitle}
      </EventlyText>
      {items.length ? (
        <View style={scheduleStyles.list}>
          {items.map((item) => (
            <View key={item.id} style={scheduleStyles.row}>
              <EventlyText variant="caption" style={scheduleStyles.day}>
                {dayLabel(item.eventDate)}
              </EventlyText>
              <View style={scheduleStyles.dot} />
              <EventlyText variant="body" style={scheduleStyles.title} numberOfLines={1}>
                {item.title}
              </EventlyText>
            </View>
          ))}
        </View>
      ) : (
        <EventlyText variant="body" style={screenStyles.emptyText}>
          {HOME_COPY.scheduleEmpty}
        </EventlyText>
      )}
    </View>
  );
}

export default ScheduleCard;
