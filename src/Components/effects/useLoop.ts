import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Under Jest there is no native animation module; a loop that never ends
 * would keep scheduling frames after the test that started it has finished.
 * Effects render their resting frame there instead.
 */
const env = (
  globalThis as { process?: { env?: Record<string, string | undefined> } }
).process?.env;
export const LOOPS_ENABLED = !env?.JEST_WORKER_ID;

interface LoopOptions {
  /** One full cycle, in ms. */
  duration: number;
  /** Rest between cycles, in ms — a sheen that sweeps, then waits. */
  pause?: number;
  /** Run or not. Pass `false` for reduced motion or an idle state. */
  running: boolean;
  easing?: (value: number) => number;
}

/**
 * A 0 → 1 value that repeats forever on the native driver.
 *
 * Every looping effect on Home is a transform or an opacity derived from one
 * of these, so none of them costs the JavaScript thread a frame — the reason
 * they hold 60 FPS on a low-end Android while the feed is still parsing.
 */
export function useLoop({
  duration,
  pause = 0,
  running,
  easing = Easing.linear,
}: LoopOptions): Animated.Value {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!running || !LOOPS_ENABLED) {
      value.setValue(0);
      return undefined;
    }
    const cycle = Animated.timing(value, {
      toValue: 1,
      duration,
      easing,
      useNativeDriver: true,
    });
    const loop = Animated.loop(
      pause > 0 ? Animated.sequence([cycle, Animated.delay(pause)]) : cycle,
      { resetBeforeIteration: true },
    );
    loop.start();
    return () => loop.stop();
  }, [duration, easing, pause, running, value]);

  return value;
}
