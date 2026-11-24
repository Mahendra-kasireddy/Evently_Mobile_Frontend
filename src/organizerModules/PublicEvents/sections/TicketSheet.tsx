import { Alert, Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, EventlyIcon, KeyboardAvoider } from '../../../Components';
import type { TicketSheetResult } from '../container';
import {
  PUBLIC_EVENTS_COPY,
  TICKET_DESCRIPTION_MAX,
  TICKET_NAME_MAX,
} from '../constants';
import { ORG_ACCENT } from '../design';
import { formStyles as f, sheetStyles as s } from '../styles';
import type { TicketTypeStatus } from '../types';
import { digitsOnly, priceText } from '../utils';
import { ActionButton } from './ActionButton';
import { DateTimeField } from './DateTimeField';
import { FormField } from './FormField';
import { Segment } from './Segment';

const COPY = PUBLIC_EVENTS_COPY.tickets;

const STATUS_OPTIONS: Array<{ key: TicketTypeStatus; label: string }> = [
  { key: 'active', label: COPY.active },
  { key: 'paused', label: COPY.pausedOption },
];

/** Add or edit a ticket type, as a bottom sheet. */
export function TicketSheet({ t }: { t: TicketSheetResult }) {
  const requestClose = () => {
    if (t.saving) return;
    if (!t.dirty) {
      t.close();
      return;
    }
    Alert.alert(
      PUBLIC_EVENTS_COPY.form.discardTitle,
      PUBLIC_EVENTS_COPY.form.discardBody,
      [
        { text: PUBLIC_EVENTS_COPY.form.keepEditing, style: 'cancel' },
        {
          text: PUBLIC_EVENTS_COPY.form.discard,
          style: 'destructive',
          onPress: t.close,
        },
      ],
    );
  };

  const onSave = () => {
    t.save().catch(() => undefined);
  };

  return (
    <Modal
      visible={t.visible}
      transparent
      animationType="slide"
      onRequestClose={requestClose}
      statusBarTranslucent
    >
      <KeyboardAvoider style={s.root}>
        <Pressable
          style={s.overlay}
          onPress={requestClose}
          accessibilityLabel={PUBLIC_EVENTS_COPY.close}
        >
          <Pressable style={s.sheetWrap} onPress={() => undefined}>
            <SafeAreaView edges={['bottom']} style={s.sheet}>
              <View style={s.grabber} />
              <View style={s.headRow}>
                <View style={s.icon}>
                  <EventlyIcon
                    name="ticket-outline"
                    size={22}
                    color={ORG_ACCENT.saffron}
                  />
                </View>
                <AppText variant="h2" style={s.title}>
                  {t.isNew ? COPY.sheetNew : COPY.sheetEdit}
                </AppText>
              </View>
              <ScrollView
                style={s.scroll}
                contentContainerStyle={s.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <FormField
                  label={COPY.name}
                  value={t.form.name}
                  onChangeText={v => t.setField('name', v)}
                  placeholder={COPY.namePh}
                  max={TICKET_NAME_MAX}
                  error={t.errors.name}
                  autoCapitalize="words"
                />
                <View style={f.row}>
                  <View style={f.half}>
                    <FormField
                      label={COPY.price}
                      value={t.form.price}
                      onChangeText={v => t.setField('price', priceText(v))}
                      placeholder={COPY.pricePh}
                      keyboardType="decimal-pad"
                      error={t.errors.price}
                    />
                  </View>
                  <View style={f.half}>
                    <FormField
                      label={COPY.quantity}
                      value={t.form.totalQuantity}
                      onChangeText={v =>
                        t.setField('totalQuantity', digitsOnly(v, 7))
                      }
                      placeholder={COPY.quantityPh}
                      keyboardType="number-pad"
                      error={t.errors.totalQuantity}
                      hint={COPY.quantityHint(t.sold) || undefined}
                    />
                  </View>
                </View>
                <View style={f.field}>
                  <AppText variant="bodySmall" style={f.label}>
                    {COPY.statusLabel}
                  </AppText>
                  <Segment
                    options={STATUS_OPTIONS}
                    value={t.form.status}
                    onChange={v => t.setField('status', v)}
                  />
                </View>
                <DateTimeField
                  label={COPY.salesStart}
                  date={t.form.salesStartDate}
                  time={t.form.salesStartTime}
                  onDate={v => t.setField('salesStartDate', v)}
                  onTime={v => t.setField('salesStartTime', v)}
                  dateError={t.errors.salesStartDate}
                  timeError={t.errors.salesStartTime}
                  blank={PUBLIC_EVENTS_COPY.form.optional}
                  hint={COPY.salesHint}
                  clearable
                />
                <DateTimeField
                  label={COPY.salesEnd}
                  date={t.form.salesEndDate}
                  time={t.form.salesEndTime}
                  onDate={v => t.setField('salesEndDate', v)}
                  onTime={v => t.setField('salesEndTime', v)}
                  dateError={t.errors.salesEndDate}
                  timeError={t.errors.salesEndTime}
                  minIso={t.form.salesStartDate || undefined}
                  blank={PUBLIC_EVENTS_COPY.form.optional}
                  clearable
                />
                <FormField
                  label={COPY.maxPer}
                  value={t.form.maxPerCustomer}
                  onChangeText={v =>
                    t.setField('maxPerCustomer', digitsOnly(v, 2))
                  }
                  placeholder={COPY.maxPerPh}
                  keyboardType="number-pad"
                  error={t.errors.maxPerCustomer}
                />
                <FormField
                  label={COPY.description}
                  value={t.form.description}
                  onChangeText={v => t.setField('description', v)}
                  placeholder={COPY.descriptionPh}
                  max={TICKET_DESCRIPTION_MAX}
                  error={t.errors.description}
                  multiline
                />
              </ScrollView>
              <View style={s.footer}>
                {t.saveError ? (
                  <AppText
                    variant="bodySmall"
                    style={f.saveError}
                    accessibilityLiveRegion="polite"
                  >
                    {t.saveError}
                  </AppText>
                ) : null}
                <ActionButton
                  title={
                    t.saving ? COPY.saving : t.isNew ? COPY.create : COPY.save
                  }
                  icon="check"
                  loading={t.saving}
                  onPress={onSave}
                />
                <Pressable
                  style={s.cancel}
                  onPress={requestClose}
                  disabled={t.saving}
                  accessibilityRole="button"
                >
                  <AppText variant="body" style={s.cancelText}>
                    {PUBLIC_EVENTS_COPY.cancel}
                  </AppText>
                </Pressable>
              </View>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </KeyboardAvoider>
    </Modal>
  );
}

export default TicketSheet;
