import { View } from 'react-native';
import { INVITATION_COPY as COPY, LIMITS, TIMEZONES } from '../constants';
import type { DetailsEditor } from '../editors';
import { styles as base } from '../styles';
import { zoneLabel } from '../utils';
import { ChoiceChips, DateTimeField, FormField, Group } from './Fields';

/** Template, names, date and venue — the cover's details — and the timezone. */
export function DetailsStep({ d }: { d: DetailsEditor }) {
  const form = d.form;
  if (!form) return null;
  const zones = TIMEZONES.includes(form.timezone)
    ? TIMEZONES
    : [form.timezone, ...TIMEZONES];

  return (
    <View style={base.stack}>
      {d.templates.length || d.fonts.length ? (
        <Group title={COPY.groupLook}>
          {d.templates.length ? (
            <ChoiceChips
              label={COPY.template}
              options={d.templates.map(t => ({
                key: t.id,
                label: t.label,
                swatch: t.heroStops?.[1] ?? t.accent,
              }))}
              value={form.template}
              onChange={key => d.set('template', key)}
            />
          ) : null}
          {d.fonts.length ? (
            <ChoiceChips
              label={COPY.font}
              options={d.fonts.map(f => ({ key: f.id, label: f.label }))}
              value={form.fontStyle}
              onChange={key => d.set('fontStyle', key)}
              hint={d.fonts.find(f => f.id === form.fontStyle)?.note}
            />
          ) : null}
        </Group>
      ) : null}

      <Group title={COPY.groupNames}>
        <FormField
          label={COPY.eyebrow}
          value={form.eyebrow}
          onChangeText={v => d.set('eyebrow', v)}
          max={LIMITS.eyebrow}
          autoCapitalize="characters"
        />
        <FormField
          label={COPY.hostOne}
          value={form.hostOne}
          onChangeText={v => d.set('hostOne', v)}
          max={LIMITS.host}
          autoCapitalize="words"
        />
        <FormField
          label={COPY.joiner}
          value={form.joiner}
          onChangeText={v => d.set('joiner', v)}
          max={LIMITS.joiner}
        />
        <FormField
          label={COPY.hostTwo}
          value={form.hostTwo}
          onChangeText={v => d.set('hostTwo', v)}
          max={LIMITS.host}
          autoCapitalize="words"
        />
      </Group>

      <Group title={COPY.groupWhen}>
        <DateTimeField
          label={COPY.eventDate}
          date={form.eventDate}
          time={form.eventTime}
          onDate={v => d.set('eventDate', v)}
          onTime={v => d.set('eventTime', v)}
          dateError={d.errors.eventDate}
          timeError={d.errors.eventTime}
        />
        <ChoiceChips
          label={COPY.timezone}
          hint={COPY.timezoneHint}
          options={zones.map(z => ({ key: z, label: zoneLabel(z) }))}
          value={form.timezone}
          onChange={key => d.set('timezone', key)}
        />
        <FormField
          label={COPY.venueName}
          value={form.venueName}
          onChangeText={v => d.set('venueName', v)}
          max={LIMITS.venueName}
        />
        <FormField
          label={COPY.venueAddress}
          value={form.venueAddress}
          onChangeText={v => d.set('venueAddress', v)}
          max={LIMITS.venueAddress}
          multiline
        />
      </Group>

      <Group title={COPY.groupMessage}>
        <FormField
          label={COPY.message}
          value={form.message}
          onChangeText={v => d.set('message', v)}
          max={d.welcomeMax}
          error={d.errors.message}
          multiline
        />
      </Group>
    </View>
  );
}

export default DetailsStep;
