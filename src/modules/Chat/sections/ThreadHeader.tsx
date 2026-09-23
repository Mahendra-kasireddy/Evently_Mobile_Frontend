import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { CHAT_COPY as COPY, CHAT_NAVY_DEEP } from '../constants';
import { threadStyles as s } from '../styles';
import type { ConversationItem } from '../types';

interface ThreadHeaderProps {
  /** Null until the summary loads, or for a thread not in this inbox. */
  summary: ConversationItem | null;
  /** What the route knew, so the name is right before anything is fetched. */
  fallbackName: string;
  onBack: () => void;
  /** Dropped entirely when there is no organizer to request a quote from. */
  onQuote?: () => void;
}

/**
 * Who you are talking to, how to leave, and the one thing a conversation is
 * usually leading towards.
 *
 * The reply line is rendered only when the server measured one — see
 * `replyLabel`. An organizer nobody has messaged enough gets no line rather
 * than a reassuring default, because a default would be about the schema and
 * not about them.
 */
export function ThreadHeader({ summary, fallbackName, onBack, onQuote }: ThreadHeaderProps) {
  const name = summary?.withName || fallbackName;

  return (
    <View style={s.header}>
      <TouchableOpacity
        style={s.back}
        onPress={onBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <EventlyIcon name="chevron-left" size={21} color={CHAT_NAVY_DEEP} />
      </TouchableOpacity>

      {summary ? (
        <View style={[s.headerAvatar, { backgroundColor: summary.withAvatarColor }]}>
          <EventlyText variant="subtitle" style={s.headerAvatarText}>
            {summary.withInitials}
          </EventlyText>
        </View>
      ) : null}

      <View style={s.headerText}>
        <EventlyText variant="subtitle" style={s.headerName} numberOfLines={1}>
          {name}
        </EventlyText>
        {summary?.replyLabel ? (
          <EventlyText variant="caption" style={s.headerReply}>
            {summary.replyLabel}
          </EventlyText>
        ) : null}
      </View>

      {onQuote ? (
        <TouchableOpacity
          style={s.quote}
          onPress={onQuote}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`${COPY.quote} from ${name}`}
        >
          <EventlyText variant="caption" style={s.quoteText}>
            {COPY.quote}
          </EventlyText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default ThreadHeader;
