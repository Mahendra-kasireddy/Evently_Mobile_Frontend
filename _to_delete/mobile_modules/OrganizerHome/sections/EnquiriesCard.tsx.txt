import { View } from 'react-native';
import { EventlyText } from '../../../Components';
import { HOME_COPY } from '../constants';
import { cardStyles, enquiryStyles, screenStyles } from '../styles';
import { categoriesLabel, enquiryLabel, relativeTime } from '../utils';
import type { ApiIncomingRequest } from '../types';

interface EnquiriesCardProps {
  enquiries: ApiIncomingRequest[];
}

function initials(seed: string): string {
  const trimmed = seed.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  return (parts[0]?.[0] ?? '').toUpperCase() + (parts[1]?.[0] ?? '').toUpperCase();
}

/** Read-only for now — mobile has no quote-response detail screen yet, unlike web's
 * "View & Quote" flow, so this surfaces what's pending without a dead-end CTA. */
export function EnquiriesCard({ enquiries }: EnquiriesCardProps) {
  return (
    <View style={cardStyles.card}>
      <EventlyText variant="h2" style={cardStyles.cardTitle}>
        {HOME_COPY.enquiriesTitle}
      </EventlyText>
      {enquiries.length ? (
        <View style={enquiryStyles.list}>
          {enquiries.map((r) => {
            const seed = r.customerName || r.occasion || 'Event';
            return (
              <View key={r.id} style={enquiryStyles.row}>
                <View style={enquiryStyles.avatar}>
                  <EventlyText style={enquiryStyles.avatarText}>{initials(seed)}</EventlyText>
                </View>
                <View style={enquiryStyles.who}>
                  <EventlyText variant="subtitle" style={enquiryStyles.name} numberOfLines={1}>
                    {enquiryLabel(r)}
                  </EventlyText>
                  <EventlyText variant="caption" style={enquiryStyles.meta} numberOfLines={1}>
                    {[r.when, categoriesLabel(r.categories.length)].filter(Boolean).join(' · ')}
                  </EventlyText>
                </View>
                <EventlyText variant="caption" style={enquiryStyles.time}>
                  {relativeTime(r.createdAt)}
                </EventlyText>
              </View>
            );
          })}
        </View>
      ) : (
        <EventlyText variant="body" style={screenStyles.emptyText}>
          {HOME_COPY.enquiriesEmpty}
        </EventlyText>
      )}
    </View>
  );
}

export default EnquiriesCard;
