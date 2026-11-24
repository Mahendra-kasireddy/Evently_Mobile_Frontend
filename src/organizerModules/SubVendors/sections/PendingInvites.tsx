import { ActivityIndicator, Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { SUBVENDORS_COPY as COPY } from '../constants';
import { CHIP_TONE, ORG_ACCENT } from '../design';
import {
  cardStyles as card,
  chipToneStyles,
  pendingStyles as s,
} from '../styles';
import type { PendingItem } from '../types';

/** Invited numbers that haven't signed up yet, each with Cancel invite. */
export function PendingInvites({
  items,
  removingId,
  onCancel,
}: {
  items: PendingItem[];
  removingId: string | null;
  onCancel: (item: PendingItem) => void;
}) {
  if (!items.length) return null;
  const tone = chipToneStyles.amber;
  return (
    <View style={s.wrap}>
      <AppText variant="h3" style={s.heading} accessibilityRole="header">
        {`${COPY.pendingTitle} · ${items.length}`}
      </AppText>
      <AppText variant="caption" style={s.hint}>
        {COPY.pendingHint}
      </AppText>
      {items.map(item => {
        const busy = removingId === item.linkId;
        return (
          <View key={item.linkId} style={s.row}>
            <View style={s.icon}>
              <EventlyIcon
                name="email-fast-outline"
                size={22}
                color={CHIP_TONE.amber.ink}
              />
            </View>
            <View style={s.text}>
              <AppText variant="body" style={s.phone} numberOfLines={1}>
                {item.phone}
              </AppText>
              <View style={s.meta}>
                <View style={[card.chip, tone.box]}>
                  <AppText variant="label" style={[card.chipText, tone.text]}>
                    {COPY.chip.pending}
                  </AppText>
                </View>
                {item.sentAgo ? (
                  <AppText variant="label" style={s.ago}>
                    {item.sentAgo}
                  </AppText>
                ) : null}
              </View>
            </View>
            {busy ? (
              <ActivityIndicator size="small" color={ORG_ACCENT.sindoor} />
            ) : (
              <Pressable
                style={s.cancel}
                onPress={() => onCancel(item)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`${COPY.cancelInvite} ${item.phone}`}
              >
                <AppText variant="bodySmall" style={s.cancelText}>
                  {COPY.cancelInvite}
                </AppText>
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}

export default PendingInvites;
