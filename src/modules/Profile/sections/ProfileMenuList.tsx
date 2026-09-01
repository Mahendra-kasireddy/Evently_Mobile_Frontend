import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { PROFILE_NAVY } from '../constants';
import { profileMenuListStyles as s } from '../styles';

export interface ProfileMenuItem {
  key: string;
  icon: string;
  label: string;
  /** One line saying what is behind the row, so the label need not carry it. */
  hint?: string;
  onPress: () => void;
}

interface ProfileMenuListProps {
  title: string;
  items: ProfileMenuItem[];
}

/** One titled group of destinations. */
export function ProfileMenuList({ title, items }: ProfileMenuListProps) {
  if (items.length === 0) return null;

  return (
    <>
      <EventlyText variant="caption" style={s.sectionTitle}>
        {title}
      </EventlyText>
      <View style={s.card}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.key}
            style={[s.row, index > 0 && s.rowDivider]}
            activeOpacity={0.7}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <View style={s.iconBadge}>
              <EventlyIcon name={item.icon} size={18} color={PROFILE_NAVY} />
            </View>
            <View style={s.text}>
              <EventlyText variant="body" style={s.label}>
                {item.label}
              </EventlyText>
              {item.hint ? (
                <EventlyText variant="caption" style={s.hint}>
                  {item.hint}
                </EventlyText>
              ) : null}
            </View>
            <EventlyIcon name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

export default ProfileMenuList;
