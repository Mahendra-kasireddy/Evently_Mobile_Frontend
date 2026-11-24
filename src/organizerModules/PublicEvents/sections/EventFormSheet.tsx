import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  AppHeader,
  AppText,
  EventlyIcon,
  EventlyImage,
  KeyboardAvoider,
} from '../../../Components';
import type { EventFormSheetResult } from '../container';
import {
  ADDRESS_MAX,
  CITY_MAX,
  DESCRIPTION_MAX,
  PUBLIC_EVENTS_COPY,
  TITLE_MAX,
  VENUE_MAX,
} from '../constants';
import { ORG_ACCENT, ORG_INK } from '../design';
import { formStyles as s } from '../styles';
import { coordinateText, coverUri } from '../utils';
import { ActionButton } from './ActionButton';
import { DateTimeField } from './DateTimeField';
import { FormField } from './FormField';

const COPY = PUBLIC_EVENTS_COPY.form;

/** One short, numbered part of the form. */
function Group({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={s.group}>
      <View style={s.groupHead}>
        <View style={s.groupNumber}>
          <AppText variant="label" style={s.groupNumberText}>
            {String(n)}
          </AppText>
        </View>
        <AppText variant="h3" style={s.groupTitle}>
          {title}
        </AppText>
      </View>
      {children}
    </View>
  );
}

/** The cover: a big tap target when empty, the photo with Change/Remove after. */
function CoverPicker({ f }: { f: EventFormSheetResult }) {
  const preview = coverUri(f.form.coverUrl);
  return (
    <View style={s.field}>
      <AppText variant="bodySmall" style={s.label}>
        {COPY.cover}
      </AppText>
      {preview ? (
        <>
          <View style={s.cover}>
            <EventlyImage
              source={{ uri: preview }}
              style={s.coverImage}
              resizeMode="cover"
            />
            {f.uploading ? (
              <View style={s.coverBusy}>
                <ActivityIndicator color={ORG_ACCENT.saffron} />
              </View>
            ) : null}
          </View>
          <View style={s.coverActions}>
            <ActionButton
              title={COPY.coverChange}
              icon="image-edit-outline"
              kind="ghost"
              small
              disabled={f.uploading || f.saving}
              onPress={() => {
                f.pickCover().catch(() => undefined);
              }}
              containerStyle={s.half}
            />
            <ActionButton
              title={COPY.coverRemove}
              icon="trash-can-outline"
              kind="dangerGhost"
              small
              disabled={f.uploading || f.saving}
              onPress={f.removeCover}
              containerStyle={s.half}
            />
          </View>
        </>
      ) : (
        <Pressable
          style={s.coverEmpty}
          onPress={() => {
            f.pickCover().catch(() => undefined);
          }}
          disabled={f.uploading || f.saving}
          accessibilityRole="button"
          accessibilityLabel={COPY.coverAdd}
        >
          {f.uploading ? (
            <ActivityIndicator color={ORG_ACCENT.saffron} />
          ) : (
            <EventlyIcon
              name="image-plus"
              size={30}
              color={ORG_ACCENT.saffron}
            />
          )}
          <AppText variant="bodySmall" style={s.coverEmptyText}>
            {f.uploading ? COPY.coverUploading : COPY.coverAdd}
          </AppText>
        </Pressable>
      )}
      {f.coverError ? (
        <AppText variant="caption" style={s.error}>
          {f.coverError}
        </AppText>
      ) : (
        <AppText variant="caption" style={s.hint}>
          {COPY.coverHint}
        </AppText>
      )}
    </View>
  );
}

/**
 * Creating or editing an event, as a full-screen sheet over the screen it was
 * opened from. Four short parts rather than one long form; the map pin is
 * tucked under "Advanced". Anything the server still refuses is shown in its
 * own words above the button.
 */
