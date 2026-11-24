import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { COUPONS_COPY as COPY } from '../constants';
import { ORG_ACCENT } from '../design';
import { emptyStyles as s } from '../styles';
import { CreateButton } from './CreateButton';

/** No coupons yet: say what they are for, and offer the one next step. */
export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <View style={s.card}>
      <View style={s.icon}>
        <EventlyIcon
          name="ticket-percent-outline"
          size={34}
          color={ORG_ACCENT.saffron}
        />
      </View>
      <AppText variant="h2" style={s.title}>
        {COPY.emptyTitle}
      </AppText>
      <AppText variant="body" style={s.body}>
        {COPY.emptyBody}
      </AppText>
      <CreateButton onPress={onCreate} style={s.action} />
    </View>
  );
}

export default EmptyState;
