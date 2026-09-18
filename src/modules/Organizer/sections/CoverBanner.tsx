import { Share, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyImage, EventlyText } from '../../../Components';
import { brand } from '../../../theme';
import { COVER_NAVY, COVER_PLUM, ORGANIZER_COPY as COPY } from '../constants';
import { COVER_HEIGHT, coverStyles as s } from '../styles';
import { CoverArt } from './CoverArt';
import type { VerificationBadge } from '../types';

interface CoverBannerProps {
  name: string;
  /** The organizer's own cover upload. Null draws the gradient instead. */
  coverUrl: string | null;
  /** Null when there is nothing Evently can vouch for. */
  verification: VerificationBadge | null;
  onBack: () => void;
}

/**
 * The band behind the profile's head.
 *
 * The organizer's own cover photo when they uploaded one, and the drawn
 * gradient when they did not — never a stock photograph, which would put
 * somebody else's venue at the top of their profile.
 *
 * There is no "save to favourites" heart here. The design has one, but
 * nothing in the API stores a saved organizer, and a heart that forgets what
 * it was told the moment the screen closes is worse than no heart.
 */
export function CoverBanner({ name, coverUrl, verification, onBack }: CoverBannerProps) {
  const share = () => {
    // The native sheet: nothing here decides where it goes, so there is no
    // list of apps to keep up to date.
    Share.share({ message: `${name} on Evently` }).catch(() => {});
  };

  return (
    <View style={s.wrap}>
      {coverUrl ? (
        <>
          <EventlyImage source={{ uri: coverUrl }} style={s.photo} resizeMode="cover" />
          <View style={s.scrim} />
        </>
      ) : (
        <CoverArt
          width={390}
          height={COVER_HEIGHT}
          from={COVER_NAVY}
          to={COVER_PLUM}
          style={s.art}
        />
      )}

      <View style={s.topRow}>
        <TouchableOpacity
          style={s.circle}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <EventlyIcon name="chevron-left" size={22} color={brand.onNavy} />
        </TouchableOpacity>

        <View style={s.actions}>
          <TouchableOpacity
            style={s.circle}
            onPress={share}
            accessibilityRole="button"
            accessibilityLabel={COPY.share}
          >
            <EventlyIcon name="share-variant-outline" size={18} color={brand.onNavy} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Only for an organizer an admin has actually passed. */}
      {verification ? (
        <View style={s.badge}>
          <EventlyIcon name="check-decagram" size={14} color={brand.mint} />
          <EventlyText variant="label" style={s.badgeText}>
            {verification.detail
              ? `${verification.title} · ${verification.detail}`
              : verification.title}
          </EventlyText>
        </View>
      ) : null}
    </View>
  );
}

export default CoverBanner;
