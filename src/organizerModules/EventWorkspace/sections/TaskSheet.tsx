import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AppText,
  CalendarSheet,
  EventlyIcon,
  KeyboardAvoider,
  todayIso,
} from '../../../Components';
import { absoluteFileUrl } from '../../../services/urls';
import { CATEGORY_LABEL } from '../../SubVendors/constants';
import type { TaskSheetResult } from '../container';
import {
  AMOUNT_MAX_DIGITS,
  ASSIGNEE_MAX,
  EVENT_COPY,
  TITLE_MAX,
} from '../constants';
import { DANGER, ORG_ACCENT, ORG_INK } from '../design';
import { sheetStyles as s } from '../styles';
import type { AssignMode, SubVendorOption } from '../types';
import { digitsOnly } from '../utils';
import { ActionButton } from './ActionButton';

const COPY = EVENT_COPY.sheet;
const MODES: AssignMode[] = ['none', 'subvendor', 'person'];

/** "Fri, 14 Nov 2026" for a picked `YYYY-MM-DD`. */
function dayLabel(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function FieldError({ text }: { text?: string }) {
  return text ? (
    <AppText variant="caption" style={s.error}>
      {text}
    </AppText>
  ) : null;
}

function SubVendorList({
  options,
  selected,
  onSelect,
}: {
  options: SubVendorOption[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={s.options} accessibilityRole="radiogroup">
      {options.map(o => {
        const on = o.id === selected;
        return (
          <Pressable
            key={o.id}
            style={[s.option, on && s.optionOn]}
            onPress={() => onSelect(o.id)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            accessibilityLabel={o.name}
          >
            <View style={s.optionAvatar}>
              <AppText variant="bodySmall" style={s.optionInitials}>
                {o.initials}
              </AppText>
            </View>
            <View style={s.optionText}>
              <AppText variant="body" style={s.optionName} numberOfLines={1}>
                {o.name}
              </AppText>
              {o.category ? (
                <AppText variant="caption" style={s.optionSub}>
                  {CATEGORY_LABEL[o.category] ?? o.category}
                </AppText>
              ) : null}
            </View>
            <EventlyIcon
              name={on ? 'radiobox-marked' : 'radiobox-blank'}
              size={22}
              color={on ? ORG_ACCENT.saffron : ORG_INK.inkFaint}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Add or edit one task, as a bottom sheet: name, due date, who's doing it (a
 * sub-vendor from the team, or any name), what it pays, and — once the task
 * exists — a photo proof and delete.
 */
export function TaskSheet({
  t,
  subvendors,
  subvendorsFailed,
}: {
  t: TaskSheetResult;
  subvendors: SubVendorOption[];
  subvendorsFailed: boolean;
}) {
  const [picking, setPicking] = useState(false);
  const busy = t.saving || t.deleting || t.uploading;
  const proofUri = absoluteFileUrl(t.task?.photoProof?.url);
  const changedVendor =
    !t.isNew &&
    t.form.mode === 'subvendor' &&
    !!t.form.subVendorId &&
    t.form.subVendorId !== t.task?.subVendorId;

  const requestClose = () => {
    if (busy) return;
    if (!t.dirty) {
      t.close();
      return;
    }
    Alert.alert(COPY.discardTitle, COPY.discardBody, [
      { text: COPY.keepEditing, style: 'cancel' },
      { text: COPY.discard, style: 'destructive', onPress: t.close },
    ]);
  };

  const confirmDelete = () => {
    if (busy) return;
    Alert.alert(COPY.deleteTitle, COPY.deleteBody(t.task?.title ?? ''), [
      { text: COPY.keep, style: 'cancel' },
      {
        text: COPY.deleteConfirm,
        style: 'destructive',
        onPress: () => {
          t.remove().catch(() => undefined);
        },
      },
    ]);
  };

  const onSave = () => {
    t.save().catch(() => undefined);
  };
  const onProof = () => {
    t.uploadProof().catch(() => undefined);
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
          accessibilityLabel={COPY.close}
        >
          <Pressable style={s.sheetWrap} onPress={() => undefined}>
            <SafeAreaView edges={['bottom']} style={s.sheet}>
              <View style={s.grabber} />
              <View style={s.headRow}>
                <View style={s.icon}>
                  <EventlyIcon
                    name={t.isNew ? 'plus' : 'clipboard-edit-outline'}
                    size={22}
                    color={ORG_ACCENT.saffron}
                  />
                </View>
                <AppText variant="h2" style={s.title}>
                  {t.isNew ? COPY.newTitle : COPY.editTitle}
                </AppText>
                <Pressable
                  style={s.close}
                  onPress={requestClose}
                  accessibilityRole="button"
                  accessibilityLabel={COPY.close}
                >
                  <EventlyIcon name="close" size={20} color={ORG_INK.ink} />
                </Pressable>
              </View>

              <ScrollView
                style={s.scroll}
                contentContainerStyle={s.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={s.field}>
                  <View style={s.labelRow}>
                    <AppText variant="bodySmall" style={s.label}>
                      {COPY.title}
                    </AppText>
                    <AppText variant="label" style={s.counter}>
                      {COPY.titleCount(t.form.title.length)}
                    </AppText>
                  </View>
                  <TextInput
                    style={[s.input, t.errors.title ? s.inputError : null]}
                    value={t.form.title}
                    onChangeText={v => t.setField('title', v)}
                    placeholder={COPY.titlePh}
                    placeholderTextColor={ORG_INK.inkFaint}
                    maxLength={TITLE_MAX}
                    autoCapitalize="sentences"
                    autoFocus={t.isNew}
                    accessibilityLabel={COPY.title}
                  />
                  <FieldError text={t.errors.title} />
                </View>

                <View style={s.field}>
                  <AppText variant="bodySmall" style={s.label}>
                    {COPY.due}
                  </AppText>
                  <Pressable
                    style={s.dateBox}
                    onPress={() => setPicking(true)}
                    accessibilityRole="button"
                    accessibilityLabel={`${COPY.due}: ${
                      t.form.dueDate ? dayLabel(t.form.dueDate) : COPY.dueBlank
                    }`}
                  >
                    <EventlyIcon
                      name="calendar-blank-outline"
                      size={18}
                      color={ORG_INK.inkSoft}
                    />
                    <AppText
                      variant="body"
                      style={[s.dateValue, !t.form.dueDate && s.dateBlank]}
                    >
                      {t.form.dueDate
                        ? dayLabel(t.form.dueDate)
                        : COPY.dueBlank}
                    </AppText>
                    <EventlyIcon
                      name="chevron-down"
                      size={18}
                      color={ORG_INK.inkSoft}
                    />
                  </Pressable>
                </View>

                <View style={s.field}>
                  <AppText variant="bodySmall" style={s.label}>
                    {COPY.assign}
                  </AppText>
                  <View style={s.segment} accessibilityRole="radiogroup">
                    {MODES.map(m => {
                      const on = t.form.mode === m;
                      return (
                        <Pressable
                          key={m}
                          style={[s.segmentItem, on && s.segmentOn]}
                          onPress={() => t.setField('mode', m)}
                          accessibilityRole="radio"
                          accessibilityState={{ checked: on }}
                        >
                          <AppText
                            variant="bodySmall"
                            style={[s.segmentText, on && s.segmentTextOn]}
                          >
                            {COPY.modes[m]}
                          </AppText>
                        </Pressable>
                      );
                    })}
                  </View>
                  {t.form.mode === 'subvendor' ? (
                    subvendors.length ? (
                      <>
                        <SubVendorList
                          options={subvendors}
                          selected={t.form.subVendorId}
                          onSelect={id => t.setField('subVendorId', id)}
                        />
                        <FieldError text={t.errors.subVendorId} />
                        {changedVendor ? (
                          <AppText variant="caption" style={s.hint}>
                            {COPY.reassignNote}
                          </AppText>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <AppText variant="caption" style={s.hint}>
                          {subvendorsFailed
                            ? COPY.subvendorsFailed
                            : COPY.noSubvendors}
                        </AppText>
                        <FieldError text={t.errors.subVendorId} />
                      </>
                    )
                  ) : null}
                  {t.form.mode === 'person' ? (
                    <>
                      <TextInput
                        style={[
                          s.input,
                          t.errors.assigneeName ? s.inputError : null,
                        ]}
                        value={t.form.assigneeName}
                        onChangeText={v => t.setField('assigneeName', v)}
                        placeholder={COPY.personPh}
                        placeholderTextColor={ORG_INK.inkFaint}
                        maxLength={ASSIGNEE_MAX}
                        autoCapitalize="words"
                        accessibilityLabel={COPY.person}
                      />
                      <FieldError text={t.errors.assigneeName} />
                    </>
                  ) : null}
                </View>

                <View style={s.field}>
                  <AppText variant="bodySmall" style={s.label}>
                    {COPY.amount}
                  </AppText>
                  <TextInput
                    style={[s.input, t.errors.amount ? s.inputError : null]}
                    value={t.form.amount}
                    onChangeText={v => t.setField('amount', digitsOnly(v))}
                    placeholder={COPY.amountPh}
                    placeholderTextColor={ORG_INK.inkFaint}
                    keyboardType="number-pad"
                    maxLength={AMOUNT_MAX_DIGITS}
                    accessibilityLabel={COPY.amount}
                  />
                  {t.errors.amount ? (
                    <FieldError text={t.errors.amount} />
                  ) : (
                    <AppText variant="caption" style={s.hint}>
                      {COPY.amountHint}
                    </AppText>
                  )}
                </View>

                <View style={s.field}>
                  <AppText variant="bodySmall" style={s.label}>
                    {COPY.proof}
                  </AppText>
                  {t.isNew ? (
                    <AppText variant="caption" style={s.hint}>
                      {COPY.proofNew}
                    </AppText>
                  ) : (
                    <View style={s.proofRow}>
                      {proofUri ? (
                        <Image
                          source={{ uri: proofUri }}
                          style={s.proofImage}
                          accessibilityLabel={COPY.proof}
                        />
                      ) : (
                        <View style={s.proofEmpty}>
                          <EventlyIcon
                            name="camera-outline"
                            size={24}
                            color={ORG_INK.inkFaint}
                          />
                        </View>
                      )}
                      <Pressable
                        style={s.proofButton}
                        onPress={onProof}
                        disabled={busy}
                        accessibilityRole="button"
                        accessibilityState={{ busy: t.uploading }}
                      >
                        {t.uploading ? (
                          <ActivityIndicator size="small" color={ORG_INK.ink} />
                        ) : (
                          <EventlyIcon
                            name="camera-plus-outline"
                            size={18}
                            color={ORG_INK.ink}
                          />
                        )}
                        <AppText variant="bodySmall" style={s.proofButtonText}>
                          {t.uploading
                            ? COPY.proofUploading
                            : proofUri
                            ? COPY.proofReplace
                            : COPY.proofAdd}
                        </AppText>
                      </Pressable>
                    </View>
                  )}
                </View>
              </ScrollView>

              <View style={s.footer}>
                {t.error ? (
                  <AppText
                    variant="bodySmall"
                    style={s.saveError}
                    accessibilityLiveRegion="polite"
                  >
                    {t.error}
                  </AppText>
                ) : null}
                <ActionButton
                  title={
                    t.saving ? COPY.saving : t.isNew ? COPY.create : COPY.save
                  }
                  icon={t.isNew ? 'plus' : 'check'}
                  onPress={onSave}
                  loading={t.saving}
                  disabled={busy}
                />
                {!t.isNew ? (
                  <Pressable
                    style={s.delete}
                    onPress={confirmDelete}
                    disabled={busy}
                    accessibilityRole="button"
                  >
                    {t.deleting ? (
                      <ActivityIndicator size="small" color={DANGER} />
                    ) : (
                      <EventlyIcon
                        name="trash-can-outline"
                        size={18}
                        color={DANGER}
                      />
                    )}
                    <AppText variant="body" style={s.deleteText}>
                      {COPY.delete}
                    </AppText>
                  </Pressable>
                ) : null}
              </View>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </KeyboardAvoider>

      {/* Mounted per pick, so the calendar opens on the month already chosen. */}
      {picking ? (
        <CalendarSheet
          visible
          value={t.form.dueDate}
          minIso={
            t.form.dueDate && t.form.dueDate < todayIso()
              ? t.form.dueDate
              : todayIso()
          }
          title={COPY.pickDue}
          onSelect={iso => {
            t.setField('dueDate', iso);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      ) : null}
    </Modal>
  );
}

export default TaskSheet;
