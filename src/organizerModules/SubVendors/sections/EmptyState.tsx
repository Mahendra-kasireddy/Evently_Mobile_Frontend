import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { SUBVENDORS_COPY as COPY } from '../constants';
import { ORG_ACCENT } from '../design';
import { emptyStyles as s, styles as base } from '../styles';
import { ActionButton } from './ActionButton';

/**
 * No team yet: say what a team is for and offer the one next step. When a
 * category chip is what emptied the list, offer the way back instead.
 */
export function EmptyState({
  filtered,
  onInvite,
  onShowAll,
}: {
  filtered: boolean;
  onInvite: () => void;
  onShowAll: () => void;
}) {
  return (
    <View style={s.wrap}>
      <View style={s.icon}>
        <EventlyIcon
          name={filtered ? 'filter-variant-remove' : 'account-group-outline'}
          size={34}
          color={ORG_ACCENT.saffron}
        />
      </View>
      <AppText variant="h3" style={base.title}>
        {filtered ? COPY.emptyFilteredTitle : COPY.emptyTitle}
      </AppText>
      <AppText variant="body" style={base.muted}>
        {filtered ? COPY.emptyFilteredBody : COPY.emptyBody}
      </AppText>
      {filtered ? (
        <Pressable onPress={onShowAll} hitSlop={8} accessibilityRole="button">
          <AppText variant="bodySmall" style={s.link}>
            {COPY.showAll}
          </AppText>
        </Pressable>
      ) : (
        <ActionButton
          title={COPY.invite}
          onPress={onInvite}
          containerStyle={s.button}
        />
      )}
    </View>
  );
}

export default EmptyState;
