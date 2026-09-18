import type { ReactNode } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, View } from 'react-native';
import { colors, layout } from '../theme';
import { EventlyIcon } from './EventlyIcon';
import { EventlyText } from './EventlyText';
import { appHeaderStyles } from './styles';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: ReactNode;
  /**
   * Kept for the screens that pass it. The header has one title size now — the
   * design system's `screenTitle` — so this no longer changes anything, and
   * the prop stays only so those call sites keep compiling.
   *
   * @deprecated the header title is `screenTitle` everywhere.
   */
  compact?: boolean;
}

/**
 * The app's one header: back arrow, title, optional trailing action.
 *
 * Fixed at the design system's 56pt with 16pt gutters, its content vertically
 * centred, so a header on one screen is the same height as a header on
 * another. The back chevron is 20pt inside a 44pt touch target — the icon is
 * what you see, the target is what you hit, and they are not the same
 * measurement.
 *
 * The chevron is a vector glyph from the icon set the app already ships
 * (`EventlyIcon` → MaterialCommunityIcons), never an image: a PNG arrow is a
 * second thing to keep in step with the tint and a blurry one at any density
 * it was not exported for.
 *
 * Safe areas are deliberately NOT applied here. Every screen that uses this
 * already wraps itself in `SafeAreaView edges={['top']}`, and insetting again
 * would pad twice — visibly so on a notched iPhone. The header sits inside
 * that inset, which is what makes it 56pt of header rather than 56pt minus the
 * status bar.
 */
export function AppHeader({
  title,
  showBackButton = true,
  onBackPress,
  rightElement,
}: AppHeaderProps) {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={appHeaderStyles.container}>
      <View style={appHeaderStyles.left}>
        {showBackButton && (
          <Pressable
            onPress={handleBackPress}
            style={({ pressed }) => [
              appHeaderStyles.backButton,
              pressed && appHeaderStyles.backButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            testID="header-back"
          >
            <EventlyIcon
              name="chevron-left"
              size={layout.backIcon}
              color={colors.text}
            />
          </Pressable>
        )}
        <EventlyText
          variant="screenTitle"
          style={appHeaderStyles.title}
          numberOfLines={1}
        >
          {title}
        </EventlyText>
      </View>

      {rightElement && (
        <View style={appHeaderStyles.rightElement}>{rightElement}</View>
      )}
    </View>
  );
}

export default AppHeader;
