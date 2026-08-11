import type { ReactNode } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import { EventlyIcon } from './EventlyIcon';
import { EventlyText } from './EventlyText';
import { appHeaderStyles } from './styles';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: ReactNode;
  /** Smaller, less shouty title — for screens where the h1 default reads too heavy. */
  compact?: boolean;
}

/** Reusable screen header: back arrow + title, with an optional trailing action. */
export function AppHeader({ title, showBackButton = true, onBackPress, rightElement, compact = false }: AppHeaderProps) {
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
          <TouchableOpacity
            onPress={handleBackPress}
            style={appHeaderStyles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <EventlyIcon name="chevron-left" size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        <EventlyText variant={compact ? 'h2' : 'h1'} style={appHeaderStyles.title} numberOfLines={1}>
          {title}
        </EventlyText>
      </View>

      {rightElement && <View style={appHeaderStyles.rightElement}>{rightElement}</View>}
    </View>
  );
}

export default AppHeader;
