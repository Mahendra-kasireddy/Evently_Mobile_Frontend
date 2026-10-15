import { ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../../../Components';
import { threadStyles as s } from '../styles';

interface SuggestionBarProps {
  suggestions: string[];
  onPick: (text: string) => void;
}

/**
 * Questions worth asking, one tap away.
 *
 * They fill the box rather than sending, so nothing goes out in the customer's
 * name that they did not choose to send — and they can change the wording
 * before it does. Horizontal, because the useful set is longer than a row.
 */
export function SuggestionBar({ suggestions, onPick }: SuggestionBarProps) {
  if (suggestions.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.suggestions}
      keyboardShouldPersistTaps="handled"
    >
      {suggestions.map(text => (
        <TouchableOpacity
          key={text}
          style={s.chip}
          activeOpacity={0.8}
          onPress={() => onPick(text)}
          accessibilityRole="button"
          accessibilityLabel={text}
        >
          <AppText variant="label" style={s.chipText}>
            {text}
          </AppText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default SuggestionBar;
