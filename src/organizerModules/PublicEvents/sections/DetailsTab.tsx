import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { PUBLIC_EVENTS_COPY } from '../constants';
import { ORG_INK } from '../design';
import { detailStyles as s, styles as screen } from '../styles';
import type { DetailRow } from '../types';
import { ActionButton } from './ActionButton';

const COPY = PUBLIC_EVENTS_COPY.details;

/** What customers are told, read-only, with Edit as the one action. */
export function DetailsTab({
  rows,
  editable,
  onEdit,
}: {
  rows: DetailRow[];
  editable: boolean;
  onEdit: () => void;
}) {
  return (
    <View style={screen.section}>
      {editable ? (
        <ActionButton
          title={COPY.edit}
          icon="pencil-outline"
          onPress={onEdit}
        />
      ) : null}
      <View style={s.card}>
        {rows.map(r => (
          <View key={r.key} style={s.row}>
            <View style={s.icon}>
              <EventlyIcon name={r.icon} size={18} color={ORG_INK.inkSoft} />
            </View>
            <View style={s.body}>
              <AppText variant="caption" style={s.label}>
                {r.label}
              </AppText>
              <AppText variant="body" style={s.value}>
                {r.value}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default DetailsTab;
