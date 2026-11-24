import { Pressable, View } from 'react-native';
import { AppText } from '../../../Components';
import { formStyles as s } from '../styles';

/** Two or three side-by-side choices, one on. */
export function Segment<K extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ key: K; label: string }>;
  value: K;
  onChange: (key: K) => void;
}) {
  return (
    <View style={s.segment} accessibilityRole="radiogroup">
      {options.map(o => {
        const on = o.key === value;
        return (
          <Pressable
            key={o.key}
            style={[s.segmentItem, on && s.segmentOn]}
            onPress={() => onChange(o.key)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            accessibilityLabel={o.label}
          >
            <AppText
              variant="bodySmall"
              style={[s.segmentText, on && s.segmentTextOn]}
            >
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

export default Segment;
