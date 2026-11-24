import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../Components';
import { styles as s } from '../styles';

/** A section's title, with its one optional link on the right. */
export function SectionTitle({
  title,
  action,
  onPressAction,
}: {
  title: string;
  action?: string;
  onPressAction?: () => void;
}) {
  return (
    <View style={s.sectionHead}>
      <AppText variant="h3" style={s.sectionTitle} accessibilityRole="header">
        {title}
      </AppText>
      {action ? (
        onPressAction ? (
          <TouchableOpacity
            onPress={onPressAction}
            hitSlop={8}
            accessibilityRole="button"
          >
            <AppText variant="bodySmall" style={s.sectionAction}>
              {action}
            </AppText>
          </TouchableOpacity>
        ) : (
          <AppText variant="caption" style={s.sectionAction}>
            {action}
          </AppText>
        )
      ) : null}
    </View>
  );
}

export default SectionTitle;
