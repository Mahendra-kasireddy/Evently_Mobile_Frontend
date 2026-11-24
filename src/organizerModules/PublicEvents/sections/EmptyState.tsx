import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { ORG_ACCENT } from '../design';
import { emptyStyles as s } from '../styles';
import { ActionButton } from './ActionButton';

/** Nothing here yet: what it is for, and the one next step. */
export function EmptyState({
  icon,
  title,
  body,
  actionTitle,
  onAction,
}: {
  icon: string;
  title: string;
  body: string;
  actionTitle?: string;
  onAction?: () => void;
}) {
  return (
    <View style={s.card}>
      <View style={s.icon}>
        <EventlyIcon name={icon} size={34} color={ORG_ACCENT.saffron} />
      </View>
      <AppText variant="h2" style={s.title}>
        {title}
      </AppText>
      <AppText variant="body" style={s.body}>
        {body}
      </AppText>
      {actionTitle && onAction ? (
        <ActionButton
          title={actionTitle}
          icon="plus"
          onPress={onAction}
          containerStyle={s.action}
        />
      ) : null}
    </View>
  );
}

export default EmptyState;
