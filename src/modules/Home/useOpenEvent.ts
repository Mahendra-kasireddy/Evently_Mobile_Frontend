import { useCallback } from 'react';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  MainTabParamList,
  RootStackParamList,
} from '../../navigation/types';
import type { CurrentEventViewModel } from './types';

type EventNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * Where one of the customer's events opens — decided by which record it is,
 * not by how far along it is.
 *
 * It lives here rather than in a screen because two screens list events now,
 * and a card and a row that lead to different places for the same event is
 * exactly the kind of drift nobody notices until a customer reports it.
 *
 * The routing used to turn on the stage, and a submitted request with no
 * quotes yet matched no branch and fell through to the plan wizard: a button
 * reading "See your request" opened a blank new plan. CompareQuotes is the
 * request's own screen — none is still a number of quotes, and the brief is on
 * it either way — so a request opens there whether or not anyone has replied,
 * and only a draft, which genuinely has nothing else to open, goes back to the
 * wizard.
 *
 * With exactly two quotes it goes one step further and opens them side by
 * side. "Compare 2 quotes" promises a comparison, and with two there is no
 * choosing left to do — sending the customer to a list so they can tick the
 * only two rows on it is a screen that asks a question with one answer. Three
 * or more is a real choice, so that opens the list.
 */
export function useOpenEvent(): (event: CurrentEventViewModel) => void {
  const navigation = useNavigation<EventNavigationProp>();

  return useCallback(
    (event: CurrentEventViewModel) => {
      if (event.source === 'booking') {
        return navigation.navigate('Workspace', {
          bookingId: event.refId,
          workspaceName: event.title,
        });
      }
      if (event.source === 'quote') {
        /*
         * An accepted quote has one thing left to do, and it is the advance.
         *
         * Nothing is booked until it is paid, so sending this customer back to
         * the comparison would be showing them a decision they have already
         * made. The quotation id is what the payment screen prices from — the
         * request id cannot be used, because a request can hold several
         * quotes and only one of them was accepted.
         */
        if (event.stage === 'quote_accepted' && event.quotationId) {
          return navigation.navigate('Payment', { quotationId: event.quotationId });
        }

        /*
         * Exactly two, not "at least two". With three the customer has a
         * choice to make about which pair to open, and picking it for them
         * would bury a quote they never saw.
         */
        if (event.quoteRows.length === 2) {
          const [first, second] = event.quoteRows;
          return navigation.navigate('LineByLine', {
            requestId: event.refId,
            leftId: first.id,
            rightId: second.id,
            title: event.title,
          });
        }
        return navigation.navigate('CompareQuotes', {
          requestId: event.refId,
          title: event.title,
        });
      }
      return navigation.navigate('Plan');
    },
    [navigation],
  );
}

export default useOpenEvent;
