import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../Components';
import { CHAT_COPY as COPY } from '../constants';
import { rowStyles as s } from '../styles';
import type { ConversationItem } from '../types';

interface ConversationRowProps {
  item: ConversationItem;
  onPress: () => void;
}

/**
 * One thread in the inbox.
 *
 * The preview goes bold while there is something unread — the badge says how
 * many, but the weight is what the eye finds while scanning, and a count alone
 * makes every row look the same until you read it.
 *
 * The preview is one line. Two lines of a message nobody has opened is the
 * message itself, and the row stops being a list item.
 */
export function ConversationRow({ item, onPress }: ConversationRowProps) {
  const unread = item.unread > 0;

  return (
    <TouchableOpacity
      style={s.row}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        unread
          ? `${item.withName}, ${item.unread} unread. ${item.preview}`
          : `${item.withName}. ${item.preview || COPY.noMessagesYet}`
      }
    >
      <View style={[s.avatar, { backgroundColor: item.withAvatarColor }]}>
        <AppText variant="h3" style={s.avatarText}>
          {item.withInitials}
        </AppText>
      </View>

      <View style={s.text}>
        <View style={s.headRow}>
          <AppText variant="body" style={s.name} numberOfLines={1}>
            {item.withName}
          </AppText>
          {/* Dropped before anyone has written, rather than an empty slot. */}
          {item.whenLabel ? (
            <AppText variant="caption" style={s.when}>
              {item.whenLabel}
            </AppText>
          ) : null}
        </View>

        {/* A thread with no messages is a real state — "Message organizer"
            opens one before anybody writes — so the row says so rather than
            collapsing to a name and a coloured square. */}
        <AppText
          variant="body"
          style={[
            s.preview,
            unread && s.previewUnread,
            !item.preview && s.previewEmpty,
          ]}
          numberOfLines={1}
        >
          {item.preview || COPY.noMessagesYet}
        </AppText>
      </View>

      {unread ? (
        <View style={s.badge}>
          <AppText variant="label" style={s.badgeText}>
            {item.unread > 9 ? '9+' : item.unread}
          </AppText>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default ConversationRow;
