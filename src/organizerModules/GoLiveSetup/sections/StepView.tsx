import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  type ComponentType,
} from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, EventlyIcon, KeyboardAvoider } from '../../../Components';
import { SETUP_COPY as COPY, STEP_META, STEP_PARTS } from '../constants';
import type { SetupContainerResult } from '../container';
import { DANGER, ORG_INK } from '../design';
import {
  styles as base,
  fieldStyles as f,
  stepViewStyles as s,
} from '../styles';
import type { FieldKey, SetupPhase, StepId, StepProps } from '../types';
import { partIndexOf, summaryRows } from '../utils';
import { ActionButton } from './ActionButton';
import { BankStep } from './steps/BankStep';
import { BasicStep } from './steps/BasicStep';
import { PortfolioStep } from './steps/PortfolioStep';
import { ServicesStep } from './steps/ServicesStep';
import { VerificationStep } from './steps/VerificationStep';

const STEP_COMPONENT: Record<StepId, ComponentType<StepProps>> = {
  basic: BasicStep,
  services: ServicesStep,
  portfolio: PortfolioStep,
  verification: VerificationStep,
  bank: BankStep,
};

/** Why a step is view-only. */
function lockNote(step: StepId, phase: SetupPhase | undefined): string {
  if (step === 'bank' && (phase === 'submitted' || phase === 'approved'))
    return COPY.readOnlyNote.bankLocked;
  if (phase === 'submitted') return COPY.readOnlyNote.submitted;
  if (phase === 'approved') return COPY.readOnlyNote.approved;
  if (phase === 'pending') return COPY.pendingBody;
  return COPY.readOnlyNote.other;
}

/**
 * One step of the setup: a line on what it is for, short tabs when the step
 * is long, its fields in small cards, and Save pinned at the bottom. When the
 * step cannot be edited, the saved values as a plain list instead.
 */
export function StepView({ c }: { c: SetupContainerResult }) {
  const step = c.step as StepId;
  const parts = STEP_PARTS[step];
  const scroll = useRef<ScrollView>(null);

  // A new tab starts at its top.
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [c.part]);

  const errorParts = useMemo(
    () =>
      new Set(
        (Object.keys(c.errors) as FieldKey[]).map(k => partIndexOf(step, k)),
      ),
    [c.errors, step],
  );

  if (!c.form || !c.baseline) return null;

  if (c.readOnly) {
    const rows = summaryRows(step, c.form, c.options);
    return (
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.lockNote}>
          <EventlyIcon name="lock-outline" size={16} color={ORG_INK.inkSoft} />
          <AppText variant="caption" style={s.lockText}>
            {lockNote(step, c.hub?.phase)}
          </AppText>
        </View>
        <View style={f.card}>
          {rows.map((row, index) => (
            <Fragment key={row.key}>
              {index > 0 ? <View style={s.readDivider} /> : null}
              <View style={s.readRow}>
                <AppText variant="bodySmall" style={s.readLabel}>
                  {row.label}
                </AppText>
                <AppText
                  variant="bodySmall"
                  style={[
                    s.readValue,
                    row.value === COPY.notAdded && s.readValueEmpty,
                  ]}
                >
                  {row.value}
                </AppText>
              </View>
            </Fragment>
          ))}
        </View>
      </ScrollView>
    );
  }

  const Step = STEP_COMPONENT[step];
  const activePart = parts[c.part] ?? parts[0];

  return (
    <KeyboardAvoider style={base.container}>
      {parts.length > 1 ? (
        <View style={s.tabs} accessibilityRole="tablist">
          {parts.map((p, index) => {
            const on = index === c.part;
            return (
              <Pressable
                key={p.key}
                style={[s.tab, on && s.tabOn]}
                onPress={() => c.setPart(index)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={p.label}
              >
                <AppText
                  variant="bodySmall"
                  style={[s.tabText, on && s.tabTextOn]}
                  numberOfLines={1}
                >
                  {p.label}
                </AppText>
                {errorParts.has(index) ? <View style={s.tabDot} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
      <ScrollView
        ref={scroll}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        <AppText variant="bodySmall" style={s.blurb}>
          {step === 'bank' ? COPY.bankStepHint : STEP_META[step].blurb}
        </AppText>
        {c.optionsFailed ? (
          <View style={s.optionsError}>
            <EventlyIcon
              name="alert-circle-outline"
              size={18}
              color={DANGER.ink}
            />
            <AppText variant="caption" style={s.optionsErrorText}>
              {COPY.optionsFailed}
            </AppText>
            <Pressable
              onPress={c.retryOptions}
              hitSlop={8}
              accessibilityRole="button"
            >
              <AppText variant="caption" style={s.retry}>
                {COPY.retry}
              </AppText>
            </Pressable>
          </View>
        ) : null}
        <Step
          form={c.form}
          baseline={c.baseline}
          errors={c.errors}
          part={activePart.key}
          options={c.options}
          uploading={c.uploading}
          mobile={c.mobile}
          setField={c.setField}
          toggle={c.toggle}
          upload={c.upload}
          removeFile={c.removeFile}
        />
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={base.footer}>
        {c.saveError ? (
          <AppText variant="caption" style={base.footerError}>
            {c.saveError}
          </AppText>
        ) : null}
        <ActionButton
          title={c.saving ? COPY.saving : COPY.save}
          onPress={() => {
            c.save().catch(() => undefined);
          }}
          loading={c.saving}
          disabled={!c.dirty || !!c.uploading}
        />
      </SafeAreaView>
    </KeyboardAvoider>
  );
}

export default StepView;
