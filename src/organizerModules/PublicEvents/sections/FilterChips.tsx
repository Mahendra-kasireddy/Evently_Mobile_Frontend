import { Pressable, ScrollView, View } from 'react-native';
import { AppText } from '../../../Components';
import { filterStyles as s } from '../styles';

/** A row of choices, one on at a time; scrolls sideways when it must. */
export function FilterChips<K extends string>({
  options,
  value,
  onChange,
  scroll = true,
}: {
  options: Array<{ key: K; label: string }>;
  value: K;
  onChange: (key: K) => void;
  scroll?: boolean;
}) {
  const chips = options.map(o => {
    const on = o.key === value;
    return (
      <Pressable
        key={o.key}
        style={[s.chip, on && s.chipOn]}
        onPress={() => onChange(o.key)}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        accessibilityLabel={o.label}
      >
        <AppText variant="bodySmall" style={[s.text, on && s.textOn]}>
          {o.label}
        </AppText>
      </Pressable>
    );
  });
  if (!scroll) return <View style={s.row}>{chips}</View>;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
    >
      {chips}
    </ScrollView>
  );
}

export default FilterChips;
