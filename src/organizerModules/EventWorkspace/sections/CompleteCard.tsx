import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { EVENT_COPY } from '../constants';
import { ORG_ACCENT } from '../design';
import { closingStyles as s, styles as screen } from '../styles';
import { ActionButton } from './ActionButton';

const COPY = EVENT_COPY.complete;

/** Closing the event out — offered while it is confirmed or in progress. */
export function CompleteCard({
  marking,
  disabled,
  onComplete,
}: {
  marking: boolean;
  disabled: boolean;
  onComplete: () => void;
}) {
  return (
    <View style={screen.section}>
      <View style={s.card}>
        <View style={s.headRow}>
          <View style={[s.icon, s.iconDone]}>
            <EventlyIcon
              name="flag-checkered"
              size={22}
              color={ORG_ACCENT.jade}
            />
          </View>
          <View style={s.headText}>
            <AppText variant="h3" style={s.title}>
              {COPY.title}
            </AppText>
            <AppText variant="bodySmall" style={s.body}>
              {COPY.body}
            </AppText>
          </View>
        </View>
        <ActionButton
          title={marking ? COPY.marking : COPY.action}
          icon="check-all"
          kind="ghost"
          onPress={onComplete}
          loading={marking}
          disabled={disabled}
        />
      </View>
    </View>
  );
}

export default CompleteCard;
