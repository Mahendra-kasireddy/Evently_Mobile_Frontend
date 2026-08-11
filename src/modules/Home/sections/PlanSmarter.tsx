import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { TOOL_ICON_COLOR, TOOL_ICON_NAME } from '../constants';
import { planSmarterStyles } from '../styles';
import { colors } from '../../../theme';
import type { ToolItem, ToolsViewModel } from '../types';

interface PlanSmarterProps {
  data: ToolsViewModel;
}

function ToolCard({ item }: { item: ToolItem }) {
  const accent = TOOL_ICON_COLOR[item.icon];
  return (
    <View style={planSmarterStyles.card}>
      <View style={[planSmarterStyles.iconBadge, { backgroundColor: accent }]}>
        <EventlyIcon name={TOOL_ICON_NAME[item.icon]} size={20} color={colors.onPrimary} />
      </View>
      <EventlyText variant="subtitle" style={planSmarterStyles.cardTitle}>
        {item.title}
      </EventlyText>
      <EventlyText variant="body" style={planSmarterStyles.cardDesc}>
        {item.description}
      </EventlyText>
    </View>
  );
}

export function PlanSmarter({ data }: PlanSmarterProps) {
  return (
    <View style={planSmarterStyles.section}>
      <EventlyText variant="h2" style={planSmarterStyles.title}>
        {data.title}
      </EventlyText>
      <EventlyText variant="body" style={planSmarterStyles.subtitle}>
        {data.subtitle}
      </EventlyText>
      <View style={planSmarterStyles.list}>
        {data.tools.map((tool) => (
          <ToolCard key={tool.id} item={tool} />
        ))}
      </View>
    </View>
  );
}

export default PlanSmarter;
