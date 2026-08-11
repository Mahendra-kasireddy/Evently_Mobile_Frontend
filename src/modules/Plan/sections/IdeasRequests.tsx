import { ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, EventlyTextInput } from '../../../Components';
import { ideasStyles } from '../styles';
import { PLAN_ACCENT, PLAN_NAVY } from '../constants';
import type { IdeasConfigDTO } from '../types';

interface IdeasRequestsProps {
  config: IdeasConfigDTO;
  value: string;
  onAdd: (suggestion: string) => void;
  onChange: (value: string) => void;
}

export function IdeasRequests({ config, value, onAdd, onChange }: IdeasRequestsProps) {
  return (
    <View style={ideasStyles.section}>
      <View style={ideasStyles.head}>
        <View style={ideasStyles.icon}>
          <EventlyIcon name="creation" size={15} color={PLAN_ACCENT} />
        </View>
        <EventlyText variant="subtitle" style={ideasStyles.title}>
          {config.title}
        </EventlyText>
      </View>
      {config.subtitle ? (
        <EventlyText variant="caption" style={ideasStyles.subtitle}>
          {config.subtitle}
        </EventlyText>
      ) : null}
      {config.suggestions.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ideasStyles.chipRow}>
          {config.suggestions.map((suggestion) => (
            <TouchableOpacity key={suggestion} style={ideasStyles.chip} onPress={() => onAdd(suggestion)}>
              <EventlyIcon name="plus" size={12} color={PLAN_NAVY} />
              <EventlyText variant="caption" style={ideasStyles.chipText}>
                {suggestion}
              </EventlyText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}
      <EventlyTextInput style={ideasStyles.textarea} value={value} placeholder={config.placeholder} onChangeText={onChange} multiline />
    </View>
  );
}

export default IdeasRequests;
