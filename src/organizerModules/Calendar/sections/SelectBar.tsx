import { View } from 'react-native';
import { AppText, EventlyButton } from '../../../Components';
import { CALENDAR_COPY as COPY } from '../constants';
import { ORG_ACCENT } from '../design';
import { selectStyles as s } from '../styles';

/** Picking several days to block: what to do, how many, then confirm or cancel. */
export function SelectBar({
  count,
  busy,
  onConfirm,
  onCancel,
}: {
  count: number;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <View style={s.card}>
      <AppText variant="h3" style={s.title}>
        {COPY.selectTitle}
      </AppText>
      <AppText variant="caption" style={s.hint}>
        {COPY.selectHint}
      </AppText>
      <AppText variant="bodySmall" style={s.count}>
        {COPY.selectCount(count)}
      </AppText>
      <View style={s.row}>
        <EventlyButton
          title={COPY.cancel}
          variant="outline"
          accentColor={ORG_ACCENT.saffron}
          disabled={busy}
          onPress={onCancel}
          style={s.button}
        />
        <EventlyButton
          title={COPY.confirmBlock(count)}
          accentColor={ORG_ACCENT.saffron}
          disabled={count === 0}
          loading={busy}
          onPress={onConfirm}
          style={s.button}
        />
      </View>
    </View>
  );
}

export default SelectBar;