export function EventFormSheet({ f }: { f: EventFormSheetResult }) {
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

  const onSubmit = () => {
    f.submit().catch(() => undefined);
  };

  const setStartDate = (iso: string) => {
    f.setField('startDate', iso);
    // An end before the new start would only be an error waiting to happen.
    if (f.form.endDate && iso && f.form.endDate < iso)
      f.setField('endDate', '');
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
            title={f.isEdit ? COPY.editTitle : COPY.createTitle}
            showBackButton={false}
            rightElement={
              <Pressable
                style={s.close}
                onPress={requestClose}
                accessibilityRole="button"
                accessibilityLabel={PUBLIC_EVENTS_COPY.close}
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
              <Group n={1} title={COPY.sectionBasics}>
                <FormField
                  label={COPY.title}
                  value={f.form.title}
                  onChangeText={v => f.setField('title', v)}
                  placeholder={COPY.titlePh}
                  max={TITLE_MAX}
                  error={f.errors.title}
                  autoCapitalize="words"
                />
                <FormField
                  label={COPY.description}
                  value={f.form.description}
                  onChangeText={v => f.setField('description', v)}
                  placeholder={COPY.descriptionPh}
                  max={DESCRIPTION_MAX}
                  error={f.errors.description}
                  multiline
                  autoCapitalize="sentences"
                />
                <CoverPicker f={f} />
              </Group>

              <Group n={2} title={COPY.sectionWhen}>
                <DateTimeField
                  label={COPY.startDate}
                  date={f.form.startDate}
                  time={f.form.startTime}
                  onDate={setStartDate}
                  onTime={v => f.setField('startTime', v)}
                  dateError={f.errors.startDate}
                  timeError={f.errors.startTime}
                />
                <DateTimeField
                  label={COPY.endDate}
                  date={f.form.endDate}
                  time={f.form.endTime}
                  onDate={v => f.setField('endDate', v)}
                  onTime={v => f.setField('endTime', v)}
                  dateError={f.errors.endDate}
                  timeError={f.errors.endTime}
                  minIso={f.form.startDate || undefined}
                  blank={f.form.endTime ? COPY.sameDay : COPY.optional}
                  clearable
                />
              </Group>

              <Group n={3} title={COPY.sectionWhere}>
                <FormField
                  label={COPY.venueName}
                  value={f.form.venueName}
                  onChangeText={v => f.setField('venueName', v)}
                  placeholder={COPY.venueNamePh}
                  max={VENUE_MAX}
                  error={f.errors.venueName}
                  autoCapitalize="words"
                />
                <FormField
                  label={COPY.address}
                  value={f.form.address}
                  onChangeText={v => f.setField('address', v)}
                  placeholder={COPY.addressPh}
                  max={ADDRESS_MAX}
                  error={f.errors.address}
                />
                <View style={s.row}>
                  <View style={s.half}>
                    <FormField
                      label={COPY.city}
                      value={f.form.city}
                      onChangeText={v => f.setField('city', v)}
                      max={CITY_MAX}
                      error={f.errors.city}
                      autoCapitalize="words"
                    />
                  </View>
                  <View style={s.half}>
                    <FormField
                      label={COPY.state}
                      value={f.form.state}
                      onChangeText={v => f.setField('state', v)}
                      max={CITY_MAX}
                      error={f.errors.state}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              </Group>

              <Pressable
                style={s.toggle}
                onPress={f.toggleAdvanced}
                accessibilityRole="button"
                accessibilityState={{ expanded: f.showAdvanced }}
              >
                <EventlyIcon
                  name={f.showAdvanced ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={ORG_INK.inkSoft}
                />
                <AppText variant="bodySmall" style={s.toggleText}>
                  {f.showAdvanced ? COPY.hideAdvanced : COPY.showAdvanced}
                </AppText>
              </Pressable>

              {f.showAdvanced ? (
                <Group n={4} title={COPY.sectionAdvanced}>
                  <AppText variant="caption" style={s.hint}>
                    {COPY.advancedHint}
                  </AppText>
                  <View style={s.row}>
                    <View style={s.half}>
                      <FormField
                        label={COPY.latitude}
                        value={f.form.latitude}
                        onChangeText={v =>
                          f.setField('latitude', coordinateText(v))
                        }
                        placeholder="17.3850"
                        keyboardType="numbers-and-punctuation"
                        maxLength={14}
                        error={f.errors.latitude}
                      />
                    </View>
                    <View style={s.half}>
                      <FormField
                        label={COPY.longitude}
                        value={f.form.longitude}
                        onChangeText={v =>
                          f.setField('longitude', coordinateText(v))
                        }
                        placeholder="78.4867"
                        keyboardType="numbers-and-punctuation"
                        maxLength={15}
                        error={f.errors.longitude}
                      />
                    </View>
                  </View>
                </Group>
              ) : null}
            </ScrollView>
            <View style={s.footer}>
              {f.saveError ? (
                <AppText
                  variant="bodySmall"
                  style={s.saveError}
                  accessibilityLiveRegion="polite"
                >
                  {f.saveError}
                </AppText>
              ) : null}
              <ActionButton
                title={
                  f.saving ? COPY.saving : f.isEdit ? COPY.save : COPY.create
                }
                icon="check"
                loading={f.saving}
                disabled={f.uploading}
                onPress={onSubmit}
              />
            </View>
          </KeyboardAvoider>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

export default EventFormSheet;
