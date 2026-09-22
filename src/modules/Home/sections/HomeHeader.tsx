import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { HOME_NAVY } from '../constants';
import { homeHeaderStyles as s } from '../styles';

interface HomeHeaderProps {
  /** The monogram on the avatar — the account's own, never an organizer's. */
  initials: string;
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
 * feed. It carries the account's initials, because the API has no photograph
 * for a customer — a stock face would be somebody else's. The badge on the
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
          <EventlyText variant="subtitle" style={s.avatarText}>
            {initials}
          </EventlyText>
        </TouchableOpacity>

        <View style={s.actions}>
          <TouchableOpacity
            style={iconButton}
            onPress={onPressSearch}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <EventlyIcon name="magnify" size={23} color={tint} />
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
            <EventlyIcon name="bell-outline" size={23} color={tint} />
            <Badge count={unreadCount} />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

export default HomeHeader;
