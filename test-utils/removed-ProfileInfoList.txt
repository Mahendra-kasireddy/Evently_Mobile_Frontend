import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { PROFILE_ACCENT, PROFILE_COPY as COPY, PROFILE_GREEN } from '../constants';
import { profileInfoListStyles as s } from '../styles';
import type { ProfileViewModel } from '../types';

/**
 * The account's own facts.
 *
 * A fact the account does not hold keeps its row and shows a prompt, because
 * a missing city is something the customer can fix — a bare blank just looks
 * broken. The phone additionally carries whether it is verified, which the
 * screen previously fetched and then threw away.
 */
export function ProfileInfoList({ data }: { data: ProfileViewModel }) {
  return (
    <View style={s.card}>
      {data.facts.map((fact, index) => {
        const missing = !fact.value;
        return (
          <View key={fact.key} style={[s.row, index > 0 && s.rowDivider]}>
            <View style={s.iconBadge}>
              <EventlyIcon name={fact.icon} size={18} color={PROFILE_ACCENT} />
            </View>
            <View style={s.text}>
              <EventlyText variant="caption" style={s.label}>
                {fact.label}
              </EventlyText>
              <EventlyText
                variant="body"
                style={missing ? s.valueEmpty : s.value}
                numberOfLines={1}
              >
                {fact.value || fact.emptyHint}
              </EventlyText>
            </View>

            {fact.verified !== undefined && !missing ? (
              <View style={s.verified}>
                <EventlyIcon
                  name={fact.verified ? 'check-decagram' : 'alert-circle-outline'}
                  size={15}
                  color={fact.verified ? PROFILE_GREEN : colors.textMuted}
                />
                <EventlyText
                  variant="caption"
                  style={[s.verifiedText, { color: fact.verified ? PROFILE_GREEN : colors.textMuted }]}
                >
                  {fact.verified ? COPY.verified : COPY.unverified}
                </EventlyText>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export default ProfileInfoList;
