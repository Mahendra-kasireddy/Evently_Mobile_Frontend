import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { CURRENT_EVENT_STAGE_COLOR, CURRENT_EVENT_STAGE_LABEL } from '../constants';
import { currentEventStyles } from '../styles';
import { colors } from '../../../theme';
import type { CurrentEventViewModel } from '../types';

interface CurrentEventCardProps {
  data: CurrentEventViewModel;
}

export function CurrentEventCard({ data }: CurrentEventCardProps) {
  const stageColor = CURRENT_EVENT_STAGE_COLOR[data.stage];
  const stageLabel = CURRENT_EVENT_STAGE_LABEL[data.stage];

  return (
    <View style={currentEventStyles.section}>
      <View style={currentEventStyles.card}>
        <View style={currentEventStyles.titleRow}>
          <View style={currentEventStyles.iconCircle}>
            <EventlyIcon name="calendar-check" size={20} color={colors.onPrimary} />
          </View>
          <EventlyText variant="subtitle" style={currentEventStyles.title} numberOfLines={1}>
            {data.title}
          </EventlyText>
        </View>
        <View style={currentEventStyles.stageRow}>
          <View style={currentEventStyles.stagePill}>
            <View style={[currentEventStyles.stageDot, { backgroundColor: stageColor }]} />
            <EventlyText variant="caption" style={[currentEventStyles.stageText, { color: stageColor }]}>
              {stageLabel}
            </EventlyText>
          </View>
        </View>
        <View style={currentEventStyles.progressTrack}>
          <View style={[currentEventStyles.progressFill, { width: `${data.progress}%` }]} />
        </View>
        <View style={currentEventStyles.footerRow}>
          <EventlyText variant="caption" style={currentEventStyles.progressLabel}>
            {data.progress}% complete
          </EventlyText>
          {data.daysToGo != null ? (
            <View style={currentEventStyles.daysToGoBadge}>
              <EventlyText variant="caption" style={currentEventStyles.daysToGo}>
                {data.daysToGo} days to go
              </EventlyText>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default CurrentEventCard;
