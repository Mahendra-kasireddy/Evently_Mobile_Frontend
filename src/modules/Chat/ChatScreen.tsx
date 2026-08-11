import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import { colors } from '../../theme';
import { styles } from './styles';

/**
 * No chat/messaging module exists in the backend yet (only booking/quote/
 * notification). This is a placeholder ready to wire up once one does.
 */
export function ChatScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <EventlyIcon name="chat-outline" size={64} color={colors.textMuted} />
      <EventlyText variant="h2" style={styles.title}>
        Chat is coming soon
      </EventlyText>
      <EventlyText variant="body" style={styles.subtitle}>
        You'll be able to message organizers here once messaging is available.
      </EventlyText>
    </SafeAreaView>
  );
}

export default ChatScreen;
