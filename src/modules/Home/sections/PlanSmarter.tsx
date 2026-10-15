import { View } from 'react-native';
import { EventlyIcon, AppText } from '../../../Components';
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
        <EventlyIcon
          name={TOOL_ICON_NAME[item.icon]}
          size={20}
          color={colors.onPrimary}
        />
      </View>
      <AppText
        variant="body"
        weight="medium"
        style={planSmarterStyles.cardTitle}
      >
        {item.title}
      </AppText>
      <AppText variant="body" style={planSmarterStyles.cardDesc}>
        {item.description}
      </AppText>
    </View>
  );
}

export function PlanSmarter({ data }: PlanSmarterProps) {
  return (
    <View style={planSmarterStyles.section}>
      <AppText variant="h2" style={planSmarterStyles.title}>
        {data.title}
      </AppText>
      <AppText variant="caption" style={planSmarterStyles.subtitle}>
        {data.subtitle}
      </AppText>
      <View style={planSmarterStyles.list}>
        {data.tools.map(tool => (
          <ToolCard key={tool.id} item={tool} />
        ))}
      </View>
    </View>
  );
}

export default PlanSmarter;
