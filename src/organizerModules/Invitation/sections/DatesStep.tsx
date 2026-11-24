import { Alert, Pressable, View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import { INVITATION_COPY as COPY, LIMITS, TIMEZONES } from '../constants';
import type { DatesEditor } from '../editors';
import { ORG_ACCENT, ORG_INK } from '../design';
import { styles as base, datesStyles as s, listStyles as l } from '../styles';
import type { SubEventForm } from '../types';
import { subEventLine, zoneLabel } from '../utils';
import { ChoiceChips, DateTimeField, FormField, TimeInput } from './Fields';
import { Sheet } from './Sheet';
import { RowTools } from './StoryStep';

function EventRow({
  event,
  index,
  total,
  isCountdown,
  dt,
}: {
  event: SubEventForm;
  index: number;
  total: number;
  isCountdown: boolean;
  dt: DatesEditor;
}) {
  const name = event.name.trim() || COPY.subUnnamed;
  const flags = [
    event.visibility === 'hidden' ? COPY.subHidden : '',
    event.liveEnabled ? COPY.subLive : '',
    isCountdown ? COPY.subCountdownNote : '',
  ].filter(Boolean);

  const confirmRemove = () =>
    Alert.alert(COPY.subRemoveTitle, COPY.subRemoveBody, [
      { text: COPY.cancel, style: 'cancel' },
      {
        text: COPY.remove,
        style: 'destructive',
        onPress: () => dt.remove(event.key),
      },
    ]);

  return (
    <View style={l.row}>
      <Pressable
        style={s.rowMain}
        onPress={() => dt.openEdit(event.key)}
        accessibilityRole="button"
        accessibilityLabel={`${COPY.subEdit}: ${name}`}
      >
        <View style={s.dateTile}>
          <EventlyIcon
            name="calendar-heart"
            size={20}
            color={ORG_ACCENT.saffron}
          />
        </View>
        <View style={s.rowText}>
          <AppText
            variant="body"
            style={[s.name, !event.name.trim() && s.nameMissing]}
            numberOfLines={1}
          >
            {name}
          </AppText>
          <AppText variant="caption" style={s.line} numberOfLines={2}>
            {subEventLine(event)}
          </AppText>
          {flags.length ? (
            <AppText variant="caption" style={s.flags} numberOfLines={1}>
              {flags.join(' · ')}
            </AppText>
          ) : null}
        </View>
        <EventlyIcon name="pencil-outline" size={18} color={ORG_INK.inkFaint} />
      </Pressable>
      <RowTools
        name={name}
        first={index === 0}
        last={index === total - 1}
        onMove={delta => dt.move(event.key, delta)}
        onRemove={confirmRemove}
      />
    </View>
  );
}

/** One event's fields, in a sheet. Done puts it in the list; Save sends the list. */
function SubEventSheet({ dt }: { dt: DatesEditor }) {
  const sheet = dt.sheet;
  if (!sheet) return null;
  const e = sheet.form;
  const zones = TIMEZONES.includes(e.timezone)
    ? TIMEZONES
    : [e.timezone, ...TIMEZONES];

  const close = () => {
    if (!dt.sheetDirty) {
      dt.closeSheet();
      return;
    }
    Alert.alert(COPY.discardTitle, COPY.discardBody, [
      { text: COPY.keepEditing, style: 'cancel' },
      { text: COPY.discard, style: 'destructive', onPress: dt.closeSheet },
    ]);
  };

  return (
    <Sheet
      visible
      icon="calendar-edit"
      title={sheet.isNew ? COPY.subNew : COPY.subEdit}
      onClose={close}
      primary={{ title: COPY.subDone, onPress: dt.sheetDone }}
    >
      <FormField
        label={COPY.subName}
        value={e.name}
        onChangeText={v => dt.setSheetField('name', v)}
        placeholder={COPY.subNamePh}
        max={LIMITS.subName}
        error={sheet.errors.name}
        autoCapitalize="words"
      />
      <DateTimeField
        label={COPY.subStart}
        date={e.eventDate}
        time={e.eventTime}
        onDate={v => dt.setSheetField('eventDate', v)}
        onTime={v => dt.setSheetField('eventTime', v)}
        dateError={sheet.errors.eventDate}
        timeError={sheet.errors.eventTime}
      />
      <View style={s.endRow}>
        <View style={s.endText}>
          <AppText variant="bodySmall" style={s.endLabel}>
            {COPY.subEnd}
          </AppText>
          <AppText
            variant="caption"
            style={sheet.errors.endTime ? s.endError : s.endHint}
          >
            {sheet.errors.endTime ?? COPY.subEndHint}
          </AppText>
        </View>
        <View style={s.endInput}>
          <TimeInput
            label={COPY.subEnd}
            value={e.endTime}
            onChange={v => dt.setSheetField('endTime', v)}
            error={!!sheet.errors.endTime}
          />
        </View>
      </View>
      <ChoiceChips
        label={COPY.subTimezone}
        options={zones.map(z => ({ key: z, label: zoneLabel(z) }))}
        value={e.timezone}
        onChange={v => dt.setSheetField('timezone', v)}
      />
      <FormField
        label={COPY.subVenueName}
        value={e.venueName}
        onChangeText={v => dt.setSheetField('venueName', v)}
        max={LIMITS.venueName}
      />
      <FormField
        label={COPY.subVenueAddress}
        value={e.venueAddress}
        onChangeText={v => dt.setSheetField('venueAddress', v)}
        max={LIMITS.venueAddress}
        hint={COPY.subAddressHint}
        multiline
      />
      <FormField
        label={COPY.subDressCode}
        value={e.dressCode}
        onChangeText={v => dt.setSheetField('dressCode', v)}
        max={LIMITS.dressCode}
      />
      <FormField
        label={COPY.subNote}
        value={e.note}
        onChangeText={v => dt.setSheetField('note', v)}
        max={LIMITS.note}
        multiline
      />
    </Sheet>
  );
}

/** The events schedule: a list to arrange, each event edited in a sheet. */
export function DatesStep({ dt }: { dt: DatesEditor }) {
  const list = dt.list;
  if (!list) return null;

  return (
    <View style={base.stack}>
      {list.length === 0 ? (
        <AppText variant="bodySmall" style={base.note}>
          {COPY.datesEmpty}
        </AppText>
      ) : null}

      <View style={l.list}>
        {list.map((event, index) => (
          <EventRow
            key={event.key}
            event={event}
            index={index}
            total={list.length}
            isCountdown={!!event.id && event.id === dt.countdownId}
            dt={dt}
          />
        ))}
      </View>

      <Pressable
        style={[l.add, !dt.canAdd && l.addOff]}
        onPress={dt.openNew}
        disabled={!dt.canAdd}
        accessibilityRole="button"
        accessibilityLabel={COPY.datesAdd}
      >
        <EventlyIcon
          name="calendar-plus"
          size={20}
          color={ORG_ACCENT.saffron}
        />
        <AppText variant="bodySmall" style={l.addText}>
          {dt.canAdd ? COPY.datesAdd : COPY.datesFull(LIMITS.subEvents)}
        </AppText>
      </Pressable>

      <SubEventSheet dt={dt} />
    </View>
  );
}

export default DatesStep;
