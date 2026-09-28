import { View } from 'react-native';

/*
 * A cover video plays through a native player, which this app does not
 * currently bundle. Rather than pretend otherwise — a black rectangle where a
 * video should be is worse than the theme it replaced — the player is looked
 * up once, and the cover falls back to its theme when there is none.
 *
 * `react-native-video` is the player this resolves to. Installing it is the
 * only thing standing between a saved cover video and it playing; nothing else
 * about the invitation changes, because the url and the key are stored either
 * way.
 */
type PlayerProps = {
  source: { uri: string };
  style: object;
  repeat: boolean;
  muted: boolean;
  paused: boolean;
  resizeMode: string;
  controls: boolean;
};

function resolvePlayer(): React.ComponentType<PlayerProps> | null {
  try {
     
    const mod = require('react-native-video');
    return (mod?.default ?? mod?.Video ?? null) as React.ComponentType<PlayerProps> | null;
     
  } catch {
    return null;
  }
}

const Player = resolvePlayer();

/** True where a cover video can actually be drawn. Checked, never assumed. */
export const canPlayVideo = Player !== null;

/**
 * The cover's video: playing on its own, silent, looping, with nothing to tap.
 *
 * A guest opening an invitation is not being asked to operate a player, so
 * there are no controls and no sound — it is a moving photograph.
 */
export function HeroVideo({ uri, style }: { uri: string; style: object }) {
  if (!Player) return <View style={style} />;
  return (
    <Player
      source={{ uri }}
      style={style}
      repeat
      muted
      paused={false}
      resizeMode="cover"
      controls={false}
    />
  );
}

export default HeroVideo;
