import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { ORG_INK } from '../design';
import { headerStyles as s } from '../styles';
import type { HeaderModel } from '../types';
import { StatusChip } from './StatusChip';

/** What the event is, when and where, where it stands, and the money. */
export function HeaderCard({
  header,
  muted,
}: {
  header: HeaderModel;
  /** Closed events draw their date tile in grey. */
  muted: boolean;
}) {
  const tint = muted ? s.mutedText : null;
  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={[s.date, muted && s.dateMuted]}>
          {header.day ? (
            <>
              <AppText variant="label" style={[s.weekday, tint]}>
                {header.weekday}
              </AppText>
              <AppText variant="h1" style={[s.day, tint]}>
                {header.day}
              </AppText>
              <AppText variant="label" style={[s.month, tint]}>
                {header.month}
              </AppText>
            </>
          ) : (
            <EventlyIcon
              name="calendar-question"
              size={24}
              color={ORG_INK.inkSoft}
            />
          )}
        </View>
        <View style={s.body}>
          <AppText variant="label" style={s.when}>
            {header.when}
          </AppText>
          <AppText variant="h2" style={s.title} numberOfLines={2}>
            {header.title}
          </AppText>
          {header.customerName ? (
            <View style={s.metaRow}>
              <EventlyIcon
                name="account-outline"
                size={14}
                color={ORG_INK.inkSoft}
              />
              <AppText variant="caption" style={s.meta} numberOfLines={1}>
                {header.customerName}
              </AppText>
            </View>
          ) : null}
          {header.location ? (
            <View style={s.metaRow}>
              <EventlyIcon
                name="map-marker-outline"
                size={14}
                color={ORG_INK.inkSoft}
              />
              <AppText variant="caption" style={s.meta} numberOfLines={1}>
                {header.location}
              </AppText>
            </View>
          ) : null}
          <StatusChip chip={header.status} />
        </View>
      </View>

      <View style={s.money}>
        {header.money.map(line => (
          <View
            key={line.key}
            style={s.moneyCell}
            accessible
            accessibilityLabel={`${line.label} ${line.value}`}
          >
            <AppText variant="label" style={s.moneyLabel} numberOfLines={1}>
              {line.label}
            </AppText>
            <AppText
              variant="h3"
              style={[s.moneyValue, line.settled && s.moneySettled]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {line.value}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

export default HeaderCard;
