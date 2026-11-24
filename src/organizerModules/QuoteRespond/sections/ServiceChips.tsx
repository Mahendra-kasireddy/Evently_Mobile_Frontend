import { Pressable, ScrollView, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { formatInr } from '../../Shared';
import { QUOTE_COPY as COPY } from '../constants';
import { AMBER_INK, ORG_INK } from '../design';
import { chipStyles as s } from '../styles';
import type { LineForm } from '../types';
import { lineAmount, templateForLine } from '../utils';

/**
 * One chip per service on the quote. Tapping a chip opens that service's card
 * below, so the form stays one card tall however many services are quoted.
 * Each chip carries its running price, and a red dot when the card has an
 * error, so nothing is hidden behind an unselected chip.
 */
export function ServiceChips({
  lines,
  activeUid,
  errors,
  onSelect,
}: {
  lines: LineForm[];
  activeUid: string | null;
  errors: Record<string, string>;
  onSelect: (uid: string) => void;
}) {
  if (lines.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
      keyboardShouldPersistTaps="handled"
    >
      {lines.map(line => {
        const on = line.uid === activeUid;
        const amount = lineAmount(line);
        const name = line.title.trim() || COPY.serviceName;
        const hasError = Boolean(errors[line.uid]);
        return (
          <Pressable
            key={line.uid}
            style={[s.chip, on && s.chipOn, hasError && s.chipError]}
            onPress={() => onSelect(line.uid)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${name}${amount > 0 ? `, ${formatInr(amount)}` : ''}${
              hasError ? ', needs attention' : ''
            }`}
          >
            <EventlyIcon
              name={templateForLine(line).icon}
              size={16}
              color={on ? AMBER_INK : ORG_INK.inkSoft}
            />
            <AppText
              variant="bodySmall"
              style={[s.text, on && s.textOn]}
              numberOfLines={1}
            >
              {name}
            </AppText>
            {amount > 0 ? (
              <AppText variant="caption" style={[s.amount, on && s.textOn]}>
                {formatInr(amount)}
              </AppText>
            ) : null}
            {hasError ? <View style={s.dot} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export default ServiceChips;
