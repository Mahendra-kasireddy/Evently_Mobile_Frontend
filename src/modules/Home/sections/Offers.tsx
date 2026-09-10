import { FlatList, TouchableOpacity, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { colors } from '../../../theme';
import { offersStyles as s } from '../styles';
import { SectionHead } from './SectionHead';
import type { Offer, OffersViewModel } from '../types';

interface OffersProps {
  data: OffersViewModel;
  /** Opens the offer's terms. */
  onPressOffer: (offer: Offer) => void;
}

function OfferCard({ offer, onPress }: { offer: Offer; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[s.card, offer.tone === 'navy' ? s.cardNavy : s.cardAccent]}
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${offer.title}. ${offer.terms}. ${offer.ctaLabel}.`}
    >
      <EventlyText variant="caption" style={s.eyebrow} numberOfLines={1}>
        {offer.eyebrow}
      </EventlyText>
      <EventlyText variant="h2" style={s.title} numberOfLines={2}>
        {offer.title}
      </EventlyText>
      {/* Dropped rather than left as an empty line when an offer carries
          neither an end date nor terms. */}
      {offer.terms ? (
        <EventlyText variant="caption" style={s.terms} numberOfLines={3}>
          {offer.terms}
        </EventlyText>
      ) : null}
      <View style={s.ctaRow}>
        <EventlyText variant="body" style={s.ctaText}>
          {offer.ctaLabel}
        </EventlyText>
        <EventlyIcon name="chevron-right" size={17} color={colors.onPrimary} />
      </View>
    </TouchableOpacity>
  );
}

/**
 * What is running right now.
 *
 * The count beside the title is the real number of cards rather than a fixed
 * label, and the section is not rendered at all when nothing is live — the
 * server only ever sends offers whose window is open, so an empty list here
 * means there genuinely are none, not that something failed to load.
 */
export function Offers({ data, onPressOffer }: OffersProps) {
  return (
    <View>
      <SectionHead title={data.title} actionLabel={data.countLabel} />
      <FlatList
        data={data.items}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.list}
        renderItem={({ item }) => <OfferCard offer={item} onPress={() => onPressOffer(item)} />}
      />
    </View>
  );
}

export default Offers;
