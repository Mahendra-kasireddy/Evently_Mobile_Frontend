import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../Components';
import { sectionHeadStyles as s } from '../styles';

interface BookingSectionHeadProps {
  title: string;
  /** No longer drawn: headings carry no icon badge. */
  icon?: string;
  gradient: [string, string];
  /** A count beside the title, when there is one worth showing. */
  count?: number;
  onSeeAll?: () => void;
}

/**
 * A Bookings section heading, in Home's style: the title, an optional
 * count, and "See all" in the section's own colour. No icon badge.
 */
export function BookingSectionHead({
  title,
  gradient,
  count,
  onSeeAll,
}: BookingSectionHeadProps) {
  return (
    <View style={s.row}>
      <View style={s.left}>
        <AppText variant="h3" style={s.title} numberOfLines={1}>
          {title}
        </AppText>
        {count ? (
          <View style={s.count}>
            <AppText
              variant="label"
              style={[s.countText, { color: gradient[1] }]}
            >
              {count}
            </AppText>
          </View>
        ) : null}
      </View>
      {onSeeAll ? (
        <TouchableOpacity
          onPress={onSeeAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
        >
          <AppText
            variant="bodySmall"
            style={[s.seeAll, { color: gradient[1] }]}
          >
            See all
          </AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default BookingSectionHead;
