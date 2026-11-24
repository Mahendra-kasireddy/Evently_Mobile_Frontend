import { View } from 'react-native';
import {
  AppText,
  EventlyIcon,
  GradientFill,
  PressableScale,
} from '../../../Components';
import { HOME_COPY as COPY } from '../constants';
import { needsStyles as s } from '../styles';
import { SectionTitle } from './SectionTitle';

const QUOTE_GRADIENT: [string, string] = ['#a084ff', '#5a35e0'];
const CONFIRM_GRADIENT: [string, string] = ['#ff8a5c', '#d9462f'];

/**
 * The two things a customer is waiting on: quotes to send and bookings to
 * accept. Each tile is a way straight to that list. A tile with nothing in it
 * is left out; with both at zero, so is the section.
 */
export function NeedsYouCard({
  toQuote,
  toConfirm,
  onQuote,
  onConfirm,
}: {
  toQuote: number;
  toConfirm: number;
  onQuote: () => void;
  onConfirm: () => void;
}) {
  return (
    <View>
      <SectionTitle title={COPY.needsTitle} />
      <View style={s.row}>
        {toQuote > 0 ? (
          <Tile
            count={toQuote}
            label={COPY.toQuote(toQuote)}
            gradient={QUOTE_GRADIENT}
            onPress={onQuote}
          />
        ) : null}
        {toConfirm > 0 ? (
          <Tile
            count={toConfirm}
            label={COPY.toConfirm(toConfirm)}
            gradient={CONFIRM_GRADIENT}
            onPress={onConfirm}
          />
        ) : null}
      </View>
    </View>
  );
}

function Tile({
  count,
  label,
  gradient,
  onPress,
}: {
  count: number;
  label: string;
  gradient: [string, string];
  onPress: () => void;
}) {
  return (
    <PressableScale
      style={s.tile}
      containerStyle={s.tileWrap}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${count} ${label}`}
    >
      <GradientFill colors={gradient} direction="diagonal" />
      <View style={s.arrow}>
        <EventlyIcon name="arrow-top-right" size={18} color="#ffffff" />
      </View>
      <AppText variant="display" style={s.number}>
        {count}
      </AppText>
      <AppText variant="bodySmall" style={s.label}>
        {label}
      </AppText>
    </PressableScale>
  );
}

export default NeedsYouCard;
