import { Fragment } from 'react';
import { View } from 'react-native';
import { EventlyIcon, EventlyText } from '../../../Components';
import { ORG_ACCENT } from '../constants';
import { assuranceStyles as s } from '../styles';
import type { Assurance } from '../types';

interface AssuranceCardProps {
  items: Assurance[];
}

/**
 * The three things a customer is buying besides the event.
 *
 * Each row is a promise this codebase keeps rather than a marketing line: the
 * reply figures are the organizer's own record, the advance is refunded when a
 * booking falls through, and every quote arrives priced line by line.
 */
export function AssuranceCard({ items }: AssuranceCardProps) {
  if (items.length === 0) return null;

  return (
    <View style={s.card}>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 ? <View style={s.divider} /> : null}
          <View style={s.row}>
            <EventlyIcon name={item.icon} size={19} color={ORG_ACCENT} />
            <EventlyText variant="body" style={s.text}>
              {item.text}
            </EventlyText>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

export default AssuranceCard;
