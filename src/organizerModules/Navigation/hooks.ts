import { useCallback, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAsync } from '../../hooks/useAsync';
import type { RootStackParamList } from '../../navigation/types';
import { ORGANIZER_ROUTES, type OrganizerRouteKey } from './constants';
import { getUnreadCount } from './services';

/** The bell's count, fetched again whenever the screen comes back into view. */
export function useUnreadCount(): number {
  const { data, refetch } = useAsync(getUnreadCount, []);
  // The first focus is the mount, which useAsync has already fetched for.
  const seen = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (seen.current) refetch();
      seen.current = true;
    }, [refetch]),
  );
  return data ?? 0;
}

/**
 * Opens an organizer screen by name — natively once it is built, otherwise its
 * web page under a native header. Screens link through this, never to a web
 * path directly, so moving a screen to native needs no change at its links.
 */
export function useOpenOrganizerScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return useCallback(
    (key: OrganizerRouteKey) => {
      const route = ORGANIZER_ROUTES[key];
      navigation.navigate('OrganizerWebPage', {
        path: route.path,
        title: route.title,
      });
    },
    [navigation],
  );
}
