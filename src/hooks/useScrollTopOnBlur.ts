import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

/** Anything that can be scrolled back to its start. */
interface Scrollable {
  scrollTo?: (opts: { x?: number; y?: number; animated?: boolean }) => void;
  scrollToOffset?: (opts: { offset: number; animated?: boolean }) => void;
}

/**
 * A tab screen stays mounted when you switch tabs, so it keeps its scroll
 * position: scroll Home halfway, open Bookings, come back, and you land in the
 * middle of Home. This puts the screen back at the top the moment you leave
 * it — on blur, not on return, so the jump never shows.
 *
 * Attach the returned ref to the screen's main ScrollView or FlatList.
 */
export function useScrollTopOnBlur<T extends Scrollable = Scrollable>() {
  const ref = useRef<T>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('blur', () => {
      const list = ref.current;
      if (!list) return;
      if (list.scrollToOffset) {
        list.scrollToOffset({ offset: 0, animated: false });
      } else {
        list.scrollTo?.({ x: 0, y: 0, animated: false });
      }
    });
    return typeof unsubscribe === 'function' ? unsubscribe : undefined;
  }, [navigation]);

  return ref;
}
