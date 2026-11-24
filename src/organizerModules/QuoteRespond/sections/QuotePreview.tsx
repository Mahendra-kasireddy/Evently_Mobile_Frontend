import { View } from 'react-native';
import { AppText, EventlyIcon, GradientFill } from '../../../Components';
import { formatInr } from '../../Shared';
import { QUOTE_COPY as COPY } from '../constants';
import { AMBER_INK, ORG_ACTION_GRADIENT, ORG_INK } from '../design';
import { previewStyles as s } from '../styles';
import type { PreviewLine, QuoteTotals } from '../types';

/** The quote as the customer reads it: each service, the sums, the terms. */
export function QuotePreview({
  lines,
  totals,
  notes,
  siteVisit,
}: {
  lines: PreviewLine[];
  totals: QuoteTotals;
  notes: string;
  siteVisit: boolean;
}) {
  return (
    <View style={s.card}>
      {lines.length ? (
        lines.map(l => (
          <View key={l.uid} style={s.line}>
            <View style={s.lineIcon}>
              <EventlyIcon name={l.icon} size={18} color={AMBER_INK} />
            </View>
            <View style={s.lineBody}>
              <View style={s.lineHead}>
                <AppText variant="body" style={s.lineTitle}>
                  {l.title}
                </AppText>
                <AppText variant="body" style={s.lineAmount}>
                  {l.amount}
                </AppText>
              </View>
              {l.details.map((d, i) => (
                <AppText
                  key={`${l.uid}-${i}`}
                  variant="caption"
                  style={s.detail}
                >
                  {d}
                </AppText>
              ))}
              {l.note ? (
                <AppText variant="caption" style={s.detail}>
                  {l.note}
                </AppText>
              ) : null}
            </View>
          </View>
        ))
      ) : (
        <AppText variant="body" style={s.empty}>
          {COPY.previewEmpty}
        </AppText>
      )}

      <View style={s.row}>
        <AppText variant="body" style={s.rowLabel}>
          {COPY.subtotal}
        </AppText>
        <AppText variant="body" style={s.rowValue}>
          {formatInr(totals.subtotal)}
        </AppText>
      </View>
      <View style={s.row}>
        <AppText variant="body" style={s.rowLabel}>
          {COPY.tax(totals.taxRate)}
        </AppText>
        <AppText variant="body" style={s.rowValue}>
          {formatInr(totals.taxAmount)}
        </AppText>
      </View>
      <View style={s.grand}>
        <AppText variant="h3" style={s.grandLabel}>
          {COPY.total}
        </AppText>
        <AppText variant="h2" style={s.grandValue}>
          {formatInr(totals.grandTotal)}
        </AppText>
      </View>
      <View style={s.advance}>
        <GradientFill colors={ORG_ACTION_GRADIENT} direction="across" />
        <AppText variant="body" style={s.advanceText}>
          {COPY.previewAdvance(totals.advancePercentage)}
        </AppText>
        <AppText variant="body" style={s.advanceText}>
          {formatInr(totals.advanceAmount)}
        </AppText>
      </View>

      {siteVisit ? (
        <View style={s.callout}>
          <EventlyIcon
            name="map-marker-check-outline"
            size={18}
            color={ORG_INK.inkSoft}
          />
          <AppText variant="bodySmall" style={s.calloutText}>
            {COPY.previewSiteVisit}
          </AppText>
        </View>
      ) : null}
      {notes.trim() ? (
        <View style={s.callout}>
          <EventlyIcon
            name="message-text-outline"
            size={18}
            color={ORG_INK.inkSoft}
          />
          <View style={s.calloutBody}>
            <AppText variant="label" style={s.calloutTitle}>
              {COPY.previewNotes}
            </AppText>
            <AppText variant="bodySmall" style={s.calloutText}>
              {notes.trim()}
            </AppText>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default QuotePreview;
