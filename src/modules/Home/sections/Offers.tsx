import { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { HERO_ACCENT_COLOR } from '../constants';
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
  /*
   * Most coupon titles already carry the figure — "10% off on Birthday" — and
   * setting it large underneath said the same number twice, in two sizes, on
   * a card 340 points wide. So the big figure is drawn only when the title
   * does not already state it; a coupon called "Diwali bonanza" still gets
   * one. The cap is never lost either way: when the figure is dropped it
   * joins the conditions, because "up to ₹10,000" is the part of the offer
   * the title does not say.
   */
  const stripped = (text: string) => text.replace(/\s+/g, '').toLowerCase();
  const titleSaysIt = stripped(coupon.title).includes(
    stripped(coupon.valueLabel),
  );
  const capNote = coupon.valueNote.replace(/^off,\s*/, '');
  const conditions = titleSaysIt
    ? [capNote === 'off' ? '' : capNote, coupon.terms]
        .filter(Boolean)
        .join(' · ')
    : coupon.terms;

  return (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[
        `Coupon ${coupon.code}`,
        coupon.title,
        titleSaysIt ? capNote : `${coupon.valueLabel} ${coupon.valueNote}`,
        coupon.terms,
        coupon.ctaLabel,
      ]
        .filter(Boolean)
        .join('. ')}
    >
      <View style={s.art} pointerEvents="none">
        <View style={s.artInner}>
          <EventlyIcon
            name="ticket-percent"
            size={68}
            color={HERO_ACCENT_COLOR}
          />
        </View>
      </View>

      <View style={s.body}>
        {/* The code, where a category label would otherwise sit. It is the
            part the customer has to carry to a checkout, so it is the part
            the card leads with. */}
        <EventlyText variant="caption" style={s.code} numberOfLines={1}>
          {coupon.code}
        </EventlyText>

        <EventlyText variant="h2" style={s.title} numberOfLines={2}>
          {coupon.title}
        </EventlyText>

        {titleSaysIt ? null : (
          <View style={s.valueRow}>
            <EventlyText variant="h1" style={s.value}>
              {coupon.valueLabel}
            </EventlyText>
            <EventlyText variant="caption" style={s.valueNote}>
              {coupon.valueNote}
            </EventlyText>
          </View>
        )}

        {/* The conditions stay on the card. The reference has none to show;
            a discount does — a 15% code that quietly needs a ₹1,50,000
            booking is an offer the customer finds out about at checkout. */}
        {conditions ? (
          <EventlyText variant="caption" style={s.terms} numberOfLines={2}>
            {conditions}
          </EventlyText>
        ) : null}

        <View style={s.cta}>
          <EventlyText variant="caption" style={s.ctaText}>
            {coupon.ctaLabel}
          </EventlyText>
        </View>
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
  const [page, setPage] = useState(0);

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
        /* One card to a screen, so it settles on a card rather than between
           two — which is what makes the dots below mean anything. */
        pagingEnabled
        onMomentumScrollEnd={event => {
          const { contentOffset, layoutMeasurement } = event.nativeEvent;
          setPage(
            Math.round(contentOffset.x / Math.max(1, layoutMeasurement.width)),
          );
        }}
        renderItem={({ item }) => (
          <OfferCard coupon={item} onPress={() => onPressOffer(item)} />
        )}
      />

      {data.items.length > 1 ? (
        <View style={s.dots}>
          {data.items.map((item, index) => (
            <View
              key={item.id}
              style={[s.dot, index === page && s.dotActive]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default Offers;
