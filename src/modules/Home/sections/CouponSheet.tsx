import { Modal, Pressable, View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { couponSheetStyles as s } from '../styles';
import { HOME_NAVY } from '../constants';
import type { CouponOffer } from '../types';

interface CouponSheetProps {
  /** The coupon being read, or null when the sheet is closed. */
  coupon: CouponOffer | null;
  onClose: () => void;
}

/**
 * A coupon's full terms.
 *
 * Tapping a card opens this rather than "claiming" anything, because there is
 * nothing to claim: a coupon is a code, and it does its work when it is typed
 * at checkout. A button labelled "Claim offer" that only recorded an intention
 * would be promising a discount the booking has not agreed to.
 *
 * So the sheet does the one useful thing — shows the code large enough to
 * carry, with every condition attached to it spelled out — and says plainly
 * where it gets used.
 */
export function CouponSheet({ coupon, onClose }: CouponSheetProps) {
  return (
    <Modal
      visible={coupon !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      {/* Tapping the dimmed area closes it — the expected way out of a sheet. */}
      <Pressable style={s.backdrop} onPress={onClose} accessibilityLabel="Close" />

      {coupon ? (
        <View style={s.sheet}>
          <View style={s.grabber} />

          <View style={s.head}>
            <View style={s.headText}>
              <EventlyText variant="caption" style={s.code}>
                {coupon.code}
              </EventlyText>
              <EventlyText variant="h2" style={s.title} numberOfLines={2}>
                {coupon.title}
              </EventlyText>
            </View>
            <Pressable
              style={s.close}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <EventlyIcon name="close" size={20} color={HOME_NAVY} />
            </Pressable>
          </View>

          {/* Only when the admin wrote one — an empty paragraph is worse than
              no paragraph. */}
          {coupon.description ? (
            <EventlyText variant="body" style={s.description}>
              {coupon.description}
            </EventlyText>
          ) : null}

          <View style={s.rows}>
            {coupon.details.map((row) => (
              <View key={row.label} style={s.row}>
                <EventlyText variant="body" style={s.rowLabel}>
                  {row.label}
                </EventlyText>
                <EventlyText variant="body" style={s.rowValue}>
                  {row.value}
                </EventlyText>
              </View>
            ))}
          </View>

          {/* Says where the code is used, rather than offering a button that
              cannot use it from here. */}
          <View style={s.note}>
            <EventlyIcon name="information-outline" size={16} color="#5b6470" />
            <EventlyText variant="caption" style={s.noteText}>
              Enter this code when you confirm a booking. We will check it applies before anything
              is charged.
            </EventlyText>
          </View>
        </View>
      ) : null}
    </Modal>
  );
}

export default CouponSheet;
