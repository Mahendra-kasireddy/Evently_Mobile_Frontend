import { Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { IDEAS_COPY as COPY } from '../constants';
import type { Notice } from '../container';
import { DANGER, OK_INK } from '../design';
import { styles as s } from '../styles';

/** What just happened — a success, or why something didn't. */
export function NoticeBar({
  notice,
  onDismiss,
}: {
  notice: Notice;
  onDismiss: () => void;
}) {
  const ok = notice.tone === 'ok';
  const ink = ok ? OK_INK : DANGER;
  return (
    <View
      style={[s.notice, ok ? s.noticeOk : s.noticeError]}
      accessibilityLiveRegion="polite"
    >
      <EventlyIcon
        name={ok ? 'check-circle-outline' : 'alert-circle-outline'}
        size={18}
        color={ink}
      />
      <AppText
        variant="bodySmall"
        style={[s.noticeText, ok ? s.noticeTextOk : s.noticeTextError]}
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
