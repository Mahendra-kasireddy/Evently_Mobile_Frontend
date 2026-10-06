import { TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText, GradientFill } from '../../../Components';
import { sectionHeadStyles as s } from '../styles';

interface BookingSectionHeadProps {
  title: string;
  icon: string;
  gradient: [string, string];
  /** A count beside the title, when there is one worth showing. */
  count?: number;
  onSeeAll?: () => void;
}

/**
 * A Bookings section heading, in Home's style: a gradient badge with the
 * section's icon, the title, an optional count, and "See all" in the
 * section's own colour.
 */
export function BookingSectionHead({ title, icon, gradient, count, onSeeAll }: BookingSectionHeadProps) {
  return (
    <View style={s.row}>
      <View style={s.left}>
        <View style={s.badge}>
          <GradientFill colors={gradient} direction="diagonal" />
          <EventlyIcon name={icon} size={15} color="#ffffff" />
        </View>
        <EventlyText variant="subtitle" style={s.title} numberOfLines={1}>
          {title}
        </EventlyText>
        {count ? (
          <View style={s.count}>
            <EventlyText variant="caption" style={[s.countText, { color: gradient[1] }]}>
              {count}
            </EventlyText>
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
          <EventlyText variant="caption" style={[s.seeAll, { color: gradient[1] }]}>
            See all
          </EventlyText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default BookingSectionHead;
