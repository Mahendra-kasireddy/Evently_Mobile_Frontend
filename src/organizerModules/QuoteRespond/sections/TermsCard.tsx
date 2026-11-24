import { Pressable, Switch, View } from 'react-native';
import { AppText } from '../../../Components';
import {
  ADVANCE_PRESETS,
  LIMITS,
  QUOTE_COPY as COPY,
  SITE_VISIT_THRESHOLD,
} from '../constants';
import { ORG_ACCENT, ORG_PAPER } from '../design';
import { fieldStyles as f, termsStyles as s } from '../styles';
import type { AdvanceChoice, QuoteErrors, QuoteForm } from '../types';
import { Field } from './Field';

/** Note to the customer, tax, the advance to confirm, and a site visit. */
export function TermsCard({
  form,
  errors,
  grandTotal,
  onNotes,
  onTax,
  onAdvanceChoice,
  onAdvanceCustom,
  onSiteVisit,
}: {
  form: QuoteForm;
  errors: QuoteErrors;
  grandTotal: number;
  onNotes: (text: string) => void;
  onTax: (text: string) => void;
  onAdvanceChoice: (choice: AdvanceChoice) => void;
  onAdvanceCustom: (text: string) => void;
  onSiteVisit: (on: boolean) => void;
}) {
  return (
    <View style={s.card}>
      <Field
        label={COPY.notesLabel}
        value={form.notes}
        onChangeText={onNotes}
        placeholder={COPY.notesPlaceholder}
        maxLength={LIMITS.notes}
        error={errors.notes}
        multiline
      />

      <Field
        label={COPY.taxLabel}
        value={form.taxRate}
        onChangeText={onTax}
        suffix="%"
        placeholder="0"
        keyboardType="decimal-pad"
        error={errors.taxRate}
        hint={COPY.taxHint}
        containerStyle={s.narrow}
      />

      <View style={f.field}>
        <AppText variant="label" style={f.label}>
          {COPY.advanceLabel}
        </AppText>
        <View style={s.chips}>
          {ADVANCE_PRESETS.map(choice => {
            const on = form.advanceChoice === choice;
            return (
              <Pressable
                key={String(choice)}
                style={[s.chip, on && s.chipOn]}
                onPress={() => onAdvanceChoice(choice)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
              >
                <AppText
                  variant="bodySmall"
                  style={[s.chipText, on && s.chipTextOn]}
                >
                  {choice === 'custom' ? COPY.custom : COPY.percent(choice)}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        {form.advanceChoice === 'custom' ? (
          <Field
            label={COPY.custom}
            value={form.advanceCustom}
            onChangeText={onAdvanceCustom}
            suffix="%"
            placeholder="40"
            keyboardType="number-pad"
            error={errors.advance}
            containerStyle={s.narrow}
            autoFocus
          />
        ) : null}
        <AppText variant="caption" style={f.hint}>
          {COPY.advanceHint}
        </AppText>
      </View>

      <View style={s.switchRow}>
        <View style={s.switchText}>
          <AppText variant="body" style={s.switchTitle}>
            {COPY.siteVisitTitle}
          </AppText>
          <AppText variant="caption" style={f.hint}>
            {COPY.siteVisitBody}
          </AppText>
          {grandTotal >= SITE_VISIT_THRESHOLD && !form.siteVisit ? (
            <AppText variant="caption" style={s.recommended}>
              {COPY.siteVisitRecommended}
            </AppText>
          ) : null}
        </View>
        <Switch
          value={form.siteVisit}
          onValueChange={onSiteVisit}
          trackColor={{ false: ORG_PAPER.hairline, true: ORG_ACCENT.marigold }}
          thumbColor="#ffffff"
          accessibilityLabel={COPY.siteVisitTitle}
        />
      </View>
    </View>
  );
}

export default TermsCard;
