import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

/*
 * Video, played by the phone's own engine.
 *
 * `react-native-video` is preferred where it is installed. Where it is not —
 * this app today — the video plays inside a WebView, which the app already
 * ships: an HTML <video> element is the platform's native player (AVPlayer on
 * iOS, the system media stack on Android) with its own controls, so nothing
 * new has to be linked or rebuilt to play a reel.
 *
 * The file server answers byte-range requests (see the upload controller),
 * which iOS requires before it will play a video at all.
 */

/** `ambient`: silent, looping, no controls — a moving photograph. `player`: sound and controls. */
export type VideoMode = 'ambient' | 'player';

type NativePlayerProps = {
  source: { uri: string };
  style: object;
  repeat: boolean;
  muted: boolean;
  paused: boolean;
  resizeMode: string;
  controls: boolean;
};

type WebViewProps = {
  source: { html: string; baseUrl?: string };
  style: object;
  originWhitelist: string[];
  javaScriptEnabled: boolean;
  allowsInlineMediaPlayback: boolean;
  mediaPlaybackRequiresUserAction: boolean;
  allowsFullscreenVideo: boolean;
  scrollEnabled: boolean;
  bounces: boolean;
  setSupportMultipleWindows: boolean;
};

function resolve<T>(load: () => unknown, pick: (mod: any) => unknown): T | null {
  try {
    return (pick(load()) ?? null) as T | null;
  } catch {
    return null;
  }
}

const NativePlayer = resolve<React.ComponentType<NativePlayerProps>>(
  () => require('react-native-video'),
  (mod) => mod?.default ?? mod?.Video,
);
const WebViewImpl = resolve<React.ComponentType<WebViewProps>>(
  () => require('react-native-webview'),
  (mod) => mod?.WebView ?? mod?.default,
);

/** True where a video can actually be drawn. Checked, never assumed. */
export const canPlayVideo = NativePlayer !== null || WebViewImpl !== null;

/** Escapes a value for use inside a double-quoted HTML attribute. */
function attr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** The page the WebView renders: one <video>, edge to edge, on black. */
export function videoHtml(uri: string, mode: VideoMode, fit: 'cover' | 'contain'): string {
  const ambient = mode === 'ambient';
  const flags = ambient
    ? 'autoplay muted loop playsinline disablepictureinpicture'
    : 'autoplay controls playsinline';
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>html,body{margin:0;padding:0;height:100%;background:#000;overflow:hidden}
video{width:100%;height:100%;object-fit:${fit};display:block;background:#000}</style></head>
<body><video src="${attr(uri)}" ${flags} preload="auto"></video></body></html>`;
}

/**
 * An invitation's video.
 *
 * `ambient` for the cover and the card preview — no sound, no controls,
 * looping, so a guest opening an invitation is not asked to operate a
 * player. `player` for the full-screen view, where the reel is the point:
 * sound and the platform's own controls.
 */
export function HeroVideo({
  uri,
  style,
  mode = 'ambient',
  fit = 'cover',
}: {
  uri: string;
  style: object;
  mode?: VideoMode;
  fit?: 'cover' | 'contain';
}) {
  const html = useMemo(() => videoHtml(uri, mode, fit), [uri, mode, fit]);

  if (NativePlayer) {
    const ambient = mode === 'ambient';
    return (
      <NativePlayer
        source={{ uri }}
        style={style}
        repeat={ambient}
        muted={ambient}
        paused={false}
        resizeMode={fit}
        controls={!ambient}
      />
    );
  }
  if (!WebViewImpl) return <View style={style} />;
  return (
    <View style={style} pointerEvents={mode === 'ambient' ? 'none' : 'auto'}>
      <WebViewImpl
        source={{ html }}
        style={styles.web}
        originWhitelist={['*']}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
        scrollEnabled={false}
        bounces={false}
        setSupportMultipleWindows={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: '#000' },
});

export default HeroVideo;
