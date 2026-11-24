import { View } from 'react-native';
import { AppText, EventlyIcon } from '../../../Components';
import type { MemoriesLiveResult } from '../container';
import {
  LIVE_URL_MAX,
  PUBLIC_EVENTS_COPY,
  UPLOADER_OPTIONS,
} from '../constants';
import { ORG_ACCENT } from '../design';
import {
  formStyles as f,
  settingsStyles as s,
  styles as screen,
} from '../styles';
import type { LiveAccess } from '../types';
import { digitsOnly } from '../utils';
import { ActionButton } from './ActionButton';
import { DateTimeField } from './DateTimeField';
import { FormField } from './FormField';
import { Segment } from './Segment';
import { SwitchRow } from './SwitchRow';

const MEM = PUBLIC_EVENTS_COPY.memories;
const LIVE = PUBLIC_EVENTS_COPY.live;

const UPLOADERS = UPLOADER_OPTIONS.map(key => ({
  key,
  label: MEM.uploaders[key],
}));
const ACCESS: Array<{ key: LiveAccess; label: string }> = [
  { key: 'ticketed', label: LIVE.ticketed },
  { key: 'free', label: LIVE.free },
];

function CardHead({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <View style={s.head}>
      <View style={s.icon}>
        <EventlyIcon name={icon} size={20} color={ORG_ACCENT.saffron} />
      </View>
      <View style={s.headText}>
        <AppText variant="h3" style={s.title}>
          {title}
        </AppText>
        <AppText variant="caption" style={s.body}>
          {body}
        </AppText>
      </View>
    </View>
  );
}

/** Two settings cards — the shared photo gallery and the live stream — each with its own Save. */
export function MemoriesLiveTab({ m }: { m: MemoriesLiveResult }) {
  const mem = m.memories;
  const live = m.live;
  return (
    <View style={screen.section}>
      <View style={s.card}>
        <CardHead
          icon="image-multiple-outline"
          title={MEM.title}
          body={MEM.body}
        />
        <SwitchRow
          label={MEM.enabled}
          value={mem.enabled}
          onValueChange={v => m.setMemory('enabled', v)}
        />
        {mem.enabled ? (
          <>
            <View style={f.field}>
              <AppText variant="bodySmall" style={f.label}>
                {MEM.uploadersLabel}
              </AppText>
              <Segment
                options={UPLOADERS}
                value={mem.uploaders}
                onChange={v => m.setMemory('uploaders', v)}
              />
            </View>
            <SwitchRow
              label={MEM.attendeeView}
              value={mem.attendeeView}
              onValueChange={v => m.setMemory('attendeeView', v)}
            />
            <SwitchRow
              label={MEM.attendeeDownload}
              value={mem.attendeeDownload}
              onValueChange={v => m.setMemory('attendeeDownload', v)}
            />
            <SwitchRow
              label={MEM.moderation}
              value={mem.moderation}
              onValueChange={v => m.setMemory('moderation', v)}
            />
            <FormField
              label={MEM.windowLabel}
              value={mem.uploadWindowDays}
              onChangeText={v =>
                m.setMemory('uploadWindowDays', digitsOnly(v, 3))
              }
              placeholder={MEM.windowPh}
              keyboardType="number-pad"
              error={m.memoriesError ?? undefined}
            />
          </>
        ) : null}
        <ActionButton
          title={MEM.save}
          icon="content-save-outline"
          kind={m.memoriesDirty ? 'primary' : 'ghost'}
          loading={m.savingMemories}
          disabled={!m.memoriesDirty}
          onPress={() => {
            m.saveMemories().catch(() => undefined);
          }}
        />
      </View>

      <View style={s.card}>
        <CardHead icon="broadcast" title={LIVE.title} body={LIVE.body} />
        <SwitchRow
          label={LIVE.enabled}
          value={live.enabled}
          onValueChange={v => m.setLive('enabled', v)}
        />
        <FormField
          label={LIVE.url}
          value={live.url}
          onChangeText={v => m.setLive('url', v.trim())}
          placeholder={LIVE.urlPh}
          hint={LIVE.urlHint}
          error={m.liveErrors.url}
          max={LIVE_URL_MAX}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {live.enabled ? (
          <>
            <View style={f.field}>
              <AppText variant="bodySmall" style={f.label}>
                {LIVE.accessLabel}
              </AppText>
              <Segment
                options={ACCESS}
                value={live.access}
                onChange={v => m.setLive('access', v)}
              />
            </View>
            <SwitchRow
              label={LIVE.replay}
              value={live.replayEnabled}
              onValueChange={v => m.setLive('replayEnabled', v)}
            />
            <DateTimeField
              label={LIVE.startsAt}
              date={live.startDate}
              time={live.startTime}
              onDate={v => m.setLive('startDate', v)}
              onTime={v => m.setLive('startTime', v)}
              dateError={m.liveErrors.startDate}
              timeError={m.liveErrors.startTime}
              blank={PUBLIC_EVENTS_COPY.form.optional}
              hint={LIVE.timesHint}
              clearable
            />
            <DateTimeField
              label={LIVE.endsAt}
              date={live.endDate}
              time={live.endTime}
              onDate={v => m.setLive('endDate', v)}
              onTime={v => m.setLive('endTime', v)}
              dateError={m.liveErrors.endDate}
              timeError={m.liveErrors.endTime}
              minIso={live.startDate || undefined}
              blank={PUBLIC_EVENTS_COPY.form.optional}
              clearable
            />
          </>
        ) : null}
        <ActionButton
          title={LIVE.save}
          icon="content-save-outline"
          kind={m.liveDirty ? 'primary' : 'ghost'}
          loading={m.savingLive}
          disabled={!m.liveDirty}
          onPress={() => {
            m.saveLive().catch(() => undefined);
          }}
        />
      </View>
    </View>
  );
}

export default MemoriesLiveTab;
