import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackHandler, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventlyIcon, EventlyText } from '../../Components';
import type { RootStackParamList } from '../../navigation/types';
import { PAY_GREEN, SUCCESS_COPY as COPY } from './constants';
import { successStyles as s } from './styles';

type SuccessRouteProp = RouteProp<RootStackParamList, 'PaymentSuccess'>;
type SuccessNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * The receipt.
 *
 * There is no way back from here, by design. Behind this screen is a payment
 * form for a quotation that has now been booked, and "back" onto it would
 * offer to charge the customer a second time — so the hardware back button is
 * sent Home, and there is no back control in the header.
 *
 * The one action leads into the workspace, which is where the event is run
 * from now on.
 */
export function PaymentSuccessScreen() {
  const navigation = useNavigation<SuccessNavigationProp>();
  const { params } = useRoute<SuccessRouteProp>();

  /**
   * Home is the whole history from here.
   *
   * `reset` rather than `navigate`, so whatever the customer does next — back
   * out of the workspace, press the hardware back — lands on Home rather than
   * on the payment form behind this screen.
   */
  const goHome = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        goHome();
        return true;
      });
      return () => subscription.remove();
    }, [goHome]),
  );

  const openWorkspace = () => {
    /* Home first, then the workspace on top of it: backing out of the
       workspace should land on Home, not on a paid-for payment form. */
    navigation.reset({
      index: 1,
      routes: [
        { name: 'Main' },
        { name: 'Workspace', params: { bookingId: params.bookingId } },
      ],
    });
  };

  const organizer = params.organizerName?.trim() || 'Your organizer';

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.body}>
        <View style={s.tick}>
          <EventlyIcon name="check" size={44} color={PAY_GREEN} />
        </View>

        <EventlyText variant="h1" style={s.heading}>
          {COPY.heading}
        </EventlyText>
        <EventlyText variant="body" style={s.text}>
          {COPY.body(organizer)}
        </EventlyText>
      </View>

      <View style={s.foot}>
        <TouchableOpacity
          style={s.cta}
          activeOpacity={0.85}
          onPress={openWorkspace}
          accessibilityRole="button"
          accessibilityLabel={COPY.cta}
        >
          <EventlyText variant="subtitle" style={s.ctaText}>
            {COPY.cta}
          </EventlyText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default PaymentSuccessScreen;
