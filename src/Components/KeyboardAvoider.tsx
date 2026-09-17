import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface KeyboardAvoiderProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Height of any fixed chrome between this view's top and the window's top. */
  keyboardVerticalOffset?: number;
}

/**
 * Keeps the focused field above the keyboard, on both platforms.
 *
 * Every screen in the app used to say `behavior={Platform.OS === 'ios' ?
 * 'padding' : undefined}`, leaving Android to the manifest's `adjustResize`.
 * That stopped working: the app targets SDK 36, and from SDK 35 Android
 * enforces edge-to-edge, under which the window is never resized for the
 * keyboard — so `adjustResize` is a no-op and `undefined` means "do nothing".
 * The symptom was a keyboard sitting on top of the field being typed into.
 * (`android:windowOptOutEdgeToEdgeEnforcement` is not a way out: it is ignored
 * at target 36.)
 *
 * So Android gets `padding` too, driven by the keyboard events rather than by
 * a window resize that no longer happens. One component rather than the same
 * ternary in eight screens, because the next platform change of this kind
 * should be one edit.
 */
export function KeyboardAvoider({
  children,
  style,
  keyboardVerticalOffset,
}: KeyboardAvoiderProps) {
  return (
    <KeyboardAvoidingView
      style={style}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

export default KeyboardAvoider;
