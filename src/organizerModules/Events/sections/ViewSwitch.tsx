import { Pressable, View } from 'react-native';
import { AppText } from '../../../Components';
import { EVENTS_COPY as COPY } from '../constants';
import { segmentStyles as s } from '../styles';
import type { EventsView } from '../types';

const VIEWS: EventsView[] = ['upcoming', 'past'];

/** Upcoming | Past. */
export function ViewSwitch({
  view,
  onChange,
  counts,
}: {
  view: EventsView;
  onChange: (view: EventsView) => void;
  counts: Record<EventsView, number>;
}) {
  return (
    <View style={s.wrap} accessibilityRole="tablist">
      {VIEWS.map(v => {
        const on = v === view;
        return (
          <Pressable
            key={v}
            style={[s.item, on && s.itemOn]}
            onPress={() => onChange(v)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
          >
            <AppText variant="bodySmall" style={[s.text, on && s.textOn]}>
              {`${COPY.views[v]} · ${counts[v]}`}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

export default ViewSwitch;
