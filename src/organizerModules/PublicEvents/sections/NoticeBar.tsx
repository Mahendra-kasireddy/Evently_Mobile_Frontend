import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { PUBLIC_EVENTS_COPY as COPY } from '../constants';
import type { Notice } from '../container';
import { DANGER, STATUS_TONE } from '../design';
import { noticeStyles as s } from '../styles';

/** What just happened — a success, or why something didn't. */
export function NoticeBar({
  notice,
  onDismiss,
}: {
  notice: Notice;
  onDismiss: () => void;
}) {
  const ok = notice.tone === 'ok';
  const ink = ok ? STATUS_TONE.green.ink : DANGER;
  return (
    <View style={[s.bar, ok ? s.ok : s.error]} accessibilityLiveRegion="polite">
      <EventlyIcon
        name={ok ? 'check-circle-outline' : 'alert-circle-outline'}
        size={18}
        color={ink}
      />
      <AppText
        variant="bodySmall"
        style={[s.text, ok ? s.textOk : s.textError]}
      >
        {notice.text}
      </AppText>
      <Pressable
        onPress={onDismiss}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={COPY.dismiss}
      >
        <EventlyIcon name="close" size={18} color={ink} />
      </Pressable>
    </View>
  );
}

export default NoticeBar;
