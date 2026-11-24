import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  CalendarSheet,
  EventlyIcon,
  KeyboardAvoider,
  todayIso,
} from '../../../Components';
import type { CouponFormContainerResult } from '../container';
import {
  CODE_MAX,
  COUPONS_COPY as COPY,
  DESCRIPTION_MAX,
  TITLE_MAX,
} from '../constants';
import { ORG_INK } from '../design';
import { formStyles as s } from '../styles';
import type { CouponDiscountType } from '../types';
import { digitsOnly, pickedDateLabel, sanitizeCode } from '../utils';
import { CreateButton } from './CreateButton';
import { FormField } from './FormField';

const TYPES: Array<{ key: CouponDiscountType; label: string }> = [
  { key: 'percentage', label: COPY.typePercent },
  { key: 'fixed', label: COPY.typeFixed },
];

/** A date box: what is picked (or what blank means), and a way to clear it. */
function DateBox({
  label,
  value,
  blank,
  error,
  onPress,
  onClear,
}: {
  label: string;
  value: string;
  blank: string;
  error?: string;
  onPress: () => void;
  onClear: () => void;
}) {
  return (
    <Pressable
      style={[s.date, error ? s.inputError : null]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value ? pickedDateLabel(value) : blank}`}
    >
      <View style={s.dateHead}>
        <EventlyIcon
          name="calendar-blank-outline"
          size={14}
          color={ORG_INK.inkSoft}
        />
        <AppText variant="caption" style={s.dateLabel}>
          {label}
        </AppText>
        {value ? (
          <Pressable
            style={s.dateClear}
            onPress={onClear}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`${COPY.clearDate}: ${label}`}
          >
            <EventlyIcon
              name="close-circle"
              size={16}
              color={ORG_INK.inkFaint}
            />
          </Pressable>
        ) : null}
      </View>
      <AppText
        variant="bodySmall"
        style={[s.dateValue, !value && s.dateBlank]}
        numberOfLines={1}
      >
        {value ? pickedDateLabel(value) : blank}
      </AppText>
    </Pressable>
  );
}

/**
 * Creating a coupon, as a full-screen sheet over the list rather than a new
 * route. Every limit the server enforces is checked here first, and anything
 * it still refuses is shown in its own words above the button.
 */
export function CouponFormSheet({ f }: { f: CouponFormContainerResult }) {
  const [picking, setPicking] = useState<'start' | 'end' | null>(null);
  const percent = f.form.discountType === 'percentage';
  const today = todayIso();

  // Closing with something typed asks first — the X, or Android's back.
  const requestClose = () => {
    if (f.saving) return;
    if (!f.dirty) {
      f.close();
      return;
    }
    Alert.alert(COPY.discardTitle, COPY.discardBody, [
      { text: COPY.keepEditing, style: 'cancel' },
      { text: COPY.discard, style: 'destructive', onPress: f.close },
    ]);
  };

  const onPick = (iso: string) => {
    if (picking === 'start') {
      f.setField('startsOn', iso);
      // A start after the chosen end would make the end meaningless.
      if (f.form.endsOn && f.form.endsOn < iso) f.setField('endsOn', '');
    } else if (picking === 'end') {
      f.setField('endsOn', iso);
    }
    setPicking(null);
  };

  const onSubmit = () => {
    f.submit().catch(() => undefined);
  };

  return (
    <Modal
      visible={f.visible}
      animationType="slide"
      onRequestClose={requestClose}
    >
      <SafeAreaProvider>
        <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
          <AppHeader
            title={COPY.formTitle}
            showBackButton={false}
            rightElement={
              <Pressable
                style={s.close}
                onPress={requestClose}
                accessibilityRole="button"
                accessibilityLabel={COPY.close}
              >
                <EventlyIcon name="close" size={22} color={ORG_INK.ink} />
              </Pressable>
            }
          />
          <KeyboardAvoider style={s.flex}>
            <ScrollView
              contentContainerStyle={s.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <FormField
                label={COPY.code}
                value={f.form.code}
                onChangeText={v => f.setField('code', sanitizeCode(v))}
                placeholder={COPY.codePh}
                hint={COPY.codeHint}
                max={CODE_MAX}
                error={f.errors.code}
                autoCapitalize="characters"
                autoCorrect={false}
                code
              />
              <FormField
                label={COPY.name}
                value={f.form.title}
                onChangeText={v => f.setField('title', v)}
                placeholder={COPY.namePh}
                max={TITLE_MAX}
                error={f.errors.title}
                autoCapitalize="sentences"
              />

              <View style={s.field}>
                <AppText variant="bodySmall" style={s.label}>
                  {COPY.discountType}
                </AppText>
                <View style={s.segment} accessibilityRole="radiogroup">
                  {TYPES.map(t => {
                    const on = f.form.discountType === t.key;
                    return (
                      <Pressable
                        key={t.key}
                        style={[s.segmentItem, on && s.segmentOn]}
                        onPress={() => f.setDiscountType(t.key)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: on }}
                      >
                        <AppText
                          variant="body"
                          style={[s.segmentText, on && s.segmentTextOn]}
                        >
                          {t.label}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <FormField
                label={percent ? COPY.valuePercent : COPY.valueFixed}
                value={f.form.discountValue}
                onChangeText={v => f.setField('discountValue', digitsOnly(v))}
                placeholder={percent ? COPY.valuePercentPh : COPY.valueFixedPh}
                error={f.errors.discountValue}
                keyboardType="number-pad"
                maxLength={percent ? 3 : 7}
              />
              {percent ? (
                <FormField
                  label={COPY.maxDiscount}
                  value={f.form.maxDiscount}
                  onChangeText={v => f.setField('maxDiscount', digitsOnly(v))}
                  placeholder={COPY.maxDiscountPh}
                  hint={COPY.maxDiscountHint}
                  error={f.errors.maxDiscount}
                  keyboardType="number-pad"
                  maxLength={8}
                />
              ) : null}
              <FormField
                label={COPY.minBookingField}
                value={f.form.minBookingAmount}
                onChangeText={v =>
                  f.setField('minBookingAmount', digitsOnly(v))
                }
                placeholder={COPY.minBookingPh}
                error={f.errors.minBookingAmount}
                keyboardType="number-pad"
                maxLength={8}
              />

              <View style={s.field}>
                <View style={s.dates}>
                  <DateBox
                    label={COPY.startsField}
                    value={f.form.startsOn}
                    blank={COPY.startsBlank}
                    onPress={() => setPicking('start')}
                    onClear={() => f.setField('startsOn', '')}
                  />
                  <DateBox
                    label={COPY.endsField}
                    value={f.form.endsOn}
                    blank={COPY.endsBlank}
                    error={f.errors.endsOn}
                    onPress={() => setPicking('end')}
                    onClear={() => f.setField('endsOn', '')}
                  />
                </View>
                {f.errors.endsOn ? (
                  <AppText variant="caption" style={s.error}>
                    {f.errors.endsOn}
                  </AppText>
                ) : null}
              </View>

              <FormField
                label={COPY.description}
                value={f.form.description}
                onChangeText={v => f.setField('description', v)}
                placeholder={COPY.descriptionPh}
                max={DESCRIPTION_MAX}
                error={f.errors.description}
                multiline
              />
            </ScrollView>
            <View style={s.footer}>
              {f.saveError ? (
                <AppText variant="caption" style={s.saveError}>
                  {f.saveError}
                </AppText>
              ) : null}
              <CreateButton
                title={f.saving ? COPY.saving : COPY.create}
                icon={f.saving ? '' : 'check'}
                onPress={onSubmit}
                disabled={f.saving}
              />
            </View>
          </KeyboardAvoider>
        </SafeAreaView>
      </SafeAreaProvider>

      {/* Mounted per pick, so the calendar opens on the month already chosen. */}
      {picking ? (
        <CalendarSheet
          visible
          value={picking === 'start' ? f.form.startsOn : f.form.endsOn}
          minIso={
            picking === 'end' && f.form.startsOn ? f.form.startsOn : today
          }
          title={picking === 'start' ? COPY.pickStart : COPY.pickEnd}
          onSelect={onPick}
          onClose={() => setPicking(null)}
        />
      ) : null}
    </Modal>
  );
}

export default CouponFormSheet;
