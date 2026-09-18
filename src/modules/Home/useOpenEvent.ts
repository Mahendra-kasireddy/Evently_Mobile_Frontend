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
