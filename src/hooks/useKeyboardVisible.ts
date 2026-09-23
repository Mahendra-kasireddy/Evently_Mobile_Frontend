import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/**
 * Whether the software keyboard is on screen.
 *
 * For the one thing a safe-area inset cannot do on its own: a composer pinned
 * to the bottom needs the home-indicator inset while the keyboard is down, and
 * none of it while the keyboard is up — the keyboard is already covering that
 * strip, and padding it again leaves a band of empty white above the keys.
 *
 * iOS reports `will*` (in step with the animation) and Android only `did*`.
 */
export function useKeyboardVisible(): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, () => setVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return visible;
}

export default useKeyboardVisible;
