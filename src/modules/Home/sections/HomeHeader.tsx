import { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { HERO_ACCENT_COLOR, HOME_NAVY } from '../constants';
import { homeHeaderStyles as s } from '../styles';

interface HomeHeaderProps {
  /** The monogram on the avatar — the account's own, never an organizer's. */
  initials: string;
  /** The account's own photo, absolute; '' (or one that fails to load) shows the monogram. */
  photoUrl?: string;
  /** Only for the avatar's label, so it names who it opens. */
  displayName: string;
  unreadCount: number;
  /** True when the header is drawn over the hero photograph. */
  onPhoto?: boolean;
  onPressProfile: () => void;
  onPressNotifications: () => void;
  /** Opens the search screen, where the results and the filters live. */
  onPressSearch: () => void;
}

/** A count worth showing, capped so a big number cannot stretch the dot. */
function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={s.badge}>
      <EventlyText variant="caption" style={s.badgeText}>
        {count > 9 ? '9+' : count}
      </EventlyText>
    </View>
  );
}

/**
 * The bar above everything: whose account this is, what is waiting for them,
 * and the way into search.
 *
 * The avatar on the left is the way into Profile, which is no longer a tab:
 * the account is one destination reached from one place, not a peer of the
 * feed. It shows the photo the customer added at first sign-in, and their
 * initials when there is none or it will not load — never a stock face, which
 * would be somebody else's. The badge on the
 * bell is a real count and disappears at zero.
 *
 * One row, not two. Search is an icon here rather than a field drawn to look
 * like an input: typing happens on the search screen, where the results and
 * the filters live, so the field on Home was a button pretending to be
 * something it was not — and it cost a whole row of the fold to say what a
 * glyph says.
 */
export function HomeHeader({
  initials,
  photoUrl = '',
  displayName,
  unreadCount,
  onPhoto = false,
  onPressProfile,
  onPressNotifications,
  onPressSearch,
}: HomeHeaderProps) {
  /* On the photo everything is white and each control gets its own tinted
     disc; on the canvas it is navy and unadorned. */
  const tint = onPhoto ? colors.onPrimary : HOME_NAVY;
  const iconButton = [s.iconButton, onPhoto && s.iconButtonOnPhoto];
  // A photo that fails to load falls back to the monogram, not a blank disc.
  const [photoFailed, setPhotoFailed] = useState(false);
  useEffect(() => setPhotoFailed(false), [photoUrl]);
  const showPhoto = photoUrl !== '' && !photoFailed;
  return (
    <View style={s.container}>
      <View style={s.topRow}>
        <TouchableOpacity
          style={[s.avatar, onPhoto && s.avatarOnPhoto]}
          onPress={onPressProfile}
          accessibilityRole="button"
          accessibilityLabel={
            displayName ? `Your profile, ${displayName}` : 'Your profile'
          }
        >
          {showPhoto ? (
            <Image
              source={{ uri: photoUrl }}
              style={s.avatarImage}
              onError={() => setPhotoFailed(true)}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <EventlyText variant="subtitle" style={s.avatarText}>
              {initials}
            </EventlyText>
          )}
        </TouchableOpacity>

        <View style={s.actions}>
          <TouchableOpacity
            style={iconButton}
            onPress={onPressSearch}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <EventlyIcon
              name="magnify"
              size={22}
              color={onPhoto ? HERO_ACCENT_COLOR : tint}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={iconButton}
            onPress={onPressNotifications}
            accessibilityRole="button"
            accessibilityLabel={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : 'Notifications'
            }
          >
            <EventlyIcon
              name="bell-outline"
              size={22}
              color={onPhoto ? '#7c5cdb' : tint}
            />
            <Badge count={unreadCount} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default HomeHeader;
