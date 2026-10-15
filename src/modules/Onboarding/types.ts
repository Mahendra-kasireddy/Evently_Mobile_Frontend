import type { ImageSourcePropType } from 'react-native';

/** Which extra decoration a slide's picture gets. */
export type OnboardingArt = 'discover' | 'platform' | 'celebrate';

export interface OnboardingSlide {
  key: string;
  art: OnboardingArt;
  image: ImageSourcePropType;
  /** Soft colour of the round glow behind the picture. */
  glow: string;
  heading: string;
  subtitle: string;
}
