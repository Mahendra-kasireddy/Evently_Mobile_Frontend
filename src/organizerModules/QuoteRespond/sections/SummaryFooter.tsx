import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, EventlyButton, EventlyIcon } from '../../../Components';
import { useKeyboardVisible } from '../../../hooks/useKeyboardVisible';
import { formatInr } from '../../Shared';
import type { SavingKind } from '../container';
import { QUOTE_COPY as COPY } from '../constants';
import { ORG_ACCENT, SUCCESS } from '../design';
import { footerStyles as s } from '../styles';
import type { QuoteMode, QuoteTotals } from '../types';

/**
 * The money, always in view, and what to do with the quote. While the
 * keyboard is up only the total stays, so the field being typed in is not
 * squeezed out of sight.
 */
export function SummaryFooter({
  mode,
  totals,
  saving,
  saveError,
  done,
  onSend,
  onDraft,
}: {
  mode: QuoteMode;
  totals: QuoteTotals;
  saving: SavingKind | null;
  saveError: string | null;
  done: string | null;
  onSend: () => void;
  onDraft: () => void;
}) {
  const keyboard = useKeyboardVisible();
  const readonly = mode === 'readonly';
  const canDraft = mode === 'new' || mode === 'draft';
  const updating = mode === 'sent';
  const busy = saving !== null || done !== null;

  return (
    <SafeAreaView edges={keyboard ? [] : ['bottom']} style={s.footer}>
      {keyboard ? null : (
        <View style={s.breakdown}>
          <View style={s.cell}>
            <AppText variant="caption" style={s.cellLabel}>
              {COPY.subtotal}
            </AppText>
            <AppText variant="bodySmall" style={s.cellValue}>
              {formatInr(totals.subtotal)}
            </AppText>
          </View>
          <View style={s.cell}>
            <AppText variant="caption" style={s.cellLabel}>
              {COPY.tax(totals.taxRate)}
            </AppText>
            <AppText variant="bodySmall" style={s.cellValue}>
              {formatInr(totals.taxAmount)}
            </AppText>
          </View>
          <View style={s.cell}>
            <AppText variant="caption" style={s.cellLabel}>
              {COPY.advance(totals.advancePercentage)}
            </AppText>
            <AppText variant="bodySmall" style={s.cellValue}>
              {formatInr(totals.advanceAmount)}
            </AppText>
          </View>
        </View>
      )}
      <View style={s.totalRow}>
        <AppText variant="body" style={s.totalLabel}>
          {COPY.total}
        </AppText>
        <AppText variant="h2" style={s.totalValue}>
          {formatInr(totals.grandTotal)}
        </AppText>
      </View>

      {saveError && !keyboard ? (
        <AppText variant="caption" style={s.error}>
          {saveError}
        </AppText>
      ) : null}

      {done ? (
        <View style={s.done} accessibilityLiveRegion="polite">
          <EventlyIcon name="check-circle" size={20} color={SUCCESS} />
          <AppText variant="body" style={s.doneText}>
            {done}
          </AppText>
        </View>
      ) : readonly || keyboard ? null : (
        <View style={s.actions}>
          {canDraft ? (
            <EventlyButton
              title={saving === 'draft' ? COPY.savingDraft : COPY.saveDraft}
              variant="outline"
              onPress={onDraft}
              loading={saving === 'draft'}
              disabled={busy}
              accentColor={ORG_ACCENT.saffron}
              style={s.secondary}
            />
          ) : null}
          <EventlyButton
            title={
              saving === 'send'
                ? updating
                  ? COPY.updating
                  : COPY.sending
                : updating
                ? COPY.update
                : COPY.send
            }
            onPress={onSend}
            loading={saving === 'send'}
            disabled={busy}
            accentColor={ORG_ACCENT.saffron}
            style={s.primary}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default SummaryFooter;
