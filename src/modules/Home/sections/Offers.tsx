import { FlatList, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { offersStyles as s } from '../styles';
import { SectionHead } from './SectionHead';
import type { CouponOffer, CouponsViewModel } from '../types';

interface OffersProps {
  /** Opens the full list. The row is a carousel, so most of it is off screen. */
  onPressSeeAll: () => void;
  data: CouponsViewModel;
  /** Opens the coupon's full terms. */
  onPressOffer: (coupon: CouponOffer) => void;
}

export function OfferCard({
  coupon,
  onPress,
}: {
  coupon: CouponOffer;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.card, coupon.tone === 'navy' ? s.cardNavy : s.cardAccent]}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[
        `Coupon ${coupon.code}`,
        coupon.title,
        coupon.terms,
        coupon.ctaLabel,
      ]
        .filter(Boolean)
        .join('. ')}
    >
      {/* The code, where a category label would otherwise sit. It is the part
          the customer has to carry to a checkout, so it is the part the card
          leads with. */}
      <EventlyText variant="caption" style={s.eyebrow} numberOfLines={1}>
        {coupon.code}
      </EventlyText>
      <EventlyText variant="h2" style={s.title} numberOfLines={2}>
        {coupon.title}
      </EventlyText>
      {/* Dropped rather than left as an empty line when a coupon has neither a
          minimum nor an end date. */}
      {coupon.terms ? (
        // Two lines, not three: the conditions are a reminder of what to check,
        // and the sheet behind "See details" is where they are read in full.
        <EventlyText variant="caption" style={s.terms} numberOfLines={2}>
          {coupon.terms}
        </EventlyText>
      ) : null}
      <View style={s.ctaRow}>
        <EventlyText variant="body" style={s.ctaText}>
          {coupon.ctaLabel}
        </EventlyText>
        <EventlyIcon name="chevron-right" size={17} color={colors.onPrimary} />
      </View>
    </TouchableOpacity>
  );
}

/**
 * The coupons this customer could still use.
 *
 * The count beside the title is the real number of cards rather than a fixed
 * label, and the section is not rendered at all when nothing is live — the
 * server only sends coupons that are active, inside their window, with slots
 * left, and not already used up by this customer, so an empty list means there
 * genuinely are none rather than that something failed to load.
 */
export function Offers({ data, onPressOffer, onPressSeeAll }: OffersProps) {
  return (
    <View>
      <SectionHead
        title={data.title}
        actionLabel="See all"
        onPressAction={onPressSeeAll}
      />
      <FlatList
        data={data.items}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <OfferCard coupon={item} onPress={() => onPressOffer(item)} />
        )}
      />
    </View>
  );
}

export default Offers;
