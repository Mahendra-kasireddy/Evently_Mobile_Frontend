import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyButton, EventlyIcon, EventlyText } from '../../../Components';
import type { RootStackParamList } from '../../../navigation/types';
import { ONB_COPY, ORG_ACCENT, ORG_GREEN } from '../constants';
import { submittedStyles } from '../styles';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SubmittedPanel() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={submittedStyles.container} edges={['top', 'bottom']}>
      <View style={submittedStyles.badge}>
        <EventlyIcon name="check-decagram" size={44} color={ORG_GREEN} />
      </View>
      <EventlyText variant="h1" style={submittedStyles.title}>
        Profile submitted for review
      </EventlyText>
      <EventlyText variant="body" style={submittedStyles.subtitle}>
        {ONB_COPY.verifyNote} We'll notify you the moment you're approved and live for customers.
      </EventlyText>
      <EventlyButton
        title="Continue to Evently"
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
        accentColor={ORG_ACCENT}
        style={submittedStyles.button}
      />
    </SafeAreaView>
  );
}

export default SubmittedPanel;
