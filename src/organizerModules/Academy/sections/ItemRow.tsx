import { ActivityIndicator, Pressable, View } from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { ORG_ACCENT, ORG_ACTION_GRADIENT, ORG_INK } from '../design';
import { stageStyles as s } from '../styles';

/**
 * One row in a stage — a lesson, a workshop or a master-class item: an icon,
 * its name and detail, and either its action or a "done" chip.
 */
export function ItemRow({
  icon,
  title,
  meta,
  done,
  doneLabel,
  actionLabel,
  primary,
  disabled,
  busy,
  onPress,
}: {
  icon: string;
  title: string;
  meta?: string;
  done: boolean;
  doneLabel: string;
  actionLabel: string;
  /** The row to do next — its button in the action colour. */
  primary: boolean;
  disabled: boolean;
  busy: boolean;
  onPress: () => void;
}) {
  return (
    <View style={[s.row, primary && !done && s.rowNext]}>
      <View style={[s.rowIcon, done && s.rowIconDone]}>
        <EventlyIcon
          name={done ? 'check' : icon}
          size={18}
          color={done ? ORG_ACCENT.jade : ORG_INK.inkSoft}
        />
      </View>
      <View style={s.rowText}>
        <AppText
          variant="body"
          style={[s.rowTitle, done && s.rowTitleDone]}
          numberOfLines={2}
        >
          {title}
        </AppText>
        {meta ? (
          <AppText variant="caption" style={s.rowMeta}>
            {meta}
          </AppText>
        ) : null}
      </View>
      {done ? (
        <View style={s.chip}>
          <EventlyIcon name="check" size={12} color={ORG_ACCENT.jade} />
          <AppText variant="label" style={s.chipText}>
            {doneLabel}
          </AppText>
        </View>
      ) : (
        <Pressable
          style={[s.button, !primary && s.buttonGhost]}
          onPress={onPress}
          disabled={disabled || busy}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel}: ${title}`}
          accessibilityState={{ disabled: disabled || busy, busy }}
        >
          {primary ? (
            <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
          ) : null}
          {busy ? (
            <ActivityIndicator
              size="small"
              color={primary ? '#ffffff' : ORG_INK.ink}
            />
          ) : (
            <AppText
              variant="bodySmall"
              style={[s.buttonText, !primary && s.buttonTextGhost]}
            >
              {actionLabel}
            </AppText>
          )}
        </Pressable>
      )}
    </View>
  );
}

export default ItemRow;
