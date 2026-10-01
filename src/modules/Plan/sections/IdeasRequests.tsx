import { ScrollView, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, EventlyTextInput } from '../../../Components';
import { ideasStyles } from '../styles';
import { PLAN_ACCENT, PLAN_TEXT_MUTED } from '../constants';
import type { IdeasConfigDTO } from '../types';

/** Room for a real wish list, short of an essay. */
const IDEAS_MAX_LENGTH = 500;

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
          <EventlyIcon name="creation" size={18} color={PLAN_ACCENT} />
        </View>
        <View style={ideasStyles.headText}>
          <EventlyText variant="h2" style={ideasStyles.title}>
            {config.title}
          </EventlyText>
          {config.subtitle ? (
            <EventlyText variant="caption" style={ideasStyles.subtitle}>
              {config.subtitle}
            </EventlyText>
          ) : null}
        </View>
      </View>

      {config.suggestions.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={ideasStyles.chipRow}
          contentContainerStyle={ideasStyles.chipRowContent}
        >
          {config.suggestions.map((suggestion) => (
            <TouchableOpacity key={suggestion} style={ideasStyles.chip} onPress={() => onAdd(suggestion)}>
              <EventlyIcon name="plus" size={14} color={PLAN_ACCENT} />
              <EventlyText variant="caption" style={ideasStyles.chipText}>
                {suggestion}
              </EventlyText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : null}

      <View style={ideasStyles.textareaBox}>
        <EventlyTextInput
          style={ideasStyles.textarea}
          value={value}
          placeholder={config.placeholder}
          placeholderTextColor={PLAN_TEXT_MUTED}
          onChangeText={onChange}
          maxLength={IDEAS_MAX_LENGTH}
          multiline
        />
        <View style={ideasStyles.textareaFooter}>
          <EventlyText variant="caption" style={ideasStyles.counter}>
            {`${value.length}/${IDEAS_MAX_LENGTH}`}
          </EventlyText>
          <View style={ideasStyles.pencil}>
            <EventlyIcon name="pencil-outline" size={13} color={PLAN_ACCENT} />
          </View>
        </View>
      </View>
    </View>
  );
}

export default IdeasRequests;
