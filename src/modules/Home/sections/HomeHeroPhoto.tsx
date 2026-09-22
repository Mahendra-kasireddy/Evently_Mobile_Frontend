import type { ReactNode } from 'react';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { homeHeroPhotoStyles as s } from '../styles';

/*
 * Bundled rather than fetched: this is the app's own artwork, not an
 * organizer's upload. A remote hero would leave the first screen of the app
 * blank on a cold start, which is the one moment it cannot afford to.
 */
const HERO_PHOTO = require('../../../assets/images/MrandMrs.jpg');

interface HomeHeroPhotoProps {
  /** The header, drawn over the photo. */
  children: ReactNode;
}

/**
 * The photograph behind Home's header.
 *
 * Full-bleed and under the status bar, so the picture starts at the very top
 * of the screen rather than in a box below it.
 *
 * The image sizes itself to the band and the header is what floats — not the
 * other way round. An `<Image>` positioned only by absolute insets has no
 * width or height of its own to resize against, and mis-measured badly enough
 * that `cover` showed a blown-up corner of the photo instead of the picture.
 * Giving it real dimensions and lifting the controls above it is what makes
 * the sign visible.
 */
export function HomeHeroPhoto({ children }: HomeHeroPhotoProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.wrap}>
      <Image source={HERO_PHOTO} style={s.photo} resizeMode="cover" />
      {/* Only as dark as the white controls need — the photograph is the
          point of the band, and a heavy wash turns it into a grey block. */}
      <View style={s.scrim} pointerEvents="none" />
      <View style={[s.overlay, { paddingTop: insets.top }]}>{children}</View>
    </View>
  );
}

export default HomeHeroPhoto;
