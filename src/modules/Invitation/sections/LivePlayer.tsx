import { Linking, View } from 'react-native';
import { liveStyles as s } from '../styles';

/*
 * The live stream, playing inside the invitation.
 *
 * `react-native-webview` is a native module, so it is resolved the same way
 * `HeroVideo` resolves its player: looked up once, and reported honestly. A
 * JS bundle can be reloaded the moment the dependency lands in package.json,
 * but the native side only exists after the app is rebuilt — between those
 * two moments a direct import is a red screen, and this is a card that says
 * so instead.
 *
 * The transport controls the reference shows — pause, volume, picture in
 * picture, full screen — are the player's own, drawn inside this frame by
 * YouTube or Vimeo. That is why this is a real embed rather than a still with
 * buttons painted over it: painted ones would not do anything.
 */
type WebViewProps = {
  source: { uri: string };
  style: object;
  javaScriptEnabled: boolean;
  domStorageEnabled: boolean;
  allowsInlineMediaPlayback: boolean;
  allowsFullscreenVideo: boolean;
  mediaPlaybackRequiresUserAction: boolean;
  originWhitelist: string[];
  setSupportMultipleWindows: boolean;
  onShouldStartLoadWithRequest: (req: {
    url: string;
    isTopFrame?: boolean;
  }) => boolean;
};

function resolveWebView(): React.ComponentType<WebViewProps> | null {
  try {
    const mod = require('react-native-webview');
    return (mod?.WebView ??
      mod?.default ??
      null) as React.ComponentType<WebViewProps> | null;
  } catch {
    return null;
  }
}

const WebViewImpl = resolveWebView();

/** True where a stream can actually be drawn. Checked, never assumed. */
export const canEmbedStream = WebViewImpl !== null;

/**
 * Hosts the frame may navigate to itself.
 *
 * The url already passed the server's allowlist on the way in, but a player
 * is a web page: a guest tapping the channel name inside it would otherwise
 * navigate this frame to somewhere arbitrary, still wearing the invitation's
 * chrome. Anything that is not the player goes to the real browser, where the
 * address bar tells the truth about where they are.
 */
const PLAYER_HOSTS = [
  'youtube.com',
  'youtube-nocookie.com',
  'youtu.be',
  'vimeo.com',
  'twitch.tv',
  'facebook.com',
  'dailymotion.com',
  'mediadelivery.net',
  'cloudflarestream.com',
  'videodelivery.net',
  'google.com',
  'gstatic.com',
  'ytimg.com',
];

export function isPlayerUrl(url: string): boolean {
  if (url === 'about:blank') return true;
  const host = /^https?:\/\/([^/?#]+)/i.exec(url)?.[1]?.toLowerCase();
  if (!host) return false;
  /* Suffix match on a dot boundary, so `youtube.com.evil.example` does not
     pass by containing an allowed name. */
  return PLAYER_HOSTS.some(h => host === h || host.endsWith(`.${h}`));
}

/** The player, 16:9, with the stream's own controls inside it. */
export function LivePlayer({ uri }: { uri: string }) {
  if (!WebViewImpl) return null;
  return (
    <View style={s.player} testID="live-player">
      <WebViewImpl
        source={{ uri }}
        style={s.playerFrame}
        javaScriptEnabled
        domStorageEnabled
        /* Without this iOS refuses to play in place and throws the video into
           its own full-screen player the moment it starts. */
        allowsInlineMediaPlayback
        allowsFullscreenVideo
        /* The guest presses play. A live stream that starts itself burns
           someone's mobile data before they have decided to watch. */
        mediaPlaybackRequiresUserAction
        originWhitelist={['https://*']}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={req => {
          if (isPlayerUrl(req.url)) return true;
          Linking.openURL(req.url).catch(() => undefined);
          return false;
        }}
      />
    </View>
  );
}

export default LivePlayer;
