import { View } from 'react-native';
import { AppText, EventlyIcon, PressableScale } from '../../../Components';
import { EVENTS_COPY as COPY } from '../constants';
import { SHORTCUT_LOOK } from '../design';
import { shortcutStyles as s, shortcutToneStyles } from '../styles';

export type ShortcutKey = keyof typeof SHORTCUT_LOOK;

const ORDER: ShortcutKey[] = ['calendar', 'subvendors', 'publicEvents'];

/** The rest of Events, one tap away: the calendar, sub-vendors and ticketed events. */
export function Shortcuts({ onOpen }: { onOpen: (key: ShortcutKey) => void }) {
  return (
    <View style={s.row}>
      {ORDER.map(key => {
        const look = SHORTCUT_LOOK[key];
        return (
          <PressableScale
            key={key}
            style={s.tile}
            containerStyle={s.wrap}
            onPress={() => onOpen(key)}
            accessibilityRole="button"
            accessibilityLabel={COPY.shortcuts[key]}
          >
            <View style={[s.icon, shortcutToneStyles[key]]}>
              <EventlyIcon name={look.icon} size={21} color={look.ink} />
            </View>
            <AppText variant="caption" style={s.label}>
              {COPY.shortcuts[key]}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

export default Shortcuts;
